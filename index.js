var Twit = require('twit');

require('dotenv').config();

/* Instancie o bot com as chaves no arquivo .env */
const Bot = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
});

console.log('Este bot está rodando...');

var firstId

/* BotInit() : Para iniciar o bot */
function BotInit() {
    var query = {
        q: "from:@labezin",
        result_type: "recent"
    }

    Bot.get('search/tweets', query, BotGotLatestTweet);

    function BotGotLatestTweet(error, data, response) {
        if (error) {
            console.log('Bot não pôde achar o último tweet, : ' + error);
        }
        else {
            var id = data.statuses[0].id_str
            
            if(firstId === undefined) {
                firstId = id
            }
            else {
                if(data.statuses[0].id_str !== firstId &&
                    data.statuses[0].in_reply_to_status_id === null &&
                    data.statuses[0].in_reply_to_status_id_str === null &&
                    data.statuses[0].in_reply_to_user_id === null &&
                    data.statuses[0].in_reply_to_user_id_str === null &&
                    data.statuses[0].in_reply_to_screen_name === null &&
                    data.statuses[0].text.substr(0, 1) !== 'RT') {

                        Bot.post('statuses/update', {
                            status: 'fodase parcero',
                            in_reply_to_status_id: id,
                            auto_populate_reply_metadata: true
                        }, BotRetweeted);

                    firstId = id
                }
            }

            function BotRetweeted(error, response) {
                if (error) {
                    console.log('Bot não pode retweetar, : ' + error);
                }
                else {
                    console.log('Bot retweetou : ' + id);
                }
            }
        }
    }
}


/* Inicialize o bot Bot */
BotInit();