const Twit = require('twit');

require('dotenv').config();

const Bot = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
});

// start stream and track tweets
const stream = Bot.stream('statuses/filter', { track: '@bot_passeiamao' });
var contador = 8

console.log("Bot rodando... contador = " + contador)

// use this to log errors from requests
function responseCallback(err, data, response) {
    if (err !== undefined)
        console.log(err);
    else
        console.log("Mais uma passada, somando " + contador);
}

// event handler
stream.on('tweet', tweet => {
    if (tweet.display_text_range) {
        if (tweet.text.slice(tweet.display_text_range[0], tweet.display_text_range[1]).indexOf("@bot_passeiamao" > -1)) {
            contador = contador + 1
            Bot.post('statuses/update', {
                status: 'Ihaaa você acaba de passar a mão na bunda do LAB! \n\nAgora ela recebeu passadas de mão ' + contador + ' vez(es)',
                in_reply_to_status_id: tweet.id_str,
                auto_populate_reply_metadata: true
            }, responseCallback);
        }
    }
});


/* Bot fodase parcero */

// var Twit = require('twit');

// require('dotenv').config();

// /* Instancie o bot com as chaves no arquivo .env */
// const Bot = new Twit({
//     consumer_key: process.env.CONSUMER_KEY,
//     consumer_secret: process.env.CONSUMER_SECRET,
//     access_token: process.env.ACCESS_TOKEN,
//     access_token_secret: process.env.ACCESS_TOKEN_SECRET,
//     timeout_ms: 60 * 1000,
// });

// console.log('Este bot está rodando...');

// var firstId

// /* BotInit() : Para iniciar o bot */
// function BotInit() {
//     var query = {
//         q: "from:@labezin",
//         result_type: "recent"
//     }

//     Bot.get('search/tweets', query, BotGotLatestTweet);

//     function BotGotLatestTweet(error, data, response) {
//         if (error) {
//             console.log('Bot não pôde achar o último tweet: ' + error);
//         }
//         else {
//             var id = data.statuses[0].id_str

//             if (firstId === undefined) {
//                 firstId = id
//             }
//             else {
//                 if (data.statuses[0].id_str !== firstId &&
//                     data.statuses[0].in_reply_to_status_id === null &&
//                     data.statuses[0].in_reply_to_status_id_str === null &&
//                     data.statuses[0].in_reply_to_user_id === null &&
//                     data.statuses[0].in_reply_to_user_id_str === null &&
//                     data.statuses[0].in_reply_to_screen_name === null &&
//                     !data.statuses[0].retweeted_status) {

//                     Bot.post('statuses/update', {
//                         status: 'fodase parcero',
//                         in_reply_to_status_id: id,
//                         auto_populate_reply_metadata: true
//                     }, BotCommented);

//                     firstId = id
//                 }
//             }

//             function BotCommented(error, response) {
//                 if (error) {
//                     console.log('Bot não pode comentar: ' + error);
//                 }
//                 else {
//                     console.log('Bot comentou: ' + id);
//                 }
//             }
//         }
//     }
// }

// /* Configure um intervalo de 5 segundos (em microsegundos) */
// setInterval(BotInit, 5 * 1000);

// /* Inicialize o bot Bot */
// BotInit();