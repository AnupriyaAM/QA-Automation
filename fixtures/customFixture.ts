import { test as baseTest } from '@playwright/test'
import { DonationPage } from '../pages/donation'
import { DetailsPage } from '../pages/details'
import { PaymentPage } from '../pages/payments';
import { ThankyouPage } from '../pages/thankyou';

type customForceFixture = {
    DonationPage: DonationPage
    DetailsPage:DetailsPage
    PaymentPage:PaymentPage
    ThankyouPage:ThankyouPage
}

export const test = baseTest.extend<customForceFixture>({

    DonationPage: async ({ page }, use) => {
        const donationPage = new DonationPage(page);
        await use(donationPage);
    },

    DetailsPage: async ({ page }, use) => {
        const detailsPage = new DetailsPage(page);
        await use(detailsPage);
    },

    PaymentPage: async ({ page }, use) => {
        const paymentPage = new PaymentPage(page);
        await use(paymentPage);
    },

    ThankyouPage: async ({ page }, use) => {
        const thankyouPage = new ThankyouPage(page);
        await use(thankyouPage);
    },
})