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
      var tempDiv = $("<div>" + buttonSelector.attr("healthPoints") + "</div>");
      tempDiv.addClass("char-hp");
      var tempDiv2 = $("<div>" + buttonSelector.attr("name") + "</div>");
      tempDiv2.addClass("char-name");
      buttonSelector.append(tempDiv2, tempDiv);
    },

    updateHPOnScreen: function() {
      var userHP = this.userChar.attr("healthPoints");
      var defHP = this.defender.attr("healthPoints");
      $(".user-char-btn .char-hp").html(userHP);
      $(".defender-btn .char-hp").html(defHP);
    }, 

    updateBattleText: function(textType) {
      var battleTextDiv = $(".battle-text");
      //choose the corresponding text content
      if(textType==="attack"){
        var sentence = ("You attacked " + character.defName + " with " + character.userAttack + " and " + character.defName + " countered with " + character.defCounter + ".");
      } else if(textType==="loseGame") {
        var sentence = "Oh no, you've been defeated! Click 'Play Again' to start a new game.";
      } else if(textType==="winBattle") {
        var sentence = ("You defeated " + character.defName + "! Choose your next opponent by clicking an enemy.");
      } else if(textType==="beginGame") {
        var sentence = "Preparing to battle opponent. Use the attack button to battle " + character.defName + ".";
      } else if(textType==="winGame") {
        var sentence = "Way to go, you are the ultimate champion! Click 'Play Again' to start a new game";
      }
      // update the content in the div with the selected text
      battleTextDiv.html(sentence);
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
        $(".your-char-div").append(charBtn)
      }
    },

    // player clicks one of 4 character buttons
    selectCharacter: function() {
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
          // var index = browser.enemies.indexOf($(this));
          // browser.enemies.splice(index,1);
          //add defender class for styling change
          browser.defender.addClass("defender-btn");
          // .defender is new parent DIV, move to new parent/section of page
          $(".defender-div").append(browser.defender);
          //update all the character info in vars so we can access the attributes faster in the gameplay (battles)
          character.storeAttributes();
          //show attack button, get ready to fight! 
          //attack button showing means it's on-click is active, similar to calling a "launch attack fxn here"
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
      this.userHP = browser.userChar.attr("healthPoints");
      this.defHP = browser.defender.attr("healthPoints");
      this.userAttack = browser.userChar.attr("attackPower");
      this.defCounter = browser.defender.attr("attackPower");
    }
  };

  // vars and functions related to a user/defender battle
  var battle = {

    updateHealthPoints: function() {
      console.log("running updatehealthpoints");
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
      character.userAttack = parseInt(character.userAttack) + parseInt(character.userAttack);
      //auto updated in attack text next attack
    },

    attackDefender: function() {
      // Do not allow to attach the same event twice (since we will be calling this anew with each new defender and don't want to reattach)
      console.log("empty function loll");
    },

    //check if user or defender defeated
    defeatChecker: function() {
      // user defeated
      if(browser.userChar.attr("healthPoints") <= 0){
        console.log("you lose!");
        // show defeat text
        browser.updateBattleText("loseGame");
        //hide attack button 
        browser.showBtn(".attack-button", false);
        // show 'try again' button which calls some function
        browser.showBtn(".new-game-button", true);
      } 
      // defender defeated
      else if(browser.defender.attr("healthPoints") <= 0){
        console.log("defeated defender!")
        // remove defeated defender button element! 
        $(".defender-btn").remove();
        //hide attack button so it can't be clicked (character.selectdefender will show attack button again)
        browser.showBtn(".attack-button", false);
        // show success text (choose a new defender)
        browser.updateBattleText("winBattle");
        // set browser.defender = null so character.selectDefender() triggers selection of a new one (using .enemy onclick)
        browser.defender = null;
      }
    }
  };

  //browser 
  character.createCharBtns();
  // user interaction 
  character.selectCharacter();

  //event management
  $(".attack-button").on("click", function() {
    if(!(browser.defender===null)){
      browser.updateBattleText("attack");
      console.log("attack was clicked once");
      battle.updateHealthPoints();
      battle.updateUserAttackPower();
    } else {
    console.log("houston we have no defender");
    }
  });

// TODO: 

//remove defender from enemies array when defeated
// when enemies array is empty, then game over Win! 

//Try again button onclick --> newgame function 
    // resets everything 
// game over if users hp gets to 0 or less
// game over if all opponents are defeated

// attack power for userChar shouldn't reset between opponents, it should stay increased from the previous.

// make divs to display name, hp, etc.displaying just name for now.  

// any character must be able to win or lose if you pick opponents in correct order 

});


// Final housekeeping TODOs: 

//check for semicolons
// remove any blank lines at end of file
// remove console.logs 
// rewrite comments to be very clear and concise. try Brian's suggestoin of a function block comment for each 
// heroku repo