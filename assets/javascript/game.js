// wrap in document ready bc jquery
$(document).ready(function() {

// game begins
  var setup = {
    "userChar": null,
    "enemies": [],
    "defender": []
  };

  var character = {
    "name": ["bob", "joe", "moe", "peter"],
    "healthPoints": [120,100,150,180],
    "attackPower": [8, 5, 20,25],
    "counterAttackPower": [8,5,20,25],
    "charBtnArray": [],

    createCharBtn : function() {
      for(var i = 0; i < this.name.length; i++) {
        var charBtn = $("<button>");
        charBtn.addClass("character-button");
        // add attributes 
        charBtn.attr("name", this.name[i]);
        charBtn.attr("healthPoints", this.healthPoints[i]);
        charBtn.attr("attackPower", this.attackPower[i]);
        charBtn.attr("counterAttackPower", this.counterAttackPower[i]);
        this.charBtnArray.push(charBtn); // add to array
        // add display elements
        charBtn.text(charBtn.attr("name"));
        // append child to parent element so it displays
        $(".your-character").append(charBtn)
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
          setup.userChar.addClass("user-char");
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
          setup.enemies.push(character.charBtnArray[i]);
          // add enemy class 
          character.charBtnArray[i].addClass("enemy");
        }
      }
    }

  };

  //setup 
  character.createCharBtn();
  // user interaction 
  gameplay.selectCharacter();





//player clicks an enemy and they move into the "defender" section 

// player can now click the "attack" button 

// each time they click, their hp are decreased by whatever the opponent's counter attack power is 

// each attack click, opponent's hp is decreased by the user's attach power 

// after every attack click, the user's attack power increases by their base attack power 

//opponent 'defeated' and disappars if their hp gets to 0 or less

//player can click on a new character and they go from enemies to defender. now attacks are against them. 

// game over if users hp gets to 0 or less

// game over if all opponents are defeated

// when game ends, user can hit button to play again and start over

// any character must be able to win or lose if you pick opponents in correct order 

});

// TODO: 

// make divs to display name, hp, etc.displaying just name for now. 