function initSearch() {
  // show options
  $("main").show();
  // hide search bar
  $("#searchDrink").hide();
  $("#searchIngredient").hide();
  //hide drink picker form
  $("#drinkPickerForm").hide();
  $(".resultsPage").hide();
}

//SEARCHING BY DRINK NAME

//when user clicks "I know what drink I want"
function searchDrink(e) {
  e.preventDefault();
  $("main").hide();
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
  //get search value
  const name = $("#searchName").val();
  //insert search query into header
  $(".resultsHeader").text(`Results for "${name}"`);
  //check if the search query is more than 1 word, call JSON for drink name
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + name.replace(/(\s)/g, "_"), function(res) {
    // for each drink, show name and photo
    res.drinks.forEach(function(drink) {
      $(".resultsPage").append(`<div class="drinkResult"><img src="${drink.strDrinkThumb}" alt="photo of drink" class="thumbnail"><br><p>${drink.strDrink}</p></div>`);
    });
  }).fail(function() {
    $(".resultsPage").append("<p class='error'>Sorry, we couldn't find any drinks with that name. Check the spelling or try another search.</p>");
  });
}

//SEARCHING BY INGREDIENT

//when user clicks "i have an ingredient I want to use"
function searchIngredient(e) {
  e.preventDefault();
  $("main").hide();
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
  //get search value
  const ingredient = $("#ingredientSearch").val();
  $(".resultsHeader").text(`Results for "${ingredient}"`);
  //check if the search query is more than 1 word, call JSON for the ingredient
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient.replace(/(\s)/g, "_"), function(res) {
    // for each drink, show name and photo
    res.drinks.forEach(function(drink) {
      $(".resultsPage").append(`<div class="drinkResult"><img src="${drink.strDrinkThumb}" alt="photo of drink" class="thumbnail"><br><p>${drink.strDrink}</p></div>`);
    });
  });
}

//DRINK PICKER

//when user clicks "I need help finding a drink today"
function initDrinkFinder(e) {
  e.preventDefault();
  $("main").hide();
  $("#drinkPickerForm").show();
  // stop header from repeating
  $("h4").empty();
  //add header before form
  $(".pickerList").before("<h4 class='searchHeader'>Just a few questions and we'll get you on your way.</h4>");
}

function getADrink() {
  //TO FILTER BY ALCOHOL TYPE:
  //get value from form
  const alcoholType = $("#selectAlcohol").val();
  //get JSON for alcoholType and store in a variable
  const alcoholTypeResults = $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + alcoholType, function(res) {
    const drinkType = $("#selectType").val();
    const drinkTypeResults = $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=" + drinkType, function(res) {

    });
  });
}

//event listeners (ONLY DO ONCE)
function startSearch() {
  initSearch();
  $(".drinkKnown").click(searchDrink);
  $(".ingredientKnown").click(searchIngredient);
  $(".drinkHelp").click(initDrinkFinder);
  $(".drinkButton").click(findByName);
  $(".ingredientButton").click(findByIngredient);
  $(".drinkResults").click(showRecipe);
  $(".restart").click(initSearch);
  $("#drinkPickerButton").click(getADrink);
}

$(startSearch);
