const playwright = require('playwright-aws-lambda');
const { cloudinary } = require('./utils/cloudinary')
const { devices } = require('playwright-chromium')
console.log("devices", devices)
const iPhone = devices['iPhone 11 Pro']
exports.handler = async (event, ctx, callback) => {
    let result = null;
    let browser = null;

    try {
        const url = JSON.parse(event.body).data
        console.log("exports.handler -> url", url)

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


        console.log("exports.handler -> imageBuffer", imageBuffer)
        const uploadedResponse = await cloudinary.uploader.upload(`data:image/jpg;base64,${imageBuffer}`, {
            upload_preset: 'dev_upload'
        })
        // console.log("screenshotPage -> uploadedResponse", uploadedResponse)
        const { resources } = await cloudinary.search.expression(
            'folder:packshot'
        ).sort_by('public_id', 'desc')
            .max_results(30)
            .execute()
        const publicIds = await resources.map(file => file.public_id)
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(publicIds)
        })
        console.log("exports.handler -> viewport", page.viewport)

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