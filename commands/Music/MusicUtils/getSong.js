const https = require('https');
const axios = require('axios')
const concat = require('concat-stream');

module.exports = async (keyword) => {
    key = process.env.GOOGLE_API_KEY

    const queryString = getQuery({
        key: key,
        q: keyword,
        maxResults: 5,
        part: 'snippet'
    })

    const res = await axios.get('https://www.googleapis.com/youtube/v3/search?' + queryString)
    const vid = res.data.items[0]

    return {
        title: vid.snippet.title,
        description: vid.snippet.description,
        channel: vid.snippet.channelTitle,
        url: `https://youtube.com/watch?v=${vid.id.videoId}`,
        thumbnailUrl: vid.snippet.thumbnails.default.url
    }
};

function getQuery(params){
    var res = Object.keys(params).map((key) => {
        return `${key}=${params[key]}`
    })
    return res.join('&')
}