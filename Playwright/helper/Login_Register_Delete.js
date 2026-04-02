import { expect } from '@playwright/test';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

export async function RegisterAPI(request, creds) {
    expect(creds).toHaveProperty('firstName');
    expect(creds).toHaveProperty('lastName');
    expect(creds).toHaveProperty('email');
    expect(creds).toHaveProperty('password');
    const response = await request.post(`${BASE_URL}/users`, {
        data: creds
    });
    if (!response.ok()) {
        const status = response.status();
        const statusText = response.statusText();
        const url = response.url();

        let body;
        try {
            body = await response.json();
        } catch {
            body = await response.text();
        }

        throw new Error(
            `Request failed:
            URL: ${url}
            Payload: ${JSON.stringify(creds)}
            Status: ${status} ${statusText}
            Response Body: ${JSON.stringify(body, null, 2)}`
        );
    }
}

export async function DeleteUser(context) {
    let cookies = await context.cookies();
    let token = cookies.find(cookie => cookie.name === 'token');
    if (!token?.value) {
        throw new Error('No auth token found in cookies');
    }
    const response = await context.request.delete(`${BASE_URL}/users/me`, {
        headers: {
            'Authorization': token.value
        }
    });
    if (!response.ok()) {
        const status = response.status();
        const statusText = response.statusText();
        const url = response.url();

        let body;
        try {
            body = await response.json();
        } catch {
            body = await response.text();
        }

        throw new Error(
            `Request failed:
            URL: ${url}
            Payload: ${token.value}
            Status: ${status} ${statusText}
            Response Body: ${JSON.stringify(body, null, 2)}`
        );
    }
}

export async function Login(page, creds) {
    expect(creds).toHaveProperty('email');
    expect(creds).toHaveProperty('password');
    await page.goto(BASE_URL);
    await page.getByPlaceholder('Email').fill(creds.email);
    await page.getByPlaceholder('Password').fill(creds.password);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/contactList`);
    await expect(page.locator('table.contactTable')).toBeVisible();
}