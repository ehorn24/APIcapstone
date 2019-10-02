function initSearch() {
  // show options
  $("main").show();
  $(".restart").hide();
  // hide search bar
  $("#searchDrink").hide();
  $("#searchIngredient").hide();
  //hide drink picker form
  $("#drinkPickerForm").hide();
  $(".resultsPage").hide();
  $(".resultsContainer").hide();
  $(".recipePage").hide();
  $(".similarDrinks").hide();
}

//SEARCHING BY DRINK NAME

//when user clicks "I know what drink I want"
function searchDrink(e) {
  e.preventDefault();
  $("main").hide();
  $(".restart").show();
  $("#searchDrink").show();
  // stop header from repeating
  $("h4").empty();
  //add header above search bar
  $("#searchDrink").prepend("<h4 class='searchHeader'>We love a person who knows what they want.</h4>");
  //change placeholder text for name
  $("input:text").attr("placeholder", "Search by drink name...");
}

//after user types in drink name & clicks search
function findByName(e) {
  e.preventDefault();
  $("#searchDrink").hide();
  $(".resultsPage").show();
  $(".resultsContainer")
    .show()
    .empty();
  $(".similarDrinks").show();
  //get search value
  const name = $("#searchName").val();
  //insert search query into header
  $(".resultsHeader").text(`Results for "${name}"`);
  //check if the search query is more than 1 word, call JSON for drink name
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + name.replace(/(\s)/g, "_"), function(res) {
    // for each drink, show name and photo
    res.drinks.forEach(function(drink) {
      $(".resultsContainer").append(`<div class="drinkResult"><img src="${drink.strDrinkThumb}" alt="photo of drink" class="thumbnail"><br><p class="getRecipe">${drink.strDrink}</p></div>`);
    });
    $(".drinkResult").click(showRecipe);
  });
  //.fail(function() {
  //$(".resultsPage").append("<p class='error'>Sorry, we couldn't find any drinks with that name. Check the spelling or try another search.</p>");
  //}); $(".drinkResult").click(showRecipe);
}

//SEARCHING BY INGREDIENT

//when user clicks "i have an ingredient I want to use"
function searchIngredient(e) {
  e.preventDefault();
  $("main").hide();
  $(".restart").show();
  $("#searchIngredient").show();
  //stop header from repeating
  $("h4").empty();
  //add header above search bar
  $("#searchIngredient").prepend("<h4 class='searchHeader'>Let's put that random ingredient you never use, to use.</h4>");
  //change placeholder text for ingredient
  $("input:text").attr("placeholder", "Search by ingredient...");
}

//after user types in ingredient and clicks search
function findByIngredient(e) {
  e.preventDefault();
  $("#searchIngredient").hide();
  $(".resultsPage").show();
  $(".resultsContainer")
    .show()
    .empty();
  $(".similarDrinks").show();
  //get search value
  const ingredient = $("#ingredientSearch").val();
  $(".resultsHeader").text(`Results for "${ingredient}"`);
  //check if the search query is more than 1 word, call JSON for the ingredient
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient.replace(/(\s)/g, "_"), function(res) {
    // for each drink, show name and photo
    res.drinks.forEach(function(drink) {
      $(".resultsContainer").append(`<div class="drinkResult"><img src="${drink.strDrinkThumb}" alt="photo of drink" class="thumbnail"><br><p><span class="getRecipeName">${drink.strDrink}</span></p></div>`);
    });
    $(".drinkResult").click(showRecipe);
  });
}

//DRINK PICKER

//when user clicks "I need help finding a drink today"
function initDrinkFinder(e) {
  e.preventDefault();
  $("main").hide();
  $(".restart").show();
  $("#drinkPickerForm").show();
  // stop header from repeating
  $("h4").empty();
  //add header before form
  $(".pickerList").before("<h4 class='searchHeader'>Just a few questions and we'll get you on your way.</h4>");
}

//after user inputs preferences, clicks Go
function getADrink(e) {
  e.preventDefault();
  $(".resultsContainer")
    .empty()
    .show();
  $(".similarDrinks").show();
  $("#drinkPickerForm").hide();
  $(".resultsPage").show();
  $(".resultsHeader").text("We hope you'll like one of these...");
  var alcoholType = $("#selectAlcohol").val();
  var drinkType = $("#selectType").val();
  var flavor = $("#selectFlavor").val();
  var limitArr = [];
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + alcoholType, function(alcoholRes) {
    alcoholResults = [...alcoholRes.drinks];
    $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=" + drinkType, function(typeRes) {
      typeResults = [...typeRes.drinks];
      alcoholResults.forEach(function(drink) {
        typeResults.forEach(function(drink2) {
          if (drink.strDrink === drink2.strDrink) {
            var item = drink.strDrink;
            $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + item, function(res) {
              res.drinks.forEach(function(x) {
                STORE.forEach(function(y) {
                  if (x.strDrink === y.drinkName && y.drinkProfile === flavor) {
                    $(".resultsContainer").append(`<div class="drinkResult"><img src="${x.strDrinkThumb}" alt="photo of drink" class="thumbnail"><br><p>${x.strDrink}</p></div>`);
                  }
                });
              });
              $(".drinkResult").click(showRecipe);
            });
          }
        });
      });
    });
  });
}

//DISPLAY RECIPE WHEN IMAGE IS CLICKED
function showRecipe(e) {
  e.preventDefault();
  $(".resultsPage").hide();
  $(".recipePage")
    .show()
    .empty();
  $(".similarDrinks").show();
  var drink = $(this).text();
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drink, function(res) {
    var recipeArr = [...res.drinks];
    var recipe = recipeArr[0];
    $(".recipePage").append(`<img src="${recipe.strDrinkThumb}" alt="drink photo" class="drinkImg"/>
    <p>Drink Name: ${recipe.strDrink}
    <br>
    Ingredients: ${recipe.strMeasure1} of ${recipe.strIngredient1}
    <br>
    Drink Instructions: ${recipe.strInstructions}
    </p>`);
    showSimilar(recipe.strIngredient1);
  });
}

//FIND SIMILAR RECIPES TO CURRENT DRINK RECIPE SHOWN
function showSimilar(ingredient) {
  $(".similarDrinks").empty();
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient, function(res) {
    var similarArr = [...res.drinks];
    similarArr = similarArr.sort(function() {
      return 0.5 - Math.random();
    });
    similarDrinks = similarArr.slice(0, 3);
    similarDrinks.forEach(function(item) {
      $(".similarDrinks").append(`<div class="drinkResult"><img src="${item.strDrinkThumb}" alt="drink photo" class="drinkThumb"/><p>${item.strDrink}</p></div>`);
    });
    $(".drinkResult").click(showRecipe);
  });
}

//event listeners (ONLY DO ONCE)
function startSearch() {
  initSearch();
  $(".drinkKnown").click(searchDrink);
  $(".ingredientKnown").click(searchIngredient);
  $(".drinkButton").click(findByName);
  $(".ingredientButton").click(findByIngredient);
  $(".drinkHelp").click(initDrinkFinder);
  $(".drinkResult").click(showRecipe);
  $(".drinkPickerButton").click(getADrink);
  $(".restart").click(initSearch);
}

$(startSearch);
