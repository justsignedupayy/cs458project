import time
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

s = Service(ChromeDriverManager().install())
options = webdriver.ChromeOptions()
options.add_experimental_option('excludeSwitches', ['enable-logging'])
driver = webdriver.Chrome(options=options, service=s)
driver.implicitly_wait(5)
driver.maximize_window()
driver.get('http://localhost:3000')


email_input = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.XPATH, "//input[@type='email']"))
)
password_input = driver.find_element(By.XPATH, "//input[@type='password']")
sign_in_button = driver.find_element(By.XPATH, "//button[contains(text(),'Sign in with Email')]")


# here, we find the relevant elements and hold them within their respective variables to assign them relevant keys for testing.
# credentials and sign-in button
email_input.send_keys("denis@gmail.com")
password_input.send_keys("deniz123")
sign_in_button.click()


# here, we do the assigning (purposefully send the wrong user)
try:
    # waiting for the "Login Successful!" text
    success_message = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//h1[text()='Login Successful!']"))
    )
    assert success_message.text == "Login Successful!"
    print("Test is passed")


# if the success message appears, that means the Login was successful.
except (AssertionError, Exception) as e:
    print("Test is failed")

driver.quit()