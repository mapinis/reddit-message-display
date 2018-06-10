const five = require('johnny-five');

require('dotenv').config();

const board = new five.Board({
    port: 'COM3'
});

board.on('ready', () => {
    const lcd = new five.LCD({
        pins: [7, 8, 9, 10, 11, 12]
    });
    const led = new five.Led(13);

    
});