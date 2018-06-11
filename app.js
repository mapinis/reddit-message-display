const five = require("johnny-five");
const fetch = require("node-fetch");
const btoa = require("btoa");

require("dotenv").config();

const centerIn = (str, length) => {
    return " ".repeat(Math.floor((length - str.length) / 2)) + str + " ".repeat(Math.ceil((length - str.length) / 2));
}

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


const board = new five.Board({
    port: "COM3"
});

board.on("ready", () => {
    const lcd = new five.LCD({
        pins: [7, 8, 9, 10, 11, 12]
    }).clear();

    const led = new five.Led(13);

    const showNewMessage = username => {
        lcd.clear().cursor(0, 0);
        led.blink(500);
        setTimeout(() => {
            led.stop().off();
            lcd.print("New Message From")
            .cursor(1, 0);
            if(username.length <= 16) {
                lcd.print(centerIn(username, 16));
            } else {
                lcd.print(username.substr(0, 15) + "-")
                setTimeout(() => {
                    lcd.cursor(1, 0)
                    .print(centerIn("-" + username.substr(15), 16));
                }, 2000);
            }
        }, 2000);
    }

  getToken().then(response => response.json())
            .then(({ access_token }) => console.log(access_token));
});
