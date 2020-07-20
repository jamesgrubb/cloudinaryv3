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



        const uploadedResponse = await cloudinary.uploader.upload(`data:image/jpg;base64,${imageBuffer}`, {
            upload_preset: 'dev_upload'
        })

        const { resources } = await cloudinary.search.expression(
            'folder:packshot'
        ).sort_by('public_id', 'desc')
            .max_results(30)
            .execute()
        const publicIds = resources.map(file => file.public_id)
        console.log("exports.handler -> publicIds", publicIds)

        await callback(null, {
            statusCode: 200,
            body: JSON.stringify(publicIds)
        })

    } catch (error) {

        throw error

    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};