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
    * Function to display attributes in the char-btns
    * @param {string} buttonSelector - a jQuery selector (in this application, a button) designated as the parent of the data-display divs created
    * displays 'name' and 'HP' attributes and the corresponding image in the assets, 'name'.jpg
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

    updateHPOnScreen: function() {
      var userHP = this.userChar.attr('HP');
      var defHP = this.opponent.attr('HP');
      $('.user-char-btn .char-hp').html('Hilarity: ' + userHP);
      $('.opponent-btn .char-hp').html('Hilarity: ' + defHP);
    }, 

    updateBattleText: function(textType) {
      var battleTextDiv = $('.battle-text');
      //choose the corresponding text content
      if(textType==='attack'){
        var sentence = ('You hit ' + character.defName + ' with ' + character.userAttack + ' jokes and ' + character.defName + ' countered with ' + character.defCounter + '.');
      } else if(textType==='loseGame') {
        var sentence = 'Oh no, ' + character.defName + ' got the most laughs! Click "Play Again" to start a new game.';
      } else if(textType==='winBattle') {
        var sentence = ('You defeated ' + character.defName + '! Choose your next opponent by clicking a friend.');
      } else if(textType==='beginGame') {
        var sentence = 'Preparing for a battle of laughs. Use the "Make Jokes" button to battle ' + character.defName + '.';
      } else if(textType==='winGame') {
        var sentence = 'Way to go champ, could you BE any funnier? Click "Play Again" to start a new game';
      } else if(textType==='chooseCharacter') {
        var sentence = 'Choose your character! Click on a character to select.';
      } else if(textType==='chooseOpponent') {
        var sentence = 'Select your first opponent! Click on a friend to challenge them.';
      }
      // update the content in the div with the selected text
      battleTextDiv.html(sentence);
    }, 

    updateLayoutBeforeUserCharChoice: function() {
      //hide enemies/opponent areas/headers until relevant
      browser.showHidden('.enemies-section', false);
      browser.showHidden('.opponent-section', false);
    },

    updateLayoutBeforeOpponentChoice: function() {
      //show enemies section, hide opponent section! 
      browser.showHidden('.opponent-section', false);
      browser.showHidden('.enemies-section', true);
      //resize columns: user-4, opp-hidden, enemies-8
      browser.columnResize('.user-section','col-md-12','col-md-4');
      browser.columnResize('.enemies-section', 'col-md-4','col-md-8');
    },
    updateLayoutAfterOpponentChoice: function() {
      //change page arrangement so opponent fits next to userChar
      // user-4, opp-4, enemies-4 zoomed down
      browser.columnResize('.user-section','col-md-12','col-md-4');
      browser.columnResize('.enemies-section','col-md-8','col-md-4');
      browser.isZoomedOut('.enemy-btn',true);

    },
    gameResetLayout: function() {
      browser.columnResize('.user-section', 'col-md-4','col-md-12');
    },

    gameReset: function() {
      browser.gameResetLayout();
      //reset vars
      this.userChar = null;
      this.enemies = [];
      this.opponent = null;
      character.defName = null;
      character.userHP = null;
      character.defHP = null;
      character.userBase = null;
      character.userAttack = null;
      character.defCounter = null;
      // remove and recreate charBtns (fastest) 
      for(var i = 0; i < character.charBtnArray.length; i++) {
        var charBtn = character.charBtnArray[i];
        charBtn.remove();
      }
      // clear array
      character.charBtnArray = [];
      character.createCharBtns();
      // re-add the .character-button event listeners
      character.selectCharacter();
      // hide the play again button
      browser.showHidden('.new-game-button',false);
      // change to new game text
      browser.updateBattleText('chooseCharacter');
    }
  };

  // vars and functions related to character creation/selection 
  var character = {
    'name': ['Rachel', 'Phoebe', 'Joey', 'Chandler'],
    'HP': [120,100,90,100],
    'attackPower': [9,7,18,14],
    'charBtnArray': [],

    'defName': null,
    'userHP': null,
    'defHP': null,
    'userBase': null, // base attack power for user
    'userAttack': null,
    'defCounter': null,

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
          //show opponent section
          browser.showHidden('.opponent-section', true);
          // remove from enemies array 
           var index = browser.enemies.indexOf($(this));
           browser.enemies.splice(index,1);
          //add opponent class for styling change
          browser.opponent.addClass('opponent-btn');
          browser.opponent.removeClass('enemy-btn');
          // zoom back in once enemy becomes opponent
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
      this.defName = browser.opponent.attr('name');
      this.defHP = browser.opponent.attr('HP');
      this.defCounter = browser.opponent.attr('attackPower');
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
      character.userHP = character.userHP - character.defCounter;
      // each attack click, opponent's hp is decreased by the user's attach power 
      character.defHP = character.defHP - character.userAttack;
      //update new HP in the stored attribute on the button
      browser.userChar.attr('HP', character.userHP);
      browser.opponent.attr('HP', character.defHP);
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
      // user defeated if HP is ever 0 or below. 
      if(browser.userChar.attr('HP') <= 0){
        // show defeat text
        browser.updateBattleText('loseGame');
        //hide attack button 
        browser.showHidden('.attack-button', false);
        // show 'try again' button which calls some function
        browser.showHidden('.new-game-button', true);
      }
      // check opponent defeated 
      else if(browser.opponent.attr('HP') <= 0){
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
          browser.isZoomedOut('.enemy-btn', false);
          browser.updateLayoutBeforeOpponentChoice();
          browser.opponent = null;
        }
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
// heroku repo
// put heroku link in readme.md on github