## Summary/Description ✏️
Application return the incorrect result when 8 valid characters are used in input field.

## Steps to Reproduce ⚙️
1. Navitgate to https://testpages.eviltester.com/apps/7-char-val/
2. Enter in any data set with 8 valid characters
3. Click "Check Input" Button
4. Observe the application behavior.

## Expected Behavior 💭
Result should display "Invalid Value"

## Actual Behavior ‼️
Result displays "Valid Value"

## Screenshots/Visual Evidence 📷
![Bug showing incorrect output](../Screenshots/ScreenShot1.png "Screenshot1")

## Environment 🌳
- **Operating System:** Windows 11
- **Browser/Version:** Google Chrome Version 145.0.7632.117

## Risks ⚠️
- **[] Critical** - Blocks all work, requires immediate fix
- **[<font color="red">X</font>] Major** - Significant impact but not a showstopper
- **[] Minor** - Low impact, cosmetic issues
- **[] Trivial** - Very minor issue

## Relative Test Cases 📌
| Test Id | Description | Steps | Data | Expected Result | Actual Result | Status | Additional Information |
| :-: | :-: | :-- | :- | :-- | :-- | :- | :-- |
| 1.3 | Use more than 7 character | 1. Click on character input field. <br>2. Provide data set. <br>3. Click "Check Input" button| data_set:12345678 | Validation Field reads "Invalid Value" | Validation Field reads "Valid Value" | Fail | Discovered that result is only consistant with 8 values anything higher results in correct behavior |
| 1.5 | Use more than 8 characters (Test Case created for Bug #1)| 1. Click on character input field. <br>2. Leave field blank/empty. <br>3. Click "Check Input" button| data_set:123456789 | Validation Field reads "Invalid Value" | Validation Field reads "Invalid Value" | Pass | Due to Bug #1, test case created to check if more characters than 8 will cause problems |