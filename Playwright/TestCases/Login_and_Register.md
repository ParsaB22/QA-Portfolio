# Feature: Login and Register Flow ⭐

### Test Scenarios 🚩

1. Verify Sign up Handling
2. Verify Login handling
3. Verify Logout Succession

-

### Tests 📋

| 1 | Test Scenario | Verify Sign up Handling |
| :-: | :- | :- |

| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :- | :- | :- | :- | :- | :- | :- |
| 1.1 | Valid signup fields cause successful registration | 1. Navigate to website <br> 2. Click **Sign Up** <br> 3. Enter valid information <br> 4. Click **Submit** | first_name:John <br> last_name:Doe <br> email:john@test.com <br> password:Pass123 | User account created successfully and redirected to login page | Redirected to login page | Pass | Positive Test Case |
| 1.2 | All fields invalid display validation errors | 1. Navigate to website <br> 2. Click **Sign Up** <br> 3. Enter invalid data in all fields <br> 4. Click **Submit** | first_name:!@# <br> last_name:123 <br> email:bademail <br> password:1 | Error messages displayed for each invalid field | Errors displayed | Pass | Negative Test Case |
| 1.3 | Invalid first name shows first name validation error | 1. Navigate to website <br> 2. Click **Sign Up** <br> 3. Enter invalid first name and valid other fields <br> 4. Click **Submit** | first_name:123 <br> last_name:Doe <br> email:john@test.com <br> password:Pass123 | Validation error displayed for **First Name** only | Error shown | Pass | Field validation test |
| 1.4 | Invalid last name shows last name validation error | 1. Navigate to website <br> 2. Click **Sign Up** <br> 3. Enter invalid last name and valid other fields <br> 4. Click **Submit** | first_name:John <br> last_name:### <br> email:john@test.com <br> password:Pass123 | Validation error displayed for **Last Name** | Error shown | Pass | Field validation |
| 1.5 | Invalid email format shows email validation error | 1. Navigate to website <br> 2. Click **Sign Up** <br> 3. Enter invalid email format <br> 4. Click **Submit** | email:johntest.com | Error message indicating invalid email format | Error displayed | Pass | Boundary / format validation |
| 1.6 | Attempting to register with already registered email shows error | 1. Navigate to website <br> 2. Click **Sign Up** <br> 3. Enter existing email <br> 4. Click **Submit** | email:existing@test.com | Error message indicating email already registered | Error displayed | Pass | Duplicate data validation |
| 1.7 | Password less than required length shows password validation error | 1. Navigate to website <br> 2. Click **Sign Up** <br> 3. Enter password less than 7 characters <br> 4. Click **Submit** | password:12345 | Error message indicating password requirements not met | Error displayed | Pass | Boundary value test |


| 2 | Test Scenario: | Verify Login Handling |
| :-: | :- | :- |

| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :- | :- | :- | :- | :- | :- | :- |
| 2.1 | Login with valid credentials | 1. Navigate to website <br> 2. Enter valid email and password <br> 3. Click **Login** | email:john@test.com <br> password:Pass123 | User successfully logged in and redirected to contact list page | Login successful | Pass | Positive Test Case |
| 2.2 | Login with correct email but incorrect password | 1. Navigate to website <br> 2. Enter correct email but wrong password <br> 3. Click **Login** | email:john@test.com <br> password:WrongPass | Error message indicating incorrect credentials | Error displayed | Pass | Negative authentication |
| 2.3 | Login with incorrect email and incorrect password | 1. Navigate to website <br> 2. Enter invalid email and password <br> 3. Click **Login** | email:fake@test.com <br> password:badpass | Error message indicating invalid login credentials | Error displayed | Pass | Negative authentication |
| 2.4 | Login with empty email and password fields | 1. Navigate to website <br> 2. Leave fields empty <br> 3. Click **Login** | email:(blank) <br> password:(blank) | Error message indicating required fields | Error displayed | Pass | Required field validation |

| 3 | Test Scenario: | 3. Verify Logout Succession |
| :-: | :- | :- |

| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :- | :- | :- | :- | :- | :- | :- |
| 3.1 | User successfully logs out of the application | 1. Login with valid credentials <br> 2. Navigate to contact list page <br> 3. Click **Logout** button | Valid user session | User session ends and user is redirected to login page | Redirected to login page | Pass | Session termination |

