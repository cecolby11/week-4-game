$(document).ready(function() {
  // uses backstretch jquery plugin
  $('body').backstretch('assets/images/manhattan_bw.jpg');

  var gameState = {
    'selectCharacter':false,
    'showEnemies':false,
    'opponentSelected':false,
    'winBattle':false,
    'loseBattle':false,
    'loseGame':false,
    'winGame':false,
    'resetToNewGame':false,

    launchGame: function() {
      // launch game, collect initial user input
      browser.createCharBtns();
      character.selectCharacter();
    },

    /**
    * This function updates gameState bools to reflect phase of user interaction
    * @param {string} phase - one of the vars in the gameState object, to set to 'true' (wrt the user's interaction)
    */
    updateGameState: function(phase) {
      for(var key in gameState) {
        if(typeof gameState[key] === 'boolean'){
          gameState[key] = false;
        }
      }
      gameState[phase] = true;
    },

    /**
    * This function resets everything for a new game 
    * called after a win or loss in the game
    */
    gameReset: function() {
      gameState.updateGameState("resetToNewGame");
      browser.refreshGame();

      character.resetCharacters();
      browser.resetCharBtns();
    }
  };

  var data = {
    // attributes - easily add more characters or attributes by inserting here
    'name': ['Rachel', 'Phoebe', 'Joey', 'Chandler', 'Monica', 'Ross'],
    'HP': [215,180,161,140, 160, 190],
    'attackPower': [8,5,20,23,15,9],
    'charBtnArray': []
  };

  /** object for all vars/fxns related to browser layout/display */
  var browser = {

    createCharBtns : function() {
      browser.refreshGame();

      for(var i = 0; i < data.name.length; i++) {
        var charBtn = $('<button>');
        charBtn.addClass('character-button');
        // add attributes 
        charBtn.attr('name', data.name[i]);
        charBtn.attr('HP', data.HP[i]);
        charBtn.attr('attackPower', data.attackPower[i]);
        // add to array of buttons
        data.charBtnArray.push(charBtn); 
        // add display text 
        browser.displayCharacterData(charBtn);
        //charBtn.text(charBtn.attr('name'));
        // append child to parent element so it displays
        $('.your-char-div').append(charBtn);
      }
    },

    resetCharBtns: function() {
      // 1. remove existing 
      for(var i = 0; i < data.charBtnArray.length; i++) {
        var charBtn = data.charBtnArray[i];
        charBtn.remove();
      }
      // 2. clear array
      data.charBtnArray = [];
      // 3. create 
      browser.createCharBtns();
      // add their event listeners
      character.selectCharacter();
    },

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
      var userHP = character.userChar.attr('HP');
      var oppHP = character.opponent.attr('HP');
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
        var sentence = ('You hit ' + character.oppName + ' with ' + character.userAttack + ' jokes and ' + character.oppName + ' countered with ' + character.oppCounter + '.');
      } else if(gameState.loseGame === true) {
        var sentence = 'Oh no, ' + character.oppName + ' got the most laughs! Click "Play Again" to start a new game.';
      } else if(gameState.winBattle === true) {
        var sentence = ('You defeated ' + character.oppName + '! Choose your next opponent by clicking a friend.');
      } else if(gameState.opponentSelected === true) {
        var sentence = 'Preparing for a battle of laughs. Use the "Make Jokes" button to battle ' + character.oppName + '.';
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
        // zoom **OPPONENT** button back in *after* enemy becomes opponent
        browser.isZoomedOut(character.opponent, false);
        // .opponent is new parent DIV, move to new parent/section of page
        $('.opponent-div').append(character.opponent);
        //attack button showing adds its on-click listener
        browser.showHidden('.attack-button', true);
      }
      else if (gameState.winBattle === true) {
        // remove defeated opponent 
        $('.opponent-btn').remove();
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
      else if(gameState.resetToNewGame === true){
        browser.columnResize('.user-section', 'col-md-4','col-md-12');
        browser.showHidden('.new-game-button',false);
      }
    },

    refreshGame: function() {
      browser.updateLayout();
      browser.updateBattleText();
    }
  };

  /** vars/fxns related to character creation/selection */
  var character = {
    // the user's selections
    'userChar': null,
    'enemies': [],
    'opponent': null, 

    // vars to hold current user/opponent attributes in memory during battle for faster access 
    'oppName': null,
    'userHP': null,
    'oppHP': null,
    'userBase': null, // store base user attack power 
    'userAttack': null, // dynamic user attack power, increases by base each attack 
    'oppCounter': null, // opponents counter attack power(= base)

    // player clicks one of 4 character buttons
    selectCharacter: function() {
      gameState.updateGameState("selectCharacter");
      browser.refreshGame();
      //putting this in fxn because we need to 're-call' and re-add the event listener in new game when we recreate the char buttons and assign them to the class. 
      $('.character-button').on('click', function() {
        // only set userChar once per game
        if(character.userChar===null){
          //store selected in character.userChar 
          character.userChar = $(this);
          // add class user-char
          character.userChar.addClass('user-char-btn');
          //call browser enemies
          character.addEnemies();
        } 
      });
    },

    // the others in charBtnArray stored in 'enemies'
    addEnemies: function() {
      gameState.updateGameState("revealEnemies");
      browser.refreshGame();

      for(var i = 0; i < data.charBtnArray.length; i++) {
        if(!(data.charBtnArray[i].attr('name')===character.userChar.attr('name'))){
          //add to enemies array in browser
          character.enemies.push(data.charBtnArray[i]);
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
      $('.enemy-btn').on('click', function() {
        //pick opponent one time
        if(character.opponent===null){ 
          //add to character.opponent variable
          character.opponent = $(this);
          // remove from enemies array 
           var index = character.enemies.indexOf($(this));
           character.enemies.splice(index,1);
          //add opponent class for styling change
          character.opponent.addClass('opponent-btn');
          character.opponent.removeClass('enemy-btn');
          //update all the character info in vars so we can access the attributes faster in the gameplay (battles)
          character.storeAttributes();

          gameState.updateGameState("opponentSelected");
          browser.refreshGame();
        } else {
          alert('opponent already selected!');
        }
      });
    },

    storeAttributes: function() {
      //make some vars to keep things easy to access
      this.oppName = character.opponent.attr('name');
      this.oppHP = character.opponent.attr('HP');
      this.oppCounter = character.opponent.attr('attackPower');
      // if vars aren't starting out at null, then user has already defeated at least one opponent, so don't update the user vars. 
      if(this.userAttack===null){
        //update the uservars bc beginning of game
        this.userHP = character.userChar.attr('HP');
        this.userAttack = character.userChar.attr('attackPower');
        this.userBase = character.userChar.attr('attackPower');
      }
    },

    resetCharacters: function(){
      // reset vars
      character.userChar = null;
      character.enemies = [];
      character.opponent = null;
      character.oppName = null;
      character.userHP = null;
      character.oppHP = null;
      character.userBase = null;
      character.userAttack = null;
      character.oppCounter = null;
    }
  };

  // vars and functions related to user/opponent battles (user gameplay)
  var battle = {

    updateHP: function() {
      character.userHP = character.userHP - character.oppCounter;
      character.oppHP = character.oppHP - character.userAttack;
      //update this new HP in the stored attr for each
      character.userChar.attr('HP', character.userHP);
      character.opponent.attr('HP', character.oppHP);
      //update the HP displayed in the div on screen
      browser.updateHPOnScreen();
      //check @ **new** HP levels **after** each attack/click
      battle.determineOutcome();
    },

    updateUserAttackPower: function() {
      character.userAttack = parseInt(character.userAttack) + parseInt(character.userBase);
      //increases after attack, next attack refreshes browser display so new value is accordingly displayed 
    },

    //check if user or opponent defeated
    determineOutcome: function() {
      if(character.opponent.attr('HP') <= 0){
        battle.winBattle();
      }
      if(character.userChar.attr('HP') <= 0){
        battle.loseGame();
      }
    },

    winBattle: function() {
      gameState.updateGameState("winBattle");
      browser.refreshGame();
      //game win when enemies (left) array empty 
      if(character.enemies.length===0){
        battle.winGame();
      } else {
        battle.chooseNewOpponent();
      }
    },

    winGame: function() {
      gameState.updateGameState("winGame");
      browser.refreshGame();
    },

    chooseNewOpponent: function() {
      gameState.updateGameState("selectOpponent");
      browser.refreshGame();
      character.opponent = null; //next click will choose opponent
    },

    loseGame: function() {
      gameState.updateGameState("loseGame");
      browser.refreshGame();
    }
  };

  // event management
  $('.attack-button').on('click', function() {
    if(!(character.opponent===null)){
      gameState.updateGameState("inBattle");
      browser.refreshGame();
      battle.updateHP();
      battle.updateUserAttackPower();
    }
  });

  $('.new-game-button').on('click', function() {
    gameState.gameReset();
  });

  gameState.launchGame();

});
