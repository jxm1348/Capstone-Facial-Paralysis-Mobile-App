import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import { Builder, By } from 'selenium-webdriver';
import firefox from "selenium-webdriver/firefox.js";
import { goToClinicianPatients } from '../testlib.mjs';

const fetchEnter = () => new Promise(resolve => process.stdin.once('data', resolve));

const debug = true;
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
    await driver.manage().setTimeouts({ implicit: 2000 });
}, 20 * 1000);



describe('Clinician Patients', () => {
    it('Has a header', async () => {
        await goToClinicianPatients(driver, 'mgrey@gmail.com');
        const headerElement = await driver.findElement(By.id('text-patients-header'));
        expect(await headerElement.getText()).toStrictEqual('Patients');
    });

    it('Shows only appropriate patients', async () => {
        // Terry Altman has no patients
        await goToClinicianPatients(driver, 'taltman@gmail.com');
        const altmanPatients = await driver.findElements(By.css('#view-patients > div'));
        expect(altmanPatients.length).toStrictEqual(0);

        // Cristina Yang has two patients
        await goToClinicianPatients(driver, 'cyang@gmail.com');
        const yangPatients = await driver.findElements(By.css('#view-patients > div'));
        expect(yangPatients.length).toStrictEqual(2);
        await driver.findElement(By.id('pressable-patient-5NEvyWyAES1DVuuJ7BDZ')); // jxm
        await driver.findElement(By.id('pressable-patient-IneBpCxH8S4F0CVSo2fU')); // Denzel Washington
    }, 15 * 1000)
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
