# QA-Automation

We have a technical task that comprises two steps:

Step 1: Could you visit https://sandbox-app.brighthr.com/lite manually create a free account, and complete the registration process?

If the registration email doesn't arrive use the following details instead Login qaAutomationTechTask@grr.la Password A1234567890-

Step 2: Using the Playwright or Cypress framework, you need to log in to the created account and write automated tests for the following scenarios:

    1. Navigate to the employee tab on the left-hand side of the panel and add an employee by filling in all the fields, including optional ones.

    2. Add another employee.

    3. Navigate to the employee tab and verify that both employees are displayed.

    4. Integrate this build so tests can run in the CI setup of your choice.

Please submit your project by uploading it to your git repository and provide us with a link to the project. 

During the interview, you will be required to run these tests, and we will discuss the implementation and best practices.

We believe you will find this task interesting, and we are excited to look over your submission.

# Project artifacts - Playwright Automation Using TypeScript

# Required Artifacts
VS Code
Node.js
npm
Git Repositiry

# Package.json 

See - dependencies to know more about the additional packages insatalled

# Steps to run

Clone the repository: git clone https://github.com/brighthr/QA-Automation.git to the respective folder
Open in VS Code editor
Install Depedancies: npm install
To execute the Test file : npx playwright test < testfile name >.spec.ts

# Folder Details
test - holds the test scripts
testData - holds the test data in the form of JSON file
utils - holds the locators details
helpers - hold the details of actions and methods used to execute the script
properties - holds the env url and cred 