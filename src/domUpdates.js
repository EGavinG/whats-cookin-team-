// Import the recipe.js functions
import {
  filterRecipesByTag,
  filterRecipesByName,
  calculateRecipeCost,
  addToCook,
  getRandomUser,
  removeFromCook,
} from "../src/recipes";

import {
  fetchRecipesData,
  fetchIngredientsData,
  fetchUsersData,
} from "./apiCalls";

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
const recipeCarousel = document.querySelector(".recipe-carousel");
const favoriteButton = document.querySelector(".favorite-button");

let clickedRecipe;
let currentUser;
let currentRecipes;
let allFetchedRecipes;
let allFetchedIngredients;

// Event listeners

window.addEventListener("load", function () {
  fetchRecipesData()
    .then(({ recipes }) => {
      allFetchedRecipes = recipes;
      currentRecipes = recipes;
      console.log(currentRecipes);
    })
    .catch((error) => console.error(error));
  fetchIngredientsData()
    .then(({ ingredients }) => {
      allFetchedIngredients = ingredients;
      console.log(allFetchedIngredients);
    })
    .catch((error) => console.error(error));
  fetchUsersData().then(({ users }) => {
    currentUser = getRandomUser(users);
  });
  showRecipes(currentRecipes);
});

homeButton.addEventListener("click", function () {
  mainView();
});

submitButton.addEventListener("click", function () {
  search(currentRecipes);
});

tagsContainer.addEventListener("click", function (event) {
  displayFilterByTag(event, currentRecipes);
});

showAllRecipesBtn.addEventListener("click", function () {
  currentRecipes = [...allFetchedRecipes];
  showRecipes(currentRecipes);
  resultsView();
});

favsButton.addEventListener("click", function () {
  console.log(currentUser);
  addToCook(clickedRecipe, currentUser);
  console.log(currentUser);
  currentRecipes = currentUser.recipesToCook;
});

viewSavedButton.addEventListener("click", function () {
  savedToCookView();
});

removeFavsButton.addEventListener("click", function () {
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

favoriteButton.addEventListener("click", function () {
  toggleFavorite();
});

function getRecipeById(id) {
  return currentRecipes.find((recipe) => recipe.id === parseInt(id));
}

function getIngredientById(id) {
  return allFetchedIngredients.find(
    (ingredient) => ingredient.id === parseInt(id)
  );
}

// DOM manipulation functions

function toggleFavorite() {
  favoriteButton.classList.toggle("is-favorite");

  if (favoriteButton.classList.contains("is-favorite")) {
    addToCook(clickedRecipe, currentUser);
  } else {
    removeFromCook(clickedRecipe, currentUser);
  }
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

  recipes.forEach((recipe) => {
    const recipeCard = createRecipeCard(recipe);
    resultsContainer.appendChild(recipeCard);
  });
}

function createRecipeCard(recipe) {
  const recipeCard = document.createElement("div");
  recipeCard.classList.add("recipe-card");

  const image = document.createElement("img");
  image.src = recipe.image;
  image.alt = "Recipe Image";
  recipeCard.appendChild(image);

  const title = document.createElement("h3");
  title.textContent = recipe.name;
  recipeCard.appendChild(title);

  recipeCard.dataset.recipeId = recipe.id;

  return recipeCard;
}

function displayFilterByTag(event, recipes) {
  const clickedTag = event.target.closest(".tag-btn");
  if (clickedTag) {
    const tag = clickedTag.id;
    const filteredRecipesByTag = filterRecipesByTag(currentRecipes, tag);
    updateResultsContainer(filteredRecipesByTag);
    resultsView();
  }
}

function search(recipes) {
  const searchInputValue = document.getElementById("searchInput").value;
  const filteredRecipes = filterRecipesByName(currentRecipes, searchInputValue);
  updateResultsContainer(filteredRecipes);
  resultsView();
}

// Helper Functions

function mainView() {
  show(mainContainer);
  hide(resultPage);
  hide(homeButton);
  hide(recipePage);
  hide(favsButton);
  hide(removeFavsButton);
  show(recipeCarousel);
  show(showAllRecipesBtn);
}

function resultsView() {
  show(resultPage);
  show(homeButton);
  hide(recipePage);
  hide(favsButton);
  hide(removeFavsButton);
  hide(recipeCarousel);
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
  showRecipes(currentUser.recipesToCook);
  resultsView();
  show(mainContainer);
}

function hide(element) {
  element.classList.add("hidden");
}

function show(element) {
  element.classList.remove("hidden");
}
