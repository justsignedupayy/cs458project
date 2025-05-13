import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestSurveyBuilder(unittest.TestCase):

    def setUp(self):
        """Set up the WebDriver and navigate to the survey page."""
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:3000/landing")  
        self.wait = WebDriverWait(self.driver, 10)
        self.login("osman@gmail.com", "osman123")

        go_to_surveys_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Go to Surveys']")))
        go_to_surveys_button.click()
        self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "survey-page")))
        self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "survey-builder")))

    def tearDown(self):
        """Clean up the WebDriver after each test."""
        self.driver.quit()

    def login(self, email, password):
        """Helper method to log in (replace with your actual login steps)."""
        email_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Email']")))
        password_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Password']")))
        login_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign in with Email')]")))
        email_input.send_keys(email)
        password_input.send_keys(password)
        login_button.click()
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Login Successful!')]")))

    def test_survey_builder_title_displayed(self):
        """Test that the 'Create New Survey' title is displayed."""
        title = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//h2[text()='Create New Survey']"))) # Updated locator
        self.assertTrue(title.is_displayed())
        print("Test Successful: test_survey_builder_title_displayed")

    def test_survey_title_input_is_present(self):
        """Test that the survey title input field is present."""
        title_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Enter Survey Title']"))) # Updated locator
        self.assertTrue(title_input.is_displayed())
        print("Test Successful: test_survey_title_input_is_present")

    def test_add_multiple_choice_question(self):
        """Test adding a multiple-choice question."""
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Multiple Choice']"))) # Updated locator
        add_button.click()
        question_item = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//h3[contains(text(), 'multiple-choice')]"))) # Updated locator
        self.assertTrue(question_item.is_displayed())
        option_inputs = self.wait.until(EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[@placeholder='Option 1']"))) # Updated locator
        self.assertEqual(len(option_inputs), 2)  # Initial two options
        print("Test Successful: test_add_multiple_choice_question")

    def test_add_rating_scale_question(self):
        """Test adding a rating scale question."""
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Rating Scale']"))) # Updated locator
        add_button.click()
        question_item = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//h3[contains(text(), 'rating-scale')]"))) # Updated locator
        self.assertTrue(question_item.is_displayed())
        min_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[@type='number'][@value='1']"))) # Updated locator
        max_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[@type='number'][@value='5']"))) # Updated locator
        self.assertTrue(min_input.is_displayed())
        self.assertTrue(max_input.is_displayed())
        print("Test Successful: test_add_rating_scale_question")

    def test_add_conditional_question(self):
        """Test adding a conditional question."""
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Conditional']"))) # Updated locator
        add_button.click()
        question_item = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//h3[contains(text(), 'conditional')]"))) # Updated locator
        self.assertTrue(question_item.is_displayed())
        depends_on_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[contains(@placeholder, 'depends on')]"))) # Updated locator
        condition_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[contains(@placeholder, 'required answer')]"))) # Updated locator
        self.assertTrue(depends_on_input.is_displayed())
        self.assertTrue(condition_input.is_displayed())
        print("Test Successful: test_add_conditional_question")

    def test_add_open_text_question(self):
        """Test adding an open-text question."""
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Open Text']"))) # Updated locator
        add_button.click()
        question_item = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//h3[contains(text(), 'open-text')]"))) # Updated locator
        self.assertTrue(question_item.is_displayed())
        text_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[@placeholder='Enter question text']"))) # Updated locator
        self.assertTrue(text_input.is_displayed())
        print("Test Successful: test_add_open_text_question")

    def test_remove_question(self):
        """Test removing a question."""
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Multiple Choice']"))) # Updated locator
        add_button.click()
        remove_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'question-item')]//button[text()='Remove']"))) # Updated locator
        remove_button.click()
        question_items = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'question-item')]") # Updated locator
        self.assertEqual(len(question_items), 0)
        print("Test Successful: test_remove_question")

    def test_edit_question_text(self):
        """Test editing the text of a question."""
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Multiple Choice']"))) # Updated locator
        add_button.click()
        text_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[@placeholder='Enter question text']"))) # Updated locator
        test_text = "What is your favorite color?"
        text_input.send_keys(test_text)
        self.assertEqual(text_input.get_attribute('value'), test_text)
        print("Test Successful: test_edit_question_text")

    def test_add_and_remove_multiple_choice_option(self):
        """Test adding and removing options from a multiple-choice question."""
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Multiple Choice']"))) # Updated locator
        add_button.click()
        add_option_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'question-item')]//button[text()='+ Add Option']"))) # Updated locator
        add_option_button.click()
        option_inputs = self.wait.until(EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[@placeholder='Option 1']"))) # Updated locator
        self.assertEqual(len(option_inputs), 3)
        remove_option_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'question-item')]//div[contains(@class, 'option-item')][last()]//button[text()='×']"))) # Updated locator
        remove_option_button.click()
        option_inputs = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'question-item')]//input[@placeholder='Option 1']") # Updated locator
        self.assertEqual(len(option_inputs), 2)
        print("Test Successful: test_add_and_remove_multiple_choice_option")

    def test_edit_rating_scale_min_max(self):
        """Test editing the min and max values of a rating scale question."""
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Rating Scale']"))) # Updated locator
        add_button.click()
        min_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[@type='number'][@value='1']"))) # Updated locator
        max_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[@type='number'][@value='5']"))) # Updated locator
        min_input.clear()
        min_input.send_keys("0")
        max_input.clear()
        max_input.send_keys("10")
        self.assertEqual(min_input.get_attribute('value'), "0")
        self.assertEqual(max_input.get_attribute('value'), "10")
        print("Test Successful: test_edit_rating_scale_min_max")

    def test_edit_conditional_question_dependency_condition(self):
        """Test editing the dependency and condition of a conditional question."""
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Conditional']"))) # Updated locator
        add_button.click()
        depends_on_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[contains(@placeholder, 'depends on')]"))) # Updated locator
        condition_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'question-item')]//input[contains(@placeholder, 'required answer')]"))) # Updated locator
        depends_on_input.send_keys("Previous Question Text")
        condition_input.send_keys("Yes")
        self.assertEqual(depends_on_input.get_attribute('value'), "Previous Question Text")
        self.assertEqual(condition_input.get_attribute('value'), "Yes")
        print("Test Successful: test_edit_conditional_question_dependency_condition")

    def test_mark_question_as_required(self):
        """Test marking a question as required."""
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Multiple Choice']"))) # Updated locator
        add_button.click()
        required_checkbox = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'question-item')]//input[@type='checkbox']"))) # Updated locator
        required_checkbox.click()
        self.assertTrue(required_checkbox.is_selected())
        required_checkbox.click()  # Uncheck
        self.assertFalse(required_checkbox.is_selected())
        print("Test Successful: test_mark_question_as_required")

    def test_save_survey_without_title_shows_error(self):
        """Test saving a survey without a title shows an error."""
        submit_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Save Survey']"))) # Updated locator
        submit_button.click()
        error_message = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[@class='error-message']"))) # Updated locator
        self.assertEqual(error_message.text, "Survey must have a title")
        print("Test Successful: test_save_survey_without_title_shows_error")

    def test_save_survey_with_required_question_missing_text_shows_error(self):
        """Test saving a survey with a required question missing text shows an error."""
        title_input = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Enter Survey Title']"))) # Updated locator
        title_input.send_keys("Test Survey")
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Multiple Choice']"))) # Updated locator
        add_button.click()
        required_checkbox = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'question-item')]//input[@type='checkbox']"))) # Updated locator
        required_checkbox.click()
        submit_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Save Survey']"))) # Updated locator
        submit_button.click()
        error_message = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[@class='error-message']"))) # Updated locator
        self.assertEqual(error_message.text, "Please fill in all required questions")
        print("Test Successful: test_save_survey_with_required_question_missing_text_shows_error")

if __name__ == '__main__':
    unittest.main()