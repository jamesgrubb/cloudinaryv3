const playwright = require('playwright-aws-lambda');
const { cloudinary } = require('./utils/cloudinary')
const { devices } = require('playwright-chromium')

const iPhone = devices['iPhone 11 Pro']
exports.handler = async (event, ctx, callback) => {
    let result = null;
    let browser = null;

    try {
        const url = JSON.parse(event.body).data


        const browser = await playwright.launchChromium();
        // const context = await browser.newContext({
        //     viewport: iPhone.viewport,
        //     useAgent: iPhone.userAgent
        // });
        const context = await browser._defaultContext
        const page = await context.newPage();
        await page.setViewportSize(iPhone.viewport)
        await page.goto(url || 'https://www.jamesgrubb.co.uk');
        // await page.emulate(devices['iPhone 6'])
        const buffer = await page.screenshot({ type: "jpeg" })
        const imageBuffer = await buffer.toString('base64')



        // const uploadedResponse = await cloudinary.uploader.upload(`data:image/jpg;base64,${imageBuffer}`, {
        //     upload_preset: 'dev_upload'
        await cloudinary.uploader.upload(`data:image/jpg;base64,${imageBuffer}`, {
            upload_preset: 'dev_upload',
            public_id: "iPhone",
            tags: ["iphone"],
            eager: [
                { height: 838, width: 388, crop: "scale" },
                // { if: "!iphone!_in_tags", transformation: "phone" }
                { height: 892, overlay: "packshot:device:phone", width: 448, crop: "scale" }
            ]
        })



    } catch (error) {

        throw error

    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};