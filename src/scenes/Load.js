class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload(){
        // Hud elements 
        this.load.image('button_heaven', './assets/Hud/button_heaven.png');
        this.load.image('button_hell', './assets/Hud/button_hell.png');
        this.load.image('button_menu', './assets/Hud/button_menu.png');
        this.load.image('button_play', './assets/Hud/button_play.png');
        this.load.image('button_retry', './assets/Hud/button_retry.png');
        this.load.image('button_roll', './assets/Hud/button_roll.png');
        this.load.image('desk', './assets/Hud/desk.png');
        this.load.image('dialogue_box', './assets/Hud/dialogue_box.png');
        this.load.image('progressbar_1_fill', './assets/Hud/progressbar_1_fill.png');
        this.load.image('progressbar_1', './assets/Hud/progressbar_1.png');
        this.load.image('progressbar_2_fill', './assets/Hud/progressbar_2_fill.png');
        this.load.image('progressbar_2', './assets/Hud/progressbar_2.png');
        this.load.image('progressbar_3_fill', './assets/Hud/progressbar_3_fill.png');
        this.load.image('progressbar_3', './assets/Hud/progressbar_3.png');

        // Prop elements
        this.load.image('alcohol_1', './assets/Props/alcohol_1.png')
        this.load.image('alcohol_2', './assets/Props/alcohol_2.png')
        this.load.image('alcohol_3', './assets/Props/alcohol_3.png')
        this.load.image('cup_1', './assets/Props/cup_1.png')
        this.load.image('cup_2', './assets/Props/cup_2.png')
        this.load.image('dice_1', './assets/Props/dice_1.png')
        this.load.image('dice_2', './assets/Props/dice_2.png')
        this.load.image('dice_3', './assets/Props/dice_3.png')
        this.load.image('dice_4', './assets/Props/dice_4.png')
        this.load.image('dice_5', './assets/Props/dice_5.png')
        this.load.image('dice_6', './assets/Props/dice_6.png')
        this.load.image('manual', './assets/Props/manual.png')
        this.load.image('manual_open', './assets/Props/manual_open.png')
        this.load.spritesheet("dice_sheet", "./assets/Props/dice_sheet.png", { frameWidth: 32, frameHeight: 32 });

        // Ghost
        this.load.image('base_ghost', './assets/Ghost Stuff/base_ghost.png')

        // Backgrounds
        this.load.image('end_bg', './assets/end_bg.png')
        this.load.image('end_screen', './assets/end_screen.png')
        this.load.image('main_bg', './assets/main_bg.png')
        this.load.image('main_menu', './assets/main_menu.png')
        this.load.image('menu_bg', './assets/menu_bg.png')

        // Text
        this.load.text('goodQuotes', 'assets/text/good.txt');
        this.load.text('goodNeutralQuotes', 'assets/text/good_neutral.txt');
        this.load.text('neutralQuotes', 'assets/text/neutral.txt');
        this.load.text('badNeutralQuotes', 'assets/text/bad_neutral.txt');
        this.load.text('badQuotes', 'assets/text/bad.txt');

        //Audio
        this.load.audio('backgroundMusic', 'assets/audio/Game2Music.mp3');
        this.load.audio('correctSFX', 'assets/audio/Yes_V4.wav');
        this.load.audio('wrongSFX', 'assets/audio/No_V2.wav');
        this.load.audio('Wine', 'assets/audio/Wine.wav');
        this.load.audio('Dice', 'assets/audio/Dice_shortened.wav');
    }

    create(){
        music = game.sound.add('backgroundMusic');
        music.volume = 0.4;
    }

    update(){
        this.scene.start('menuScene');
    }
}