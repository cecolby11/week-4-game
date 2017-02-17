// wrap in document ready bc jquery
$(document).ready(function() {

// game begins
  var gameState = {
    "userChar": "",
    "enemies": [],
    "defender": []
  };

  var character = {
    "name": ["bob", "joe", "moe", "peter"],
    "healthPoints": [120,100,150,180],
    "attackPower": [8, 5, 20,25],
    "counterAttackPower": [8,5,20,25],
    "charBtnArray": []
  };
  // var charBtn = $("<button>");
  // charBtn.addClass("character-button");
  // $(".your-character").append(charBtn);
  // console.log("done");

  // for each char in array 
  for(var i = 0; i < character.name.length; i++) {
    //create a variable named charButton, create a button item,and add the class character-button
    var charBtn = $("<button>");
    charBtn.addClass("character-button");
    charBtn.attr("name", character.name[i]);
    charBtn.attr("healthPoints", character.healthPoints[i]);
    charBtn.attr("attackPower", character.attackPower[i]);
    charBtn.attr("counterAttackPower", character.counterAttackPower[i]);
    character.charBtnArray.push(charBtn); // add to array
    console.log(character.charBtnArray);

    // TODO: make divs to display name, hp, etc.displaying just name for now. 
    charBtn.text(charBtn.attr("name"));

    // append to your-character div 
    $(".your-character").append(charBtn);
    ;
  }

// player clicks one of 4 character buttons
  $(".character-button").on("click", function() {
    // that becomes "their character"
    //add it to gamestate.userChar 
    gameState.userChar = $(this);
    console.log((gameState.userChar).attr("name"));
    //remove from char btn array? 
    // the other 3 buttons move into the "enemies" section 
    // add them to gameState.enemies


  })

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