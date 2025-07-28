import { expect } from "@playwright/test";
import { CommonActions } from "../utils/commonActions";
import { selectors } from "../utils/locators";

export class DonationPage extends CommonActions {

  /**
   * Accepts the cookie consent
   */
  async acceptCookie() {
    this.interactWithElement(
      "ID",
      selectors.donationDetails.acceptCookies,
      "click"
    );
  }

  /**
 * Validate the header of the screen
 */
  async validateHeader() {
    this.page.getByRole('link', { name: selectors.donationDetails.logo }).isVisible();
    await expect(this.page.getByText(selectors.donationDetails.pageTitle)).toBeVisible();
  }

  /**
 * Implementation of Donation Amount and reason selection process
 * @param {object} donationData - The test data containing donation amount, donation type and purpose related fields
 *
 * - Validation of donation page title.
 * - Selects or enters the donation amount.
 * - Chooses the type of donation.
 * - Selects a motivation reason for donating.
 * - Chooses the purpose of the donation.
 * - Clicks the 'Continue' button to proceed to the next step.
 */
  async selectDonationDetails(donationData: Object) {
    await this.donateAmount(donationData);
    await this.donationType(donationData);
    await this.yourMotivation(donationData);
    await this.selectDonationPurpose(donationData);
    await this.donationContinue();
  }

  /**
   * Validates the donation amount section:
   * @param donationData - The test data containing donation amount, donation type and purpose related fields
   * 
   * - Verifies the donation title, regular donation label visibility and text.
   * - Clicks the desired donation amount.
   * - Verifies the regular donation link
   */
  async donateAmount(donationData: any) {
    await expect(this.page.getByText(selectors.donationDetails.titleText)).toBeVisible();
    await expect(this.page.getByText(selectors.donationDetails.amountLabelText)).toBeVisible();
    const amount = donationData.donation[0].amountandReason.amount.value;
    if (donationData.donation[0].amountandReason.amount.method === "select") {
      await this.interactWithElement("ID", selectors.donationDetails.selectAmount(`${amount}`), "click");
    }
    else {
      await this.interactWithElement("ID", selectors.donationDetails.otherAmountID, "fill", amount);
    }
    await expect(await this.getLocator("CLASS", selectors.donationDetails.pymtOptionLink)
    ).toHaveText(selectors.donationDetails.regularLinkText);
  }

  /**
   * Validates the donation type section:
   * @param {object} donationData - The test data containing donation amount, donation type and purpose related fields
   * 
   * - Verifies the type title and text.
   * - Choose the desired donation type.
   * - Verifies the text present - yet to do
   */
  async donationType(donationData: object) {
    await expect(this.page.getByText(selectors.donationDetails.donationTypeText, { exact: true })).toBeVisible();
    await this.selectDonationType(donationData);
    await this.donationTypeDisclaimer();
  }

  /**
   * Validate the donation type label and Choose the desired type
   * 
   * @param donationData - The test data containing donation amount, donation type and purpose related fields
   */
  async selectDonationType(donationData: any) {
    await expect(this.page.getByText(selectors.donationDetails.donationTypeLabel)).toBeVisible();
    if (donationData.donation[0].amountandReason.donationType === selectors.donationDetails.donationTypeOptn) {
      await this.interactWithElement("XPATH", "(//div[@class='sc-bBrHrO dyrTdO'])[1]", "click");
    }
    else {
      await this.page.locator('label:has-text(selectors.donationDetails.donationTypeRadio2)').click();
      await this.interactWithElement("XPATH", "(//div[@class='sc-bBrHrO dyrTdO'])[2]", "click");
    }
  }

  /**
 * Validates the disclaimer message shown under the donation type section.
 */
  async donationTypeDisclaimer() {
    await expect(this.page.getByText(selectors.donationDetails.discli1)).toBeVisible();
    await expect(this.page.getByText(selectors.donationDetails.discli2)).toBeVisible();
  }


  /**
   * Validates the Your Motivation section:
   * 
   * @param donationData - The test data containing donation amount, donation type and purpose related fields
   * 
   * - Verifies the motivation title and text.
   * - Choose the reason for the donation.
   * - validate the 'why are we asking' link -yet to do
   * - Verifies the text present - yet to do
   */
  async yourMotivation(donationData: any) {
    await expect(this.page.getByText(selectors.donationDetails.motivationText)).toBeVisible();
    await expect(this.page.getByText(selectors.donationDetails.reasonLabel)).toBeVisible();
    await this.page.selectOption(selectors.donationDetails.motivationType, { label: donationData.donation[0].amountandReason.motivationReason })
    await this.page.getByText(selectors.donationDetails.discLink).click();
    await expect(this.page.getByText(selectors.donationDetails.motivationContent)).toBeVisible();
    // await expect(await this.getLocator("CLASS", "sc-eCYdqJ.FdkWW")).toBeVisible();
    // await expect(await this.getLocator("CLASS", "sc-eCYdqJ.FdkWW")).toHaveText(selectors.donationDetails.motivationContent)
    const personName = donationData.donation[0].amountandReason.personNameMemory
    if (personName !== null && personName !== undefined && personName.trim() !== "") {
      await this.interactWithElement("ID", selectors.donationDetails.memoryID, "fill", personName)
    }

  }

  /**
  * Validate where your donation goes section:
  * 
  * @param donationData - The test data containing donation amount, donation type and purpose related fields
  * 
  * - Verifies the title and text.
  * - Choose the option to fund your donation.
  * - Select the option if user chooses cancer type or area of research
  */
  async selectDonationPurpose(donationData: any) {
    await expect(this.page.getByText(selectors.donationDetails.donationGoesText)).toBeVisible();
    await expect(this.page.getByText(selectors.donationDetails.donationGoesLabel)).toBeVisible();
    if (donationData.donation[0].amountandReason.donationFundOptn === selectors.donationDetails.cancerTypeTxt) {
      await this.page.getByRole('radio', { name: donationData.donation[0].amountandReason.donationFundOptn }).check();
      await this.page.selectOption("//select[@data-testid='restrictionSelect']", { label: donationData.donation[0].amountandReason.cancerType })
    }
    else {
      await this.page.getByRole('radio', { name: selectors.donationDetails.cancerTypeRadio1 }).check();  //selectors.donationDetails.
    }
  }

  /**
  * Validates the error messages displayed on the donation details page when mandatory fields are not filled.
  *
  * - Without filling mandatory field and activate continue button
  * - Validate the displayed error
  */
  async amountErrorValidation() {
    await this.donationContinue();
    await expect(this.page.getByText(selectors.donationDetails.amtErrorText)).toBeVisible();
    await this.interactWithElement("CLASS", selectors.donationDetails.pymtOptionLink, "click");
    await this.donationContinue();
    await expect(this.page.getByText(selectors.donationDetails.amtErrorText)).toBeVisible();
    await expect(this.page.getByText(selectors.donationDetails.frequencyErrorText)).toBeVisible();
    await this.interactWithElement("CLASS", selectors.donationDetails.pymtOptionLink, "click");
  }
}