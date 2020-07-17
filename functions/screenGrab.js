const playwright = require('playwright-aws-lambda');

exports.handler = async (event, ctx) => {
    let result = null;
    let browser = null;

    try {
        const url = JSON.parse(event.body).data
        console.log("exports.handler -> url", url)

        const browser = await playwright.launchChromium();
        const context = await browser._defaultContext;
        const page = await context.newPage();
        await page.goto(url);

        console.log('Page title: ', await page.title());
    } catch (error) {
        throw error;
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};