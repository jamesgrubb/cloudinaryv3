const playwright = require('playwright-aws-lambda');

exports.handler = async (event, ctx) => {
    let result = null;
    let browser = null;

    try {
        const browser = await playwright.launchChromium();
        const context = await browser.defaultContext();

        const page = await context.newPage();
        await page.goto('https://google.com');

        console.log('Page title: ', await page.title());
    } catch (error) {
        throw error;
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};