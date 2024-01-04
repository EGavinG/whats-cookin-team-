import {
  filterRecipesByTag,
  filterRecipesByName,
  calculateRecipeCost,
  addToCook,
  getRandomUser,
  removeFromCook,
} from "../src/recipes";

import { fetchData, postSavedRecipe } from "./apiCalls";

// Query Selectors
const resultsContainer = document.querySelector(".results-container");
const recipePage = document.querySelector(".recipe-page");
const submitButton = document.getElementById("submitButton");
const tagsContainer = document.querySelector(".tags");
const showAllRecipesBtn = document.querySelector(".show-all-btn");
const homeButton = document.getElementById("home-button");
const recipeContainer = document.querySelector(".recipe-container");
const mainContainer = document.querySelector(".main-container");
const resultPage = document.querySelector(".result-page");
const favsButton = document.getElementById("favorites-button");
const viewSavedButton = document.getElementById("view-saved-button");
const removeFavsButton = document.getElementById("remove-favorites-button");
const searchForm = document.getElementById("searchForm");

// Variables
let clickedRecipe;
let currentUser;
let currentRecipes;
let allFetchedRecipes;
let allFetchedIngredients;

// Event listeners
window.addEventListener("load", function () {
  fetchData("recipes")
    .then(({ recipes }) => {
      allFetchedRecipes = recipes;
      console.log(allFetchedRecipes);
    })
    .catch((error) => console.error(error));
  fetchData("ingredients")
    .then(({ ingredients }) => {
      allFetchedIngredients = ingredients;
      console.log(allFetchedIngredients);
    })
    .catch((error) => console.error(error));
  fetchData("users").then(({ users }) => {
    currentUser = getRandomUser(users);
  });
  showRecipes(allFetchedRecipes);
});

homeButton.addEventListener("click", function () {
  mainView();
});

submitButton.addEventListener("click", function () {
  search(allFetchedRecipes);
});

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  submitButton.click();
});

tagsContainer.addEventListener("click", function (event) {
  displayFilterByTag(event, currentRecipes);
});

showAllRecipesBtn.addEventListener("click", function () {
  resultsContainer.innerHTML = "";
  showRecipes(allFetchedRecipes);
  resultsView();
});

favsButton.addEventListener("click", function () {
  console.log(currentUser);
  showFavoriteAlert();
  addToCook(clickedRecipe, currentUser);
  console.log(currentUser);
  currentRecipes = currentUser.recipesToCook;
  postSavedRecipe(currentUser.id, clickedRecipe.id);
});

viewSavedButton.addEventListener("click", function () {
  savedToCookView();
});

removeFavsButton.addEventListener("click", function () {
  showRemoveFavoriteAlert();
  console.log(currentUser);
  removeFromCook(clickedRecipe, currentUser);
  console.log(currentUser.recipesToCook);
  console.log(currentUser);
  currentRecipes = currentUser.recipesToCook;
});

resultsContainer.addEventListener("click", function (event) {
  const clickedRecipeCard = event.target.closest(".recipe-card");
  if (clickedRecipeCard) {
    const clickedRecipeId = clickedRecipeCard.dataset.recipeId;
    clickedRecipe = getRecipeById(clickedRecipeId);
    showRecipePage(clickedRecipe);
  }
});

// Event Handlers
function getRecipeById(id) {
  return allFetchedRecipes.find((recipe) => recipe.id === parseInt(id));
}

function getIngredientById(id) {
  return allFetchedIngredients.find(
    (ingredient) => ingredient.id === parseInt(id)
  );
}

function showRecipes(recipes = []) {
  recipes.forEach((recipe) => {
    const recipeCard = createRecipeCard(recipe);
    resultsContainer.appendChild(recipeCard);
  });
}

function showRecipePage(recipe) {
  const ingredientsList = recipe.ingredients
    .map(
      (ingredient) =>
        `<li>${getIngredientById(ingredient.id).name} (${
          ingredient.quantity.amount
        } ${ingredient.quantity.unit})</li>`
    )
    .join("");

  const directionsList = recipe.instructions
    .map((instruction) => `<li>${instruction.instruction}</li>`)
    .join("");

  const totalCost = calculateRecipeCost(recipe, allFetchedIngredients);
  recipeContainer.innerHTML = `
    <section class="recipe-page">
      <img src="${recipe.image}" alt="${recipe.name}" />
      <h1>${recipe.name}</h1>
      <h4 class="ingredients">Ingredients:</h4>
      <ul>${ingredientsList}</ul>
      <h3 class="directions">Directions:</h3>
      <ol>${directionsList}</ol>
      <h3 class="cost">Estimated Total Cost: $${totalCost}</h3>

    </section>
  `;
  recipeView();
}

function updateResultsContainer(recipes) {
  resultsContainer.innerHTML = "";
  if (recipes.length > 0) {
    recipes.forEach((recipe) => {
      const recipeCard = createRecipeCard(recipe);
      resultsContainer.appendChild(recipeCard);
    });
  } else {
    resultsContainer.innerHTML = "<h1>No results match that criteria!</h1>";
  }
}

function createRecipeCard(recipe) {
  const recipeCard = document.createElement("div");
  recipeCard.classList.add("recipe-card");

  const image = document.createElement("img");
  image.src = recipe.image;
  image.alt = "Recipe Image";
  recipeCard.appendChild(image);

  const title = document.createElement("h3");
  title.textContent = changeTitleCase(recipe.name);
  recipeCard.appendChild(title);

  recipeCard.dataset.recipeId = recipe.id;

  return recipeCard;
}

function displayFilterByTag(event) {
  const clickedTag = event.target.closest(".tag-btn");
  if (clickedTag) {
    const tag = clickedTag.id;
    const filteredRecipesByTag = filterRecipesByTag(allFetchedRecipes, tag);
    updateResultsContainer(filteredRecipesByTag);
    resultsView();
  }
}

function search() {
  const searchInputValue = document.getElementById("searchInput").value;
  const filteredRecipes = filterRecipesByName(
    allFetchedRecipes,
    searchInputValue
  );
  updateResultsContainer(filteredRecipes);
  resultsView();
}

function showFavoriteAlert() {
  if (!currentUser.recipesToCook.includes(clickedRecipe)) {
    alert("Added to favorites");
  } else {
    alert("Already added to favorites");
  }
}

function showRemoveFavoriteAlert() {
  if (currentUser.recipesToCook.includes(clickedRecipe)) {
    alert("Removed from favorites");
  } else {
    alert("Not found in favorites");
  }
}

// Helper Functions

function mainView() {
  show(mainContainer);
  hide(resultPage);
  hide(homeButton);
  hide(recipePage);
  hide(favsButton);
  hide(removeFavsButton);
  show(showAllRecipesBtn);
}

function resultsView() {
  show(resultPage);
  show(homeButton);
  hide(recipePage);
  hide(favsButton);
  hide(removeFavsButton);
  hide(showAllRecipesBtn);
}

function recipeView() {
  hide(mainContainer);
  hide(resultPage);
  show(homeButton);
  show(recipePage);
  show(favsButton);
  show(removeFavsButton);
  show(viewSavedButton);
}

function savedToCookView() {
  currentRecipes = currentUser.recipesToCook;
  resultsContainer.innerHTML = "";
  showRecipes(currentRecipes);
  resultsView();
  show(mainContainer);
}

function hide(element) {
  element.classList.add("hidden");
}

function show(element) {
  element.classList.remove("hidden");
}

function changeTitleCase(string) {
  return string
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

