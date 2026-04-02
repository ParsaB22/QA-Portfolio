# Feature: User Account Management Flow ⭐

### Test Scenarios 🚩
1. User Registration
2. User Login
3. Logout & Account Deletion

### Tests 📋
|1| Test Scenario: | User Registration |
| :-: | :-- | :-- |

| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :-: | :-- | :- | :-- | :-- | :- | :-- |
| 1.1 | Register user with valid data | 1. Navigate to homepage <br> 2. Click **Sign up** <br> 3. Enter valid first name, last name, email, and password <br> 4. Click **Submit** | firstName: Parsa <br> lastName: Baghaie <br> email: parsabaghaie@example.com <br> password: password123 | User successfully registered and redirected to contact list page; contact table visible | Redirected to `/contactList`; contact table displayed | Pass | Positive Test Case - successful registration with all valid fields |
| 1.2 | Attempt registration with empty first name | 1. Navigate to homepage <br> 2. Click **Sign up** <br> 3. Leave first name empty, fill other fields with valid data <br> 4. Click **Submit** | firstName: (blank) <br> lastName: Baghaie <br> email: parsabaghaie@example.com <br> password: password123 | Error message displayed indicating first name is required; remain on registration page | Error: "firstName: Path `firstName` is required."; URL remains `/addUser` | Pass | Required field validation - negative test |
| 1.3 | Attempt registration with first name exceeding 20 characters | 1. Navigate to homepage <br> 2. Click **Sign up** <br> 3. Enter first name with 21 characters <br> 4. Fill remaining fields with valid data <br> 5. Click **Submit** | firstName: AAAAAAAAAAAAAAAAAAAAA (21 chars) <br> lastName: Baghaie <br> email: parsabaghaie@example.com <br> password: password123 | Error message indicating first name exceeds maximum length (20 characters) | Error: "Path `firstName` (...) is longer than the maximum allowed length (20)." | Pass | Field length validation - maximum character limit |
| 1.4 | Attempt registration with empty last name | 1. Navigate to homepage <br> 2. Click **Sign up** <br> 3. Leave last name empty, fill other fields with valid data <br> 4. Click **Submit** | firstName: Parsa <br> lastName: (blank) <br> email: parsabaghaie@example.com <br> password: password123 | Error message displayed indicating last name is required | Error: "lastName: Path `lastName` is required."; remains on registration page | Pass | Required field validation - negative test |
| 1.5 | Attempt registration with last name exceeding 20 characters | 1. Navigate to homepage <br> 2. Click **Sign up** <br> 3. Enter last name with 21 characters <br> 4. Fill remaining fields with valid data <br> 5. Click **Submit** | firstName: Parsa <br> lastName: AAAAAAAAAAAAAAAAAAAAA (21 chars) <br> email: parsabaghaie@example.com <br> password: password123 | Error message indicating last name exceeds maximum length (20 characters) | Error: "Path `lastName` (...) is longer than the maximum allowed length (20)." | Pass | Field length validation - maximum character limit |
| 1.6 | Attempt registration with invalid email format | 1. Navigate to homepage <br> 2. Click **Sign up** <br> 3. Enter invalid email format <br> 4. Fill remaining fields with valid data <br> 5. Click **Submit** | firstName: Parsa <br> lastName: Baghaie <br> email: bademail <br> password: password123 | Error message indicating email format is invalid | Error: "email: Email is invalid"; remains on registration page | Pass | Format validation - email pattern |
| 1.7 | Attempt registration with password too short | 1. Navigate to homepage <br> 2. Click **Sign up** <br> 3. Enter password with less than 7 characters <br> 4. Fill remaining fields with valid data <br> 5. Click **Submit** | firstName: Parsa <br> lastName: Baghaie <br> email: parsabaghaie@example.com <br> password: 1 | Error message indicating password is too short (minimum 7 characters) | Error: "password: Path `password` (`1`) is shorter than the minimum allowed length (7)." | Pass | Field length validation - minimum character requirement |
| 1.8 | Attempt registration with empty password | 1. Navigate to homepage <br> 2. Click **Sign up** <br> 3. Leave password empty <br> 4. Fill remaining fields with valid data <br> 5. Click **Submit** | firstName: Parsa <br> lastName: Baghaie <br> email: parsabaghaie@example.com <br> password: (blank) | Error message indicating password is required | Error: "password: Path `password` is required." | Pass | Required field validation - negative test |
| 1.9 | Attempt registration with password exceeding 100 characters | 1. Navigate to homepage <br> 2. Click **Sign up** <br> 3. Enter password with 101 characters <br> 4. Fill remaining fields with valid data <br> 5. Click **Submit** | firstName: Parsa <br> lastName: Baghaie <br> email: parsabaghaie@example.com <br> password: AAAAAAAAA... (101 chars) | Error message indicating password exceeds maximum length (100 characters) | Error: "password: Path `password` (...) is longer than the maximum allowed length (100)." | Pass | Field length validation - maximum character limit |
| 1.10 | Attempt registration with all fields invalid | 1. Navigate to homepage <br> 2. Click **Sign up** <br> 3. Enter invalid data in all fields <br> 4. Click **Submit** | firstName: (blank) <br> lastName: (blank) <br> email: bademail <br> password: 1 | Multiple validation errors displayed for all fields | Error contains: firstName required, lastName required, email invalid, password too short | Pass | Comprehensive negative validation - all fields |
| 1.11 | Attempt registration with existing email | 1. Pre-create user via API with email parsabaghaie@example.com <br> 2. Navigate to homepage <br> 3. Click **Sign up** <br> 4. Attempt to register with same email <br> 5. Click **Submit** | firstName: Parsa <br> lastName: Baghaie <br> email: parsabaghaie@example.com (already exists) <br> password: password123 | Error message indicating email already in use; registration prevented | Error: "Email address is already in use"; remains on registration page | Pass | Duplicate email validation - uniqueness constraint |

---
---
---

|2| Test Scenario: | User Login |
| :-: | :-- | :-- |

| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :-: | :-- | :- | :-- | :-- | :- | :-- |
| 2.1 | Login with valid credentials | 1. Pre-register user via API <br> 2. Navigate to homepage <br> 3. Enter valid email and password <br> 4. Click **Submit** | email: parsabaghaie@example.com <br> password: password123 | User successfully logged in and redirected to contact list page; contact table visible | Redirected to `/contactList`; contact table displayed | Pass | Positive Test Case - successful login |
| 2.2 | Attempt login with empty email | 1. Pre-register user via API <br> 2. Navigate to homepage <br> 3. Leave email empty, enter valid password <br> 4. Click **Submit** | email: (blank) <br> password: password123 | Error message: "Incorrect username or password" | Error displayed: "Incorrect username or password" | Pass | Negative test - missing email |
| 2.3 | Attempt login with incorrect email | 1. Pre-register user via API <br> 2. Navigate to homepage <br> 3. Enter incorrect email, valid password <br> 4. Click **Submit** | email: wrong-email <br> password: password123 | Error message: "Incorrect username or password" | Error displayed: "Incorrect username or password" | Pass | Negative test - invalid email |
| 2.4 | Attempt login with empty password | 1. Pre-register user via API <br> 2. Navigate to homepage <br> 3. Enter valid email, leave password empty <br> 4. Click **Submit** | email: parsabaghaie@example.com <br> password: (blank) | Error message: "Incorrect username or password" | Error displayed: "Incorrect username or password" | Pass | Negative test - missing password |
| 2.5 | Attempt login with incorrect password | 1. Pre-register user via API <br> 2. Navigate to homepage <br> 3. Enter valid email, incorrect password <br> 4. Click **Submit** | email: parsabaghaie@example.com <br> password: short | Error message: "Incorrect username or password" | Error displayed: "Incorrect username or password" | Pass | Negative test - invalid password |
| 2.6 | Attempt login with both email and password incorrect | 1. Pre-register user via API <br> 2. Navigate to homepage <br> 3. Enter incorrect email and password <br> 4. Click **Submit** | email: wrong-email <br> password: short | Error message: "Incorrect username or password" | Error displayed: "Incorrect username or password" | Pass | Negative test - both fields invalid |
| 2.7 | Attempt login with both email and password empty | 1. Pre-register user via API <br> 2. Navigate to homepage <br> 3. Leave both fields empty <br> 4. Click **Submit** | email: (blank) <br> password: (blank) | Error message: "Incorrect username or password" | Error displayed: "Incorrect username or password" | Pass | Negative test - empty credentials |

---
---
---

|3| Test Scenario: | Logout & Account Deletion |
| :-: | :-- | :-- |

| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :- | :- | :- | :- | :- | :- | :- |
| 3.1 | Logout from authenticated session | 1. Register user via API <br> 2. Login to application <br> 3. Click **Logout** button <br> 4. Attempt to access protected page (`/contactList`) | Existing authenticated session | User logged out and redirected to login page; protected pages inaccessible after logout | Redirected to homepage; contact list not visible when accessed directly | Pass | Logout functionality verification |
| 3.2 | Delete user account via API and invalidate session | 1. Register user via API <br> 2. Login to application <br> 3. Extract authentication token from cookies <br> 4. Call DELETE API to remove user <br> 5. Reload page and verify session invalid <br> 6. Attempt to login with deleted credentials | Existing authenticated user with valid token | User account deleted; session invalidated; login attempts fail with credentials | Page reload shows contact table not visible; login attempt returns "Incorrect username or password" | Pass | Account deletion and session invalidation verification |