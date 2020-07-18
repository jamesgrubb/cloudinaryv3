const playwright = require('playwright-aws-lambda');
const { cloudinary } = require('./utils/cloudinary')
const { devices } = require('playwright-chromium')
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
        await page.emulateMedia(devices['iPhone 6'])
        const buffer = await page.screenshot({ type: "jpeg" })
        const imageBuffer = await buffer.toString('base64')
        console.log("exports.handler -> imageBuffer", imageBuffer)
        const uploadedResponse = await cloudinary.uploader.upload(`data:image/jpg;base64,${imageBuffer}`, {
            upload_preset: 'dev_upload'
        })
        // console.log("screenshotPage -> uploadedResponse", uploadedResponse)



        // const grab = await page.screenshot({ encoding: "base64" })

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