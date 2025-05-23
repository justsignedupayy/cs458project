import time
import unittest
from appium import webdriver
from appium.webdriver.common.mobileby import MobileBy

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

    def test_invalid_login(self):
        email_input = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeTextField[@placeholder='Email']")
        password_input = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeSecureTextField[@placeholder='Password']")
        sign_in_button = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeButton[@name='Sign in with Email']")
        
        email_input.send_keys("denis@gmail.com")
        password_input.send_keys("wrongpassword")
        sign_in_button.click()

        # verify if error message appears
        time.sleep(2)
        error_message = self.driver.find_element(MobileBy.XPATH, "//XCUIElementTypeStaticText[@name='Invalid email or password']")
        self.assertIsNotNone(error_message)
    
    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()



