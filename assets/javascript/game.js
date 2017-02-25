$(document).ready(function() {
  // uses backstretch jquery plugin
  $('body').backstretch('assets/images/manhattan_bw.jpg');

  var gameState = {
    'selectCharacter':false,
    'showEnemies':false,
    'opponentSelected':false,
    'inBattle':false,
    'winBattle':false,
    'loseBattle':false,
    'loseGame':false,
    'winGame':false,
    'resetGame':false,

    updateGameState: function(phase) {
      for(var key in gameState) {
        if(typeof gameState[key] === 'boolean'){
          gameState[key] = false;
        }
      }
      gameState[phase] = true;
      console.log("update game state to " + phase);
    },

    /**
    * This function resets everything for a new game 
    * resets variables to null or empty
    * removes and recreates character buttons (cleaner than removing classes, resetting attributes, etc. and leaves potential for adding new characters each level, etc. in the future)
    * initiates new gameplay by adding event listener to char btns and waiting for user action. 
    * called after a win or loss in the game
    */
    gameReset: function() {
      browser.gameResetLayout();
      data.resetData();
      browser.resetCharBtns();
    }
  };

  /** object for all vars/fxns related to browser layout/display */
  var browser = {
    /**
    * Function to show/hide an element
    * @param {string} elementClass - a class name to pass into jQuery selector 
    * @param {bool} shouldShow - false for hidden display, true for visible. 
    */
    showHidden: function(elementClass, shouldShow) {
      var element = $(elementClass);
      if (shouldShow===true) {
        element.css('display','inline');
      }
      else {
        element.css('display', 'none');
      }
    },

    /**
    * Function to replace bootstrap grid column with a new size (by removing and adding classes)
    * @param {string} elementClass - a class name to pass into jQuery selector 
    * @param {string} originalSize - the grid class to remove 
    * @param {string} newSize - the grid class to add
    */
    columnResize: function(elementClass, originalSize, newSize){
      var element = $(elementClass);
      element.addClass(newSize).removeClass(originalSize);
    },

    /**
    * Function to scale elements up or down using css zoom
    * @param {string} elementClass - a class name to pass into jQuery selector 
    * @param {bool} shouldZoom - false for original size, true to zoom out 50% (zoom:0.5). 
    */
    isZoomedOut: function(elementClass, shouldZoom){
      if(shouldZoom===true){
        //zoom in
        $(elementClass).attr('style', 'zoom: 0.5');
      } else {
        $(elementClass).attr('style', 'zoom: 1.0');
      }
    },

    /**
    * Function to display attributes (name, HP, and 'name'.jpg img) in the char-btns
    * @param {string} buttonSelector - a jQuery selector (in this application, a button) designated as the parent of the data-display divs created
    */
    displayCharacterData: function(buttonSelector) {
      // create name div
      var nameDiv = $('<div>' + buttonSelector.attr('name') + '</div>');
      nameDiv.addClass('char-name');
      // create hp div
      var hpDiv = $('<div>' + 'Hilarity: ' + buttonSelector.attr('HP') + '</div>');
      hpDiv.addClass('char-hp');
      // create image div
      var charImgName = buttonSelector.attr('name') + '.jpg';
      var imgDiv = $('<img src="assets/images/' + charImgName + '" alt="character thumbnail">');
      imgDiv.addClass('thumbnail char-thumbnail');
      // add to parent div
      buttonSelector.append(nameDiv, imgDiv, hpDiv);
    },

    /**
    * Function to refresh existing HP value displayed on char-btn (for user and defender during battle)
    */
    updateHPOnScreen: function() {
      var userHP = data.userChar.attr('HP');
      var oppHP = data.opponent.attr('HP');
      $('.user-char-btn .char-hp').html('Hilarity: ' + userHP);
      $('.opponent-btn .char-hp').html('Hilarity: ' + oppHP);
    }, 

    /**
    * Function to refresh instruction text displayed on screen (in jumbotron) throughout the game depending on the status of gameplay
    * @param {string} textType - the scenario the text should correspond to (e.g. winning the game, losing the game, beginning a game)
    */
    updateBattleText: function(textType) {
      var battleTextDiv = $('.battle-text');
      //choose relevant content based on context
      if(gameState.inBattle === true){
        var sentence = ('You hit ' + data.oppName + ' with ' + data.userAttack + ' jokes and ' + data.oppName + ' countered with ' + data.oppCounter + '.');
      } else if(gameState.loseGame === true) {
        var sentence = 'Oh no, ' + data.oppName + ' got the most laughs! Click "Play Again" to start a new game.';
      } else if(gameState.winBattle === true) {
        var sentence = ('You defeated ' + data.oppName + '! Choose your next opponent by clicking a friend.');
      } else if(gameState.beginningNewGame === true) {
        var sentence = 'Preparing for a battle of laughs. Use the "Make Jokes" button to battle ' + data.oppName + '.';
      } else if(gameState.winGame === true) {
        var sentence = 'Way to go champ, could you BE any funnier? Click "Play Again" to start a new game';
      } else if(gameState.selectCharacter === true) {
        var sentence = 'Choose your character! Click on a character to select.';
      } else if(gameState.revealEnemies === true) {
        var sentence = 'Select your first opponent! Click on a friend to challenge them.';
      }
      // update div html 
      battleTextDiv.html(sentence);
    }, 

    /**
    * Function to update the grid/layout for game state
    */
    updateLayout: function() {
      /**
      * hides enemies and opponent sections 
      */
      if(gameState.selectCharacter === true){
        browser.showHidden('.enemies-section', false);
        browser.showHidden('.opponent-section', false);
      }
      /**
      * shows the enemies section for selection
      * hides the opponent section 
      * resizes the columns so user and enemies fit nicely side by side: user-section col-md-4, enemies col-md-8
      * ensures that enemy buttons are at normal scale and not zoomed out as they are during gameplay
      */
      else if(gameState.revealEnemies === true){
        browser.showHidden('.opponent-section', false);
        browser.showHidden('.enemies-section', true);
        browser.columnResize('.user-section','col-md-12','col-md-4');
        browser.columnResize('.enemies-section', 'col-md-4','col-md-8');
        browser.isZoomedOut('.enemy-btn', false);
      }
      /**
      * resizes the columns so user, opponent, and enemies fit nicely side by side in that order: user-section col-md-4, opponent col-md-4, enemies col-md-4
      * scales down the enemies buttons to 50% size using 'zoom' 
      * ensures opponent section is now showing so opponent can be displayed for battle
      */
      else if(gameState.opponentSelected === true){
        browser.columnResize('.user-section','col-md-12','col-md-4');
        browser.columnResize('.enemies-section','col-md-8','col-md-4');
        browser.isZoomedOut('.enemy-btn',true);
        browser.showHidden('.opponent-section', true);
        // zoom OPPONENT button back in *after* enemy becomes opponent
        browser.isZoomedOut(data.opponent, false);
        // .opponent is new parent DIV, move to new parent/section of page
        $('.opponent-div').append(data.opponent);
        //show attack button, get ready to fight! 
        //attack button showing means it's on-click is active, similar to calling a 'launch attack fxn here'
        browser.showHidden('.attack-button', true);
      }
      else if (gameState.winBattle === true) {
        // remove defeated opponent button element! 
        $('.opponent-btn').remove();
        //hide attack button so it can't be clicked (data.selectOpponent will show attack button again)
        browser.showHidden('.attack-button', false);
      }
      else if (gameState.loseGame === true) {
        browser.showHidden('.attack-button', false);
        browser.showHidden('.new-game-button', true);
      }
      else if (gameState.winGame === true) {
        browser.showHidden('.new-game-button', true);
      }
      /**
      * after a win or loss in the game, resizes the columns so user extends col-md-12 since it now holds all char-btns for display. 
      */
      else if(gameState.beginningNewGame === true){
        browser.columnResize('.user-section', 'col-md-4','col-md-12');
        browser.showHidden('.new-game-button',false);
        // change to new game text
        browser.updateBattleText();
      }
    },

    refreshGame: function() {
      browser.updateLayout();
      browser.updateBattleText();
    }
  };

  /** object for all gameplay vars/fxns related to character creation/selection */
  var data = {
    // data
    'userChar': null,
    'enemies': [],
    'opponent': null, 

    // attributes - easily add more characters or attributes by inserting here
    'name': ['Rachel', 'Phoebe', 'Joey', 'Chandler', 'Monica', 'Ross'],
    'HP': [215,180,161,140, 160, 190],
    'attackPower': [8,5,20,23,15,9],
    'charBtnArray': [],

    // vars to hold current user/opponent attributes in memory during battle for faster access 
    'oppName': null,
    'userHP': null,
    'oppHP': null,
    'userBase': null, // store base user attack power 
    'userAttack': null, // dynamic user attack power, increases by base each attack 
    'oppCounter': null, // opponents counter attack power(= base)

    createCharBtns : function() {
      browser.refreshGame();
      console.log("character.createCharBtns");

      for(var i = 0; i < this.name.length; i++) {
        var charBtn = $('<button>');
        charBtn.addClass('character-button');
        // add attributes 
        charBtn.attr('name', this.name[i]);
        charBtn.attr('HP', this.HP[i]);
        charBtn.attr('attackPower', this.attackPower[i]);
        // add to array of buttons
        this.charBtnArray.push(charBtn); 
        // add display text 
        browser.displayCharacterData(charBtn);
        //charBtn.text(charBtn.attr('name'));
        // append child to parent element so it displays
        $('.your-char-div').append(charBtn);
      }
    },

    resetCharBtns: function() {
      console.log("character.resetCharBtns");
      // 1. remove existing 
      for(var i = 0; i < data.charBtnArray.length; i++) {
        var charBtn = data.charBtnArray[i];
        charBtn.remove();
      }
      // 2. clear array
      data.charBtnArray = [];
      // 3. create 
      data.createCharBtns();
      // add their event listeners
      data.selectCharacter();
    },

    // player clicks one of 4 character buttons
    selectCharacter: function() {
      console.log("character.selectCharacter");
      gameState.updateGameState("selectCharacter");
      browser.refreshGame();
      //putting this in fxn because we need to 're-call' and re-add the event listener in new game when we recreate the char buttons and assign them to the class. 
      $('.character-button').on('click', function() {
        // only set userChar once per game
        if(data.userChar===null){
          //store selected in data.userChar 
          data.userChar = $(this);
          // add class user-char
          data.userChar.addClass('user-char-btn');
          //call browser enemies
          data.addEnemies();
        } 
      });
    },

    // the others in charBtnArray stored in 'enemies'
    addEnemies: function() {
      console.log("character.addEnemies");
      gameState.updateGameState("revealEnemies");
      browser.refreshGame();

      for(var i = 0; i < data.charBtnArray.length; i++) {
        if(!(data.charBtnArray[i].attr('name')===data.userChar.attr('name'))){
          //add to enemies array in browser
          data.enemies.push(data.charBtnArray[i]);
          // add enemy class to charBtns for styling change
          data.charBtnArray[i].addClass('enemy-btn');
          // .enemies is new parent DIV, move to new section of page. 
          $('.enemies-div').append(data.charBtnArray[i]);
          browser.updateBattleText();
        }
      }
      this.selectOpponent();
    },

    //player clicks an enemy and they move into the 'opponent' section
    selectOpponent: function() {
      console.log("character.selectOpponent");

      $('.enemy-btn').on('click', function() {
        //pick opponent one time
        if(data.opponent===null){ 
          //add to data.opponent variable
          data.opponent = $(this);
          // remove from enemies array 
           var index = data.enemies.indexOf($(this));
           data.enemies.splice(index,1);
          //add opponent class for styling change
          data.opponent.addClass('opponent-btn');
          data.opponent.removeClass('enemy-btn');
          //update all the character info in vars so we can access the attributes faster in the gameplay (battles)
          data.storeAttributes();

          gameState.updateGameState("opponentSelected");
          browser.refreshGame();
        } else {
          alert('opponent already selected!');
        }
      });
    },

    storeAttributes: function() {
      //make some vars to keep things easy to access
      this.oppName = data.opponent.attr('name');
      this.oppHP = data.opponent.attr('HP');
      this.oppCounter = data.opponent.attr('attackPower');
      // if vars aren't starting out at null, then user has already defeated at least one opponent, so don't update the user vars. 
      if(this.userAttack===null){
        //update the uservars bc beginning of game
        this.userHP = data.userChar.attr('HP');
        this.userAttack = data.userChar.attr('attackPower');
        this.userBase = data.userChar.attr('attackPower');
      }
    },

    resetData: function(){
      // reset vars
      data.userChar = null;
      data.enemies = [];
      data.opponent = null;
      data.oppName = null;
      data.userHP = null;
      data.oppHP = null;
      data.userBase = null;
      data.userAttack = null;
      data.oppCounter = null;
    }
  };

  // vars and functions related to a user/opponent battle
  var battle = {

    updateHP: function() {
      // user hp decreased by whatever the opponent's counter attack power is 
      data.userHP = data.userHP - data.oppCounter;
      // each attack click, opponent's hp is decreased by the user's attach power 
      data.oppHP = data.oppHP - data.userAttack;
      //update new HP in the stored attribute on the button
      data.userChar.attr('HP', data.userHP);
      data.opponent.attr('HP', data.oppHP);
      //update the HP number in the div on screen
      browser.updateHPOnScreen();
      //see if anyone has been defeated at the new HP levels
      battle.defeatChecker();
    },

    updateUserAttackPower: function() {
      // after every attack click, the user's attack power increases by their base attack power 
      data.userAttack = parseInt(data.userAttack) + parseInt(data.userBase);
      //auto updated in attack text next attack
    },

    winBattle: function() {
        browser.refreshGame();
        //if enemies array empty, game over WIN! else battle, over continue 
        if(data.enemies.length===0){
          battle.winGame();
        } else {
          //choose new opponent
          gameState.selectOpponent = true;
          data.chooseNewOpponent();

        }
    },

    winGame: function() {
      gameState.updateGameState("winGame");
      browser.refreshGame();
    },

    chooseNewOpponent: function() {
      gameState.selectOpponent = true;
      browser.refreshGame();
      data.opponent = null; //next click will choose opponent
    },

    loseGame: function() {
      gameState.loseGame = true;
      browser.refreshGame();
    },

    //check if user or opponent defeated
    defeatChecker: function() {
      // check opponent defeated 
      if(data.opponent.attr('HP') <= 0){
        gameState.winBattle = true;
        battle.winBattle();
      }
      // user defeated if HP is ever 0 or below. 
      if(data.userChar.attr('HP') <= 0){
        battle.loseGame();
      }
    }
  };

  //browser 
  data.createCharBtns();
  // user interaction 
  data.selectCharacter();

  //event-management

  $('.attack-button').on('click', function() {
    if(!(data.opponent===null)){
      browser.refreshGame();
      battle.updateHP();
      battle.updateUserAttackPower();
    }
  });

  $('.new-game-button').on('click', function() {
    gameState.gameReset();
  });

});

// TODO: 

// any character must be able to win or lose if you pick opponents in correct order *************

// housekeeping TODOs: 

// remove any blank lines at end of file
// rewrite comments to be very clear and concise. try Brian's suggestoin of a function block comment for each 
// heroku push
// put heroku link in readme.md on github
// write gameplay instructions? 
// include jokes? 