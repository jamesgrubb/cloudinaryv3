
const { cloudinary } = require('./utils/cloudinary')


exports.handler = async (event, context, callback) => {


    const { resources } = await cloudinary.search.expression(
        'folder:packshot'
    ).sort_by('public_id', 'desc')
        .max_results(30)
        .execute()
    const publicIds = resources.map(file => file.public_id)
    callback(null, {
        statusCode: 200,
        body: JSON.stringify(publicIds)
    })
}