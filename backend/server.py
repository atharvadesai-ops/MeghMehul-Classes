from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

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
    doc = course_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.courses.insert_one(doc)
    return course_obj

@api_router.get("/courses", response_model=List[Course])
async def get_courses(stream: Optional[str] = None):
    query = {}
    if stream:
        query['stream'] = stream
    courses = await db.courses.find(query, {"_id": 0}).to_list(1000)
    for course in courses:
        if isinstance(course['created_at'], str):
            course['created_at'] = datetime.fromisoformat(course['created_at'])
    return courses

@api_router.delete("/courses/{course_id}")
async def delete_course(course_id: str):
    result = await db.courses.delete_one({"id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted"}

@api_router.post("/reviews", response_model=Review)
async def create_review(review: ReviewBase):
    review_obj = Review(**review.model_dump())
    doc = review_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.reviews.insert_one(doc)
    return review_obj

@api_router.get("/reviews", response_model=List[Review])
async def get_reviews(approved: Optional[bool] = True):
    query = {"approved": approved} if approved is not None else {}
    reviews = await db.reviews.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for review in reviews:
        if isinstance(review['created_at'], str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    return reviews

@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry: InquiryBase):
    inquiry_obj = Inquiry(**inquiry.model_dump())
    doc = inquiry_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.inquiries.insert_one(doc)
    return inquiry_obj

@api_router.get("/inquiries", response_model=List[Inquiry])
async def get_inquiries():
    inquiries = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for inquiry in inquiries:
        if isinstance(inquiry['created_at'], str):
            inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
    return inquiries

@api_router.patch("/inquiries/{inquiry_id}")
async def update_inquiry_status(inquiry_id: str, status: str):
    result = await db.inquiries.update_one({"id": inquiry_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Status updated"}

@api_router.post("/notices", response_model=Notice)
async def create_notice(notice: NoticeBase):
    notice_obj = Notice(**notice.model_dump())
    doc = notice_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.notices.insert_one(doc)
    return notice_obj

@api_router.get("/notices", response_model=List[Notice])
async def get_notices(active: Optional[bool] = True):
    query = {"active": active} if active is not None else {}
    notices = await db.notices.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for notice in notices:
        if isinstance(notice['created_at'], str):
            notice['created_at'] = datetime.fromisoformat(notice['created_at'])
    return notices

@api_router.delete("/notices/{notice_id}")
async def delete_notice(notice_id: str):
    result = await db.notices.delete_one({"id": notice_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Notice not found")
    return {"message": "Notice deleted"}

@api_router.post("/admin/login", response_model=AdminResponse)
async def admin_login(credentials: AdminLogin):
    admin = await db.admins.find_one({"username": credentials.username}, {"_id": 0})
    
    if not admin:
        if credentials.username == "admin" and credentials.password == "admin123":
            password_hash = bcrypt.hashpw(credentials.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            admin_obj = AdminUser(username=credentials.username, password_hash=password_hash)
            doc = admin_obj.model_dump()
            await db.admins.insert_one(doc)
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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()