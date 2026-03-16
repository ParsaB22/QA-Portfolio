import { test, expect} from '@playwright/test';
import { RegisterAPI, Login, DeleteUser } from "../helper/Login_Register_Delete";

//Register related tests
test.describe('Register Tests', () => {
    test('Valid signup fields cause successful registration', async ({ page, context }) => {
        //Navigate to application
        await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
        //Click Sign Up and check if it goes to the correct page
        await page.getByRole('button', { name: 'Sign up' }).click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addUser');
        //Check if all the input fields are visible, fill them out
        const data = {
            first: 'Parsa',
            last: 'Baghaie',
            email: 'parsabaghaie@example.com',
            password: 'password123'
        };
        let firstNameInput = page.getByPlaceholder('First Name');
        await expect(firstNameInput).toBeVisible();
        await firstNameInput.fill(data.first);

        let lastNameInput = page.getByPlaceholder('Last Name');
        await expect(lastNameInput).toBeVisible();
        await lastNameInput.fill(data.last);

        let emailInput = page.getByPlaceholder('Email');
        await expect(emailInput).toBeVisible();
        await emailInput.fill(data.email);

        let passwordInput = page.getByPlaceholder('Password');
        await expect(passwordInput).toBeVisible();
        await passwordInput.fill(data.password);
        //Click submit and check if it goes to the correct page and shows the contact list confirming registration was successful
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');
        await expect(page.locator('table.contactTable')).toBeVisible();

        //Delete the user we just created to not mess with other tests
        await DeleteUser(context);
    });

    test('Invalid ALL signup fields cause error message', async ({ page }) => {
        //Navigate to application
        await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
        //Click Sign Up and check if it goes to the correct page
        await page.getByRole('button', { name: 'Sign up' }).click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addUser');
        //Check if all the input fields are visible, fill them out with invalid email and short password
        const data = {
            first: '',
            last: '',
            email: 'invalid-email',
            password: 'short'
        };

        let firstNameInput = page.getByPlaceholder('First Name');
        await expect(firstNameInput).toBeVisible();
        await firstNameInput.fill(data.first);

        let lastNameInput = page.getByPlaceholder('Last Name');
        await expect(lastNameInput).toBeVisible();
        await lastNameInput.fill(data.last);

        let emailInput = page.getByPlaceholder('Email');
        await expect(emailInput).toBeVisible();
        await emailInput.fill(data.email);

        let passwordInput = page.getByPlaceholder('Password');
        await expect(passwordInput).toBeVisible();
        await passwordInput.fill(data.password);
        //Click submit and check if error message is visible and URL has not changed
        await page.getByRole('button', { name: 'Submit' }).click();
        let errorMessage = page.locator('#error');
        //An error does pop up
        await expect(errorMessage).toBeVisible();
        //The error message contains all the expected validation errors
        await expect(errorMessage).toContainText('User validation failed:');
        await expect(errorMessage).toContainText('firstName: Path `firstName` is required.');
        await expect(errorMessage).toContainText('lastName: Path `lastName` is required.');
        await expect(errorMessage).toContainText('email: Email is invalid');
        await expect(errorMessage).toContainText("password: Path `password` (`" + data.password + "`) is shorter than the minimum allowed length (7).");
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addUser');
    });

    const invalidDataCases = [
        { case: "First Name Empty", first: '', error: "firstName: Path `firstName` is required." },
        { case: "First Name Longer than 20 Characters", first: 'A'.repeat(21), error: "Path `firstName` (`" + 'A'.repeat(21) + "`) is longer than the maximum allowed length (20)." },
        { case: "Last Name Empty", last: '', error: "lastName: Path `lastName` is required." },
        { case: "Last Name Longer than 20 Characters", last: 'A'.repeat(21), error: "Path `lastName` (`" + 'A'.repeat(21) + "`) is longer than the maximum allowed length (20)." },        
        { case: "Email Invalid", email: 'bademail', error: "email: Email is invalid" },
        { case: "Password Too Short", password: '1', error: "password: Path `password` (`1`) is shorter than the minimum allowed length (7)." },
        { case: "Password Empty", password: '', error: "password: Path `password` is required." },
        { case: "Password Longer than 100 Characters", password: 'A'.repeat(101), error: "password: Path `password` (`" + 'A'.repeat(101) + "`) is longer than the maximum allowed length (100)." },
        { case: "All Fields Invalid", first: '', last: '', email: 'bademail', password: '1', error: "User validation failed: firstName: Path `firstName` is required., lastName: Path `lastName` is required., email: Email is invalid, password: Path `password` (`1`) is shorter than the minimum allowed length (7)." }
    ];
    invalidDataCases.forEach((testcase) => {
        test("Single invalid field causes error message: "+JSON.stringify(testcase.case), async ({ page }) => {
            //Navigate to application
            await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
            //Click Sign Up and check if it goes to the correct page
            await page.getByRole('button', { name: 'Sign up' }).click();
            await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addUser');
            //Check if all the input fields are visible, fill them out with invalid email and short password
            const {
                first = "Parsa",
                last = "Baghaie",
                email = "parsabaghaie@example.com",
                password = "password123"
            } = testcase;

            let firstNameInput = page.getByPlaceholder('First Name');
            await expect(firstNameInput).toBeVisible();
            await firstNameInput.fill(first);

            let lastNameInput = page.getByPlaceholder('Last Name');
            await expect(lastNameInput).toBeVisible();
            await lastNameInput.fill(last);

            let emailInput = page.getByPlaceholder('Email');
            await expect(emailInput).toBeVisible();
            await emailInput.fill(email);

            let passwordInput = page.getByPlaceholder('Password');
            await expect(passwordInput).toBeVisible();
            await passwordInput.fill(password);

            //Click submit and check if error message is visible and URL has not changed
            await page.getByRole('button', { name: 'Submit' }).click();
            let errorMessage = page.locator('#error');
            await expect(errorMessage).toContainText('User validation failed:');
            await expect(errorMessage).toContainText(testcase.error);
            await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addUser');
        });
    });

    test('Already Existing Email causes error message', async ({ page , context, request}) => {
        //First register a user to then test registering with the same email
        const data = {
            first: 'Parsa',
            last: 'Baghaie',
            email: 'parsabaghaie@example.com',
            password: 'password123'
        };
        await RegisterAPI(request);
        //Navigate to application
        await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
        //Click Sign Up and check if it goes to the correct page
        await page.getByRole('button', { name: 'Sign up' }).click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addUser');
        //Fill out form with same email as before and check for error message about email already existing
        let firstNameInput = page.getByPlaceholder('First Name');
        await expect(firstNameInput).toBeVisible();
        await firstNameInput.fill(data.first);
        
        let lastNameInput = page.getByPlaceholder('Last Name');
        await expect(lastNameInput).toBeVisible();
        await lastNameInput.fill(data.last);
        
        let emailInput = page.getByPlaceholder('Email');
        await expect(emailInput).toBeVisible();
        await emailInput.fill(data.email);

        let passwordInput = page.getByPlaceholder('Password');
        await expect(passwordInput).toBeVisible();
        await passwordInput.fill(data.password);
        
        await page.getByRole('button', { name: 'Submit' }).click();
        let errorMessage = page.locator('#error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText("Email address is already in use");
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/addUser');

        //Delete the user we just created to not mess with other tests
        await Login(page, data);
        await DeleteUser(context);
    });
})

//Login related tests
test.describe('Login Tests', () => {
    test('Valid login fields cause successful login', async ({ page, context, request }) => {
        //First register a user to then test logging in with those credentials
        const data = {
            first: 'Parsa',
            last: 'Baghaie',
            email: 'parsabaghaie@example.com',
            password: 'password123'
        };
        await RegisterAPI(request);
        
        await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
        let emailInput = page.getByPlaceholder('Email');
        await expect(emailInput).toBeVisible();
        await emailInput.fill(data.email);

        let passwordInput = page.getByPlaceholder('Password');
        await expect(passwordInput).toBeVisible();
        await passwordInput.fill(data.password);

        
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');
        await expect(page.locator('table.contactTable')).toBeVisible();
        
        //Delete the user we just created to not mess with other tests
        await Login(page, data);
        await DeleteUser(context);
    });

    const invalidLoginCases = [
        { case: "Email Empty", email: '' },
        { case: "Email Incorrect", email: 'wrong-email' },
        { case: "Password Empty", password: '' },
        { case: "Password Incorrect", password: 'short' },
        { case: "Both Fields Incorrect", email: 'wrong-email', password: 'short' },
        { case: "Both Fields Empty", email: '', password: '' },
    ];
    invalidLoginCases.forEach((testCase) => {
        test("Invalid login fields cause error message: " + testCase.case, async ({ page }) => {
            await page.goto('https://thinking-tester-contact-list.herokuapp.com/');

            const {
                email = 'parsabaghaie@example.com',
                password = 'password123'
            } = testCase;

            let emailInput = page.getByPlaceholder('Email');
            await expect(emailInput).toBeVisible();
            await emailInput.fill(email);

            let passwordInput = page.getByPlaceholder('Password');
            await expect(passwordInput).toBeVisible();
            await passwordInput.fill(password);

            await page.getByRole('button', { name: 'Submit' }).click();

            let errorMessage = page.locator('#error');
            await expect(errorMessage).toBeVisible();
            expect(await errorMessage.textContent()).toBe("Incorrect username or password");
        });
    });
});

//Logout and Delete related tests though may seems redundant with the above tests clicking logout, they dont actually check that the user is logged out and taken to the login page, they just click the button and move on. These tests check that the user is actually logged out and taken to the login page and that the delete user functionality works as expected.
test.describe('Logout and Delete Tests', () => {
    
    test('Logout button logs the user out and takes them to the login page', async ({ page, context, request }) => {
        //First register a user to then test logging in with those credentials
        await RegisterAPI(request);
        const data = {
            email: 'parsabaghaie@example.com',
            password: 'password123'
        };
        await Login(page, data);


        let logout = page.getByRole('button', { name: 'Logout' });
        await expect(logout).toBeVisible();
        await logout.click();
        await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/');
        await page.goto('https://thinking-tester-contact-list.herokuapp.com/contactList');
        await expect(page.locator('table.contactTable')).not.toBeVisible();

        //Delete the user we just created to not mess with other tests
        await Login(page, data);
        await DeleteUser(context);
    });

    //Since we are using delete for tests we should test that it actually works and deletes the user
    test('Delete user while logged in deletes the user confirmed', async ({ page, context, request }) => {
        //First register a user to then test logging in with those credentials
        await RegisterAPI(request);
        const data = {
            email: 'parsabaghaie@example.com',
            password: 'password123'
        };
        await Login(page, data);

        let cookies = await context.cookies();
        expect(cookies).not.toBeNull();
        let token = cookies.find(cookie => cookie.name === 'token');
        expect(token).toBeDefined();
        expect(token.value).not.toBeNull();
        const response = await context.request.delete('https://thinking-tester-contact-list.herokuapp.com/users/me', {
            headers: {
                'Authorization': token.value
            }
        });
        expect(response.ok()).toBeTruthy();
        page.reload();
        await expect(page.locator('table.contactTable')).not.toBeVisible();
        await page.goto('https://thinking-tester-contact-list.herokuapp.com');

        let emailInput = page.getByPlaceholder('Email');
        await expect(emailInput).toBeVisible();
        await emailInput.fill(data.email);

        let passwordInput = page.getByPlaceholder('Password');
        await expect(passwordInput).toBeVisible();
        await passwordInput.fill(data.password);

        await page.getByRole('button', { name: 'Submit' }).click();

        let errorMessage = page.locator('#error');
        await expect(errorMessage).toBeVisible();
        expect(await errorMessage.textContent()).toBe("Incorrect username or password");
    });
});