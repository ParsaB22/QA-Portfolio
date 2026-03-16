import { test, expect} from '@playwright/test';
import { RegisterAPI, Login, DeleteUser } from "../helper/Login_Register_Delete";
// --Valid All fields
// --Valid only First/Last Name empty fields
// --missing required fields
// --invalid all optional fields
// --invalid one field of all
// --add contact and see if it shows in contact list
// --add more than one contact and see if contact list displays all
// --check to see in contact list details are in correct order and formatting

async function addContact(page, data) {
    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    for (const key of Object.keys(data)) {
        const input = page.locator(`#${key}`);
        await input.fill(data[key]);
    }
    await page.getByRole('button', { name: 'Submit' }).click();
}

// ! Polish this function with BeforeEach and AfterEach to make it more efficient and less repetitive, also add more error handling and logging to make it easier to debug if something goes wrong, currently if something goes wrong it just returns without any indication of what went wrong which can make it hard to figure out the issue, also add more comments to explain what each part of the code is doing and why, this will make it easier for other people (or yourself in the future) to understand the code and make changes if needed without having to spend a lot of time trying to figure out what the code is doing
test.describe('Add Contact', () => {
    const creds = {
            email: "parsabaghaie@example.com",
            password: "password123"
        }
    test('Valid All fields', async ({ page, context, request }) => { 
        await RegisterAPI(request);
        await Login(page, creds);
        await page.getByRole('button', { name: 'Add a New Contact' }).click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addContact');
        const data = {
            firstName: 'Brock',
            lastName: 'Lee',
            birthdate: '1990-01-01',
            email: 'brock.lee@example.com',
            phone: '1234567890',
            street1: '123 Main St',
            street2: 'Apt 4B',
            city: 'Anytown',
            stateProvince: 'Florida',
            postalCode: '12345',
            country: 'USA'
        }

        for (const key of Object.keys(data)) {
            const input = page.locator(`#${key}`);
            await expect(input).toBeVisible();
            await input.fill(data[key]);
        }
        
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');
        let newContact = page.locator('.contactTable').locator('nth=-1');
        for (const key of Object.keys(data)) {
            // console.log(`Checking if ${key} with value ${data[key]} is visible in the new contact...`);
            await expect(newContact).toContainText(data[key]);
            //! Could cause problems if the contact has similar data in other cells, better to combine first/last name, address 1/2, city/state/country into one regex to check for the whole string instead of just one field at a time
            //! but for now this is good enough to check if the data is showing up in the contact list, just be aware that it could cause errors if there are similar values in other cells
            let cell = new RegExp(data[key] + '\\b');
            await expect(page.getByRole('cell', { name: cell })).toBeVisible();
        }
        await newContact.click();
        await expect(page).toHaveURL("https://thinking-tester-contact-list.herokuapp.com/contactDetails");
        for (const key of Object.keys(data)) {
            const value = page.locator(`#${key}`);
            await expect(value).toBeVisible();
            await expect(value).toHaveText(data[key]);
        }
        await DeleteUser(context);
    });
    test('Valid required fields only - First/Last Name', async ({ page, context, request }) => { 
        await RegisterAPI(request);
        await Login(page, creds);
        await page.getByRole('button', { name: 'Add a New Contact' }).click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addContact');

        const data = {
            firstName: 'Brock',
            lastName: 'Lee',
        }

        for (const key of Object.keys(data)) {
            const input = page.locator(`#${key}`);
            await expect(input).toBeVisible();
            await input.fill(data[key]);
        }
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');
        let newContact = page.locator('.contactTable').locator('nth=-1');
        await expect(newContact.getByRole('cell', { name: `${data.firstName} ${data.lastName}` })).toBeVisible();
        await DeleteUser(context);
    });
    test('Add multiple contacts and check if they show in contact list', async ({ page, context, request }) => {
        await RegisterAPI(request);
        await Login(page, creds);
        const contacts = [
            {
                firstName: 'Alice',
                lastName: 'Smith',
            },
            {
                firstName: 'Bob',
                lastName: 'Johnson',
            },
            {
                firstName: 'Charles',
                lastName: 'Anderson',
            }
        ]
        for (const contact of contacts) {
            await addContact(page, contact);
        }
        let list = page.locator('.contacts').locator('tr.contactTableBodyRow');
        await expect(list).toHaveCount(contacts.length);
        //Contact list on site is sorted by last name so we need to sort our data by last name to match the order in the contact list, if we dont do this then we could get false negatives if the contacts are not showing up in the same order as we added them but they are still there just in a different order, this way we can be sure that we are checking for the correct contact in the correct row
        //sort data by last name to match the order in the contact list
        contacts.sort((a, b) => a.lastName.localeCompare(b.lastName));
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            console.log(`${contact.firstName} ${contact.lastName} : ${i}`);
            const row = list.nth(i);
            await page.pause();
            await expect(row.getByRole('cell', { name: `${contact.firstName} ${contact.lastName}` })).toBeVisible();
        }
        await DeleteUser(context);
    });
    test('Missing/Invalid required fields', async ({ page, context, request }) => {
        await RegisterAPI(request);
        await Login(page, creds);
        await page.getByRole('button', { name: 'Add a New Contact' }).click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addContact');

        const data = {
            birthdate: '1990-01-01',
            email: 'brock.lee@example.com'
        };

        for (const key of Object.keys(data)) {
            const input = page.locator(`#${key}`);
            await expect(input).toBeVisible();
            await input.fill(data[key]);
        }
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addContact');
        // Add assertions for missing required fields error messages if applicable
        let error = page.locator('#error');
        await expect(error).toBeVisible();
        await expect(error).toContainText("Contact validation failed:");
        await expect(error).toContainText("Path `firstName` is required.");
        await expect(error).toContainText("Path `lastName` is required.");
        //go back to contact page and check nothing was added to the contact list
        // 
        // 
        // 
        await DeleteUser(context);
    });
    let invalidData = [
        { case: "Invalid email and phone", values: { email: 'invalid-email', phone: 'invalid-phone' }, error: 'email: Email is invalid, phone: Phone number is invalid'},
    ]
    invalidData.forEach((testcase) => {
        test(`Invalid optional fields ${JSON.stringify(testcase.case)}`, async ({ page, context, request }) => {
            await RegisterAPI(request);
            await Login(page, creds);
            await page.getByRole('button', { name: 'Add a New Contact' }).click();
            const data = {
                firstName: 'John',
                lastName: 'Doe',
                ...testcase.values
            };
            for (const key of Object.keys(data)) {
                const input = page.locator(`#${key}`);
                await expect(input).toBeVisible();
                await input.fill(data[key]);
            }
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addContact');
            let error = page.locator('#error');
            await expect(error).toBeVisible();
            await expect(error).toContainText("Contact validation failed:");
            await expect(error).toContainText(testcase.error);
            //go back to contact page and check nothing was added to the contact list
            // 
            // 
            // 
            await DeleteUser(context);
        });
    });

    
});

// -- modify contact with valid fields different from current values
// -- modify contact by removal of optional fields yet valid first/last cause no errors and changes
// -- attempt to modify by removing last/first ensuring error
// -- attempt to modify with invalid all fields ensuring error
// -- attempt to modify only one invalid field ensuring error
// -- modify contact and see if changes are reflected in contact list
// -- modify one of multiple contacts and see if only that contact is modified in contact list
test.describe('Modify Contact', () => { 
    const creds = {
            email: "parsabaghaie@example.com",
            password: "password123"
        }
    test.beforeEach(async ({ page, request }) => {
        await RegisterAPI(request);
        await Login(page, creds);
    });
    test.afterEach(async ({ context }) => {
        await DeleteUser(context);
    });
    const validCases = [
        { case: "modify contact with valid fields different from current values", data: {} },
        {
            case: "modify contact by removal of optional fields ensure no errors and changes properly",
            data: {
                birthdate: '',
                email: '',
                phone: '',
                street1: '',
                street2: '',
                city: '',
                stateProvince: '',
                postalCode: '',
                country: '',
            }
        },
        
    ]
    validCases.forEach((testcase) => {
        test.only(testcase.case, async ({ page }) => {
            //predefined data
            const data = {
                firstName: 'Brock',
                lastName: 'Lee',
                birthdate: '1990-01-01',
                email: 'brock.lee@example.com',
                phone: '1234567890',
                street1: '123 Main St',
                street2: 'Apt 4B',
                city: 'Anytown',
                stateProvince: 'Florida',
                postalCode: '12345',
                country: 'USA'
            }
            //create contact
            await addContact(page, data);
            // Click on the contact we just added to go to the contact details page, then click the edit button to go to the edit page
            await page.locator('.contactTable').locator('nth=-1').click();
            await expect(page).toHaveURL("https://thinking-tester-contact-list.herokuapp.com/contactDetails");
            //click edit andd assure we are on edit page
            await page.getByRole('button', { name: 'Edit Contact' }).click();
            await expect(page).toHaveURL("https://thinking-tester-contact-list.herokuapp.com/editContact");

            //new data we will turn the old data into
            const newData = {
                firstName: 'John',
                lastName: 'Doe',
                birthdate: '1985-05-15',
                email: 'john.doe@example.com',
                phone: '0987654321',
                street1: '456 Oak Ave',
                street2: 'Suite 2C',
                city: 'Somewhere',
                stateProvince: 'California',
                postalCode: '67890',
                country: 'Canada',
                ...testcase.data
            };
            // page issues cause page state to delay so this code waits for values to correctly appear then continues
            //probably due to page logic filling in prevalues when page loads but when the page loads playwright also trys to fill those values at the same time causing problems
            await expect(page.locator('#firstName')).not.toHaveValue('');
            //fill in data into respective fields
            for (const [key, value] of Object.entries(newData)) {
                const input = page.locator(`#${key}`);
                await expect(input).toBeVisible();
                await input.fill(value);
            }
            //submit
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page).toHaveURL("https://thinking-tester-contact-list.herokuapp.com/contactDetails");
            //check if updated values are assigned to the right slots
            for (const key of Object.keys(newData)) {
                const value = page.locator(`#${key}`);
                if (newData[key] === '') {
                    await expect(value).not.toBeVisible();
                }
                else {
                    await expect(value).toBeVisible();
                }
                await expect(value).toHaveText(newData[key]);
            }
            //go baack to full contact list
            await page.getByRole('button', { name: 'Return to Contact List' }).click();
            //get the only contact in list which will ensure that its the one we edited
            let updatedContact = page.locator('.contactTable').locator('nth=-1');
            //check if updated values are persistent in contact list
            await expect(updatedContact).toBeVisible();
            let index = 0;
            let cells = page.getByRole('cell');
            for (const key of Object.keys(newData)) {
                // console.log(`Checking if ${key} with value ${data[key]} is visible in the new contact...`);
                //index back if the field shares cell
                if (key === "lastName" || key === "street2" || key === "stateProvince" || key === "postalCode") {
                    index -= 1;
                }
                let val = await cells.nth(index).innerText();
                console.log("index:" + index + " = " + val);
                expect(val).toContain(newData[key]);
                index++;
            }
        });
    });
    let invalidCases = [
        {
            case: "attempt to modify by removing last/first ensuring error",
            data: {
                firstName: '',
                lastName: ''
            },
            error: "lastName: Path `lastName` is required., firstName: Path `firstName` is required."
        },
        {
            case: "attempt to modify with invalid all fields ensuring error",
            data: {
                firstName: '',
                lastName: '',
                birthdate: 'invalid-date',
                email: 'invalid-email',
                phone: 'invalid-phone',
                postalCode: 'ABCDE',
            },
            error: "postalCode: Postal code is invalid, phone: Phone number is invalid, email: Email is invalid, birthdate: Birthdate is invalid, lastName: Path `lastName` is required., firstName: Path `firstName` is required."
        },
        {
            case: "attempt to modify only one invalid field ensuring error",
            data: {
                email: 'invalid-email'
            },
            error: "email: Email is invalid"
        },
    ]
    invalidCases.forEach((testcase) => {
        test.only(testcase.case, async ({ page }) => {
            const data = {
                firstName: 'Brock',
                lastName: 'Lee',
                birthdate: '1990-01-01',
                email: 'brock.lee@example.com',
                phone: '1234567890',
                street1: '123 Main St',
                street2: 'Apt 4B',
                city: 'Anytown',
                stateProvince: 'Florida',
                postalCode: '12345',
                country: 'USA'
            }
                //create contact
            await addContact(page, data);
            await page.locator('.contactTable').locator('nth=-1').click();
            await page.getByRole('button', { name: 'Edit Contact' }).click();
            const newData = {
                firstName: 'John',
                lastName: 'Doe',
                birthdate: '1985-05-15',
                email: 'john.doe@example.com',
                phone: '0987654321',
                street1: '456 Oak Ave',
                street2: 'Suite 2C',
                city: 'Somewhere',
                stateProvince: 'California',
                postalCode: '67890',
                country: 'Canada',
                ...testcase.data
            };
            await expect(page.locator('#firstName')).not.toHaveValue('');
            //fill in data into respective fields
            for (const [key, value] of Object.entries(newData)) {
                const input = page.locator(`#${key}`);
                await expect(input).toBeVisible();
                await input.fill(value);
            }
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page).toHaveURL("https://thinking-tester-contact-list.herokuapp.com/editContact");
            let error = page.locator('#error');
            await expect(error).toBeVisible();
            await expect(error).toContainText("Validation failed:");
            await expect(error).toContainText(testcase.error);
        });
    });
    // test('modify one of multiple contacts and see if only that contact is modified in contact list', async ({ page, context, request }) => { });
    // test cancel edit and ensure no changes are made
});
// 69b45619ed7f8200150d3579
// 69b45619ed7f8200150d3579
// --delete contact and see if it is removed from contact list
// --delete one of multiple contacts and see if only that contact is removed from contact list
test.describe('Delete Contact', () => { });