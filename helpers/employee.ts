import { selectors } from "../utils/locators"
import { LoginPage } from "./login"
import employeeData from "../testData/createEmployeeDetails.json"
import { expect } from "@playwright/test"
import fs from 'fs'

export class EmployeePage extends LoginPage {
    // Method to avtivate the Employee from the dashboard
    async activateEmployee() {
        await this.page.click(selectors.employee)
    }
    // Method to activate the Add Employee button
    async addEmployee() {
        await this.page.click(selectors.addEmployee)
    }
    // Method to fill all the details in the Add New Employee screen
    async fillEmployeeDetails() {
        let totalRecord = employeeData.length;
        let record_Count = 0;
        const employeeDetails = JSON.parse(fs.readFileSync("testData/createEmployeeDetails.json",'utf-8'))
        for (let empData of employeeDetails) {
            record_Count++
            await this.page.fill(selectors.employeeDetails.firstName, empData.firstName)
            await this.page.fill(selectors.employeeDetails.lastName, empData.lastName)
            await this.page.fill(selectors.employeeDetails.emailAddress, empData.emailAddress)
            await this.page.fill(selectors.employeeDetails.phoneNumber, empData.phoneNumber)
            await this.page.getByText('Select date').click()
            await this.page.click(selectors.employeeDetails.selectYear)
            await this.page.getByRole('button', { name: empData.startYear }).click()
            await this.page.click(selectors.employeeDetails.selectMonth)
            await this.page.getByRole('button', { name: empData.startMonth }).click()
            await this.page.getByText(empData.startDay, { exact: true }).click()
            await this.page.fill(selectors.employeeDetails.jobTitle, empData.jobTitle)
            await this.page.click(selectors.employeeDetails.saveEmployee)
            await expect(this.page.locator(selectors.successMessage)).toHaveText(selectors.successMessageText)
            if (totalRecord === record_Count) {
                await this.page.getByRole('link', { name: selectors.goToProfile }).click()
            }
            else {
                await this.page.getByRole('button', { name: selectors.addEmployeeText }).click()
            }
        }
    }
    // Method to Validate the added employee details
    async validateEmployeeDetails() {
        for (let empData of employeeData) {
            const expectedName = empData.firstName + " " + empData.lastName
            const jobTitle = empData.jobTitle
            console.log('Employee Name = ', await this.page.getByRole('heading', { name: expectedName }).last().innerText())
            // This validation can be used for to validate the exact value
            // await expect(this.page.getByRole('heading', { name: expectedNames, exact: true })).toBeVisible();
            await expect(this.page.getByRole('heading', { name: expectedName }).last()).toBeVisible();
        }
    }
}
