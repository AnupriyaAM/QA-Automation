import { expect } from "@playwright/test";
import { CommonActions } from "../utils/commonActions";
import { PaymentPage } from "./payments";
import { selectors } from "../utils/locators";

export class ThankyouPage extends CommonActions {

  /**
  * Validates the 'Thank You' page after a successful donation process.
  *
  * @param {object} donationData - The data used during the donation process, used for validation on the confirmation page.
  * @param paymentPage - The PaymentPage instance used to retrieve the transaction ID for validation.
  * 
  * - Verifies that the confirmation recipient message
  * - Validates the donation summary details
  */
  async thankyouDetails(donationData: object, paymentPage: PaymentPage) {
    await this.confirmationRecipit(donationData, paymentPage);
    await this.donationDetails(donationData);
  }

  /**
  * Validates the messages displayed on the 'Thank You' page after a successful donation and validate the transaction id from the API response call.
  *
  * @param donationData - The data used during the donation process, used for validation on the confirmation page.
  * @param paymentPage - The PaymentPage instance used to retrieve the transaction ID for validation.
  *
  * - The thank you message.
  * - The message regards to donations.
  * - The presence of a reference number message and validate with the transaction ID captured on completing the payment process.
  * - The confirmation email message with the recipient's email address.
  */
  async confirmationRecipit(donationData: any, paymentPage: PaymentPage) {
    await this.page.waitForSelector(`text=${selectors.thankYouDetails.thankYouText}`, { state: 'visible', timeout: 150000 });
    await expect(this.page.getByText(selectors.thankYouDetails.thankYouText)).toBeVisible();
    await expect(this.page.getByText(selectors.thankYouDetails.memoryText)).toBeVisible();
    await expect(this.page.getByText(selectors.thankYouDetails.referenceText)).toBeVisible();
    const referenceId = await this.page.getByText(selectors.thankYouDetails.referenceText).textContent();
    expect(referenceId?.split("is ")[1]).toBe(paymentPage.getTransactionId());
    await expect(this.page.getByText(`A confirmation email will be sent to ${donationData.donation[0].personalDetails.email}`)).toBeVisible();
  }

  /**
   * Validates the donationDetails in 'Thank You' page.
   *
   * @param donationData - The data used during the donation process, used for validation on the confirmation page.
   *
   * - Verifies the amount ,type and reasons against the data provided
   */
  async donationDetails(donationData: any) {
    await expect(this.page.getByText(selectors.thankYouDetails.yourDation)).toBeVisible();
    await expect(this.page.getByText(`£${donationData.donation[0].amountandReason.amount.value}.00`)).toBeVisible();
    if (donationData.donation[0].paymentDetails.giftaid === "Yes") {
      await expect(this.page.getByText("£5.00 Gift Aid*")).toBeVisible();
    }
    await expect(this.page.getByAltText(selectors.thankYouDetails.eyeIcon)).toBeVisible();
    if (donationData.donation[0].amountandReason.donationFundOptn === selectors.donationDetails.cancerTypeTxt) {
      await expect(this.page.getByText(donationData.donation[0].amountandReason.cancerType)).toBeVisible();
    }
    else {
      await expect(this.page.getByText(selectors.donationDetails.cancerTypeRadio1)).toBeVisible();
    }
    if (donationData.donation[0].amountandReason.motivationReason === selectors.thankYouDetails.memoryLabel) {
      await expect(this.page.getByAltText(selectors.thankYouDetails.memoryicon)).toBeVisible();
      const personName = donationData.donation[0].amountandReason.personNameMemory;
      if (personName !== null && personName !== undefined && personName.trim() !== "") {
        await expect(this.page.getByText(`In memory of ${personName}`)).toBeVisible();
      }
      else {
        await expect(this.page.getByText(selectors.thankYouDetails.tqMemoryText, { exact: true })).toBeVisible();
      }
    }
  }
}