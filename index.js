currPage = "home";

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
  $("nav").hide();
}

//SEARCHING BY DRINK NAME

//when user clicks "I know what drink I want"
function searchDrink(e) {
  e.preventDefault();
  currPage = "searchByName";
  $("nav").fadeIn(600);
  $("main").hide(0);
  $(".restart").fadeIn(600);
  $("#searchDrink").fadeIn(600);
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
  currPage = "searchNameResults";
  $("#searchDrink").hide();
  $(".resultsPage").fadeIn(600);
  $(".resultsContainer")
    .fadeIn(600)
    .empty();
  //get search value
  const name = $("#searchName").val();
  //insert search query into header
  $(".resultsHeader").text(`Results for "${name}"`);
  //check if the search query is more than 1 word, call JSON for drink name
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + name.replace(/(\s)/g, "_"), function(res) {
    if (!res.drinks) {
      $(".resultsContainer").html("<p class='retrySearch'>Sorry, we weren't able to find any drinks with that name. Check the spelling or try a different search.</p>");
    }
    // for each drink, show name and photo
    res.drinks.forEach(function(drink) {
      $(".resultsContainer").append(`<div class="drinkResult nameResult"><img src="${drink.strDrinkThumb}" alt="photo of drink" class="thumbnail"><br><p class="recipeName">${drink.strDrink}</p></div>`);
    });
  });
}

//SEARCHING BY INGREDIENT

//when user clicks "i have an ingredient I want to use"
function searchIngredient(e) {
  e.preventDefault();
  currPage = "searchByIngredient";
  $("main").hide();
  $("nav").fadeIn(600);
  $(".restart").fadeIn(600);
  $("#searchIngredient").fadeIn(600);
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
  currPage = "searchIngredientResults";
  $("#searchIngredient").hide();
  $(".resultsPage").fadeIn(600);
  $(".resultsContainer")
    .fadeIn(600)
    .empty();
  //get search value
  const ingredient = $("#ingredientSearch").val();
  $(".resultsHeader").text(`Results for "${ingredient}"`);
  //check if the search query is more than 1 word, call JSON for the ingredient
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient.replace(/(\s)/g, "_"), function(res) {
    // for each drink, show name and photo
    res.drinks.forEach(function(drink) {
      $(".resultsContainer").append(`<div class="drinkResult ingredientResult"><img src="${drink.strDrinkThumb}" alt="photo of drink" class="thumbnail"><br><p><span class="recipeName">${drink.strDrink}</span></p></div>`);
    });
  });
}

//DRINK PICKER

//when user clicks "I need help finding a drink today"
function initDrinkFinder(e) {
  e.preventDefault();
  currPage = "drinkPickerForm";
  $("main").hide();
  $("nav").fadeIn(600);
  $(".restart").fadeIn(600);
  $("#drinkPickerForm").fadeIn(600);
  // stop header from repeating
  $("h4").empty();
  //add header before form
  $(".pickerList").before("<h4 class='searchHeader'>Just a few questions and we'll get you on your way.</h4>");
}

finalFinalResults = [];

//after user inputs preferences, clicks Go
function getADrink(e) {
  e.preventDefault();
  currPage = "drinkPickerResults";
  $(".resultsContainer")
    .empty()
    .fadeIn(600);
  $("#drinkPickerForm").hide();
  $(".resultsPage").fadeIn(600);
  $(".resultsHeader").text("We hope you'll like one of these...");
  var alcoholType = $("#selectAlcohol").val();
  var drinkType = $("#selectType").val();
  var flavor = $("#selectFlavor").val();
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + alcoholType, function(alcoholRes) {
    alcoholResults = [...alcoholRes.drinks];
    finalFinalResults = [];
    $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=" + drinkType, function(typeRes) {
      typeResults = [...typeRes.drinks];
      finalResults = {};
      thirdCallNum = [];
      alcoholResults.forEach(function(drink) {
        typeResults.forEach(function(drink2) {
          if (drink.strDrink === drink2.strDrink) {
            var item = drink.strDrink;
            thirdCallNum.push(item);
            $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + item, function(res) {
              res.drinks.forEach(function(x) {
                STORE.forEach(function(y) {
                  if (x.strDrink === y.drinkName && y.drinkProfile === flavor) {
                    finalFinalResults.push(x);
                  }
                });
              });
            });
          }
        });
      });
      if (thirdCallNum.length === 0) {
        $(".resultsContainer").append(`<p class="drinkPickerError">Sorry, we weren't able to find any drinks that matched all your choices. Try changing one or two of the options.</p>`);
      }
    });
  });
}

//DISPLAY RECIPE WHEN IMAGE IS CLICKED
function showRecipe(e) {
  e.preventDefault();
  currPage = "recipePage";
  $(".resultsPage").hide();
  $(".recipePage")
    .fadeIn(600)
    .empty();
  $(".similarDrinks").fadeIn(600);
  var drink = $(this).text();
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drink, function(res) {
    var recipe = res.drinks[0];
    var finalString = "";
    var searchSimilar = recipe.strIngredient1;
    var ingredientArr = [recipe.strIngredient1, recipe.strIngredient2, recipe.strIngredient3, recipe.strIngredient4, recipe.strIngredient5, recipe.strIngredient6, recipe.strIngredient7, recipe.strIngredient8, recipe.strIngredient9, recipe.strIngredient10, recipe.strIngredient11, recipe.strIngredient12, recipe.strIngredient13, recipe.strIngredient14, recipe.strIngredient15].filter(i => i !== null);
    var measureArr = [recipe.strMeasure1, recipe.strMeasure2, recipe.strMeasure3, recipe.strMeasure4, recipe.strMeasure5, recipe.strMeasure6, recipe.strMeasure7, recipe.strMeasure8, recipe.strMeasure9, recipe.strMeasure10, recipe.strMeasure11, recipe.strMeasure12, recipe.strMeasure13, recipe.strMeasure14, recipe.strMeasure15].filter(i => i !== null);
    instructions = recipe.strInstructions;
    photo = recipe.strDrinkThumb;
    title = recipe.strDrink;
    var measureIngredient = ingredientArr.map((d, i) => `<li class="ingredientItem">${measureArr[i] ? measureArr[i] : ""} ${d}</li>`);
    measureIngredient = measureIngredient.join(" ");
    console.log(measureIngredient);
    finalString = '<h2 class="title">' + title + '</h2><div class="imgContainer"><img src="' + photo + '" alt="drink photo" class="drinkImg"/></div><div class="ingredientContainer"><h5>Ingredients:</h5><ul class="ingredientList">' + measureIngredient + '</ul></div><div class="instructionsContainer"><h5>Instructions:</h5><p>' + instructions + "</p></div>";
    $(".recipePage").append(finalString);
    showSimilar(searchSimilar);
  });
}

//FIND SIMILAR RECIPES TO CURRENT DRINK RECIPE SHOWN
function showSimilar(ingredient) {
  $(".similarDrinks").empty();
  $(".similarDrinks").append("<h4 class='similarHeader'>Try something similar!</h4>");
  $.getJSON("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient, function(res) {
    var similarArr = [...res.drinks];
    similarArr = similarArr.sort(function() {
      return 0.5 - Math.random();
    });
    similarDrinks = similarArr.slice(0, 3);
    similarDrinks.forEach(function(item) {
      $(".similarDrinks").append(`<div class="drinkResult"><img src="${item.strDrinkThumb}" alt="drink photo" class="thumbnail"/><p class="recipeName">${item.strDrink}</p></div>`);
    });
  });
}

function goBack(e) {
  e.preventDefault();
  switch (currPage) {
    case "searchByName":
      initSearch();
      break;
    case "searchNameResults":
      $(".resultsContainer").empty();
      $(".resultsHeader").empty();
      searchDrink(e);
      break;
    case "searchByIngredient":
      initSearch();
      break;
    case "searchIngredientResults":
      $(".resultsContainer").empty();
      $(".resultsHeader").empty();
      searchIngredient(e);
      break;
    case "drinkPickerForm":
      initSearch();
      break;
    case "drinkPickerResults":
      $(".resultsContainer").empty();
      $(".resultsHeader").empty();
      initDrinkFinder(e);
      break;
    case "recipePage":
      initSearch();
      break;
    default:
      break;
  }
}

//event listeners (ONLY DO ONCE)
function startSearch() {
  initSearch();
  $(".drinkKnown").click(searchDrink);
  $(".ingredientKnown").click(searchIngredient);
  $(".drinkButton").click(findByName);
  $(".ingredientButton").click(findByIngredient);
  $(".drinkHelp").click(initDrinkFinder);
  $("body").on("click", ".drinkResult", showRecipe);
  $(".drinkPickerButton").click(getADrink);
  $(".restart").click(initSearch);
  $(".back").click(goBack);
  $(".logo").click(initSearch);
}

$(function() {
  startSearch();
  $(document).ajaxComplete(function(event, xhr, settings) {
    if (currPage === "drinkPickerResults")
      if (settings.url.indexOf("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=") === 0) {
        if (finalFinalResults.length !== 0) {
          // finalFinalResults.sort(); // Randomise the array.
          if (finalFinalResults.length > 3) finalFinalResults.length = 3;
          $(".resultsContainer").empty();
          finalFinalResults.forEach(function(x) {
            $(".resultsContainer").append(`<div class="drinkResult pickerResult"><img src="${x.strDrinkThumb}" alt="photo of drink" class="thumbnail"><br><p class="recipeName">${x.strDrink}</p></div>`);
          });
        } else {
          $(".resultsContainer").html(`<p class="drinkPickerError">Sorry, we weren't able to find any drinks that matched all your choices. Try changing one or two of the options.</p>`);
        }
      }
  });
});
