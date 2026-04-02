# Playwright - Contact Manager 💥

## Description 📝
This project contains end-to-end automated tests for the Contact List Manager application (https://thinking-tester-contact-list.herokuapp.com/). The test suite validates user account management (registration, login, logout, account deletion) and contact management (add, modify, delete contacts). The tests are written using Playwright Test Framework and follow Page Object Model patterns with reusable helper functions.

## Prerequisites 🛠️
- Node.js (v16 or higher)
- Playwright (v1.40 or higher)
- Modern web browser (Chrome, Firefox, or Safari)
- Internet connection to access the test application
- Git (for version control)

## Goal 💡
The objective of this testing project is to validate the core functionality of the Contact List Manager application through comprehensive automated testing. The tests aim to:

1. **Verify user account lifecycle** - Ensure users can successfully register, login, logout, and delete their accounts
2. **Validate contact CRUD operations** - Confirm that contacts can be created, read, updated, and deleted correctly
3. **Test validation rules** - Ensure proper error handling for invalid inputs, required fields, and format validation
4. **Verify data integrity** - Confirm that operations affect only intended records and maintain consistency across views
5. **Test edge cases** - Validate boundary conditions (min/max lengths), cancellation flows, and sorting behavior
6. **Ensure session security** - Verify that protected pages are inaccessible after logout and deleted accounts cannot be accessed

## Feature Scope 💾

### User Account Management
- **User Registration**
  - Positive: Successful registration with valid data
  - Negative: Empty/invalid first name, last name, email, password
  - Boundary testing: 21-character names (exceeds 20 char limit)
  - Boundary testing: 1-character password (below 7 char minimum)
  - Boundary testing: 101-character password (exceeds 100 char maximum)
  - Format validation: Invalid email patterns
  - Uniqueness validation: Duplicate email detection
  - Comprehensive validation: Multiple invalid fields simultaneously

- **User Login**
  - Positive: Successful login with valid credentials
  - Negative: Empty/invalid email, empty/invalid password
  - Negative: Combination scenarios (both fields invalid/empty)
  - Error message consistency verification

- **Logout & Account Deletion**
  - Logout functionality and session invalidation
  - Protected page access after logout
  - API-based account deletion with token authentication
  - Session invalidation after account deletion
  - Login attempts with deleted credentials

### Contact Management
- **Add Contact**
  - Positive: Add contact with all valid fields (11 fields)
  - Positive: Add contact with only required fields (first/last name)
  - Multiple contacts creation with sorting validation (by last name, then first name)
  - Cancel creation flow
  - Negative: Missing required fields (first/last name)
  - Negative: Invalid optional field formats (email, phone)

- **Modify Contact**
  - Positive: Update all fields with valid new data
  - Positive: Remove all optional fields (clear to empty)
  - Isolation testing: Update only selected contact without affecting others
  - Cancel edit flow
  - Negative: Remove required fields (first/last name)
  - Negative: Invalid values for every field type
  - Negative: Single invalid field (email format)

- **Delete Contact**
  - Positive: Delete existing contact with ID-based verification
  - Cancel deletion flow
  - Targeted deletion: Remove selected contact from multiple contacts

## Key QA Concepts 🧠

### Testing Techniques Applied
- **Exploratory Testing** - Manual exploration of application flows to identify edge cases and unexpected behaviors before automation
- **Boundary Value Analysis (BVA)** - Testing field length limits:
  - First/Last name: 21 characters (exceeds 20 char maximum)
  - Password: 1 character (below 7 char minimum), 101 characters (exceeds 100 char maximum)
- **Equivalence Partitioning** - Grouping valid/invalid inputs for email, phone, date formats
- **Positive & Negative Testing** - Both successful flows and error scenarios
- **Regression Testing** - Automated test suite ensures existing functionality remains intact

### Automation Strategies
- **Data-Driven Testing** - Parameterized test cases for validation scenarios (invalidDataCases, invalidLoginCases, validCases, invalidCases)
- **API & UI Integration** - Using API calls for test setup (RegisterAPI, DeleteUser) and UI for user interaction
- **Test Isolation** - Each test creates its own user and cleans up afterward (beforeEach/afterEach hooks)
- **Race Condition Prevention** - Using `Promise.all()` for click + waitForURL to prevent navigation race conditions
- **Robust Selectors** - Using `getByRole`, `getByPlaceholder`, and semantic locators instead of brittle CSS selectors
- **Helper Functions** - Reusable `addContact()` function to reduce code duplication

### Quality Metrics
- **Test Coverage**: 36 total test cases
  - User Registration: 11 tests
  - User Login: 7 tests
  - Logout & Deletion: 2 tests
  - Add Contact: 6 tests
  - Modify Contact: 7 tests
  - Delete Contact: 3 tests

## Conclusion 💬
This Playwright automation project successfully validates the end-to-end functionality of the Contact List Manager application, covering both user account management and contact operations. The test suite demonstrates a comprehensive approach to quality assurance by integrating API calls for efficient test setup and cleanup, while using UI automation to verify user-facing behaviors.

The project implements industry best practices including data-driven testing for validation scenarios, boundary value analysis for field length constraints, and proper test isolation through beforeEach/afterEach hooks. Race conditions are prevented using Promise.all() patterns for navigation events, and reusable helper functions reduce code duplication while maintaining readability.

All critical application flows function as expected, with proper validation handling for required fields, format constraints, and uniqueness rules. The application correctly manages session state, ensuring protected resources are inaccessible after logout or account deletion. Error messaging is consistent and user-friendly across all negative scenarios.

The automation framework provides a solid foundation for regression testing and can be easily extended to cover additional features, visual regression, or cross-browser testing. The project demonstrates effective collaboration between API and UI testing strategies, resulting in fast, reliable, and maintainable test coverage.