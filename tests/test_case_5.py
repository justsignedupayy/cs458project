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

long_email = "a" * 250 + "@example.com"  # 250+ characters
long_password = "P@ssw0rd" * 50  # 400+ characters

email_input.send_keys(long_email)
password_input.send_keys(long_password)
sign_in_button.click()


try:
    # waiting for the "Login Successful!" text
    success_message = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//h1[text()='Login Successful!']"))
    )

    assert success_message.text == "Login Successful!"
    print("Test is passed")


except TimeoutException:
    try:
        # check if the site has generated an error message
        error_message = WebDriverWait(driver, 3).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "error-message"))
        )
        if "Invalid email format" in error_message.text:
            print("Test failed: Site rejected long email/password (Invalid email format).")
        else:
            print(f"Test failed: Site rejected login with message: {error_message.text}")
    except TimeoutException:
        print("Test failed: No response from the site (Possible unhandled edge case).")


driver.quit()


