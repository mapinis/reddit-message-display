const five = require("johnny-five");
const fetch = require("node-fetch");
const btoa = require("btoa");

require("dotenv").config();

const board = new five.Board({
  port: "COM3"
});

const getToken = () => {
  return fetch("https://www.reddit.com/api/v1/access_token", {
    body:
      "grant_type=password&username=" + process.env.REDDIT_USERNAME + "&password=" + process.env.REDDIT_PASSWORD,
    headers: {
      Authorization: "Basic " + btoa(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET),
      "User-Agent": "reddit-message-display/0.1 by " + process.env.REDDIT_USERNAME,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });
};

board.on("ready", () => {
  const lcd = new five.LCD({
    pins: [7, 8, 9, 10, 11, 12]
  });
  const led = new five.Led(13);

  getToken().then(response => response.json())
            .then(({ access_token }) => console.log(access_token));
});
