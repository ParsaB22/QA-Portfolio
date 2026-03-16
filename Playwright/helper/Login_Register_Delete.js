import {expect} from '@playwright/test';

export async function RegisterAPI(request) {
    const response = await request.post('https://thinking-tester-contact-list.herokuapp.com/users', {
        data: {
            firstName: "Parsa",
            lastName: "Baghaie",
            email: "parsabaghaie@example.com",
            password: "password123"
        }
    });
    if (!response.ok()) {
        throw new Error('Failed to create user, status code: ' + response.status());
    }
}

export async function DeleteUser(context) {
    let cookies = await context.cookies();
    let token = cookies.find(cookie => cookie.name === 'token');
    if (!token) {
        console.error('ERROR: No token cookie found, cannot delete user');
        return;
    }
    const response = await context.request.delete('https://thinking-tester-contact-list.herokuapp.com/users/me', {
        headers: {
            'Authorization': token.value
        }
    });
    if (!response.ok()) {
        throw new Error('Failed to delete user, status code: ' + response.status());
    }
}

export async function Login(page, data) {
    await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
    await page.getByPlaceholder('Email').fill(data.email);
    await page.getByPlaceholder('Password').fill(data.password);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/contactList');
}