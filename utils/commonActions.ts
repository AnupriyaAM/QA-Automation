import { Locator, Page } from "@playwright/test";

export class CommonActions {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the specified URL
   * @param url - The URL to navigate to.
   */
  async loadUrl(url: string) {
    try {
      await this.page.goto(url);
    } catch (error) {
      console.error(`Failed to launch the URL: ${url}:`, error);
    }
  }

  /**
   * Get page title
   * @returns The page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current URL
   * @returns The current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
 * Proceeds to the next step in the donation flow by clicking the "Continue" button.
 */
  async donationContinue() {
    await this.interactWithElement("TEXT", "Continue", "click");
  }

  /**
   * Returns a Playwright Locator based on the given attribute type
   * @param {string} attribute - The type of locator to use ("CSS", "ID", "XPATH").
   * @param {string} locator - The value of the locator to find the element.
   * @throws {Error} Throws an error if an unsupported attribute or action is used.
   */
  async getLocator(
    attribute: "CLASS" | "ID" | "XPath",
    locator: string
  ): Promise<Locator> {
    switch (attribute) {
      case "CLASS":
        const cssSelector = `.${locator}`;
        return this.page.locator(cssSelector);

      case "ID":
        const idSelector = `#${locator}`;
        return this.page.locator(idSelector);

      case "XPath":
        return this.page.locator(locator);

      default:
        throw new Error(`Unsupported attribute type: ${attribute}`);
    }
  }

  /**
   * Get screenshot of the screen or scenario
   * @param {string} stepName - the name of the screenshot.
   */
  async getscreenshot(stepName: string) {
    await this.page.screenshot({
      path: `test-results/screenshot/${stepName}.png`,
      fullPage: true,
    });
  }

  /**
   * Interacts with a web element based on the given attribute and action.
   *
   * @param {string} attribute - The type of locator to use ("LABEL", "PLACEHOLDER", "TEXT", "TITLE", "ALTTEXT", "ID", "CLASS").
   * @param {string} locator - The value of the locator to find the element.
   * @param {string} action - The action to perform on the element ("click" or "fill").
   * @param {string} [data] - The data to input if the action is "fill" (optional).
   * @throws {Error} Throws an error if an unsupported attribute or action is used.
   */
  async interactWithElement(
    attribute:
      | "LABEL"
      | "PLACEHOLDER"
      | "TEXT"
      | "TITLE"
      | "ALTTEXT"
      | "ID"
      | "CLASS"
      | "XPATH",
    locator: string,
    action: "click" | "fill",
    data: string = ""
  ) {
    if (!locator) {
      throw new Error("Locator must be provided.");
    }

    if (action === "fill" && !data) {
      throw new Error("Data must be provided for the 'fill' action.");
    }

    switch (attribute) {
      case "LABEL":
        if (action === "click") {
          await this.page.getByLabel(locator).click();
        } else {
          await this.page.getByLabel(locator).fill(data);
        }
        break;

      case "PLACEHOLDER":
        if (action === "click") {
          await this.page.getByPlaceholder(locator).click();
        } else {
          await this.page.getByPlaceholder(locator).fill(data);
        }
        break;

      case "TEXT":
        if (action === "click") {
          await this.page.getByText(locator, { exact: true }).click();
        } else {
          throw new Error(
            "The 'fill' action is not supported for 'TEXT' attributes."
          );
        }
        break;

      case "TITLE":
        if (action === "click") {
          await this.page.getByTitle(locator).click();
        } else {
          throw new Error(
            "The 'fill' action is not supported for 'TITLE' attributes."
          );
        }
        break;

      case "ALTTEXT":
        if (action === "click") {
          await this.page.getByAltText(locator).click();
        } else {
          throw new Error(
            "The 'fill' action is not supported for 'ALTTEXT' attributes."
          );
        }
        break;

      case "ID":
        const idSelector = `#${locator}`;
        if (action === "click") {
          await this.page.locator(idSelector).click();
        } else {
          await this.page.locator(idSelector).fill(data);
        }
        break;

      case "CLASS":
        const classSelector = `.${locator}`;
        if (action === "click") {
          await this.page.locator(classSelector).click();
        } else {
          await this.page.locator(classSelector).fill(data);
        }
        break;

      case "XPATH":
        if (action === "click") {
          await this.page.locator(locator).click();
        } else {
          await this.page.locator(locator).fill(data);
        }
        break;

      default:
        throw new Error(`Unsupported attribute: ${attribute}`);
    }
  }
}