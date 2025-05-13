import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestLandingPage(unittest.TestCase):

    def setUp(self):
        """Set up the WebDriver before each test."""
        self.driver = webdriver.Chrome() 
        self.driver.get("http://localhost:3000/landing")
        self.wait = WebDriverWait(self.driver, 10)
        self.login()

    def tearDown(self):
        """Clean up the WebDriver after each test."""
        self.driver.quit()

    def login(self):
        """Logs in the user with the provided credentials."""
        email_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Email']")
        password_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Password']")

        email_input.send_keys("osman@gmail.com")
        password_input.send_keys("osman123")

        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with Email')]")
        login_button.click()

        # Wait for the landing page to load. You might need to adjust the condition.
        self.wait.until(EC.url_contains("landing")) # Assuming your landing page URL contains "landing"

    def test_login_successful_message_displayed(self):
        """Test that the 'Login Successful!' message is displayed."""
        wait = WebDriverWait(self.driver, 10)
        login_message = wait.until(EC.visibility_of_element_located((By.XPATH, "//h1[text()='Login Successful!']")))
        self.assertTrue(login_message.is_displayed())
        print("Test Successful: Login Successful message displayed.")    

    def test_profile_image_is_displayed(self):
        """Test that the user's profile image is displayed."""
        wait = WebDriverWait(self.driver, 10)
        profile_image = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "profile-image")))
        self.assertTrue(profile_image.is_displayed())
        print("Test Successful: Test that the user's profile image is displayed.")

    def test_user_email_is_displayed(self):
        """Test that the user's email is displayed."""
        wait = WebDriverWait(self.driver, 10)
        email_element = wait.until(EC.visibility_of_element_located((By.XPATH, "//p[contains(text(), 'Email:')]")))
        # Assuming 'user.email' from your React code is available in the rendered HTML
        # You might need to adjust the locator based on how the email is rendered.
        self.assertIn("osman@gmail.com", email_element.text)
        print("Test Successful: Test that the user's email is displayed.")

    def test_go_to_surveys_button_is_displayed_and_navigates(self):
        """Test that the 'Go to Surveys' button is displayed and navigates to the surveys section."""
        wait = WebDriverWait(self.driver, 10)
        surveys_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Go to Surveys']")))
        self.assertTrue(surveys_button.is_displayed())
        surveys_button.click()
        # Assert that the activePage state has changed to 'surveys'
        # This might involve checking for the presence of elements specific to the SurveyPage
        survey_container = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "survey-container")))
        self.assertTrue(survey_container.is_displayed())
        print("Test Successful: Test that the 'Go to Surveys' button is displayed and navigates to the surveys section.")


    def test_back_to_dashboard_button_is_displayed_and_navigates(self):
        """Test that the 'Back to Dashboard' button is displayed on the surveys page and navigates back."""
        # First, navigate to the surveys page
        wait = WebDriverWait(self.driver, 10)
        surveys_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Go to Surveys']")))
        surveys_button.click()
        # Now, test the back button
        back_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Back to Dashboard']")))
        self.assertTrue(back_button.is_displayed())
        back_button.click()
        # Assert that we are back on the dashboard by checking for the login message
        login_message = wait.until(EC.visibility_of_element_located((By.XPATH, "//h1[text()='Login Successful!']")))
        self.assertTrue(login_message.is_displayed())
        print("Test Successful: Test that the 'Back to Dashboard' button is displayed on the surveys page and navigates back.")


    def test_logout_button_is_displayed_and_redirects_to_login(self):
        """Test that the 'Logout' button is displayed and redirects to the login page."""
        wait = WebDriverWait(self.driver, 10)
        logout_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Logout']")))
        self.assertTrue(logout_button.is_displayed())
        logout_button.click()
        # Assert that the current URL is the login page URL
        # Replace "YOUR_LOGIN_PAGE_URL_HERE" with your actual login page URL
        wait.until(EC.url_to_be("http://localhost:3000/"))
        self.assertEqual(self.driver.current_url, "http://localhost:3000/")
        print("Test Successful: Test that the 'Logout' button is displayed and redirects to the login page.")


if __name__ == '__main__':
    unittest.main()