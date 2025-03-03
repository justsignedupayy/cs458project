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
driver = webdriver.Chrome(service=s, options=options)




driver.execute_cdp_cmd("Network.enable", {})
driver.execute_cdp_cmd("Network.emulateNetworkConditions", {
    "offline": False,
    "latency": 500,
    "downloadThroughput": 100 * 1024,  # 100 KB/s download speed
    "uploadThroughput": 50 * 1024,  # 50 KB/s upload speed
})


# here, we purposefully slow down network speed before accessing the relevant url.
driver.get('http://localhost:3000')


email_input = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.XPATH, "//input[@type='email']"))
)
password_input = driver.find_element(By.XPATH, "//input[@type='password']")
sign_in_button = driver.find_element(By.XPATH, "//button[contains(text(),'Sign in with Email')]")


# again, we access the relevant objects.
# credentials and sign-in button
email_input.send_keys("deniz@gmail.com")
password_input.send_keys("deniz123")


# we send the correct user in order to test the signing in process
sign_in_button = WebDriverWait(driver, 15).until(
    EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Sign in with Email')]"))
)


sign_in_button.click()


try:
    # waiting for the success message (indicates login success)
    success_message = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//h1[text()='Login Successful!']"))
    )


# the test is passed if the success message appears
    assert success_message.text == "Login Successful!"
    print("Test is passed")  


except TimeoutException:
    try:
        error_message = driver.find_element(By.XPATH, "//p[contains(text(),'Incorrect email or password')]")
        print("Test failed due to incorrect user input")


# to ensure that the test failure is due to network rather than wrong user input, we used TimeoutException
    except NoSuchElementException:
        print("Test failed due to network error (or unexpected issue)")


# this is the relevant error due to network
except AssertionError:
    print("Test is failed due to incorrect page content")
except Exception as e:
    print(f"Test failed due to an unexpected error: {e}")


driver.quit()