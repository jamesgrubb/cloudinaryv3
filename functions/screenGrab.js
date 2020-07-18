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
        await screenshotPage(page)
        // const grab = await page.screenshot({ encoding: "base64" })

        // console.log("exports.handler -> uploadedResponse", uploadedResponse)
        function screenshotPage(page) {
            return new Promise(resolve => {
                let buffer = page.screenshot()
                let imageBuffer = buffer.toString('base64')
                let uploadedResponse = cloudinary.uploader.upload(imageBuffer, {
                    upload_preset: 'dev_upload'
                })
                setTimeout(() => {
                    resolve(uploadedResponse)
                }, 2000)

            })
        }
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