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

    def test_birthdate_selection(self):
        # Step 1: Login
        self.driver.find_element(MobileBy.ACCESSIBILITY_ID, "Email").send_keys("test@example.com")
        self.driver.find_element(MobileBy.ACCESSIBILITY_ID, "Password").send_keys("testpassword")
        self.driver.find_element(MobileBy.ACCESSIBILITY_ID, "Sign in with Email").click()
        time.sleep(2)

        # Step 2: Tap the birthdate field
        self.driver.find_element(MobileBy.ACCESSIBILITY_ID, "Tap to select birth date").click()
        time.sleep(1)

        # Step 3: Interact with the native date picker
        picker_wheels = self.driver.find_elements(MobileBy.CLASS_NAME, "XCUIElementTypePickerWheel")
        picker_wheels[0].send_keys("January")
        picker_wheels[1].send_keys("1")
        picker_wheels[2].send_keys("1995")
        time.sleep(1)

        # Step 4: Tap outside to close the picker (simulate tap if needed)
        self.driver.tap([(200, 400)])
        time.sleep(1)

        # Step 5: Verify the selected date appears in the field
        birth_field = self.driver.find_element(MobileBy.ACCESSIBILITY_ID, "Tap to select birth date")
        selected_value = birth_field.get_attribute("value")
        self.assertIn("1995", selected_value)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()