export const selectors={
    login: "//a[text()='Log in']",
    loginScreen: {
        usernameField: "#username",
        PwdField: "//input[@id='password']",
        login_button: "//button[text()='Login']",
    },
    employee: "//div[@title = 'Employees']",
    addEmployee: "//button[text()='Add employee']",
    employeeDetails: {
        firstName: "#firstName",
        lastName: "//input[@id='lastName']",
        emailAddress: "#email",
        phoneNumber: "#phoneNumber",
        startDate: ".sc-elJkPfkWcpjF",
        jobTitle: "#jobTitle",
        saveEmployee: "//button[text()='Save new employee']",
        selectYear:"//button[@data-e2e='select-year']",
        selectMonth:"//button[@data-e2e='select-month']",
        selectDay:""
    },
    goToProfile: "Go to profile",
    addEmployeeText: "Add another employee",
    successMessage: "//div//h1[@class='text-lg text-white']",
    successMessageText: "Success! New employee added"
}