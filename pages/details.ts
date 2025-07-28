import { expect } from "@playwright/test";
import { CommonActions } from "../utils/commonActions";
import { selectors } from "../utils/locators";
import { DonationPage } from "./donation";

export class DetailsPage extends CommonActions {

    /**
    * Fills in the personal details section of the donation flow.
    * 
    * @param {object} donationData - The test data containing personal information related fields
    * 
    * - Enters personal information
    * - Enters address details
    * - Enter phone number
    * - Clicks the Continue button to proceed to the payment step
    */
    async personalDetails(donationData: object) {
        await this.fillPersonalDetails(donationData);
        await this.fillAddressDetails(donationData);
        await this.fillPhoneNumber(donationData);
        await this.donationContinue();
    }

    /**
    * Fills in the personal details section of the form.
    * 
    * @param donationData - The test data containing personal information related fields
    * 
    * - Validates that the "Your details" section title is displayed.
    * - Verifies visibility of each form field (Title, First name, Last name, Email address).
    * - Selects a title from the dropdown and fills in First name, Last name and Email address.
    */
    async fillPersonalDetails(donationData: any) {
        await expect(this.page.getByText(selectors.personalDetails.yourDetailsText, { exact: true })).toBeVisible();
        await expect(this.page.getByLabel(selectors.personalDetails.title)).toBeVisible();
        await this.page.selectOption(selectors.personalDetails.titlePath, { label: donationData.donation[0].personalDetails.title });
        await expect(this.page.getByLabel(selectors.personalDetails.firstNameText)).toBeVisible();
        await this.interactWithElement("ID", selectors.personalDetails.firstNameID, "fill", donationData.donation[0].personalDetails.firstname);
        await expect(this.page.getByLabel(selectors.personalDetails.lastNameText)).toBeVisible();
        await this.interactWithElement("ID", selectors.personalDetails.lastNameID, "fill", donationData.donation[0].personalDetails.lastname);
        await expect(this.page.getByLabel(selectors.personalDetails.emailText)).toBeVisible();
        await this.interactWithElement("ID", selectors.personalDetails.emailID, "fill", donationData.donation[0].personalDetails.email);

    }

    /**
    * Fills in and validates the user's address information.
    * 
    * @param donationData - The test data containing personal information related fields
    *
    * - Validates visibility of the address section and label.
    * - Fills in the postcode and validate address lookup.
    * - Selects an address from the returned dropdown list.
    * - Verifies the auto-filled address fields to match the selected value.
    */
    async fillAddressDetails(donationData: any) {
        await expect(this.page.getByText(selectors.personalDetails.yourAdressText, { exact: true })).toBeVisible();
        await expect(await this.getLocator("ID", selectors.personalDetails.addressheader)).toHaveText(selectors.personalDetails.addressHeaderText);
        await this.interactWithElement("ID", selectors.personalDetails.addressheader, "click");
        await expect(this.page.getByText(selectors.donationDetails.addressContent)).toBeVisible();
        await expect(this.page.getByLabel(selectors.personalDetails.postCodeText)).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.postcodeLabelText)).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.manualAddressText)).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.manualAddressLink, { exact: true })).toBeVisible();
        await this.interactWithElement("ID", selectors.personalDetails.postalCodeText, "fill", donationData.donation[0].personalDetails.homeAddress.postcode);
        await this.interactWithElement("TEXT", selectors.personalDetails.findAddress, "click");
        await expect(this.page.getByLabel(selectors.personalDetails.selectAddress)).toBeVisible();
        const fullAddress = donationData.donation[0].personalDetails.homeAddress;
        await this.page.selectOption(selectors.personalDetails.addressOptn, { label: `${fullAddress.address1}, ${fullAddress.town}, ${fullAddress.postcode}` });
        expect(await this.page.locator(selectors.personalDetails.address1).inputValue()).toMatch(fullAddress.address1);
        expect(await this.page.locator(selectors.personalDetails.city).inputValue()).toMatch(fullAddress.town);
        expect(await this.page.locator(selectors.personalDetails.country).textContent()).toBe(fullAddress.country);
    }

    /**
    * Fills in and validates the user's preference and phone number information.
    * 
    * @param donationData - The test data containing personal information related fields
    *
    * - Validates visibility of the Staying in touch with us section and label.
    * - Fills in the preference and phone number.
    */
    async fillPhoneNumber(donationData: any) {
        await expect(this.page.getByText(selectors.personalDetails.stayText)).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.helpText)).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.contact)).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.email, { exact: true })).toBeVisible();
        if (donationData.donation[0].personalDetails.emailOptIn === "No") {
            await this.interactWithElement("XPATH", selectors.personalDetails.emailOptn1, "click");
        } else {
            await this.interactWithElement("XPATH", selectors.personalDetails.emailOptn2, "click");
        }
        await expect(this.page.getByText(selectors.personalDetails.text, { exact: true })).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.post, { exact: true })).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.phone, { exact: true })).toBeVisible();
        const isSelected = await this.page.locator(selectors.personalDetails.phoneOptn).first().isChecked();
        if (typeof isSelected === "boolean" && isSelected === true) {
            await expect(this.page.getByLabel(selectors.personalDetails.phoneNumber)).toBeVisible();
            await this.interactWithElement("ID", selectors.personalDetails.phNumberID, "fill", donationData.donation[0].personalDetails.phone);
        }
    }

    /**
   * Validates the error messages displayed on the payment page when mandatory fields are not filled.
   *
   * @param DonationPage - Page object for donation details.
   * @param donationData - Test data object containing input values for the form.
   * 
   * - Without filling mandatory field and activate continue button
   * - Validate the displayed error
   */
    async detailsErrorValidation(donationPage: DonationPage, donationData: any) {
        await donationPage.donateAmount(donationData);
        await donationPage.donationType(donationData);
        await this.donationContinue();
        await this.donationContinue();
        await expect(this.page.getByText(selectors.personalDetails.firstNameError)).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.lastNameError)).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.emailError)).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.postcodeerror)).toBeVisible();
        await expect(this.page.getByText(selectors.personalDetails.phonenumberError)).toBeVisible();
        await this.interactWithElement("ID", selectors.personalDetails.postalCodeText, "fill", donationData.donation[0].personalDetails.homeAddress.postcode);
        await this.interactWithElement("TEXT", selectors.personalDetails.findAddress, "click");
        await this.donationContinue();
        await expect(this.page.getByText(selectors.personalDetails.addressError)).toBeVisible();
    }
}