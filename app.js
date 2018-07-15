const five = require("johnny-five");
const fetch = require("node-fetch");
require("dotenv").config();

let tokenHolder = require("./token.js");



const board = new five.Board({
    port: "COM3"
});

board.on("ready", () => {

    let newMessagesArr = [];
    const BLINK_TIME = 2000;
    const DISPLAY_TIME = 4000;

    const lcd = new five.LCD({
        pins: [7, 8, 9, 10, 11, 12]
    }).clear();

    const led = new five.Led(13);

    const centerIn = (str, length) => {
        return " ".repeat(Math.floor((length - str.length) / 2)) + str + " ".repeat(Math.ceil((length - str.length) / 2));
    }

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
                }, DISPLAY_TIME / 2);
            }
            setTimeout(() => {
                lcd.clear().cursor(0, 0);
            }, DISPLAY_TIME);
        }, BLINK_TIME);
    }

    const displayMessages = () => {
        // 6 seconds per message
        const username = newMessagesArr.pop();
        showNewMessage(username);
        if(newMessagesArr.length > 0){
            setTimeout(displayMessages, BLINK_TIME + DISPLAY_TIME);
        } 
    }

    const getNewMessages = token => {
        newMessagesArr.push("Person");
        newMessagesArr.push("12345678901112134578");
    }

    getNewMessages();
    displayMessages();

});
