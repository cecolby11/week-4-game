// wrap in document ready bc jquery
$(document).ready(function() {

  //vars and functions realted to general browser display/setup 
  var browser = {
    "userChar": null,
    "enemies": [],
    "defender": null, 

    showBtn: function(buttonClass, shouldShow) {
      var button = $(buttonClass);
      if (shouldShow===true) {
        button.css("display","block");
      }
      else {
        button.css("display", "none");
      }
    },

    displayData: function(buttonSelector) {
      //name div
      var tempDiv = $("<div>" + buttonSelector.attr("name") + "</div>");
      tempDiv.addClass("char-name");
      //health points div
      var tempDiv2 = $("<div>" + "Hilarity Points: " + buttonSelector.attr("healthPoints") + "</div>");
      tempDiv2.addClass("char-hp");
      //image div
      var charImgName = buttonSelector.attr("name") + ".jpg";
      console.log(charImgName);
      var tempDiv3 = $("<img src='assets/images/" + charImgName + "' alt='character thumbnail'>");
      tempDiv3.addClass("thumbnail char-thumbnail");
      buttonSelector.append(tempDiv, tempDiv2, tempDiv3);
    },

    updateHPOnScreen: function() {
      var userHP = this.userChar.attr("healthPoints");
      var defHP = this.defender.attr("healthPoints");
      $(".user-char-btn .char-hp").html("Hilarity Points: " + userHP);
      $(".defender-btn .char-hp").html("Hilarity Points: " + defHP);
    }, 

    updateBattleText: function(textType) {
      var battleTextDiv = $(".battle-text");
      //choose the corresponding text content
      if(textType==="attack"){
        var sentence = ("You hit " + character.defName + " with " + character.userAttack + " jokes and " + character.defName + " countered with " + character.defCounter + ".");
      } else if(textType==="loseGame") {
        var sentence = "Oh no, " + character.defName + " is funnier than you! Click 'Play Again' to start a new game.";
      } else if(textType==="winBattle") {
        var sentence = ("You defeated " + character.defName + "! Choose your next opponent by clicking a FRIEND.");
      } else if(textType==="beginGame") {
        var sentence = "Preparing for a battle of laughs. Use the 'Make Jokes' button to battle " + character.defName + ".";
      } else if(textType==="winGame") {
        var sentence = "Way to go champ, could you BE any funnier? Click 'Play Again' to start a new game";
      } else if(textType==="chooseCharacter") {
        var sentence = "Choose your character! Click on a character to select."
      } else if(textType==="chooseDefender") {
        var sentence = "Select your first opponent! Click on an enemy to challenge them."
      }
      // update the content in the div with the selected text
      battleTextDiv.html(sentence);
    }, 

    gameReset: function() {
      //reset vars
      this.userChar = null;
      this.enemies = [];
      this.defender = null;
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
      browser.showBtn(".new-game-button",false);
      // change to new game text
      browser.updateBattleText("chooseCharacter");
    }
  };

  // vars and functions related to character creation/selection 
  var character = {
    "name": ["Rachel", "Phoebe", "Joey", "Chandler"],
    "healthPoints": [120,100,150,180],
    "attackPower": [8, 5, 20, 25],
    "charBtnArray": [],

    "defName": null,
    "userHP": null,
    "defHP": null,
    "userBase": null, // base attack power for user
    "userAttack": null,
    "defCounter": null,

    createCharBtns : function() {
      for(var i = 0; i < this.name.length; i++) {
        var charBtn = $("<button>");
        charBtn.addClass("character-button");
        // add attributes 
        charBtn.attr("name", this.name[i]);
        charBtn.attr("healthPoints", this.healthPoints[i]);
        charBtn.attr("attackPower", this.attackPower[i]);
        // add to array of buttons
        this.charBtnArray.push(charBtn); 
        // add display text 
        browser.displayData(charBtn);
        //charBtn.text(charBtn.attr("name"));
        // append child to parent element so it displays
        $(".your-char-div").append(charBtn);
      }
    },

    // player clicks one of 4 character buttons
    selectCharacter: function() {
      //putting this in fxn because we need to "re-call" and re-add the event listener in new game when we recreate the char buttons and assign them to the class. 
      $(".character-button").on("click", function() {
        // only set userChar once per game
        if(browser.userChar===null){
          //store selected in browser.userChar 
          browser.userChar = $(this);
          // add class user-char
          browser.userChar.addClass("user-char-btn");
          //call browser enemies
          character.addEnemies();
        } else {
          console.log("user character already selected!")
        }
      });
    },

    // the others in charBtnArray stored in "enemies"
    addEnemies: function() {
      for(var i = 0; i < character.charBtnArray.length; i++) {
        if(!(character.charBtnArray[i].attr("name")===browser.userChar.attr("name"))){
          //add to enemies array in browser
          browser.enemies.push(character.charBtnArray[i]);
          // add enemy class to charBtns for styling change
          character.charBtnArray[i].addClass("enemy-btn");
          // .enemies is new parent DIV, move to new section of page. 
          $(".enemies-div").append(character.charBtnArray[i]);
          browser.updateBattleText("chooseDefender");
        }
      }
      this.selectDefender();
    },

    //player clicks an enemy and they move into the "defender" section
    selectDefender: function() {
      $(".enemy-btn").on("click", function() {
        //pick defender one time 
        // if(browser.enemies === []) {
        //   console.log("no enemies left, put code here to end game");
        // }
        if(browser.defender===null){
          //add to browser.defender 
          browser.defender = $(this);
          // remove from enemies array
           var index = browser.enemies.indexOf($(this));
           browser.enemies.splice(index,1);
          //add defender class for styling change
          browser.defender.addClass("defender-btn");
          // .defender is new parent DIV, move to new parent/section of page
          $(".defender-div").append(browser.defender);
          //update all the character info in vars so we can access the attributes faster in the gameplay (battles)
          character.storeAttributes();
          //show attack button, get ready to fight! 
          //attack button showing means it's on-click is active, similar to calling a "launch attack fxn here"
          //add attack button div into user-char-btn parent
          $(".attack-button-div").appendTo($(".user-char-btn"));
          browser.showBtn(".attack-button", true);
          browser.updateBattleText("beginGame");  
        } else {
          console.log("defender already selected!")
        }
      });
    },

    storeAttributes: function() {
      //make some vars to keep things easy to access
      this.defName = browser.defender.attr("name");
      this.defHP = browser.defender.attr("healthPoints");
      this.defCounter = browser.defender.attr("attackPower");
      // if vars aren't starting out at null, then user has already defeated at least one defender, so don't update the user vars. 
      if(this.userAttack===null){
        //update the uservars bc beginning of game
        console.log("gamestart, storing user attributes");
        this.userHP = browser.userChar.attr("healthPoints");
        this.userAttack = browser.userChar.attr("attackPower");
        this.userBase = browser.userChar.attr("attackPower");
      }
    }
  };

  // vars and functions related to a user/defender battle
  var battle = {

    updateHealthPoints: function() {
      // user hp decreased by whatever the opponent's counter attack power is 
      character.userHP = character.userHP - character.defCounter;
      // each attack click, opponent's hp is decreased by the user's attach power 
      character.defHP = character.defHP - character.userAttack;
      //update new HP in the stored attribute on the button
      browser.userChar.attr("healthPoints", character.userHP);
      browser.defender.attr("healthPoints", character.defHP);
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

    //check if user or defender defeated
    defeatChecker: function() {
      // check defender defeated first
      if(browser.defender.attr("healthPoints") <= 0){
        // remove defeated defender button element! 
        $(".defender-btn").remove();
        //hide attack button so it can't be clicked (character.selectdefender will show attack button again)
        browser.showBtn(".attack-button", false);

        //if enemies array empty, game over WIN! else battle, over continue 
        if(browser.enemies.length===0){
          browser.updateBattleText("winGame");
          browser.showBtn(".new-game-button", true);
        } else {
          // show success text (choose a new defender)
          browser.updateBattleText("winBattle");
          // set browser.defender = null so character.selectDefender() triggers selection of a new one (using .enemy onclick) 
          browser.defender = null;
        }
      }
      // user defeated
      if(browser.userChar.attr("healthPoints") <= 0){
        // show defeat text
        browser.updateBattleText("loseGame");
        //hide attack button 
        browser.showBtn(".attack-button", false);
        // show 'try again' button which calls some function
        browser.showBtn(".new-game-button", true);
      }
    }
  };

  //browser 
  character.createCharBtns();
  // user interaction 
  character.selectCharacter();

  //event-management

  $(".attack-button").on("click", function() {
    if(!(browser.defender===null)){
      browser.updateBattleText("attack");
      battle.updateHealthPoints();
      battle.updateUserAttackPower();
    }
  });

  $(".new-game-button").on("click", function() {
    browser.gameReset();
  });

// TODO: 

// any character must be able to win or lose if you pick opponents in correct order 

//footer and stuff at bottom of page (especially after all enemies disappear and its blank)

});


// Final housekeeping TODOs: 

//check for semicolons
// remove any blank lines at end of file
// remove console.logs 
//single quotes instead of double? 
// rewrite comments to be very clear and concise. try Brian's suggestoin of a function block comment for each 
// heroku repo
// replace health points with hilarity points in code, make the jokes stuff clearer in the code language instaed of attack/battle? 
