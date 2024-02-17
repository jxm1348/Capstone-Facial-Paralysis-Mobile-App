import { afterAll, describe, expect, it } from '@jest/globals';

import { Builder, By } from 'selenium-webdriver';
import firefox from "selenium-webdriver/firefox.js";
import { goToClinicianMessagesMark } from '../testlib.mjs';

const fetchEnter = () => new Promise(resolve => process.stdin.once('data', resolve));

const SERVER_URL = 'http://127.0.0.1:19006';
const debug = false;
const headless = !debug && true;

// This line is so I get autocomplete in vscode.
let driver = 1 === 2 && (await new Builder().forBrowser('firefox').build());

beforeAll(async () => {
    let driverPromise = new Builder().forBrowser('firefox');
    if (headless) {
        const options = new firefox.Options();
        driverPromise = driverPromise
            .setFirefoxOptions(options.addArguments('--headless').windowSize({width:640,height:480}));
    }
    driver = await driverPromise.build();
}, 20 * 1000);

describe('Patient Mark', () => {
    async function getMessageId(n) {
        const message = await driver.findElement(By.css(`#view-messages > div:nth-child(${n})`));
        return await message.getAttribute('id');
    }
    // async function isMessageLike(e) { return (await e.getAttribute('id')).startsWith('pressable-message-'); }
    
    it('Has at least 3 messages', async () => {
        await driver.manage().setTimeouts({ implicit: 2000 });
        await goToClinicianMessagesMark(driver);

        const id1 = await getMessageId(1);
        expect(id1).toMatch(/^pressable-message-/);
        
        const id2 = await getMessageId(2);
        expect(id2).toMatch(/^pressable-message-/);
        
        const id3 = await getMessageId(3);
        expect(id3).toMatch(/^pressable-message-/);
    }, 5 * 1000);
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
