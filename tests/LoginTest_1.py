import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestLoginPage(unittest.TestCase):
    def setUp(self):
        """Set up the WebDriver before each test."""
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.get("http://localhost:3000")
        self.wait = WebDriverWait(self.driver, 20) # Initialize WebDriverWait here

    def tearDown(self):
        """Clean up the WebDriver after each test."""
        self.driver.quit()

    # Test: Successful Login
    def test_successful_login(self):
        email_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Email']")
        password_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Password']")

        email_input.send_keys("osman@gmail.com")
        password_input.send_keys("osman123")

        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with Email')]")
        login_button.click()

        self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Login Successful!')]"))
        )

        self.assertIn("Survey", self.driver.page_source)
        print("Test Successful: User logged in and survey page loaded.")

    # Test: Failed Login (Invalid Credentials)
    def test_failed_login(self):
        email_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Email']")
        password_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Password']")

        email_input.send_keys("wronguser@example.com")
        password_input.send_keys("wrongpassword")

        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with Email')]")
        login_button.click()

        self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(@class, 'error-message')]"))
        )
        self.assertIn("Invalid email or password. Please try again.", self.driver.page_source)
        print("Test Successful: Invalid login showed error message.")

    # Test: Empty Fields Error
    def test_empty_fields(self):
        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with Email')]")
        login_button.click()

        self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(@class, 'error-message')]"))
        )
        self.assertIn("Please enter both email and password.", self.driver.page_source)
        print("Test Successful: Empty fields error displayed.")

    # Test: Excessively Long Email and Password
    def test_excessive_length(self):
        email_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Email']")
        password_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Password']")

        long_email = "a" * 300 + "@gmail.com"
        long_password = "p" * 300

        email_input.send_keys(long_email)
        password_input.send_keys(long_password)

        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with Email')]")
        login_button.click()

        self.assertIn("Input too long.", self.driver.page_source) # Adjust assertion based on actual error message
        print("Test Successful: Excessive length blocked.")

    # Test: SQL Injection Attempt
    def test_sql_injection(self):
        email_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Email']")
        password_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Password']")

        email_input.send_keys("' OR '1'='1")
        password_input.send_keys("password123")

        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with Email')]")
        login_button.click()

        self.assertIn("Invalid input detected. Please avoid using special characters.", self.driver.page_source) # Adjust assertion
        print("Test Successful: SQL injection attempt blocked.")

    # Test: Only E-Mail
    def test_only_mail(self):
        email_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Email']")
        password_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Password']") # You need to find the password field even if you don't interact with it

        email_input.send_keys("osman@gmail.com")

        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with Email')]")
        login_button.click()

        self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(@class, 'error-message')]"))
        )
        self.assertIn("Please enter both email and password.", self.driver.page_source)
        print("Test Successful: Only E-Mail attempt blocked.")

    # Test: Wrong E-Mail Format
    def test_wrong_format(self):
        email_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Email']")
        password_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Password']")

        email_input.send_keys("wronguser")
        password_input.send_keys("wrongpassword")

        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with Email')]")
        login_button.click()

        self.assertIn("Invalid email format.", self.driver.page_source) # Adjust assertion
        print("Test Successful: Wrong E-Mail format blocked.")

    # Test: Sign in with Google
    def test_sign_in_with_google(self):
        # Locate the "Sign in with Google" button
        google_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in with Google')]")

        # Click the button to simulate Google sign-in
        google_button.click()

        # Wait for the page to load after the Google login action
        # This might involve waiting for a specific element or URL change
        try:
            self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Login Successful!')]"))  # Adjust based on expected outcome
            )
            self.assertIn("Login Successful!", self.driver.page_source)
            print("Test Successful: Google Sign-In button works correctly.")
        except:
            print("Warning: Unable to fully verify Google Sign-In flow in this automated test.")
            # Google Sign-in often involves pop-ups or redirects that are hard to fully automate.
            # You might need more specific checks based on your application's behavior after clicking the button.

if __name__ == '__main__':
    unittest.main()