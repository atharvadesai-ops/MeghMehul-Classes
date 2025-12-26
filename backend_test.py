#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class EngineeringClassesAPITester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'No message')}"
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, str(e))
            return False

    def test_admin_login(self):
        """Test admin login functionality"""
        try:
            login_data = {
                "username": "admin",
                "password": "admin123"
            }
            response = requests.post(f"{self.api_url}/admin/login", json=login_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                self.admin_token = data.get('token')
                details = f"Login successful, token received: {bool(self.admin_token)}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Admin Login", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login", False, str(e))
            return False

    def test_courses_api(self):
        """Test courses CRUD operations"""
        # Test GET courses (should work without auth)
        try:
            response = requests.get(f"{self.api_url}/courses", timeout=10)
            success = response.status_code == 200
            details = f"GET Status: {response.status_code}"
            if success:
                courses = response.json()
                details += f", Found {len(courses)} courses"
            self.log_test("GET Courses", success, details)
        except Exception as e:
            self.log_test("GET Courses", False, str(e))

        # Test POST course (create new course)
        try:
            course_data = {
                "name": "Test Engineering Course",
                "stream": "Computer",
                "type": "Degree",
                "description": "Test course for API testing",
                "duration": "4 years",
                "features": ["Programming", "Data Structures", "Algorithms"]
            }
            response = requests.post(f"{self.api_url}/courses", json=course_data, timeout=10)
            success = response.status_code == 200
            details = f"POST Status: {response.status_code}"
            
            course_id = None
            if success:
                data = response.json()
                course_id = data.get('id')
                details += f", Course ID: {course_id}"
            
            self.log_test("POST Course", success, details)
            
            # Test DELETE course if creation was successful
            if success and course_id:
                try:
                    delete_response = requests.delete(f"{self.api_url}/courses/{course_id}", timeout=10)
                    delete_success = delete_response.status_code == 200
                    delete_details = f"DELETE Status: {delete_response.status_code}"
                    self.log_test("DELETE Course", delete_success, delete_details)
                except Exception as e:
                    self.log_test("DELETE Course", False, str(e))
                    
        except Exception as e:
            self.log_test("POST Course", False, str(e))

    def test_inquiries_api(self):
        """Test inquiries API"""
        # Test POST inquiry (contact form submission)
        try:
            inquiry_data = {
                "name": "Test Student",
                "phone": "9876543210",
                "email": "test@example.com",
                "course_interested": "Computer Engineering - Degree",
                "message": "Test inquiry for API testing"
            }
            response = requests.post(f"{self.api_url}/inquiries", json=inquiry_data, timeout=10)
            success = response.status_code == 200
            details = f"POST Status: {response.status_code}"
            
            inquiry_id = None
            if success:
                data = response.json()
                inquiry_id = data.get('id')
                details += f", Inquiry ID: {inquiry_id}"
            
            self.log_test("POST Inquiry", success, details)
            
            # Test GET inquiries
            try:
                get_response = requests.get(f"{self.api_url}/inquiries", timeout=10)
                get_success = get_response.status_code == 200
                get_details = f"GET Status: {get_response.status_code}"
                if get_success:
                    inquiries = get_response.json()
                    get_details += f", Found {len(inquiries)} inquiries"
                self.log_test("GET Inquiries", get_success, get_details)
                
                # Test PATCH inquiry status if we have an inquiry
                if get_success and inquiry_id:
                    try:
                        patch_response = requests.patch(f"{self.api_url}/inquiries/{inquiry_id}?status=contacted", timeout=10)
                        patch_success = patch_response.status_code == 200
                        patch_details = f"PATCH Status: {patch_response.status_code}"
                        self.log_test("PATCH Inquiry Status", patch_success, patch_details)
                    except Exception as e:
                        self.log_test("PATCH Inquiry Status", False, str(e))
                        
            except Exception as e:
                self.log_test("GET Inquiries", False, str(e))
                
        except Exception as e:
            self.log_test("POST Inquiry", False, str(e))

    def test_reviews_api(self):
        """Test reviews API"""
        # Test POST review
        try:
            review_data = {
                "name": "Test Student",
                "rating": 5,
                "comment": "Excellent teaching quality and support!",
                "course": "Computer Engineering - Degree"
            }
            response = requests.post(f"{self.api_url}/reviews", json=review_data, timeout=10)
            success = response.status_code == 200
            details = f"POST Status: {response.status_code}"
            
            if success:
                data = response.json()
                review_id = data.get('id')
                details += f", Review ID: {review_id}"
            
            self.log_test("POST Review", success, details)
            
            # Test GET reviews
            try:
                get_response = requests.get(f"{self.api_url}/reviews", timeout=10)
                get_success = get_response.status_code == 200
                get_details = f"GET Status: {get_response.status_code}"
                if get_success:
                    reviews = get_response.json()
                    get_details += f", Found {len(reviews)} reviews"
                self.log_test("GET Reviews", get_success, get_details)
            except Exception as e:
                self.log_test("GET Reviews", False, str(e))
                
        except Exception as e:
            self.log_test("POST Review", False, str(e))

    def test_notices_api(self):
        """Test notices API"""
        # Test POST notice
        try:
            notice_data = {
                "title": "Test Notice",
                "content": "This is a test notice for API testing",
                "priority": "medium"
            }
            response = requests.post(f"{self.api_url}/notices", json=notice_data, timeout=10)
            success = response.status_code == 200
            details = f"POST Status: {response.status_code}"
            
            notice_id = None
            if success:
                data = response.json()
                notice_id = data.get('id')
                details += f", Notice ID: {notice_id}"
            
            self.log_test("POST Notice", success, details)
            
            # Test GET notices
            try:
                get_response = requests.get(f"{self.api_url}/notices", timeout=10)
                get_success = get_response.status_code == 200
                get_details = f"GET Status: {get_response.status_code}"
                if get_success:
                    notices = get_response.json()
                    get_details += f", Found {len(notices)} notices"
                self.log_test("GET Notices", get_success, get_details)
                
                # Test DELETE notice if creation was successful
                if get_success and notice_id:
                    try:
                        delete_response = requests.delete(f"{self.api_url}/notices/{notice_id}", timeout=10)
                        delete_success = delete_response.status_code == 200
                        delete_details = f"DELETE Status: {delete_response.status_code}"
                        self.log_test("DELETE Notice", delete_success, delete_details)
                    except Exception as e:
                        self.log_test("DELETE Notice", False, str(e))
                        
            except Exception as e:
                self.log_test("GET Notices", False, str(e))
                
        except Exception as e:
            self.log_test("POST Notice", False, str(e))

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Meghmehul Engineering Classes API Tests")
        print(f"🔗 Testing API at: {self.api_url}")
        print("=" * 60)
        
        # Test basic connectivity first
        if not self.test_api_root():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Test admin login
        self.test_admin_login()
        
        # Test all CRUD operations
        self.test_courses_api()
        self.test_inquiries_api()
        self.test_reviews_api()
        self.test_notices_api()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if success_rate < 70:
            print("⚠️  WARNING: Low success rate detected!")
            
        return success_rate >= 70

def main():
    tester = EngineeringClassesAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "success_rate": (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
        "test_details": tester.test_results
    }
    
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())