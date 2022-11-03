let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 360,
    scene: [ Load, Menu, Play, End ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyLEFT, keySPACE, keyUP, keyDOWN;
let music;