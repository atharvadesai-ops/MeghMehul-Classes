from fastapi import FastAPI, APIRouter, HTTPException, Depends
from starlette.middleware.cors import CORSMiddleware
import os
import requests
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import bcrypt
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# In-memory storage
db = {
    "courses": [],
    "reviews": [],
    "inquiries": [],
    "notices": [],
    "admins": []
}

class CourseBase(BaseModel):
    name: str
    stream: str
    type: str
    description: str
    duration: str
    features: List[str]

class Course(CourseBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewBase(BaseModel):
    name: str
    rating: int
    comment: str
    course: str

class Review(ReviewBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    approved: bool = True

class InquiryBase(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    course_interested: str
    message: Optional[str] = None

class Inquiry(InquiryBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "new"

class NoticeBase(BaseModel):
    title: str
    content: str
    priority: str

class Notice(NoticeBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    active: bool = True

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str

class AdminResponse(BaseModel):
    id: str
    username: str
    token: str

@api_router.get("/")
async def root():
    return {"message": "Meghmehul Engineering Classes API"}

@api_router.post("/courses", response_model=Course)
async def create_course(course: CourseBase):
    course_obj = Course(**course.model_dump())
    db["courses"].append(course_obj.model_dump())
    return course_obj

@api_router.get("/courses", response_model=List[Course])
async def get_courses(stream: Optional[str] = None):
    courses = db["courses"]
    if stream:
        courses = [c for c in courses if c['stream'] == stream]
    return courses

@api_router.delete("/courses/{course_id}")
async def delete_course(course_id: str):
    initial_len = len(db["courses"])
    db["courses"] = [c for c in db["courses"] if c['id'] != course_id]
    if len(db["courses"]) == initial_len:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted"}

@api_router.post("/reviews", response_model=Review)
async def create_review(review: ReviewBase):
    review_obj = Review(**review.model_dump())
    db["reviews"].append(review_obj.model_dump())
    return review_obj

@api_router.get("/reviews", response_model=List[Review])
async def get_reviews(approved: Optional[bool] = True):
    reviews = db["reviews"]
    if approved is not None:
        reviews = [r for r in reviews if r.get('approved') == approved]
    # Sort by created_at desc
    reviews.sort(key=lambda x: x['created_at'], reverse=True)
    return reviews

@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry: InquiryBase):
    inquiry_obj = Inquiry(**inquiry.model_dump())
    db["inquiries"].append(inquiry_obj.model_dump())
    
    # Send WhatsApp Notification (Server-side)
    try:
        send_whatsapp_notification(inquiry_obj)
    except Exception as e:
        logger.error(f"Failed to send WhatsApp notification: {str(e)}")
        
    return inquiry_obj

def send_whatsapp_notification(inquiry: Inquiry):
    """
    Sends a WhatsApp notification using the WhatsApp Cloud API (Meta) or logs if not configured.
    """
    whatsapp_token = os.environ.get("WHATSAPP_TOKEN")
    whatsapp_phone_number_id = os.environ.get("WHATSAPP_PHONE_NUMBER_ID")
    target_phone_number = "918983692788" # The number mentioned in the site/user request
    
    message_body = (
        f"🔔 *New Inquiry Received*\n\n"
        f"👤 *Name:* {inquiry.name}\n"
        f"📞 *Phone:* {inquiry.phone}\n"
        f"📧 *Email:* {inquiry.email or 'N/A'}\n"
        f"📚 *Course:* {inquiry.course_interested}\n"
        f"💬 *Message:* {inquiry.message or 'N/A'}\n"
    )

    if whatsapp_token and whatsapp_phone_number_id:
        url = f"https://graph.facebook.com/v22.0/{whatsapp_phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {whatsapp_token}",
            "Content-Type": "application/json"
        }
        data = {
    "messaging_product": "whatsapp",
    "to": "918983692788",
    "type": "template",
    "template": {
        "name": "inquiry_alert",
        "language": {
            "code": "en_US"
        },
        "components": [
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": inquiry.name
                    },
                    {
                        "type": "text",
                        "text": inquiry.phone or 'N/A'
                    },
                    {
                        "type": "text",
                        "text": inquiry.email or 'N/A'
                    },
                    {
                        "type": "text",
                        "text": inquiry.course_interested or 'N/A'
                    },
                    {
                        "type": "text",
                        "text": inquiry.message or 'N/A'
                    }
                ]
            }
        ]
    }
}


        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            logger.info("✅ WhatsApp notification sent successfully")
        else:
            logger.error(f"❌ Failed to send WhatsApp notification: {response.text}")
    else:
        # Simulation mode if credentials are missing
        logger.info("ℹ️ WhatsApp credentials not found in .env. Simulating send:")
        logger.info(f"📤 To: {target_phone_number}")
        logger.info(f"📝 Content:\n{message_body}")

@api_router.get("/inquiries", response_model=List[Inquiry])
async def get_inquiries():
    # Sort by created_at desc
    inquiries = sorted(db["inquiries"], key=lambda x: x['created_at'], reverse=True)
    return inquiries

@api_router.patch("/inquiries/{inquiry_id}")
async def update_inquiry_status(inquiry_id: str, status: str):
    for inquiry in db["inquiries"]:
        if inquiry['id'] == inquiry_id:
            inquiry['status'] = status
            return {"message": "Status updated"}
    raise HTTPException(status_code=404, detail="Inquiry not found")

@api_router.post("/notices", response_model=Notice)
async def create_notice(notice: NoticeBase):
    notice_obj = Notice(**notice.model_dump())
    db["notices"].append(notice_obj.model_dump())
    return notice_obj

@api_router.get("/notices", response_model=List[Notice])
async def get_notices(active: Optional[bool] = True):
    notices = db["notices"]
    if active is not None:
        notices = [n for n in notices if n.get('active') == active]
    notices.sort(key=lambda x: x['created_at'], reverse=True)
    return notices

@api_router.delete("/notices/{notice_id}")
async def delete_notice(notice_id: str):
    initial_len = len(db["notices"])
    db["notices"] = [n for n in db["notices"] if n['id'] != notice_id]
    if len(db["notices"]) == initial_len:
        raise HTTPException(status_code=404, detail="Notice not found")
    return {"message": "Notice deleted"}

@api_router.post("/admin/login", response_model=AdminResponse)
async def admin_login(credentials: AdminLogin):
    # Find admin
    admin = next((a for a in db["admins"] if a['username'] == credentials.username), None)
    
    if not admin:
        # Default admin check (create if doesn't exist equivalent in logic)
        if credentials.username == "admin" and credentials.password == "admin123":
            # Check if default admin already in db to avoid duplicates if called multiple times (though simple list append is fine for now)
            # Actually, let's just create a new one every time for this simple in-memory logic or check if exists
            
            # Encrypt password
            password_hash = bcrypt.hashpw(credentials.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            admin_obj = AdminUser(username=credentials.username, password_hash=password_hash)
            db["admins"].append(admin_obj.model_dump())
            
            token = str(uuid.uuid4())
            return AdminResponse(id=admin_obj.id, username=admin_obj.username, token=token)
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), admin['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = str(uuid.uuid4())
    return AdminResponse(id=admin['id'], username=admin['username'], token=token)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)