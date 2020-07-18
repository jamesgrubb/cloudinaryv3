const playwright = require('playwright-aws-lambda');
const { cloudinary } = require('./utils/cloudinary')

exports.handler = async (event, ctx) => {
    let result = null;
    let browser = null;

    try {
        const url = JSON.parse(event.body).data
        console.log("exports.handler -> url", url)

        const browser = await playwright.launchChromium();
        const context = await browser._defaultContext;
        const page = await context.newPage();
        await page.goto(url || 'https://www.jamesgrubb.co.uk');
        const grab = await page.screenshot({ encoding: "base64" })
        const uploadedResponse = await cloudinary.uploader.upload(grab, {
            upload_preset: 'dev_upload'
        })
        console.log("exports.handler -> uploadedResponse", uploadedResponse)

        console.log('Page title: ', await page.screenshot({ encoding: "base64" }));
        // console.log('Page title: ', await page.title());
    } catch (error) {

        throw error

    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};