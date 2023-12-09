// Import the recipe.js functions
import {
  filterRecipesByTag,
  filterRecipesByName,
  calculateRecipeCost,
  addToCook,
  getRandomUser,
  removeFromCook,
} from "../src/recipes";

import recipeData from "./data/recipes";
import ingredientsData from "./data/ingredients";

// Query Selectors
const resultsContainer = document.querySelector(".results-container");
const recipePage = document.querySelector(".recipe-page");
const searchInput = document.querySelector(".search-bar input");
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
const searchContainer = document.querySelector(".search-container");


let clickedRecipe;
let currentUser;

// Event listeners

homeButton.addEventListener("click", function () {
  mainView();
});

submitButton.addEventListener("click", function () {
  search();
});

tagsContainer.addEventListener("click", function (event) {
  displayFilterByTag(event);
});

showAllRecipesBtn.addEventListener("click", function () {
  resultsView();
});

favsButton.addEventListener("click", function () { 
  currentUser = getRandomUser();
  addToCook(clickedRecipe, currentUser);
});

viewSavedButton.addEventListener("click", function () {
  savedToCookView();
});

removeFavsButton.addEventListener("click", function () {
  console.log(currentUser)
  removeFromCook(clickedRecipe, currentUser);
  console.log(currentUser.recipesToCook);
  console.log(currentUser)
});

resultsContainer.addEventListener("click", function (event) {
  const clickedRecipeCard = event.target.closest(".recipe-card");
  if (clickedRecipeCard) {
    const clickedRecipeId = clickedRecipeCard.dataset.recipeId;
    clickedRecipe = getRecipeById(clickedRecipeId);
    showRecipePage(clickedRecipe);
  }
});

function getRecipeById(id) {
  return recipeData.find((recipe) => recipe.id === parseInt(id));
}

function getIngredientById(id) {
  return ingredientsData.find((ingredient) => ingredient.id === parseInt(id));
}

// DOM manipulation functions

function showRecipes(recipes) {
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

  const totalCost = calculateRecipeCost(recipe, ingredientsData);
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

function updateFilteredResults(recipes) {
  const tags = Array.from(document.querySelectorAll(".tags a"))
    .filter((tag) => tag.classList.contains("selected"))
    .map((tag) => tag.innerText);

  const filteredRecipes = filterRecipesByName(recipes, searchInput.value);
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

function displayFilterByTag(event) {
  const clickedTag = event.target.closest(".tag-btn");
  if (clickedTag) {
    const tag = clickedTag.id;
    const filteredRecipesByTag = filterRecipesByTag(recipeData, tag);
    updateResultsContainer(filteredRecipesByTag);
    resultsView(); 
  }
}

function search() {
  const searchInputValue = document.getElementById("searchInput").value;
  const filteredRecipes = filterRecipesByName(recipeData, searchInputValue);
  updateResultsContainer(filteredRecipes);
  resultsView();
}

function showFavorites() {
  currentUser = getRandomUser();
  console.log(currentUser)
  
  console.log(currentUser.recipesToCook);
  console.log(currentUser)
}

// Helper Functions

function mainView() {
  show(mainContainer);
  hide(resultPage);
  hide(homeButton);
  hide(recipePage)
  hide(favsButton)
  hide(removeFavsButton);

}

function resultsView() {
  hide(mainContainer);
  show(resultPage);
  show(homeButton);
  hide(recipePage);
  hide(favsButton);
  hide(removeFavsButton);

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
show(searchContainer);
}

function hide(element) {
  element.classList.add('hidden');
}

function show(element) {
  element.classList.remove('hidden');
}
export { showRecipes, showRecipePage, updateFilteredResults, getRecipeById };
