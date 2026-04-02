import { test, expect } from '@playwright/test';
import { RegisterAPI, Login, DeleteUser } from "../helper/Login_Register_Delete";

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

/**
 * Helper function to add a contact.
 * It navigates to the add contact page, fills in the provided data, submits the form,
 * and waits for the redirect back to the contact list.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {Object} data - Contact fields (e.g., firstName, lastName, email, etc.)
 */
async function addContact(page, data) {
    await test.step(`Adding Contact: ${data.firstName} ${data.lastName}`, async () => {
        /*
            Click "Add a New Contact" and wait for navigation to the /addContact page.
            Using Promise.all ensures that if navigation starts after the click,
            Playwright will already be listening for the URL change, preventing race conditions.
        */
        await Promise.all([
            page.getByRole('button', { name: 'Add a New Contact' }).click(),
            page.waitForURL(`${BASE_URL}/addContact`),
        ]);

        // Sanity check: verify the form fields are present and empty before filling.
        const firstnameLocation = await page.locator('#firstName');
        await expect(firstnameLocation).toBeEditable();
        await expect(firstnameLocation).toHaveValue('');

        // Dynamically fill all fields provided in the data object.
        // This allows the helper to work with a subset of fields (e.g., only required ones).
        for (const [key, value] of Object.entries(data)) {
            const input = await page.locator(`#${key}`);
            await input.fill(value);
        }

        // Submit the form and wait for the redirect back to the contact list page.
        await Promise.all([
            page.getByRole('button', { name: 'Submit' }).click(),
            page.waitForURL(`${BASE_URL}/contactList`),
        ]);
    });
}

//! =====================
//! ADD CONTACT TESTS
//! =====================
test.describe('ADD CONTACT', () => {
    // Credentials for the test user (used in beforeEach and afterEach).
    const creds = {
        firstName: "Parsa",
        lastName: "Baghaie",
        email: "parsabaghaie@example.com",
        password: "password123"
    };

    // Before each test: create a new user via API and log them in.
    test.beforeEach(async ({ page, request }) => {
        await RegisterAPI(request, creds);
        await Login(page, creds);
    });

    // After each test: clean up by deleting the user via API.
    test.afterEach(async ({ context }) => {
        await DeleteUser(context);
    });

    test('should create contact when all fields are valid', async ({ page }) => {
        // 1. Navigate to the "Add Contact" page.
        await Promise.all([
            page.getByRole('button', { name: 'Add a New Contact' }).click(),
            page.waitForURL(`${BASE_URL}/addContact`)
        ]);

        // 2. Define the full contact data (all optional fields included).
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
        };

        // 3. Fill each field by matching the key to the element's id attribute.
        for (const [key, value] of Object.entries(data)) {
            const input = page.locator(`#${key}`);
            await expect(input).toBeVisible();
            await input.fill(value);
        }

        // 4. Submit the form and wait for redirect back to the contact list.
        await Promise.all([
            page.getByRole('button', { name: 'Submit' }).click(),
            page.waitForURL(`${BASE_URL}/contactList`)
        ]);

        // 5. Verify the new contact appears in the table.
        //    Since we only have one contact, we can grab the first table row.
        const newContact = page.locator('.contactTable tr.contactTableBodyRow');
        await expect(newContact).toBeVisible();
        await expect(newContact).toHaveCount(1);

        // 6. Check that each field appears in the correct table column.
        //    The table has a fixed column order, but some fields share a column.
        //    We manually adjust the index for fields that do not occupy a new column.
        let index = 0;
        const cells = newContact.getByRole('cell');
        for (const [key, value] of Object.entries(data)) {
            // Fields that share a column (e.g., lastName appears in the same cell as firstName)
            // require us to skip incrementing the index.
            if (key === "lastName" || key === "street2" || key === "stateProvince" || key === "postalCode") {
                index -= 1;
            }
            const cellValue = await cells.nth(index).innerText();
            expect(cellValue).toContain(value);
            index++;
        }

        // 7. Go to the contact's detail page and verify all fields match.
        await Promise.all([
            newContact.click(),
            page.waitForURL(`${BASE_URL}/contactDetails`)
        ]);
        for (const [key, value] of Object.entries(data)) {
            const pageValue = page.locator(`#${key}`);
            await expect(pageValue).toBeVisible();
            await expect(pageValue).toHaveText(value);
        }
    });

    test('should create contact when only required fields are provided', async ({ page }) => {
        // Navigate to the add contact page.
        await Promise.all([
            page.getByRole('button', { name: 'Add a New Contact' }).click(),
            page.waitForURL(`${BASE_URL}/addContact`)
        ]);

        // Only required fields: firstName and lastName.
        const data = {
            firstName: 'Brock',
            lastName: 'Lee',
        };

        // Fill the required fields.
        for (const [key, value] of Object.entries(data)) {
            const input = page.locator(`#${key}`);
            await expect(input).toBeVisible();
            await input.fill(value);
        }

        // Submit and wait for redirect.
        await Promise.all([
            page.getByRole('button', { name: 'Submit' }).click(),
            page.waitForURL(`${BASE_URL}/contactList`)
        ]);

        // Verify that exactly one contact is displayed and that it shows the full name.
        const newContact = page.locator('.contactTable tr.contactTableBodyRow');
        await expect(newContact).toHaveCount(1);
        await expect(newContact.getByRole('cell', { name: `${data.firstName} ${data.lastName}` })).toBeVisible();
        // No deeper checks needed because the previous test already verified integrity for optional fields.
    });

    test('should add multiple contacts and display them in sorted order', async ({ page }) => {
        // List of contacts to add (only first and last name, as required).
        const contacts = [
            { firstName: 'Alice', lastName: 'Smith' },
            { firstName: 'Bob', lastName: 'Johnson' },
            { firstName: 'Charles', lastName: 'Anderson' }
        ];

        // Add each contact using the helper.
        for (const contact of contacts) {
            await addContact(page, contact);
        }

        // Get all rows from the contact table.
        const list = page.locator('.contactTable tr.contactTableBodyRow');
        await expect(list).toHaveCount(contacts.length);

        /*
            The contact list on the site is sorted by lastName (and then firstName).
            To correctly validate the order, we sort our test data the same way.
            This prevents false negatives if the contacts are displayed in a different order
            than we added them.
        */
        contacts.sort((a, b) => {
            const lastCompare = a.lastName.localeCompare(b.lastName);
            if (lastCompare !== 0) return lastCompare;
            return a.firstName.localeCompare(b.firstName);
        });

        // Verify that each row contains the expected contact in the correct order.
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            const row = list.nth(i);
            await expect(row.getByRole('cell', { name: `${contact.firstName} ${contact.lastName}` })).toBeVisible();
        }
    });

    test('should not create contact when creation is canceled', async ({ page }) => {
        const data = {
            firstName: 'Brock',
            lastName: 'Lee',
        };

        // Navigate to add contact page.
        await page.getByRole('button', { name: 'Add a New Contact' }).click();

        // Fill the fields.
        for (const [key, value] of Object.entries(data)) {
            const input = page.locator(`#${key}`);
            await expect(input).toBeVisible();
            await input.fill(value);
        }

        // Click Cancel and wait for redirect to contact list.
        await Promise.all([
            page.getByRole('button', { name: 'Cancel' }).click(),
            page.waitForURL(`${BASE_URL}/contactList`)
        ]);

        // Verify that no contact with the entered name was created.
        await expect(page.locator(
            '.contactTable .contactTableBodyRow',
            {
                has: page.getByRole(
                    "cell",
                    { name: `${data.firstName} ${data.lastName}` }
                )
            }
        )).toHaveCount(0);
    });

    test('should show validation errors when required fields are missing', async ({ page }) => {
        // Navigate to add contact page.
        await Promise.all([
            page.getByRole('button', { name: 'Add a New Contact' }).click(),
            page.waitForURL(`${BASE_URL}/addContact`)
        ]);

        // Only fill optional fields (firstName and lastName are missing on purpose).
        const data = {
            birthdate: '1990-01-01',
            email: 'brock.lee@example.com'
        };
        for (const [key, value] of Object.entries(data)) {
            const input = page.locator(`#${key}`);
            await expect(input).toBeVisible();
            await input.fill(value);
        }

        // Submit and verify we stay on the same page (validation failed).
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page).toHaveURL(`${BASE_URL}/addContact`);

        // Check that error messages mention the missing required fields.
        const error = page.locator('#error');
        await expect(error).toBeVisible();
        await expect(error).toContainText("Contact validation failed:");
        await expect(error).toContainText("Path `firstName` is required.");
        await expect(error).toContainText("Path `lastName` is required.");

        // Navigate back to contact list and verify no contact was added.
        await Promise.all([
            page.getByRole('button', { name: 'Cancel' }).click(),
            page.waitForURL(`${BASE_URL}/contactList`)
        ]);
        await expect(page.locator('.contactTable .contactTableBodyRow')).toHaveCount(0);
    });

    // Data-driven tests for invalid values in optional fields.
    const invalidData = [
        {
            case: "Email and Phone are invalid",
            values: { email: 'invalid-email', phone: 'invalid-phone' },
            error: 'email: Email is invalid, phone: Phone number is invalid'
        },
    ];

    invalidData.forEach((testcase) => {
        test(`should show validation error for optional fields when: ${JSON.stringify(testcase.case)}`, async ({ page }) => {
            // Navigate to add contact page.
            await Promise.all([
                page.getByRole('button', { name: 'Add a New Contact' }).click(),
                page.waitForURL(`${BASE_URL}/addContact`)
            ]);

            // Build the full data set: required fields are always valid, optional fields come from testcase.
            const data = {
                firstName: 'John',
                lastName: 'Doe',
                ...testcase.values
            };

            // Fill the fields.
            for (const [key, value] of Object.entries(data)) {
                const input = page.locator(`#${key}`);
                await expect(input).toBeVisible();
                await input.fill(value);
            }

            // Submit and expect to stay on the same page due to validation errors.
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page).toHaveURL(`${BASE_URL}/addContact`);

            // Verify the error message contains the expected text.
            const error = page.locator('#error');
            await expect(error).toBeVisible();
            await expect(error).toContainText("Contact validation failed:");
            await expect(error).toContainText(testcase.error);

            // Cancel and go back to contact list; ensure no contact was created.
            await Promise.all([
                page.getByRole('button', { name: 'Cancel' }).click(),
                page.waitForURL(`${BASE_URL}/contactList`)
            ]);
            await expect(page.locator('.contactTable .contactTableBodyRow')).toHaveCount(0);
        });
    });
});

//! =====================
//! MODIFY CONTACT TESTS
//! =====================
test.describe('MODIFY CONTACT', () => {
    const creds = {
        firstName: "Parsa",
        lastName: "Baghaie",
        email: "parsabaghaie@example.com",
        password: "password123"
    };

    test.beforeEach(async ({ page, request }) => {
        await RegisterAPI(request, creds);
        await Login(page, creds);
    });

    test.afterEach(async ({ context }) => {
        await DeleteUser(context);
    });

    // Test cases for valid modifications (all values are accepted by the server).
    const validCases = [
        {
            case: "providing valid fields different from current values",
            modify: {
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
            }
        },
        {
            case: "removing optional fields",
            modify: {
                firstName: 'John',
                lastName: 'Doe',
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
    ];

    validCases.forEach((testcase) => {
        test("should update contact when: " + testcase.case, async ({ page }) => {
            // 1. Create a base contact with all fields filled.
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
            };
            await addContact(page, data);

            // 2. Click on the contact to open details.
            await Promise.all([
                page.locator('.contactTable tr.contactTableBodyRow').click(),
                page.waitForURL(`${BASE_URL}/contactDetails`)
            ]);

            // 3. Click Edit to go to the edit page.
            await Promise.all([
                page.getByRole('button', { name: 'Edit Contact' }).click(),
                page.waitForURL(`${BASE_URL}/editContact`)
            ]);

            /*
                Important: The edit form is pre‑populated with the contact's existing data.
                We wait for the firstName field to have a value (i.e., the page has finished
                rendering the pre‑filled values) before we start typing. This avoids a race
                condition where Playwright would try to fill while the page is still loading.
            */
            await expect(page.locator('#firstName')).not.toHaveValue('');

            // 4. Fill the form with the new data (or clear fields if value is empty string).
            for (const [key, value] of Object.entries(testcase.modify)) {
                const input = page.locator(`#${key}`);
                await expect(input).toBeVisible();
                await input.fill(value);
            }

            // 5. Submit the changes and wait for redirect to the contact details page.
            await Promise.all([
                page.getByRole('button', { name: 'Submit' }).click(),
                page.waitForURL(`${BASE_URL}/contactDetails`)
            ]);

            // 6. Verify that the details page reflects the updated values.
            for (const [key, value] of Object.entries(testcase.modify)) {
                const pageValue = page.locator(`#${key}`);
                if (value === '') {
                    // If the field was cleared, it should not be visible (or should be empty).
                    await expect(pageValue).not.toBeVisible();
                } else {
                    await expect(pageValue).toBeVisible();
                }
                await expect(pageValue).toHaveText(value);
            }

            // 7. Return to the contact list and verify the updated values in the table.
            await Promise.all([
                page.getByRole('button', { name: 'Return to Contact List' }).click(),
                page.waitForURL(`${BASE_URL}/contactList`)
            ]);

            const updatedContact = page.locator('.contactTable tr.contactTableBodyRow');
            await expect(updatedContact).toBeVisible();
            await expect(updatedContact).toHaveCount(1);

            // Check each field in the table, adjusting for columns that share cells.
            let index = 0;
            const cells = updatedContact.getByRole('cell');
            for (const [key, value] of Object.entries(testcase.modify)) {
                if (key === "lastName" || key === "street2" || key === "stateProvince" || key === "postalCode") {
                    index -= 1;
                }
                const cellValue = await cells.nth(index).innerText();
                expect(cellValue).toContain(value);
                index++;
            }
        });
    });

    test('should update only the selected contact without affecting others', async ({ page }) => {
        // Create three contacts.
        const contacts = [
            { firstName: 'Alice', lastName: 'Smith' },
            { firstName: 'Bob', lastName: 'Johnson' },
            { firstName: 'Charles', lastName: 'Anderson' }
        ];
        for (const contact of contacts) {
            await addContact(page, contact);
        }

        // Get all rows and sort them by the same order as the UI (lastName, firstName).
        let list = page.locator('.contactTable tr.contactTableBodyRow');
        await expect(list).toHaveCount(contacts.length);
        contacts.sort((a, b) => {
            const lastCompare = a.lastName.localeCompare(b.lastName);
            if (lastCompare !== 0) return lastCompare;
            return a.firstName.localeCompare(b.firstName);
        });

        // For each contact, capture its unique ID (the first column in the row).
        // This ID will help us later to ensure only the modified contact changes.
        for (let i = 0; i < contacts.length; i++) {
            const id = await list.nth(i).locator('td').first().innerText();
            await expect(list.nth(i).getByRole('cell', { name: `${contacts[i].firstName} ${contacts[i].lastName}` })).toBeVisible();
            contacts[i].id = id;
        }

        // Pick a random contact to modify.
        const randomIndex = Math.floor(Math.random() * contacts.length);
        const oldContact = contacts[randomIndex];

        // Click on the chosen contact to open its details.
        await Promise.all([
            page.getByRole('cell', { name: `${oldContact.firstName} ${oldContact.lastName}` }).click(),
            page.waitForURL(`${BASE_URL}/contactDetails`)
        ]);

        // Click Edit.
        await Promise.all([
            page.getByRole('button', { name: 'Edit Contact' }).click(),
            page.waitForURL(`${BASE_URL}/editContact`)
        ]);

        // Define the modifications (only firstName and lastName, keeping the ID unchanged).
        const modifiedContact = {
            firstName: 'Robert',
            lastName: 'Johnson',
            id: oldContact.id
        };

        // Wait for the form to be ready, then update the fields.
        await expect(page.locator('#firstName')).not.toHaveValue('');
        await page.locator('#firstName').fill(modifiedContact.firstName);
        await page.locator('#lastName').fill(modifiedContact.lastName);

        // Submit changes and return to contact list.
        await Promise.all([
            page.getByRole('button', { name: 'Submit' }).click(),
            page.waitForURL(`${BASE_URL}/contactDetails`)
        ]);
        await Promise.all([
            page.getByRole('button', { name: 'Return to Contact List' }).click(),
            page.waitForURL(`${BASE_URL}/contactList`)
        ]);

        // Replace the modified contact in the list with the updated one.
        contacts[randomIndex] = modifiedContact;

        // Re‑sort the list (the name change might affect sorting order).
        contacts.sort((a, b) => {
            const lastCompare = a.lastName.localeCompare(b.lastName);
            if (lastCompare !== 0) return lastCompare;
            return a.firstName.localeCompare(b.firstName);
        });

        // Verify the table now contains the updated contacts, and that each ID is still the same
        // (meaning only the name fields changed, and other contacts remain untouched).
        const newList = page.locator('.contactTable tr.contactTableBodyRow');
        await expect(newList).toHaveCount(contacts.length);
        for (let i = 0; i < contacts.length; i++) {
            const id = await newList.nth(i).locator('td').first().innerText();
            await expect(newList.nth(i).getByRole('cell', { name: `${contacts[i].firstName} ${contacts[i].lastName}` })).toBeVisible();
            expect(contacts[i].id).toBe(id);
        }
    });

    // Test cases for invalid modifications (the server should reject them).
    const invalidCases = [
        {
            case: "attempting to modify contact by removing first and last name",
            modify: {
                firstName: '',
                lastName: ''
            },
            error: "lastName: Path `lastName` is required., firstName: Path `firstName` is required."
        },
        {
            case: "attempting to modify contact with invalid values for every field",
            modify: {
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
            case: "attempting to modify contact with one invalid field (Email)",
            modify: {
                email: 'invalid-email'
            },
            error: "email: Email is invalid"
        },
    ];

    invalidCases.forEach((testcase) => {
        test("should show validation error when: " + testcase.case, async ({ page }) => {
            // Create a base contact.
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
            };
            await addContact(page, data);

            // Open the contact details and go to edit.
            await Promise.all([
                page.locator('.contactTable tr.contactTableBodyRow').click(),
                page.waitForURL(`${BASE_URL}/contactDetails`)
            ]);
            await Promise.all([
                page.getByRole('button', { name: 'Edit Contact' }).click(),
                page.waitForURL(`${BASE_URL}/editContact`)
            ]);

            // Wait for the form to be pre‑filled.
            await expect(page.locator('#firstName')).not.toHaveValue('');

            // Fill the form with the invalid data.
            for (const [key, value] of Object.entries(testcase.modify)) {
                const input = page.locator(`#${key}`);
                await expect(input).toBeVisible();
                await input.fill(value);
            }

            // Submit and verify we stay on the edit page (validation failed).
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page).toHaveURL(`${BASE_URL}/editContact`);

            // Check that the error message contains the expected text.
            const error = page.locator('#error');
            await expect(error).toBeVisible();
            await expect(error).toContainText("Validation failed:");
            await expect(error).toContainText(testcase.error);

            // Cancel the edit and verify that no changes were persisted.
            await Promise.all([
                page.getByRole('button', { name: 'Cancel' }).click(),
                page.waitForURL(`${BASE_URL}/contactDetails`)
            ]);
            for (const [key, value] of Object.entries(data)) {
                const pageValue = page.locator(`#${key}`);
                await expect(pageValue).toHaveText(value);
            }
        });
    });

    test('should not update contact when edit is canceled', async ({ page }) => {
        // Original contact data (baseline to compare after cancellation).
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
        };

        // Create the contact.
        await addContact(page, data);

        // Open the contact details and go to edit.
        await Promise.all([
            page.locator('.contactTable tr.contactTableBodyRow').click(),
            page.waitForURL(`${BASE_URL}/contactDetails`)
        ]);
        await Promise.all([
            page.getByRole('button', { name: 'Edit Contact' }).click(),
            page.waitForURL(`${BASE_URL}/editContact`)
        ]);

        // New values we would apply but then cancel.
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
        };

        // Wait for the form to be pre‑filled.
        await expect(page.locator('#firstName')).not.toHaveValue('');

        // Fill the form with the new data.
        for (const [key, value] of Object.entries(newData)) {
            const input = page.locator(`#${key}`);
            await expect(input).toBeVisible();
            await input.fill(value);
        }

        // Cancel the edit – this should discard all changes.
        await Promise.all([
            page.getByRole('button', { name: 'Cancel' }).click(),
            page.waitForURL(`${BASE_URL}/contactDetails`)
        ]);

        // Verify that the contact details still show the original data.
        for (const [key, value] of Object.entries(data)) {
            const pageValue = page.locator(`#${key}`);
            if (value === '') {
                await expect(pageValue).not.toBeVisible();
            } else {
                await expect(pageValue).toBeVisible();
            }
            await expect(pageValue).toHaveText(value);
        }

        // Return to contact list and verify the table still contains the original data.
        await Promise.all([
            page.getByRole('button', { name: 'Return to Contact List' }).click(),
            page.waitForURL(`${BASE_URL}/contactList`)
        ]);

        const updatedContact = page.locator('.contactTable tr.contactTableBodyRow');
        await expect(updatedContact).toBeVisible();

        let index = 0;
        const cells = updatedContact.getByRole('cell');
        for (const [key, value] of Object.entries(data)) {
            if (key === "lastName" || key === "street2" || key === "stateProvince" || key === "postalCode") {
                index -= 1;
            }
            const cellValue = await cells.nth(index).innerText();
            expect(cellValue).toContain(value);
            index++;
        }
    });
});

//! =====================
//! DELETE CONTACT TESTS
//! =====================
test.describe('DELETE CONTACT', () => {
    const creds = {
        firstName: "Parsa",
        lastName: "Baghaie",
        email: "parsabaghaie@example.com",
        password: "password123"
    };

    test.beforeEach(async ({ page, request }) => {
        await RegisterAPI(request, creds);
        await Login(page, creds);
    });

    test.afterEach(async ({ context }) => {
        await DeleteUser(context);
    });

    test('should delete contact and remove it from contact list', async ({ page }) => {
        // Create a contact.
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
        };
        await addContact(page, data);

        // Capture its unique ID (first column) to reliably identify it after deletion.
        const id = await page.locator('.contactTable .contactTableBodyRow').locator('td').first().innerText();

        // Open the contact details.
        await Promise.all([
            page.locator('.contactTable tr.contactTableBodyRow').click(),
            page.waitForURL(`${BASE_URL}/contactDetails`)
        ]);

        // Handle the browser confirmation dialog – accept the deletion.
        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });

        // Click Delete and wait for redirect back to contact list.
        await Promise.all([
            page.getByRole('button', { name: 'Delete Contact' }).click(),
            page.waitForURL(`${BASE_URL}/contactList`)
        ]);

        // Verify the contact is no longer present by its unique ID.
        await expect(page.locator('.contactTable td', { hasText: id })).toHaveCount(0);
    });

    test('should not delete contact when deletion is canceled', async ({ page }) => {
        // Create a contact.
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
        };
        await addContact(page, data);

        // Capture its ID.
        const id = await page.locator('.contactTable tr.contactTableBodyRow').locator('td').first().innerText();

        // Open contact details.
        await Promise.all([
            page.locator('.contactTable tr.contactTableBodyRow').click(),
            page.waitForURL(`${BASE_URL}/contactDetails`)
        ]);

        // Handle the dialog – dismiss it (cancel deletion).
        page.on('dialog', async (dialog) => {
            await dialog.dismiss();
        });

        // Attempt to delete but cancel.
        await page.getByRole('button', { name: 'Delete Contact' }).click();

        // Verify we remain on the details page (delete was canceled).
        await expect(page).toHaveURL(`${BASE_URL}/contactDetails`);

        // Return to contact list and verify the contact still exists.
        await Promise.all([
            page.getByRole('button', { name: 'Return to Contact List' }).click(),
            page.waitForURL(`${BASE_URL}/contactList`)
        ]);
        await expect(page.locator('.contactTable td', { hasText: id })).toHaveCount(1);
    });

    test('should only delete the selected contact from multiple contacts', async ({ page }) => {
        // Contacts to keep.
        const keptContacts = [
            { firstName: 'Alice', lastName: 'Smith' },
            { firstName: 'Charles', lastName: 'Anderson' }
        ];
        // Contact to delete.
        const toBeDeleted = {
            firstName: 'Bob',
            lastName: 'Johnson',
        };

        // Create all contacts.
        for (const contact of [...keptContacts, toBeDeleted]) {
            await addContact(page, contact);
        }

        // Locate the specific row of the contact to delete.
        const contactRow = page.locator(
            '.contactTable .contactTableBodyRow',
            {
                has: page.getByRole(
                    "cell",
                    { name: `${toBeDeleted.firstName} ${toBeDeleted.lastName}` }
                )
            }
        );

        // Capture its ID.
        const id = await contactRow.locator('td').first().innerText();

        // Open its details.
        await Promise.all([
            contactRow.click(),
            page.waitForURL(`${BASE_URL}/contactDetails`)
        ]);

        // Accept the deletion.
        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });

        // Delete and wait for redirect.
        await Promise.all([
            page.getByRole('button', { name: 'Delete Contact' }).click(),
            page.waitForURL(`${BASE_URL}/contactList`)
        ]);

        // Verify the contact is gone by ID (most reliable).
        await expect(page.locator('.contactTable td', { hasText: id })).toHaveCount(0);
        // Also verify by name (secondary check).
        await expect(page.locator(
            '.contactTable .contactTableBodyRow',
            {
                has: page.getByRole(
                    "cell",
                    { name: `${toBeDeleted.firstName} ${toBeDeleted.lastName}` }
                )
            }
        )).toHaveCount(0);

        // Ensure only the kept contacts remain.
        await expect(page.locator('.contactTable .contactTableBodyRow')).toHaveCount(keptContacts.length);

        // Verify each kept contact still exists.
        for (const contact of keptContacts) {
            await expect(page.locator(
                '.contactTable .contactTableBodyRow',
                {
                    has: page.getByRole(
                        "cell",
                        { name: `${contact.firstName} ${contact.lastName}` }
                    )
                }
            )).toHaveCount(1);
        }
    });
});