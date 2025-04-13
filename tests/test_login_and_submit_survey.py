import time
import unittest
from appium import webdriver
from appium.webdriver.common.mobileby import MobileBy
from appium.webdriver.common.touch_action import TouchAction

class SurveyAppTest(unittest.TestCase):
    def setUp(self):
        desired_caps = {
            "platformName": "iOS",
            "platformVersion": "14.4",
            "deviceName": "iPhone Simulator",
            "app": "/path/to/your/app.ipa",  # this needs to be altered if someone were to test using MAC. since none of us own a MAC, this is left as a placeholder.
            "automationName": "XCUITest"
        }
        self.driver = webdriver.Remote(
            command_executor="http://localhost:4723/wd/hub", 
            desired_capabilities=desired_caps
        )
        self.driver.implicitly_wait(10)

    def test_login_and_submit_survey(self):
        # email and password fields and sign in
        email_input = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeTextField[@placeholder='Email']")
        password_input = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeSecureTextField[@placeholder='Password']")
        sign_in_button = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeButton[@name='Sign in with Email']")
        
        email_input.send_keys("osman@gmail.com")
        password_input.send_keys("osman123")
        sign_in_button.click()
        
        time.sleep(3)  

        # Test input fields on the survey page
        name_input = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeTextField[@placeholder='Name Surname']")
        name_input.send_keys("John Doe")
        
        birthdate_input = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeTextField[@placeholder='Tap to select birth date']")
        birthdate_input.click() 

        education_picker = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypePicker[@name='Education Level']")
        education_picker.send_keys("College")

        city_input = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeTextField[@placeholder='City']")
        city_input.send_keys("Adana")
        
        gender_picker = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypePicker[@name='Gender']")
        gender_picker.send_keys("Nonbinary")

        chatgpt_button = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeButton[@name='ChatGPT']")
        chatgpt_button.click()

        defects_input = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeTextField[@placeholder='Any defects/cons for ChatGPT?']")
        defects_input.send_keys("slow response")

        use_case_input = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeTextView[@placeholder='Any beneficial AI use case in daily life?']")
        use_case_input.send_keys("Helps with coding")

        # submit
        submit_button = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeButton[@name='Send']")
        submit_button.click()

        time.sleep(2)
        success_alert = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeStaticText[@name='Survey submitted successfully']")
        self.assertIsNotNone(success_alert)
    
    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()

