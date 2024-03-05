import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import { Builder, By } from 'selenium-webdriver';
import firefox from "selenium-webdriver/firefox.js";

import { goToLogin } from '../testlib.mjs';

const fetchEnter = () => new Promise(resolve => process.stdin.once('data', resolve));

const debug = false;
const headless = !debug && true;

let driver = 1 === 2 && (await new Builder().forBrowser('firefox').build());

beforeAll(async () => {
    let driverPromise = new Builder().forBrowser('firefox');
    if (headless) {
        const options = new firefox.Options();
        driverPromise = driverPromise
            .setFirefoxOptions(options.addArguments('--headless').windowSize({width:640,height:480}));
    }
    driver = await driverPromise.build();
    await driver.manage().setTimeouts({ implicit: 10000 });
}, 20 * 1000);

describe('Login screen', () => {
    it('Redirects to clinician screen on clinician login', async () => {
        await goToLogin(driver, 'taltman@gmail.com');
        const header = await driver.findElement(By.id('text-header-welcome')).getAttribute('textContent');
        expect(header).toMatch(/Teddy Altman/);
        await driver.findElement(By.id('pressable-navbar-patients')); // Should throw exception if element not found.
    }, 20 * 1000);

    it('Redirects to patient screen on patient login', async () => {
        await goToLogin(driver, 'jcarson@gmail.com');
        await driver.findElement(By.id('pressable-navbar-upload')); // Should throw exception if element not found.
    }, 20 * 1000);
})

afterAll(async () => {
    if (debug) {
        await fetchEnter();
        process.stdin.destroy();
    }
    await driver.quit();
}, 30 * 1000);
