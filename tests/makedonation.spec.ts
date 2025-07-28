import { test } from "../fixtures/customFixture";
import { selectors } from "../utils/locators"
import fs from 'fs'

let donationData = JSON.parse(fs.readFileSync("testData/data.json", 'utf-8'));

test("To validate the donation anomunt process with one Off payment", { tag: ['@smoke', '@regression'] }, async ({ DonationPage, DetailsPage, PaymentPage, ThankyouPage }) => {
    await DonationPage.loadUrl(selectors.url);
    await DonationPage.acceptCookie();
    await DonationPage.validateHeader();
    await DonationPage.selectDonationDetails(donationData);
    await DetailsPage.personalDetails(donationData);
    await PaymentPage.paymentDetails(donationData);
    await ThankyouPage.thankyouDetails(donationData, PaymentPage);
})

test("To validate error scenario without selecting the amounts and the options", async ({ DonationPage, DetailsPage, PaymentPage }) => {
    await DonationPage.loadUrl(selectors.url);
    await DonationPage.acceptCookie();
    await DonationPage.amountErrorValidation();
    await DetailsPage.detailsErrorValidation(DonationPage, donationData);
    await PaymentPage.paymentErrorValidation(DetailsPage, donationData);
})