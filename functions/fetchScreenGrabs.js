
const { cloudinary } = require('./utils/cloudinary')
const fetch = require('node-fetch')

exports.handler = async (event, context) => {

    const { resources } = await cloudinary.search.expression(
        'folder:packshot'
    ).sort_by('public_id', 'desc')
        .max_results(30)
        .execute()
    const publicIds = resources.map(file => file.public_id)

    const results = await fetch('')
}