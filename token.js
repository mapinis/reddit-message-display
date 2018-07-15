const fetch = require("node-fetch");
const btoa = require("btoa");
require("dotenv").config();

const newToken = async () => {
    const getter = () => { return new Promise(resolve => {
        fetch("https://www.reddit.com/api/v1/access_token", {
            body:
                "grant_type=password&username=" + process.env.REDDIT_USERNAME + "&password=" + process.env.REDDIT_PASSWORD,
            headers: {
                Authorization: "Basic " + btoa(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET),
                "User-Agent": "reddit-message-display/0.1 by " + process.env.REDDIT_USERNAME,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        }).then(response => response.json())
          .then(({ access_token }) => { resolve(access_token) });
    })};

    module.exports.token = await getter();
};

newToken().then(() => {
    setInterval(newToken, 3400 * 1000);
});