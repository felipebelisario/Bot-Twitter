const Twit = require('twit');
const TrackingCorreios = require('tracking-correios')

require('dotenv').config();

const Bot = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
});

// start stream and track tweets
const stream = Bot.stream('statuses/filter', { track: '@bot_rastreioc' });

console.log("Bot rodando...")

// use this to log errors from requests
function responseCallback(err, data, response) {
    if (err !== undefined)
        console.log(err);
    else
        console.log("Rastreado!");
}

// event handler
stream.on('tweet', tweet => {
    if (!tweet.display_text_range) {
        Bot.post('statuses/update', {
            status: 'Não encontrei nenhum número de rastreamento no seu tweet!',
            in_reply_to_status_id: tweet.id_str,
            auto_populate_reply_metadata: true
        }, responseCallback);
    }
    else {
        if ((tweet.text.slice(tweet.display_text_range[0], tweet.display_text_range[1])).indexOf("@bot_rastreioc") > -1) {
            objectsList = (tweet.text.slice(tweet.display_text_range[0], tweet.display_text_range[1])).split(" ")

            objectsList.splice(objectsList.indexOf("@bot_rastreioc"), 1)

            objectsList.forEach(element => {
                element.replace(",", "")
            })

            TrackingCorreios.track(objectsList)
                .then((res) => {
                    var text

                    res.forEach(element => {
                        text = "-> Nome: " + res.nome + "\n-> Número: " + res.numero +
                            "\n\n---Status---\n" + res.evento[0].descricao + "Cidade: " + res.evento[0].cidade 
                            + "\nData: " + res.evento[0].data + "\nHora: " + res.evento[0].hora

                        Bot.post('statuses/update', {
                            status: text,
                            in_reply_to_status_id: tweet.id_str,
                            auto_populate_reply_metadata: true
                        }, responseCallback);
                    })


                })
                .catch(() => {
                    Bot.post('statuses/update', {
                        status: "Tivemos um problema com o(s) número(s) de rastreio! Verfique se está(ão) correto(s) e se é(são) rastreável(is) pelos correios",
                        in_reply_to_status_id: tweet.id_str,
                        auto_populate_reply_metadata: true
                    }, responseCallback);
                })
        }
    }
});