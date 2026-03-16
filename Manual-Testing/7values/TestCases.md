# Feature: Input Validation ⭐

### Test Scenarios 🚩
1. Verify that application only excepts 7 values exactly
2. Verify that only valid characters are accepted

---

### Tests 📋
|1| Test Scenario | Verify that application only excepts 7 values exactly |
| :-: | :-- | :-- |

| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :-: | :-- | :- | :-- | :-- | :- | :-- |
| 1.1 | Use exactly 7 character | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set:1234567 | Validation Field reads "Valid Value" | Validation Field reads "Valid Value" | Pass | |
| 1.2 | Use less than 7 character | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set:123456 | Validation Field reads "Invalid Value" | Validation Field reads "Invalid Value" | Pass | |
| 1.3 | Use more than 7 character | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set:12345678 | Validation Field reads "Invalid Value" | Validation Field reads "Valid Value" | Fail | Discovered that result is only consistent with 8 values anything higher results in correct behavior |
| 1.4 | Use 0 characters | 1. Click on character input field. <br>2. Leave field blank/empty. <br>3. Click "Check Input" button| | Validation Field reads "Invalid Value" | Validation Field reads "Invalid Value" | Pass | |
| 1.5 | Use more than 8 characters (Test Case created for Bug #1)| 1. Click on character input field. <br>2. Leave field blank/empty. <br>3. Click "Check Input" button| data_set:123456789 | Validation Field reads "Invalid Value" | Validation Field reads "Invalid Value" | Pass | Due to Bug #1, test case created to check if more characters than 8 will cause problems |


|2| Test Scenario | Verify that only valid characters are accepted |
| :-: | :-- | :-- |

| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :-: | :-- | :- | :-- | :-- | :- | :-- |
| 2.1 | Use exactly 7 Lower bound Capital Letters | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set:AAAAAAA | Validation Field reads "Valid Value" | Validation Field reads "invalid Value" | Fail | Discovered that behavior is only consistent with the Character A and only occurs if A is in any other position besides the first|
| 2.2 | Use Upper bound Capital Letters | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set:ZZZZZZZ | Validation Field reads "Valid Value" | Validation Field reads "Valid Value" | Pass | |
| 2.3 | Use Lower bound Lowercase Letters | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set:aaaaaaa | Validation Field reads "Valid Value" | Validation Field reads "Valid Value" | Pass | |
| 2.4 | Use Upper bound Lowercase Letters | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set:zzzzzzz | Validation Field reads "Valid Value" | Validation Field reads "Valid Value" | Pass | |
| 2.5 | Use Lower bound of digits | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set:0000000 | Validation Field reads "Valid Value" | Validation Field reads "Valid Value" | Pass | |
| 2.6 | Use Upper bound of digits | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set:9999999 | Validation Field reads "Valid Value" | Validation Field reads "Valid Value" | Pass | |
| 2.7 | Use the character * | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set:******* | Validation Field reads "Valid Value" | Validation Field reads "Valid Value" | Pass | |
| 2.8 | Use a combination of valid character | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set: Aa0Zz9* | Validation Field reads "Valid Value" | Validation Field reads "Valid Value" | Pass | |
| 2.9 | Use invalid characters | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set: Aa0Zz9! | Validation Field reads "Valid Value" | Validation Field reads "Valid Value" | Pass | |
| 2.10 | Use the character "A" in the first position of the input string (Test Case created for Bug #2) | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set: A234567 | Validation Field reads "Valid Value" | Validation Field reads "Valid Value" | Pass | Due to Bug #2, Test case create to test bounds more closely and validation for Regression testing |
| 2.11 | Use the character "A" in any other position besides the first (Test Case created for Bug #2) | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set: 1A3456A | Validation Field reads "Valid Value" | Validation Field reads "invalid Value" | Pass | Due to Bug #2, Test case create to test bounds more closely|