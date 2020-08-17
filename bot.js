const config = require('./config')
const twit = require('twit')

const T = new twit(config)

//ajout de la fonction reponse à une mention
function replyTweet(reply, nameID) {
    var params = { status: reply, in_reply_to_status_id: nameID }
    T.post('statuses/update', params, tweeted);
    function tweeted(err, data, response) {
        if (err) {
            console.log("Something went wrong : " + err);
        } else {
            console.log("The tweet have been posted successfuly :"+ params.status)
        }
    }
}

function replyMention() {
    var stream = T.stream('statuses/filter', { track: ['@229TT'] });
    stream.on('tweet', tweetEvent);

    function tweetEvent(tweet) {

        // Who sent the tweet?
        var name = tweet.user.screen_name;
        // What is the text?
        // var txt = tweet.text;
        // the status update or tweet ID in which we will reply
        var nameID = tweet.id_str;

        // Get rid of the @ mention
        // var txt = txt.replace(/@myTwitterHandle/g, "");

        // Start a reply back to the sender
        var reply = "Hello @" + name + ' ' + ", merci de m'avoir mentionné, suis moi pour plus d'actualité à propos du hashtag TT229 si ce n'est pas encore fait !";
        replyTweet(reply, nameID)

    }


};
//ajout de la fonction reponse à une mention 

function retweet(searchText) {
    // Params to be passed to the 'search/tweets' API endpoint
    let params = {
        q: searchText + '',
        result_type: 'mixed',
        count: 25,
    }

    T.get('search/tweets', params, function (err_search, data_search, response_search) {

        let tweets = data_search.statuses
        if (!err_search) {
            let tweetIDList = []
            for (let tweet of tweets) {
                tweetIDList.push(tweet.id_str);

                //more code here later...
            }

            // Call the 'statuses/retweet/:id' API endpoint for retweeting EACH of the tweetID
            for (let tweetID of tweetIDList) {
                T.post('statuses/retweet/:id', { id: tweetID }, function (err_rt, data_rt, response_rt) {
                    if (!err_rt) {
                        console.log("\n\nRetweeted! ID - " + tweetID)
                    }
                    else {
                        console.log("\nError... Duplication maybe... " + tweetID)
                        console.log("Error = " + err_rt)
                    }
                })
            }
        }
        else {
            console.log("Error while searching" + err_search)
            process.exit(1)
        }
    })
}

// Run every 20 seconds
// setInterval(function() { retweet('#TT229 OR #waxeho'); }, 60000)
setInterval(
    function () { 
        retweet('#TT229 OR #wasexo');
        // replyMention();
    }, 20000
)
