# Feature: Contact Management Flow ⭐

### Test Scenarios 🚩
1. Add New Contact
2. Modify Contact
3. Remove Contact

---

### Tests 📋
|1| Test Scenario | Scenario A Description |
| :-: | :-- | :-- |

| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :-: | :-- | :- | :-- | :-- | :- | :-- |
| 1.1 | Add contact with all valid fields | 1. Login to application <br> 2. Click **Add Contact** <br> 3. Enter valid data in all fields <br> 4. Click **Submit** | first_name: John <br> last_name: Doe <br> email: john@test.com <br> phone: 5551234567 | Contact successfully created and appears in contact list | Contact appears in list | Pass | Positive Test Case |
| 1.2 | Add contact with only required fields | 1. Login <br> 2. Click **Add Contact** <br> 3. Enter only first and last name <br> 4. Submit form | first_name: Jane <br> last_name: Smith | Contact created successfully with empty optional fields | Contact added | Pass | Required field validation |
| 1.3 | Attempt to add contact with missing required fields | 1. Login <br> 2. Click **Add Contact** <br> 3. Leave first or last name empty <br> 4. Submit form | first_name: (blank) <br> last_name: Smith | Error message indicating required fields must be filled | Error displayed | Pass | Negative Test Case |
| 1.4 | Add contact with invalid optional field formats | 1. Login <br> 2. Click **Add Contact** <br> 3. Enter invalid optional data <br> 4. Submit form | email: bademail <br> phone: abc123 | Validation errors displayed for invalid fields | Error displayed | Pass | Format validation |
| 1.5 | Add contact with only one invalid optional field | 1. Login <br> 2. Click **Add Contact** <br> 3. Enter valid required fields and one invalid optional field <br> 4. Submit form | first_name: Alex <br> last_name: Brown <br> email: invalidemail | Validation error displayed for incorrect field only | Error displayed | Pass | Field level validation |


|2| Test Scenario: | Modify Contact |
| :-: | :-- | :-- |

| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :-: | :-- | :- | :-- | :-- | :- | :-- |
| 2.1 | Modify contact with valid new values | 1. Login <br> 2. Select existing contact <br> 3. Click **Edit Contact** <br> 4. Update fields with valid data <br> 5. Save changes | phone: 5559876543 | Contact details updated successfully | Contact updated | Pass | Positive Test Case |
| 2.2 | Remove optional fields but keep valid required fields | 1. Login <br> 2. Select existing contact <br> 3. Edit contact <br> 4. Remove optional fields <br> 5. Save changes | first_name: John <br> last_name: Doe | Contact updates successfully with optional fields removed | Contact updated | Pass | Optional field handling |
| 2.3 | Attempt to remove required fields | 1. Login <br> 2. Select contact <br> 3. Edit contact <br> 4. Delete first or last name <br> 5. Save | first_name: (blank) | Error message indicating required fields missing | Error displayed | Pass | Required field validation |
| 2.4 | Modify contact with all invalid field values | 1. Login <br> 2. Edit existing contact <br> 3. Enter invalid data in all fields <br> 4. Save | first_name: ### <br> email: bademail | Validation errors displayed for invalid inputs | Errors shown | Pass | Negative validation |
| 2.5 | Modify contact with only one invalid field | 1. Login <br> 2. Edit contact <br> 3. Enter invalid value in one field <br> 4. Save changes | phone: abcdefg | Validation error shown for that specific field | Error shown | Pass | Field validation |

|3| Test Scenario: | Remove Contact |
| :-: | :-- | :-- |

| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :- | :- | :- | :- | :- | :- | :- |
| 3.1 | Remove an existing contact | 1. Login <br> 2. Select existing contact <br> 3. Click **Delete Contact** <br> 4. Confirm deletion | Existing contact record | Contact removed from contact list | Contact removed | Pass | Data deletion test |
| 3.2 | Cancel contact deletion | 1. Login <br> 2. Select contact <br> 3. Click **Delete Contact** <br> 4. Click **Cancel** on confirmation prompt | Existing contact record | Contact remains in contact list and is not deleted | Contact still present | Pass | Negative deletion scenario |
