# QA-Automation - Playwright Automation Framework
QA-Automation is a automation framework using Playwright and TypeScript for CRUK Donation Process.

# Folder Structure
- **.github/** – GitHub Actions for CI/CD
- **fixtures/** – Custom Playwright test fixtures
- **pages/** – POM structure for UI tests
- **testData/** – JSON-based test data
- **tests/** – Actual test specs
- **utils/** – holds the common actions and the constants & locator(ID,CLASS,XPATH,TEXT)

# Setup Instructions

# Clone the repository
git clone https://github.com/AnupriyaAM/QA-Automation.git

# Navigate to project repo
cd QA-Automation

# Open in VSCode
install VSCode Editor

# Install dependencies
npm install

# Run Playwright tests
npx playwright test

# Key Feature and Validation
** Automated end-to-end test scripts validate a complete and successful donation transaction.
** Validates the transactionId from the /transaction API (POST method) and asserts it against the value displayed on the Thank You page.
** Validated dynamic content on the Thank You page based on user input data (data from test data)
** Handles validation for non-mandatory fields when the test data does not include values
** Validated the error messages when mandatory fields are left empty
** Used getByText, toHaveText to validate the text content
** Used default Playwright report for result
** Used 1 worker, if need parallel execution and worker need to be changed from playwright.config.ts

# Tech Stack

Playwright - Framework
TypeScript - Scripting language
Node.js - Runtime for executing tests
VS Code - IDE
GitHub Actions - CI/CD automation

# Possible Enhancement if needed:
** cucumber (npm install --save-dev @cucumber/cucumber) can be integrated with Playwright
 - Cucumber enables Behaviour-Driven Development (BDD), allowing test scenarios to be written in a human-readable Gherkin syntax
 - cucumber.json - is used to define feature file paths, step definition locations, and test execution options as browser settings
** Report Portal can be implemented for reporting and Execution Details