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


google_sign_in_button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Sign in with Google')]"))
)
driver.execute_script("arguments[0].click();", google_sign_in_button)


# click the sign-in with Google button
WebDriverWait(driver, 10).until(lambda d: len(d.window_handles) > 1)
driver.switch_to.window(driver.window_handles[-1])  


# switch to the newest opened window
WebDriverWait(driver, 20).until(EC.url_contains("accounts.google.com"))


# here, we wait until the clicked button opens the Google Accounts url.
try:
    assert "accounts.google.com" in driver.current_url
    print("Test is passed")


# if the url is in the current url, then the authentication process has been a success.
except AssertionError:
    print("Test is failed")
   


driver.quit()
