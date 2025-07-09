import { LaunchPage } from "./launchPage"
import { selectors } from "../utils/locators"

export class LoginPage extends LaunchPage {

    // Method to validate the login and navigate into application
    async login(emailID: string, pwd: string) {
        await this.page.click(selectors.login)
        await this.page.fill(selectors.loginScreen.usernameField, emailID)
        await this.page.fill(selectors.loginScreen.PwdField, pwd)
        await this.page.click(selectors.loginScreen.login_button)
    }
}
