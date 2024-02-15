import { By } from 'selenium-webdriver';

const SERVER_URL = 'http://127.0.0.1:19006';

export async function goToClinicianMessagesMark(driver) {
    await driver.get(SERVER_URL);
    await driver.findElement(By.id('pressable-debug-clinician')).click();
    await driver.findElement(By.id('pressable-navbar-patients')).click();
    await driver.findElement(By.id('pressable-patient-K8bhUx2Hqv2LjfP4BsKy')).click();
}

export async function goToLogin(driver, email) {
    await driver.get(SERVER_URL);
    await driver.findElement(By.id('text-input-email')).sendKeys(email);
    await driver.findElement(By.id('text-input-password')).sendKeys('password');
    await driver.findElement(By.id('pressable-login')).click();
}

export async function goToClinicianPatients(driver, email) {
    await goToLogin(driver, email);
    await driver.findElement(By.id('pressable-navbar-patients')).click();
}
