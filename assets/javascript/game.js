// wrap in document ready bc jquery
$(document).ready(function() {

// game begins
  var setup = {
    "userChar": null,
    "enemies": [],
    "defender": null, 

    showBtn : function(buttonClass) {
      var attackBtn = $(buttonClass);
      attackBtn.css("display","block")
    },

    displayData : function(buttonSelector) {
      var tempDiv = $("<div>" + buttonSelector.attr("healthPoints") + "</div>");
      tempDiv.addClass("char-hp");
      var tempDiv2 = $("<div>" + buttonSelector.attr("name") + "</div>");
      tempDiv2.addClass("char-name");
      buttonSelector.append(tempDiv2, tempDiv);
    }
  };

  var character = {
    "name": ["Rachel", "Phoebe", "Chandler", "Joey"],
    "healthPoints": [120,100,150,180],
    "attackPower": [8, 5, 20, 25],
    "charBtnArray": [],

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
        setup.displayData(charBtn);
        //charBtn.text(charBtn.attr("name"));
        // append child to parent element so it displays
        $(".your-char-div").append(charBtn)
      }
    }
  };

  var gameplay = {

    // player clicks one of 4 character buttons
    selectCharacter: function() {
      $(".character-button").on("click", function() {
        // only set userChar once per game
        if(setup.userChar===null){
          //store selected in setup.userChar 
          setup.userChar = $(this);
          // add class user-char
          setup.userChar.addClass("user-char-btn");
          //call setup enemies
          gameplay.addEnemies();
        } else {
          console.log("character already selected!")
        }
      });
    },

    // the others in charBtnArray stored in "enemies"
    addEnemies: function() {
      for(var i = 0; i < character.charBtnArray.length; i++) {
        if(!(character.charBtnArray[i].attr("name")===setup.userChar.attr("name"))){
          //add to enemies array in setup
          setup.enemies.push(character.charBtnArray[i]);
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
        if(setup.defender===null){
          //add to setup.defender 
          setup.defender = $(this);
          console.log("defender chosen: " + (setup.defender).attr("name"));
          //add defender class for styling change
          setup.defender.addClass("defender-btn");
          // .defender is new parent DIV, move to new parent/section of page
          $(".defender-div").append(setup.defender);
          //show attack button, get ready to fight! 
          setup.showBtn(".attack-button");
          battle.attackDefender();
        } else {
          console.log("defender already selected!")
        }
      });
    }
  };

  var battle = {
    "defName": null,
    "userHP": null,
    "defHP": null,
    "userAttack": null,
    "defCounter": null,

    updateBattleText: function() {
      var sentence1 = ("You attacked " + this.defName + " with " + this.userAttack);
      var sentence2 = (this.defName + " countered with " + this.defCounter);
      var battleTextDiv = $(".battle-text");
      battleTextDiv.html(sentence1 + " and " + sentence2);
    },

    updateHealthPoints: function() {
      this.userHP = this.userHP - this.defCounter;
      //update new userChar HP in the stored attribute
      setup.userChar.attr("healthPoints", this.userHP);
      //TODO update the HP number in the div on screen
    },

    attackDefender: function() {
      //update with the values 
      this.defName = setup.defender.attr("name");
      this.userHP = setup.userChar.attr("healthPoints");
      this.defHP = setup.defender.attr("healthPoints");
      this.userAttack = setup.userChar.attr("attackPower");
      this.defCounter = setup.defender.attr("attackPower");

      $(".attack-button").on("click", function() {
        battle.updateBattleText();
        battle.updateHealthPoints();
      });

    }

  };

  //setup 
  character.createCharBtns();
  // user interaction 
  gameplay.selectCharacter();

 

// each time they click, their hp are decreased by whatever the opponent's counter attack power is 

// each attack click, opponent's hp is decreased by the user's attach power 

// after every attack click, the user's attack power increases by their base attack power 

//opponent 'defeated' and disappars if their hp gets to 0 or less --> set setup.defender to null so when enemies clicked it will pick a new defender! 

//player can click on a new character and they go from enemies to defender. now attacks are against them. 

// game over if users hp gets to 0 or less

// game over if all opponents are defeated

// when game ends, user can hit button to play again and start over

// any character must be able to win or lose if you pick opponents in correct order 

});

// TODO: 

// make divs to display name, hp, etc.displaying just name for now. 
