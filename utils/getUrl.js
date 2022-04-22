const https = require('https');
const concat = require('concat-stream');

module.exports = (keyword) => {
    return new Promise((resolve, reject) => {
        https.get(`https://www.youtube.com/results?search_query=${keyword.split(' ').join('+')}`, (res) => {
            var h = '';
            res.pipe(concat((data) => {
                h = data.toString();
            }));

            res.on('end', () => {
                resolve(h.match(/videoId.\:............./g)[0]);                
            });
        });
    });
};