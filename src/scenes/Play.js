class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.maxAlcohol = game.settings.maxAlcohol;
    }

    create() {

        incorrectGhosts = 0;
        correctGhosts = 0;
        firstCorrect = -1;
        firstIncorrect = -1;
        fCBool = false;
        fIBool = false;
        //create background and sprites
        this.alcRectangle = this.add.rectangle(60, game.config.height / 2 + 110, 120, 140, 0x6666ff);
        this.alcRectangle.setInteractive({
            useHandCursor: true,
        });
        this.bg = this.add.sprite(game.config.width/2, game.config.height/2,'main_bg');
        this.base_ghost = this.add.sprite(game.config.width/2-100, game.config.height/2-75,'ghost_sheet');

        this.desk = this.add.sprite(game.config.width/2, (game.config.height/2)+108,'desk');
        this.dialogue_box = this.add.sprite(game.config.width/2+140, game.config.height/2-130,'dialogue_box');

        this.button_heaven = this.add.sprite(game.config.width/2+210, game.config.height/2-60,'button_heaven');
        this.button_heaven.setInteractive({
            useHandCursor: true,
        });
        this.button_hell = this.add.sprite(game.config.width/2+210, game.config.height/2+10,'button_hell');
        this.button_hell.setInteractive({
            useHandCursor: true,
        });
        this.manual = this.add.sprite(game.config.width/2+230, game.config.height/2+220,'manual');
        this.manual.setInteractive({
            useHandCursor: true,
        });

        this.cup_2 = this.add.sprite(game.config.width/2-10, game.config.height/2+130,'cup_2');
        this.cup_1 = this.add.sprite(game.config.width/2+70, game.config.height/2+130,'cup_1');
        this.alcohol_1 = this.add.sprite(game.config.width/2-295, game.config.height/2+125,'alcohol_1');
        this.alcohol_2 = this.add.sprite(game.config.width/2-240, game.config.height/2+98,'alcohol_2');
        this.alcohol_3 = this.add.sprite(game.config.width/2-290, game.config.height/2+35,'alcohol_3');
        this.progressbar_1 = this.add.sprite(game.config.width/2-290, game.config.height/2-55,'progressbar_1');
        //this.progressbar_1_fill = this.add.sprite(game.config.width/2-290, game.config.height/2-55, 'progressbar_1_fill');
        this.progressbar_1_fill = this.add.sprite(game.config.width/2-316, game.config.height/2-10, 'progressbar_1_fill').setOrigin(0, 1);
        this.die1Sprite = this.add.sprite(game.config.width / 2 - 140, game.config.height / 2 + 100, 'dice_sheet');
        this.die2Sprite = this.add.sprite(game.config.width/2-110, game.config.height/2+125, 'dice_sheet');
        this.die3Sprite = this.add.sprite(game.config.width/2-105, game.config.height/2+90, 'dice_sheet');

        this.open_manual = this.add.sprite(game.config.width/2, game.config.height/2+40,'manual_open').setVisible(0).setScale(1.3);
        this.open_manual.setInteractive({
            useHandCursor: true,
        });

        this.manual_open = false;
        this.movingHeavenFlag = false
        this.movingHellFlag = false
        
        
        // animation config
        this.anims.create({
            key: 'roll',
            frames: this.anims.generateFrameNumbers('dice_sheet', { start: 0, end: 5, first: 0}),
            frameRate: 10
        });
        this.anims.create({
            key: 'ghost_anim',
            frames: this.anims.generateFrameNumbers('ghost_sheet', {start: 0, end: 5, first: 0}),
            frameRate: 8,
            repeat: -1
        })
        this.base_ghost.anims.play('ghost_anim');
        
        this.correctSFX = this.sound.add('correctSFX');
        this.wrongSFX = this.sound.add('wrongSFX');
        this.wine = this.sound.add('Wine');
        this.wine.volume = 10;
        this.diceSound = this.sound.add('Dice');
        this.diceSound.volume = 5;

        // initialize alcohol
        this.alcohol = 0;
        
        // initialize drank alcohol state
        this.drank = false;
        
        // initialize number of ghosts correct
        this.correct = 0;

        //create arrays for quotes
        this.goodQuotes = this.loadWords('goodQuotes');
        this.goodNeutralQuotes = this.loadWords('goodNeutralQuotes');
        this.neutralQuotes = this.loadWords('neutralQuotes');
        this.badNeutralQuotes = this.loadWords('badNeutralQuotes');
        this.badQuotes = this.loadWords('badQuotes');
        
        // universal text config for printing out mechanics
        this.textConfig = {
            fontFamily: 'CustomFont',
            fontSize: '28px',
            color: '#f5f5dc',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            
        }
        
        this.dialogueConfig = {
            fontFamily: 'CustomFont',
            fontSize: '28px',
            color: '#f5f5dc',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            wordWrap: {width: 275, useAdvancedWrap: true}
        }
        // initial roll of dice - would player have to roll dice somehow?
        this.rollDice();
        

        // ghost dialogue
        this.quote = this.chooseQuote(this.diceSum);

        // GAME OVER flag
        this.gameOver = false;

        // 120-second play clock
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'DAY OVER', this.textConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press SPACE to Restart or ← to Menu', this.textConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        
        // adding initalization of key spaces 
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        
        // testing if my chance calculation works works - REMOVE LATER
        // for (let x = 3; x < 19; x++) {
        //     this.rollDiceTest(x);
        // }
        
        // button functionality
        this.input.on('gameobjectdown', (pointer, gameObject, event, game) => {
            if (!this.gameOver) {
                if (gameObject == this.button_heaven && !this.movingHeavenFlag && !this.movingHellFlag && !this.manual_open){
                    this.sendToHeaven();
                }   
                if (gameObject == this.button_hell && !this.movingHeavenFlag && !this.movingHellFlag && !this.manual_open){
                    this.sendToHell();
                } 
                if (gameObject == this.alcRectangle && this.alcohol >= this.maxAlcohol && !this.movingHeavenFlag && !this.movingHellFlag && !this.manual_open) {
                    this.wine.play();
                    this.drank = true;
                    // update alcohol
                    this.alcohol -= 1;
                }
                if (gameObject == this.manual && !this.manual_open){
                    this.manual_open = true;
                    this.manual.setVisible(0);
                    this.open_manual.setVisible(1);
                }
                if (gameObject == this.open_manual && this.manual_open){
                    this.manual_open = false;
                    this.manual.setVisible(1);
                    this.open_manual.setVisible(0);
                }
            }
        });
        
    }

    update() {
        // music loop
        if(!music.isPlaying){
            music.play();
        }        
        
        if (this.movingHeavenFlag){
            this.base_ghost.y--
            this.base_ghost.y--
            this.base_ghost.y--
            if (this.base_ghost.y < -100){
                this.base_ghost.y = game.config.height/2-75;
                this.movingHeavenFlag = false
                this.rollDice()
            }
        }
        if (this.movingHellFlag){
            // this.base_ghost.SendToBack()
            this.base_ghost.y++
            this.base_ghost.y++
            this.base_ghost.y++
            if (this.base_ghost.y >  game.config.height+100){
                this.base_ghost.y = game.config.height/2-75;
                this.movingHellFlag = false
                this.rollDice()
            }
        }
        // had to destroy all text so it wouldn't rewrite itself
        if (this.alcoholText) {
            this.alcoholText.destroy();
            this.dialogueText.destroy();
        }
        

        //text for ghost refreshing
        this.dialogueText = this.add.text(game.config.width / 2 + 5, game.config.height / 10 - 15, this.quote, this.dialogueConfig);

        //debugging text that appears in orange
        this.alcoholText = this.add.text(borderPadding, borderPadding, "Alcohol: " + this.alcohol, this.textConfig);     
        
        this.progressbar_1_fill.setScale(1, this.alcohol);
        
        // check key input for restart / menu
        if(this.gameOver){
            this.scene.start("endScene");
        }
        
        if (!this.gameOver) {            
            // player picked heaven for ghost
            if (Phaser.Input.Keyboard.JustDown(keyUP) && !this.movingHeavenFlag && !this.movingHellFlag && !this.manual_open) {
                this.sendToHeaven();
            }
            
            // player picked hell for ghost
            if (Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.movingHeavenFlag && !this.movingHellFlag && !this.manual_open) {
                this.sendToHell();
            }
            
            // player drank alcohol
            if (Phaser.Input.Keyboard.JustDown(keyLEFT) && this.alcohol >= game.settings.maxAlcohol && !this.movingHeavenFlag && !this.movingHellFlag && !this.manual_open) {
                this.wine.play();
                this.drank = true;
                // update alcohol
                this.alcohol -= 1;
            }
        }
    }
    
    rollDice() {
        this.diceSound.play();
        this.die1Sprite.anims.play('roll');
        this.die2Sprite.anims.play('roll');
        this.die3Sprite.anims.play('roll');
        
        
        // set drank alcohol state back to false since new ghost
        this.drank = false;
        
        // initialize dice
        // pick a random int between 1 and 6
        this.die1 = Phaser.Math.Between(1, 6);
        this.die2 = Phaser.Math.Between(1, 6);
        this.die3 = Phaser.Math.Between(1, 6);
        
        // sum up dice
        this.diceSum = this.die1 + this.die2 + this.die3;
        
        // initialize if going to heaven or hell
        // chances going to heaven = (18 - sum)/15
        // since sums are from 3 to 18
        // so if roll a 3, then (18-3)/15 = 15/15 = 1
        // so if roll a 18, then (18-18)/15 = 0/15 = 0
        this.chance = (18 - this.diceSum) / 15; 
        
        // pick a random int from 1 - 15, 1/15 chance for each number
        this.randomInt = Phaser.Math.Between(1, 15);
        
        // if the (18 - this.diceSum) is greater than or equal to the random int, then ghost would be going to heaven
        if ((18 - this.diceSum) > this.randomInt || (18 - this.diceSum) == this.randomInt) {
            this.heaven = true;
        } else {
            this.heaven = false;
        }
        

        this.quote = this.chooseQuote(this.diceSum);
        
        this.die1Sprite.on('animationcomplete', () => {    // callback after anim completes
            this.die1Sprite.setFrame(this.die1 - 1);
        });
        this.die2Sprite.on('animationcomplete', () => {    // callback after anim completes
            this.die2Sprite.setFrame(this.die2 - 1);
        });
        this.die3Sprite.on('animationcomplete', () => {    // callback after anim completes
            this.die3Sprite.setFrame(this.die3 - 1);
        });

        
        return this.diceSum;
    }
    
    // function to test probability calculations by doing it 100 times
    rollDiceTest(diceRoll) {
        let heavenNum = 0;
        let hellNum = 0;
        let randomIntTest;
        
        // repeat 100 times and mark how many times sent to heaven or hell
        for (let x = 0; x < 100; x++) {
            randomIntTest = Phaser.Math.Between(1, 15);
            if ((18 - diceRoll) >= randomIntTest) {
                heavenNum++;
            } else {
                hellNum++;
            }
        }
        
        // print out results
        console.log("Dice Roll: " + diceRoll + " Probability: " + (18 - diceRoll) +
            "/" + 15 + " Probability(%): " + ((18 - diceRoll) / 15) * 100 + "%" +
            " Heaven: " + heavenNum + " Hell: " + hellNum);
    }
    
    sendToHeaven() {
        if (this.drank) {
            // play correct sound
            this.correctSFX.play();
            // increase correct number
            this.correct++;
            correctGhosts++;
            if(!fCBool){
                if(3<= this.diceSum && this.diceSum <= 5){
                    for( let i = 0; i < this.goodQuotes.length; i++){
                        if(this.goodQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 1;
                        }
                    }
                    
                    fCBool = true;
                }else if(5 < this.diceSum && this.diceSum <= 8){
                    for( let i = 0; i < this.goodNeutralQuotes.length; i++){
                        if(this.goodNeutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 2;
                        }
                    }
                    
                    fCBool = true;
                }else if(8 < this.diceSum && this.diceSum <= 12){
                    for( let i = 0; i < this.neutralQuotes.length; i++){
                        if(this.neutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 3;
                        }
                    }
                    
                    fCBool = true;
                }else if(12 < this.diceSum && this.diceSum <= 15){
                    for( let i = 0; i < this.badNeutralQuotes.length; i++){
                        if(this.badNeutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 4;
                        }
                    }
                    
                    fCBool = true;
                }else if(15 < this.diceSum && this.diceSum <= 18){
                    for( let i = 0; i < this.badQuotes.length; i++){
                        if(this.badQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 5;
                        }
                    }
                    
                    fCBool = true;
                }
            }
        } else if (this.heaven) {
            // play correct sound
            this.correctSFX.play();
            this.correct++;
            correctGhosts++;
            if(!fCBool){
                if(3<= this.diceSum && this.diceSum <= 5){
                    for( let i = 0; i < this.goodQuotes.length; i++){
                        if(this.goodQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 1;
                        }
                    }
                    
                    fCBool = true;
                }else if(5 < this.diceSum && this.diceSum <= 8){
                    for( let i = 0; i < this.goodNeutralQuotes.length; i++){
                        if(this.goodNeutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 2;
                        }
                    }
                    
                    fCBool = true;
                }else if(8 < this.diceSum && this.diceSum <= 12){
                    for( let i = 0; i < this.neutralQuotes.length; i++){
                        if(this.neutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 3;
                        }
                    }
                    
                    fCBool = true;
                }else if(12 < this.diceSum && this.diceSum <= 15){
                    for( let i = 0; i < this.badNeutralQuotes.length; i++){
                        if(this.badNeutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 4;
                        }
                    }
                    
                    fCBool = true;
                }else if(15 < this.diceSum && this.diceSum <= 18){
                    for( let i = 0; i < this.badQuotes.length; i++){
                        if(this.badQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 5;
                        }
                    }
                    
                    fCBool = true;
                }
            }
            // update alcohol and make sure it isn't past the max
            this.alcohol += this.alcCalc();
            if (this.alcohol > game.settings.maxAlcohol) {
                this.alcohol = game.settings.maxAlcohol;
            }
        } else {
            // play incorrect sound
            this.wrongSFX.play();
            incorrectGhosts++;
            if(!fIBool){
                if(3<= this.diceSum && this.diceSum <= 5){
                    for( let i = 0; i < this.goodQuotes.length; i++){
                        if(this.goodQuotes[i] == this.quote){
                            firstIncorrect = i;
                            iGoodNeutralBad = 1;
                        }
                    }
                    console.log(firstIncorrect);
                    fIBool = true;
                }else if(5 < this.diceSum && this.diceSum <= 8){
                    for( let i = 0; i < this.goodNeutralQuotes.length; i++){
                        if(this.goodNeutralQuotes[i] == this.quote){
                            firstIncorrect = i;
                            iGoodNeutralBad = 2;
                        }
                    }
                    console.log(firstIncorrect);
                    fIBool = true;
                }else if(8 < this.diceSum && this.diceSum <= 12){
                    for( let i = 0; i < this.neutralQuotes.length; i++){
                        if(this.neutralQuotes[i] == this.quote){
                            firstIncorrect = i;
                            iGoodNeutralBad = 3;
                        }
                    }
                    console.log(firstIncorrect);
                    fIBool = true;
                }else if(12 < this.diceSum && this.diceSum <= 15){
                    for( let i = 0; i < this.badNeutralQuotes.length; i++){
                        if(this.badNeutralQuotes[i] == this.quote){
                            firstIncorrect = i;
                            iGoodNeutralBad = 4;
                            console.log(i);
                        }
                    }
                    console.log(firstIncorrect);
                    fIBool = true;
                }else if(15 < this.diceSum && this.diceSum <= 18){
                    for( let i = 0; i < this.badQuotes.length; i++){
                        if(this.badQuotes[i] == this.quote){
                            firstIncorrect = i;
                            iGoodNeutralBad = 5;
                        }
                    }
                    console.log(firstIncorrect);
                    fIBool = true;
                }
            }
        }
        
        this.movingHeavenFlag = true;
        // this.rollDice();
    }
    
    sendToHell() {
        if (this.drank) {
            // play correct sound
            this.correctSFX.play();
            // increase correct number
            this.correct++;
            correctGhosts++;
            if(!fCBool){
                if(3<= this.diceSum && this.diceSum <= 5){
                    for( let i = 0; i < this.goodQuotes.length; i++){
                        if(this.goodQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 1;
                        }
                    }
                    
                    fCBool = true;
                }else if(5 < this.diceSum && this.diceSum <= 8){
                    for( let i = 0; i < this.goodNeutralQuotes.length; i++){
                        if(this.goodNeutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 2;
                        }
                    }
                    
                    fCBool = true;
                }else if(8 < this.diceSum && this.diceSum <= 12){
                    for( let i = 0; i < this.neutralQuotes.length; i++){
                        if(this.neutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 3;
                        }
                    }
                    
                    fCBool = true;
                }else if(12 < this.diceSum && this.diceSum <= 15){
                    for( let i = 0; i < this.badNeutralQuotes.length; i++){
                        if(this.badNeutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 4;
                        }
                    }
                    
                    fCBool = true;
                }else if(15 < this.diceSum && this.diceSum <= 18){
                    for( let i = 0; i < this.badQuotes.length; i++){
                        if(this.badQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 5;
                        }
                    }
                    
                    fCBool = true;
                }
            }
        } else if (!this.heaven) {
            // play correct sound
            this.correctSFX.play();
            this.correct++;
            correctGhosts++;
            if(!fCBool){
                if(3<= this.diceSum && this.diceSum <= 5){
                    for( let i = 0; i < this.goodQuotes.length; i++){
                        if(this.goodQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 1;
                        }
                    }
                    
                    fCBool = true;
                }else if(5 < this.diceSum && this.diceSum <= 8){
                    for( let i = 0; i < this.goodNeutralQuotes.length; i++){
                        if(this.goodNeutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 2;
                        }
                    }
                    
                    fCBool = true;
                }else if(8 < this.diceSum && this.diceSum <= 12){
                    for( let i = 0; i < this.neutralQuotes.length; i++){
                        if(this.neutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 3;
                        }
                    }
                    
                    fCBool = true;
                }else if(12 < this.diceSum && this.diceSum <= 15){
                    for( let i = 0; i < this.badNeutralQuotes.length; i++){
                        if(this.badNeutralQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 4;
                        }
                    }
                    
                    fCBool = true;
                }else if(15 < this.diceSum && this.diceSum <= 18){
                    for( let i = 0; i < this.badQuotes.length; i++){
                        if(this.badQuotes[i] == this.quote){
                            firstCorrect = i;
                            cGoodNeutralBad = 5;
                        }
                    }
                    
                    fCBool = true;
                }
            }
            // update alcohol and make sure it isn't past the max
            this.alcohol += this.alcCalc();
            if (this.alcohol > game.settings.maxAlcohol) {
                this.alcohol = game.settings.maxAlcohol;
            }
        } else {
            // play incorrect sound
            this.wrongSFX.play();
            incorrectGhosts++;
            if(!fIBool){
                if(3<= this.diceSum && this.diceSum <= 5){
                    for( let i = 0; i < this.goodQuotes.length; i++){
                        if(this.goodQuotes[i] == this.quote){
                            firstIncorrect = i;
                            iGoodNeutralBad = 1;
                        }
                    }
                    console.log(firstIncorrect);
                    fIBool = true;
                }else if(5 < this.diceSum && this.diceSum <= 8){
                    for( let i = 0; i < this.goodNeutralQuotes.length; i++){
                        if(this.goodNeutralQuotes[i] == this.quote){
                            firstIncorrect = i;
                            iGoodNeutralBad = 2;
                        }
                    }
                    console.log(firstIncorrect);
                    fIBool = true;
                }else if(8 < this.diceSum && this.diceSum <= 12){
                    for( let i = 0; i < this.neutralQuotes.length; i++){
                        if(this.neutralQuotes[i] == this.quote){
                            firstIncorrect = i;
                            iGoodNeutralBad = 3;
                        }
                    }
                    console.log(firstIncorrect);
                    fIBool = true;
                }else if(12 < this.diceSum && this.diceSum <= 15){
                    for( let i = 0; i < this.badNeutralQuotes.length; i++){
                        if(this.badNeutralQuotes[i] == this.quote){
                            firstIncorrect = i;
                            iGoodNeutralBad = 4;
                        }
                    }
                    console.log(firstIncorrect);
                    fIBool = true;
                }else if(15 < this.diceSum && this.diceSum <= 18){
                    for( let i = 0; i < this.badQuotes.length; i++){
                        if(this.badQuotes[i] == this.quote){
                            firstIncorrect = i;
                            iGoodNeutralBad = 5;
                        }
                    }
                    console.log(firstIncorrect);
                    fIBool = true;
                }
            }
        }
        
        // roll dice/spawn new ghost
        this.movingHellFlag = true
        // this.rollDice();
    }
    
    alcCalc() {
        // hard coding how much alcohol each dice roll gets back (based on index)
        // sorry my brain was dead and couldn't think of an equation - I will change later
        // alcIncrements[dice roll - 3] is how much alcohol the dice roll gets back
        this.alcIncrements = [0, 0.14, 0.28, 0.42, 0.56, 0.70, 0.84, 1, 1, 0.84, 0.70, 0.56, 0.42, 0.28, 0.14, 0];
        
        return this.alcIncrements[this.diceSum - 3];
    }

    loadWords(inFile) {
        let cache = this.cache.text;
        let allWords = cache.get(inFile);
        this.tempArray = allWords.split('\n');
        for(let i = 0; i < this.tempArray.length; i++){
            this.tempArray[i] = this.tempArray[i].trim();
        }
        return this.tempArray;
    }

    chooseQuote(inNum){
        if(3<= inNum && inNum <= 5){
            return this.goodQuotes[Math.floor(Math.random() * this.goodQuotes.length)];
        }else if(5 < inNum && inNum <= 8){
            return this.goodNeutralQuotes[Math.floor(Math.random() * this.goodNeutralQuotes.length)];
        }else if(8 < inNum && inNum <= 12){
            return this.neutralQuotes[Math.floor(Math.random() * this.neutralQuotes.length)];
        }else if(12 < inNum && inNum <= 15){
            return this.badNeutralQuotes[Math.floor(Math.random() * this.badNeutralQuotes.length)];
        }else if(15 < inNum && inNum <= 18){
            return this.badQuotes[Math.floor(Math.random() * this.badQuotes.length)];
        }
    }
}