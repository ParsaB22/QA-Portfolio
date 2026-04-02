import { test, expect} from '@playwright/test';
import { RegisterAPI, Login, DeleteUser } from "../helper/Login_Register_Delete";

// Base URL for reuse across tests (good practice)
const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

//! =====================
//! REGISTRATION TESTS
//! =====================
test.describe('REGISTRATION TESTS', () => {
    test('should register user with valid data', async ({ page, context }) => {
        //* Navigate to homepage
        await page.goto(BASE_URL);
        //* Click Sign Up and check if it goes to the correct page
        await page.getByRole('button', { name: 'Sign up' }).click();
        await expect(page).toHaveURL(`${BASE_URL}/addUser`);
        // Test data for valid registration
        const creds = {
            firstName: "Parsa",
            lastName: "Baghaie",
            email: "parsabaghaie@example.com",
            password: "password123"
        };
        //*Check if all the input fields are visible/interactable, fill them out
        let firstNameInput = page.getByPlaceholder('First Name');
        await expect(firstNameInput).toBeVisible();
        await firstNameInput.fill(creds.firstName);

        let lastNameInput = page.getByPlaceholder('Last Name');
        await expect(lastNameInput).toBeVisible();
        await lastNameInput.fill(creds.lastName);

        let emailInput = page.getByPlaceholder('Email');
        await expect(emailInput).toBeVisible();
        await emailInput.fill(creds.email);

        let passwordInput = page.getByPlaceholder('Password');
        await expect(passwordInput).toBeVisible();
        await passwordInput.fill(creds.password);
        //* Submit form and verify success navigation
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page).toHaveURL(`${BASE_URL}/contactList`);
        await expect(page.locator('table.contactTable')).toBeVisible();

        // Cleanup: delete created user
        await DeleteUser(context);
    });

    //? Parameterized invalid input tests
    const invalidDataCases = [
        { case: "First Name is Empty", first: '', error: "firstName: Path `firstName` is required." },
        { case: "First Name is Longer than 20 Characters", first: 'A'.repeat(21), error: "Path `firstName` (`" + 'A'.repeat(21) + "`) is longer than the maximum allowed length (20)." },
        { case: "Last Name is Empty", last: '', error: "lastName: Path `lastName` is required." },
        { case: "Last Name is Longer than 20 Characters", last: 'A'.repeat(21), error: "Path `lastName` (`" + 'A'.repeat(21) + "`) is longer than the maximum allowed length (20)." },        
        { case: "Email is Invalid", email: 'bademail', error: "email: Email is invalid" },
        { case: "Password is Too Short", password: '1', error: "password: Path `password` (`1`) is shorter than the minimum allowed length (7)." },
        { case: "Password is Empty", password: '', error: "password: Path `password` is required." },
        { case: "Password is Longer than 100 Characters", password: 'A'.repeat(101), error: "password: Path `password` (`" + 'A'.repeat(101) + "`) is longer than the maximum allowed length (100)." },
        { case: "All Fields are Invalid", first: '', last: '', email: 'bademail', password: '1', error: "User validation failed: firstName: Path `firstName` is required., lastName: Path `lastName` is required., email: Email is invalid, password: Path `password` (`1`) is shorter than the minimum allowed length (7)." }
    ];
    
    invalidDataCases.forEach((testcase) => {
        test(`should show validation error when: ${testcase.case}`, async ({ page }) => {
            //Navigate to application
            await page.goto(BASE_URL);
            //Click Sign Up
            await page.getByRole('button', { name: 'Sign up' }).click();
            // Use defaults + override only invalid field
            const {
                first = "Parsa",
                last = "Baghaie",
                email = "parsabaghaie@example.com",
                password = "password123"
            } = testcase;

            // Fill form
            await page.getByPlaceholder('First Name').fill(first);
            await page.getByPlaceholder('Last Name').fill(last);
            await page.getByPlaceholder('Email').fill(email);
            await page.getByPlaceholder('Password').fill(password);

            // Submit and validate error
            await page.getByRole('button', { name: 'Submit' }).click();

            let errorMessage = page.locator('#error');
            await expect(errorMessage).toContainText('User validation failed:');
            await expect(errorMessage).toContainText(testcase.error);

            // Ensure no redirect
            await expect(page).toHaveURL(`${BASE_URL}/addUser`);
        });
    });

    test('should show validation error when: Email already exists', async ({ page , context, request}) => {
        //First register a user to then test registering with the same email
        const creds = {
            firstName: "Parsa",
            lastName: "Baghaie",
            email: "parsabaghaie@example.com",
            password: "password123"
        };
        // Pre-create user
        await RegisterAPI(request, creds);

        await page.goto(BASE_URL);
        await page.getByRole('button', { name: 'Sign up' }).click();

        // Fill same email again
        await page.getByPlaceholder('First Name').fill(creds.firstName);
        await page.getByPlaceholder('Last Name').fill(creds.lastName);
        await page.getByPlaceholder('Email').fill(creds.email);
        await page.getByPlaceholder('Password').fill(creds.password);
        
        await page.getByRole('button', { name: 'Submit' }).click();

        // Validate duplicate email error
        let errorMessage = page.locator('#error');
        await expect(errorMessage).toContainText("Email address is already in use");
        await expect(page).toHaveURL(`${BASE_URL}/addUser`);

        // Cleanup
        await Login(page, creds);
        await DeleteUser(context);
    });
})

//! =====================
//! LOGIN TESTS
//! =====================
test.describe('LOGIN TESTS', () => {
    const creds = {
            firstName: "Parsa",
            lastName: "Baghaie",
            email: "parsabaghaie@example.com",
            password: "password123"
        };
    test.beforeEach(async ({ request }) => {
        await RegisterAPI(request, creds);
    });
    test.afterEach(async ({ page, context }) => {
        await Login(page, creds);
        await DeleteUser(context);
    });
    test('should login with valid credentials', async ({ page, context, request }) => {
        //Navigate back to homepage
        await page.goto(BASE_URL);

        // Fill login form
        let emailInput = page.getByPlaceholder('Email');
        await expect(emailInput).toBeVisible();
        await emailInput.fill(creds.email);

        let passwordInput = page.getByPlaceholder('Password');
        await expect(passwordInput).toBeVisible();
        await passwordInput.fill(creds.password);
        
        await page.getByRole('button', { name: 'Submit' }).click();

        // Validate login success
        await expect(page).toHaveURL(`${BASE_URL}/contactList`);
        await expect(page.locator('table.contactTable')).toBeVisible();
    });

    const invalidLoginCases = [
        { case: "Email is Empty", email: '' },
        { case: "Email is Incorrect", email: 'wrong-email' },
        { case: "Password is Empty", password: '' },
        { case: "Password is Incorrect", password: 'short' },
        { case: "Email/Password Fields are Incorrect", email: 'wrong-email', password: 'short' },
        { case: "Email/Password Fields are Empty", email: '', password: '' },
    ];
    invalidLoginCases.forEach((testCase) => {
        test(`should show validation error when ${testCase.case}`, async ({ page }) => {
            // Use defaults + override only invalid field
            const {
                email = creds.email,
                password = creds.password
            } = testCase;

            await page.goto(BASE_URL);
            //Fill Form
            await page.getByPlaceholder('Email').fill(email);
            await page.getByPlaceholder('Password').fill(password);

            //Submit and validate error
            await page.getByRole('button', { name: 'Submit' }).click();

            let errorMessage = page.locator('#error');
            await expect(errorMessage).toBeVisible();
            // Same error for all invalid login attempts
            expect(await errorMessage.textContent()).toBe("Incorrect username or password");
        });
    });
});

//! =====================
//! LOGOUT / DELETE TESTS
//! =====================
test.describe('LOGOUT / DELETE TESTS', () => {
    test('should logout user and redirect to login page', async ({ page, context, request }) => {
        // First register a user and login
        const creds = {
            firstName: "Parsa",
            lastName: "Baghaie",
            email: "parsabaghaie@example.com",
            password: "password123"
        };
        await RegisterAPI(request, creds);
        await Login(page, creds);

        // Logout
        let logout = page.getByRole('button', { name: 'Logout' });
        await expect(logout).toBeVisible();
        await logout.click();
        // Ensure redirect to login page
        await expect(page).toHaveURL(BASE_URL);
        // Try accessing protected page
        await page.goto(`${BASE_URL}/contactList`);
        await expect(page.locator('table.contactTable')).not.toBeVisible();

        // Cleanup
        await Login(page, creds);
        await DeleteUser(context);
    });

    //Since we are using delete for other tests we should test that it actually works and deletes the user
    test('should delete user and invalidate session', async ({ page, context, request }) => {
        // First register a user and login
        const creds = {
            firstName: "Parsa",
            lastName: "Baghaie",
            email: "parsabaghaie@example.com",
            password: "password123"
        };
        await RegisterAPI(request, creds);
        await Login(page, creds);

        // Extract auth token from cookies
        let cookies = await context.cookies();
        expect(cookies).not.toBeNull();
        let token = cookies.find(cookie => cookie.name === 'token');
        expect(token).toBeDefined();
        expect(token.value).not.toBeNull();

        // Call delete API
        const response = await context.request.delete(`${BASE_URL}/users/me`, {
            headers: {
                'Authorization': token.value
            }
        });
        expect(response.ok()).toBeTruthy();
        // Ensure session is invalid
        page.reload();
        await expect(page.locator('table.contactTable')).not.toBeVisible();
        // Try logging in again --> should fail
        await page.goto(BASE_URL);
        await page.getByPlaceholder('Email').fill(creds.email);
        await page.getByPlaceholder('Password').fill(creds.password);
        await page.getByRole('button', { name: 'Submit' }).click();

        //Error properly triggered
        await expect(page.locator('#error')).toHaveText("Incorrect username or password");
    });
});