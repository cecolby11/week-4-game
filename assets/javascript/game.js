$(document).ready(function() {
  // uses backstretch jquery plugin
  $('body').backstretch('assets/images/manhattan_bw.jpg');

  /** object for all vars/fxns related to browser layout/display */
  var browser = {
    'userChar': null,
    'enemies': [],
    'opponent': null, 

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
      var userHP = this.userChar.attr('HP');
      var oppHP = this.opponent.attr('HP');
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
      if(textType==='attack'){
        var sentence = ('You hit ' + character.oppName + ' with ' + character.userAttack + ' jokes and ' + character.oppName + ' countered with ' + character.oppCounter + '.');
      } else if(textType==='loseGame') {
        var sentence = 'Oh no, ' + character.oppName + ' got the most laughs! Click "Play Again" to start a new game.';
      } else if(textType==='winBattle') {
        var sentence = ('You defeated ' + character.oppName + '! Choose your next opponent by clicking a friend.');
      } else if(textType==='beginGame') {
        var sentence = 'Preparing for a battle of laughs. Use the "Make Jokes" button to battle ' + character.oppName + '.';
      } else if(textType==='winGame') {
        var sentence = 'Way to go champ, could you BE any funnier? Click "Play Again" to start a new game';
      } else if(textType==='chooseCharacter') {
        var sentence = 'Choose your character! Click on a character to select.';
      } else if(textType==='chooseOpponent') {
        var sentence = 'Select your first opponent! Click on a friend to challenge them.';
      }
      // update div html 
      battleTextDiv.html(sentence);
    }, 

    /**
    * Function to update the grid/layout for gameplay before the user picks their character
    * hides enemies and opponent sections 
    */
    updateLayoutBeforeUserCharChoice: function() {
      browser.showHidden('.enemies-section', false);
      browser.showHidden('.opponent-section', false);
    },

    /**
    * Function to update the grid/layout for gameplay after the user picks their character but before they pick an opponent from the enemies
    * shows the enemies section for selection
    * hides the opponent section 
    * resizes the columns so user and enemies fit nicely side by side: user-section col-md-4, enemies col-md-8
    * ensures that enemy buttons are at normal scale and not zoomed out as they are during gameplay
    */
    updateLayoutBeforeOpponentChoice: function() {
      browser.showHidden('.opponent-section', false);
      browser.showHidden('.enemies-section', true);
      browser.columnResize('.user-section','col-md-12','col-md-4');
      browser.columnResize('.enemies-section', 'col-md-4','col-md-8');
      browser.isZoomedOut('.enemy-btn', false);
    },

    /**
    * Function to update the grid/layout for gameplay after the user picks an opponent 
    * resizes the columns so user, opponent, and enemies fit nicely side by side in that order: user-section col-md-4, opponent col-md-4, enemies col-md-4
    * scales down the enemies buttons to 50% size using 'zoom' 
    * ensures opponent section is now showing so opponent can be displayed for battle
    */
    updateLayoutAfterOpponentChoice: function() {
      browser.columnResize('.user-section','col-md-12','col-md-4');
      browser.columnResize('.enemies-section','col-md-8','col-md-4');
      browser.isZoomedOut('.enemy-btn',true);
      browser.showHidden('.opponent-section', true);
    },

    /**
    * Function to update the grid/layout for new game
    * called after a win or loss in the game
    * resizes the columns so user extends col-md-12 since it now holds all char-btns for display. 
    */
    gameResetLayout: function() {
      browser.columnResize('.user-section', 'col-md-4','col-md-12');
    },

    /**
    * This function resets everything for a new game 
    * resets variables to null or empty
    * removes and recreates character buttons (cleaner than removing classes, resetting attributes, etc. and leaves potential for adding new characters each level, etc. in the future)
    * initiates new gameplay by adding event listener to char btns and waiting for user action. 
    * called after a win or loss in the game
    */
    gameReset: function() {
      // reset layout
      browser.gameResetLayout();
      // reset vars
      this.userChar = null;
      this.enemies = [];
      this.opponent = null;
      character.oppName = null;
      character.userHP = null;
      character.oppHP = null;
      character.userBase = null;
      character.userAttack = null;
      character.oppCounter = null;
      // regenerate charBtns 
      // 1. remove existing 
      for(var i = 0; i < character.charBtnArray.length; i++) {
        var charBtn = character.charBtnArray[i];
        charBtn.remove();
      }
      // 2. clear array
      character.charBtnArray = [];
      // 3. create 
      character.createCharBtns();
      // add their event listeners
      character.selectCharacter();
      // hide the play again button
      browser.showHidden('.new-game-button',false);
      // change to new game text
      browser.updateBattleText('chooseCharacter');
    }
  };

  /** object for all gameplay vars/fxns related to character creation/selection */
  var character = {
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
      browser.updateLayoutBeforeUserCharChoice();
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

    // player clicks one of 4 character buttons
    selectCharacter: function() {
      //putting this in fxn because we need to 're-call' and re-add the event listener in new game when we recreate the char buttons and assign them to the class. 
      $('.character-button').on('click', function() {
        // only set userChar once per game
        if(browser.userChar===null){
          //store selected in browser.userChar 
          browser.userChar = $(this);
          // add class user-char
          browser.userChar.addClass('user-char-btn');
          //call browser enemies
          character.addEnemies();
        } 
      });
    },

    // the others in charBtnArray stored in 'enemies'
    addEnemies: function() {
      browser.updateLayoutBeforeOpponentChoice();

      for(var i = 0; i < character.charBtnArray.length; i++) {
        if(!(character.charBtnArray[i].attr('name')===browser.userChar.attr('name'))){
          //add to enemies array in browser
          browser.enemies.push(character.charBtnArray[i]);
          // add enemy class to charBtns for styling change
          character.charBtnArray[i].addClass('enemy-btn');
          // .enemies is new parent DIV, move to new section of page. 
          $('.enemies-div').append(character.charBtnArray[i]);
          browser.updateBattleText('chooseOpponent');
        }
      }
      this.selectOpponent();
    },

    //player clicks an enemy and they move into the 'opponent' section
    selectOpponent: function() {
      $('.enemy-btn').on('click', function() {
        browser.updateLayoutAfterOpponentChoice();
        //pick opponent one time
        if(browser.opponent===null){
          //add to browser.opponent variable
          browser.opponent = $(this);
          
          // remove from enemies array 
           var index = browser.enemies.indexOf($(this));
           browser.enemies.splice(index,1);
          //add opponent class for styling change
          browser.opponent.addClass('opponent-btn');
          browser.opponent.removeClass('enemy-btn');
          // zoom OPPONENT button back in *after* enemy becomes opponent
          browser.isZoomedOut(browser.opponent, false);
         
          // .opponent is new parent DIV, move to new parent/section of page
          $('.opponent-div').append(browser.opponent);
          //update all the character info in vars so we can access the attributes faster in the gameplay (battles)
          character.storeAttributes();
          //show attack button, get ready to fight! 
          //attack button showing means it's on-click is active, similar to calling a 'launch attack fxn here'
          browser.showHidden('.attack-button', true);
          browser.updateBattleText('beginGame');  
        } else {
          alert('opponent already selected!');
        }
      });
    },

    storeAttributes: function() {
      //make some vars to keep things easy to access
      this.oppName = browser.opponent.attr('name');
      this.oppHP = browser.opponent.attr('HP');
      this.oppCounter = browser.opponent.attr('attackPower');
      // if vars aren't starting out at null, then user has already defeated at least one opponent, so don't update the user vars. 
      if(this.userAttack===null){
        //update the uservars bc beginning of game
        this.userHP = browser.userChar.attr('HP');
        this.userAttack = browser.userChar.attr('attackPower');
        this.userBase = browser.userChar.attr('attackPower');
      }
    }
  };

  // vars and functions related to a user/opponent battle
  var battle = {

    updateHP: function() {
      // user hp decreased by whatever the opponent's counter attack power is 
      character.userHP = character.userHP - character.oppCounter;
      // each attack click, opponent's hp is decreased by the user's attach power 
      character.oppHP = character.oppHP - character.userAttack;
      //update new HP in the stored attribute on the button
      browser.userChar.attr('HP', character.userHP);
      browser.opponent.attr('HP', character.oppHP);
      //update the HP number in the div on screen
      browser.updateHPOnScreen();
      //see if anyone has been defeated at the new HP levels
      battle.defeatChecker();
    },

    updateUserAttackPower: function() {
      // after every attack click, the user's attack power increases by their base attack power 
      character.userAttack = parseInt(character.userAttack) + parseInt(character.userBase);
      //auto updated in attack text next attack
    },

    //check if user or opponent defeated
    defeatChecker: function() {
      // check opponent defeated 
      if(browser.opponent.attr('HP') <= 0){
        // remove defeated opponent button element! 
        $('.opponent-btn').remove();
        //hide attack button so it can't be clicked (character.selectOpponent will show attack button again)
        browser.showHidden('.attack-button', false);

        //if enemies array empty, game over WIN! else battle, over continue 
        if(browser.enemies.length===0){
          browser.updateBattleText('winGame');
          browser.showHidden('.new-game-button', true);
        } else {
          // show success text (choose a new opponent)
          browser.updateBattleText('winBattle');
          // set browser.opponent = null so character.selectOpponent() triggers selection of a new one (using .enemy onclick) 
          browser.updateLayoutBeforeOpponentChoice();
          browser.opponent = null;
        }
      }
      // user defeated if HP is ever 0 or below. 
      if(browser.userChar.attr('HP') <= 0){
        // show defeat text
        browser.updateBattleText('loseGame');
        //hide attack button 
        browser.showHidden('.attack-button', false);
        // show 'try again' button which calls some function
        browser.showHidden('.new-game-button', true);
      }
    }
  };

  //browser 
  character.createCharBtns();
  // user interaction 
  character.selectCharacter();

  //event-management

  $('.attack-button').on('click', function() {
    if(!(browser.opponent===null)){
      browser.updateBattleText('attack');
      battle.updateHP();
      battle.updateUserAttackPower();
    }
  });

  $('.new-game-button').on('click', function() {
    browser.gameReset();
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