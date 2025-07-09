import { chromium, Page } from "@playwright/test";

export class LaunchPage {

    page: Page
    constructor(page: Page) {
        this.page = page
    }
    // Method to launch the application URL
    async loadUrl(url: string) {
        try {
            await this.page.goto(url)
        } catch (error) {
            console.error(`Failed to launch the URL: ${url}:`, error);
        }
    }
}
