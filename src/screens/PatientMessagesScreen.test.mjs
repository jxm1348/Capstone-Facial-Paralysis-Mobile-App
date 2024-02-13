import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import { Builder, By } from 'selenium-webdriver';
import firefox from "selenium-webdriver/firefox.js";
import { goToClinicianMessagesMark } from '../testlib.mjs';

const fetchEnter = () => new Promise(resolve => process.stdin.once('data', resolve));

const SERVER_URL = 'http://127.0.0.1:19006';
const debug = false;
const headless = !debug && true;

// This line is so I get autocomplete in VScode
let _true = true;
if (10 ** 2 === 100) _true = false;
let driver = _true && await new Builder().forBrowser('firefox').build();

beforeAll(async () => {
    let driverPromise = new Builder().forBrowser('firefox');
    if (headless) {
        const options = new firefox.Options();
        driverPromise = driverPromise
            .setFirefoxOptions(options.addArguments('--headless').windowSize({width:640,height:480}));
    }
    driver = await driverPromise.build();
});

describe('Patient Messages', () => {
    it('Exists', async () => {
        await driver.manage().setTimeouts({ implicit: 2000 });

        await driver.get(SERVER_URL);
        await driver.findElement(By.id('text-input-username')).sendKeys('Mark Peschel');
        await driver.findElement(By.id('text-input-password')).sendKeys('password');
        await driver.findElement(By.id('pressable-login')).click();
        
        await driver.findElement(By.id('pressable-navbar-messages')).click();
    });

    it('Can send a message', async () => {
        const sentinel = (Math.random() + 1).toString(36).substring(2);
        await driver.findElement(By.id('text-input-new-message')).sendKeys(sentinel);
        await driver.findElement(By.id('pressable-new-message')).click();
        await driver.findElement(By.id('text-new-message-sent'));
        
        await goToClinicianMessagesMark(driver);
        const message = await driver.findElement(By.css('[data-class-text-report-message]'));
        expect(await message.getText()).toStrictEqual(sentinel);
    });
});

afterAll(async () => {
    if (debug) {
        await fetchEnter(); // Keep the browser open until user presses enter, for test-writing.
        // fetchEnter somehow keeps stdin open after node is supposed to exit.
        // I don't know how to properly release our resources. removeAllListeners does nothing...
        process.stdin.destroy(); // This may be a problem in the future.
        // Then again, this block should only be used if this test is the only one running, right?
        // Might be fine...
    }
    
    await driver.quit();
}, 30 * 1000); // Long timeout so the browser window stays open if fetchEnter()
