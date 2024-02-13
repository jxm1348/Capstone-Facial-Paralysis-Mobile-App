import { By } from 'selenium-webdriver';

const SERVER_URL = 'http://127.0.0.1:19006';

export async function goToClinicianMessagesMark(driver) {
    await driver.get(SERVER_URL);
    await driver.findElement(By.id('pressable-debug-clinician')).click();
    await driver.findElement(By.id('pressable-navbar-patients')).click();
    await driver.findElement(By.id('pressable-patient-K8bhUx2Hqv2LjfP4BsKy')).click();
}
