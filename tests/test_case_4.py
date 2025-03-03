import time
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium import webdriver
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

s = Service(ChromeDriverManager().install())
options = webdriver.ChromeOptions()
options.add_experimental_option('excludeSwitches', ['enable-logging'])


# first tab
driver1 = webdriver.Chrome(options=options, service=s)
driver1.implicitly_wait(5)
driver1.maximize_window()
driver1.get('http://localhost:3000')


#  second tab
driver2 = webdriver.Chrome(options=options, service=s)
driver2.implicitly_wait(5)
driver2.maximize_window()
driver2.get('http://localhost:3000')


try:
    email_input1 = WebDriverWait(driver1, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//input[@type='email']"))
    )
    password_input1 = driver1.find_element(By.XPATH, "//input[@type='password']")
    sign_in_button1 = driver1.find_element(By.XPATH, "//button[contains(text(),'Sign in with Email')]")


    email_input1.send_keys("deniz@gmail.com")
    password_input1.send_keys("deniz123")
    sign_in_button1.click()


# the relevant inputs have been sent for the first tab and the sign-in button is clicked
    # waiting for "Login Successful!" message
    WebDriverWait(driver1, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//h1[text()='Login Successful!']"))
    )
    print("✅ First login successful")


# the first log-in is successful if the message appears
except TimeoutException:
    print("❌ First login failed - 'Login Successful!' message not found")


except NoSuchElementException as e:
    print(f"❌ First login failed - Element not found: {e}")


# checking if the login failure is due to double tabs rather than false credentials
try:
    email_input2 = WebDriverWait(driver2, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//input[@type='email']"))
    )
    password_input2 = driver2.find_element(By.XPATH, "//input[@type='password']")
    sign_in_button2 = driver2.find_element(By.XPATH, "//button[contains(text(),'Sign in with Email')]")


    email_input2.send_keys("deniz@gmail.com")
    password_input2.send_keys("deniz123")
    sign_in_button2.click()


# the relevant inputs have been sent for the second tab and the sign-in button is clicked
    # waiting for "Login Successful!" message
    WebDriverWait(driver2, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//h1[text()='Login Successful!']"))
    )
    print("✅ Second login successful")


# the second log-in is successful if the message appears
except TimeoutException:
    print("❌ Second login failed - 'Login Successful!' message not found")
except NoSuchElementException as e:
    print(f"❌ Second login failed - Element not found: {e}")


# checking if the login failure is due to double tabs rather than false credentials
try:
    success_message1 = WebDriverWait(driver1, 5).until(
        EC.presence_of_element_located((By.XPATH, "//h1[text()='Login Successful!']"))
    )
    success_message2 = WebDriverWait(driver2, 5).until(
        EC.presence_of_element_located((By.XPATH, "//h1[text()='Login Successful!']"))
    )


# checking one more time if the success messages are still displayed
    if success_message1.is_displayed() and success_message2.is_displayed():
        print("✅ Test passed (Both sessions show 'Login Successful!')")
    else:
        print("❌ Test failed (One session lost 'Login Successful!')")


# if both messages are displayed, both sessions are logged in successfully.
except (TimeoutException, StaleElementReferenceException):
    print("❌ Test failed due to session change or logout in one tab")


driver1.quit()
driver2.quit()
