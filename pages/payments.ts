import { expect } from "@playwright/test";
import { CommonActions } from "../utils/commonActions";
import { selectors } from "../utils/locators";
import { DetailsPage } from "./details";

export class PaymentPage extends CommonActions {
  transactionId: string

  /**
 * Handles the payment process during the donation flow.
 * @param {object} donationData - The test data containing payment related fields
 * 
 * - Fills in the payment details using the provided data.
 * - Completes the payment submission.
 * - Validates the presence of a loading indicator.
 */
  async paymentDetails(donationData: object) {
    await this.fillPaymentDetails(donationData);
    await this.completePayment();
  }

  /**
   * Perform the payment for the donation form.
   * @param donationData - The test data containing payment related fields
   * - Verifies visibility of the 'Donation amount' and 'How would you like to donate?' sections.
   * - Selects the credit/debit card radio option.
   * - Fills in credit card details using iframe selectors
   * - check the giftaid if applicable
   */
  async fillPaymentDetails(donationData: any) {
    await expect(this.page.getByText(selectors.paymentDetails.donationAmountTxt)).toBeVisible();
    await this.page.waitForSelector(`text=${selectors.paymentDetails.donationMethodLblTxt}`, { state: 'visible', timeout: 10000 });
    await expect(this.page.getByText(selectors.paymentDetails.donationMethodLblTxt)).toBeVisible();
    await this.interactWithElement("XPATH", selectors.paymentDetails.paymentCardID, "click");
    await expect(this.page.getByText(selectors.paymentDetails.cardText)).toBeVisible();
    await this.page.frameLocator(selectors.paymentDetails.cardFrameID).locator(selectors.paymentDetails.cardNumberID).fill(donationData.donation[0].paymentDetails.cardNumber);
    const cardHolderName = `${donationData.donation[0].personalDetails.firstname} ${donationData.donation[0].personalDetails.lastname}`
    await this.interactWithElement("ID", selectors.paymentDetails.cardholderID, "fill", cardHolderName);
    await this.page.frameLocator(selectors.paymentDetails.dateFrameID).locator(selectors.paymentDetails.dateID).fill(donationData.donation[0].paymentDetails.cardExpiry);
    await this.page.frameLocator(selectors.paymentDetails.cvvFrameID).locator(selectors.paymentDetails.cvvID).fill(donationData.donation[0].paymentDetails.cvv);
    const giftaid = donationData.donation[0].paymentDetails.giftaid;
    if (giftaid === "Yes") {
      await this.interactWithElement("ID", selectors.paymentDetails.giftAid, "click");
    }
  }

  /**
  * Complete donation process by clicking "Complete my donation" button and capturing the transaction ID.
  */
  async completePayment() {
    const [response] = await Promise.all([
      this.page.waitForResponse(res =>
        res.url().includes('/transaction') && res.request().method() === 'POST',
        { timeout: 15000 }
      ),
      this.interactWithElement("TEXT", selectors.paymentDetails.completeDonationButton, "click"),
      this.loadingValidation()
    ]);
    const responseBody = await response.json();
    this.transactionId = responseBody.id;
  }

  /**
  * Validating the loading indicator and text
  *
  */
  async loadingValidation() {
    await expect(this.page.getByRole("alert").filter({ hasText: "Loading" })).toHaveText("Loading");
    await expect(this.page.getByText(selectors.paymentDetails.loadingText)).toBeVisible();
  }

  /**
  * Retrieves the transaction ID captured during the payment process.
  *
  * @returns {string} The transaction ID returned from the transaction API response.
  */
  getTransactionId(): string {
    return this.transactionId;
  }

  /**
  * Validates the error messages displayed on the payment page when mandatory fields are not filled.
  *
  * @param detailsPage - Page object for personal and address details.
  * @param donationData - Test data object containing input values for the form.
  * 
  * - Without filling mandatory field and activate continue button
  * - Validate the displayed error
  * - For iframe input , used focus and keyboard action tab key to get the error message displayed in the screen
  */
  async paymentErrorValidation(detailsPage: DetailsPage, donationData: object) {
    await detailsPage.fillPersonalDetails(donationData);
    await detailsPage.fillAddressDetails(donationData);
    await detailsPage.fillPhoneNumber(donationData);
    await detailsPage.donationContinue();
    await this.page.waitForSelector(`text=${selectors.paymentDetails.donationMethodLblTxt}`, { state: 'visible', timeout: 10000 });
    this.interactWithElement("TEXT", selectors.paymentDetails.completeDonationButton, "click");
    await expect(this.page.getByText(selectors.paymentDetails.paymentMethodError)).toBeVisible();
    await this.interactWithElement("XPATH", selectors.paymentDetails.paymentCardID, "click");
    this.interactWithElement("TEXT", selectors.paymentDetails.completeDonationButton, "click");
    await expect(this.page.getByText(selectors.paymentDetails.cardNameError)).toBeVisible();
    await this.page.frameLocator(selectors.paymentDetails.cardFrameID).locator(selectors.paymentDetails.cardNumberID).focus();
    await this.page.keyboard.press('Tab');
    await this.page.frameLocator(selectors.paymentDetails.dateFrameID).locator(selectors.paymentDetails.dateID).focus();
    await this.page.keyboard.press('Tab');
    await this.page.frameLocator(selectors.paymentDetails.cvvFrameID).locator(selectors.paymentDetails.cvvID).focus();
    await this.page.keyboard.press('Tab');
    await expect(this.page.getByText(selectors.paymentDetails.cardNumberError)).toBeVisible();
    await expect(this.page.getByText(selectors.paymentDetails.dateError)).toBeVisible();
    await expect(this.page.getByText(selectors.paymentDetails.cvvError)).toBeVisible();
  }
}
