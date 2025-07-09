import test from "@playwright/test"
import { EmployeePage } from "../helpers/employee"
import dotenv from 'dotenv'
import { LaunchPage } from "../helpers/launchPage"
import { LoginPage } from "../helpers/login"

dotenv.config({ path: "properties/cred.env" })

test("To create new employee", async ({ page }) => {
    const launch = new LaunchPage(page)
    const login = new LoginPage(page)
    const employee = new EmployeePage(page)
    const url = process.env.baseUrl
    const userName=process.env.BHR_username
    const password=process.env.BHR_password
    await launch.loadUrl(url as string)
    await login.login(userName as string, password as string)
    await employee.activateEmployee()
    await employee.addEmployee()
    await employee.fillEmployeeDetails()
    await employee.activateEmployee()
    await employee.validateEmployeeDetails()
})
