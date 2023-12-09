// Import the recipe.js functions
import {
  filterRecipesByTag,
  filterRecipesByName,
  getIngredientNames,
  calculateRecipeCost,
  getRecipeDirections,
  addToCook,
  getRandomUser,
  removeFromCook,
} from "../src/recipes";

import recipeData from "./data/recipes";
import ingredientsData from "./data/ingredients";
import usersData from "./data/users";

// Query Selectors
const resultsContainer = document.querySelector(".results-container");
const recipePage = document.querySelector(".recipe-page");
const searchInput = document.querySelector(".search-bar input");
const submitButton = document.getElementById("submitButton");
const tagsContainer = document.querySelector(".tags");
const showAllRecipesBtn = document.querySelector(".show-all-btn");
const recipeCard = document.querySelector(".recipe-card");
const homeButton = document.getElementById("home-button");
const recipeContainer = document.querySelector(".recipe-container");
const mainContainer = document.querySelector(".main-container");
const resultPage = document.querySelector(".result-page");
const favsButton = document.getElementById("favorites-button");
const removeFavsButton = document.getElementById("remove-favorites-button");


let clickedRecipe;
let currentUser;

// Event listeners

homeButton.addEventListener("click", function () {
  goBackToMain();
});

submitButton.addEventListener("click", function () {
  search();
});

tagsContainer.addEventListener("click", function (event) {
  displayFilterByTag(event);
});

showAllRecipesBtn.addEventListener("click", function () {
  goToResultsPage();
});

favsButton.addEventListener("click", function () { 
  currentUser = getRandomUser();
  console.log(currentUser)
  addToCook(clickedRecipe, currentUser);
  console.log(currentUser.recipesToCook);
  console.log(currentUser)
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

// document
//   .querySelector(".search-bar form")
//   .addEventListener("submit", function (event) {
//     event.preventDefault(); // Prevent the default form submission behavior

//     const searchInput = document.getElementById("searchInput").value;
//     const filteredRecipes = filterRecipesByName(recipeData, searchInput);
//     updateResultsContainer(filteredRecipes);
//   });
// DOM manipulation functions

function showAllRecipes(recipes) {
  recipes.forEach((recipe, index) => {
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
  goToRecipePage();
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
  //console.log(clickedTag.id);
  if (clickedTag) {
    const tag = clickedTag.id;
    console.log(tag);
    const filteredRecipesByTag = filterRecipesByTag(recipeData, tag);
    console.log(filteredRecipesByTag);
    updateResultsContainer(filteredRecipesByTag);
    goToResultsPage(); // showAllRecipes(filterRecipesByTag)
  }
}

function search() {
  const searchInputValue = document.getElementById("searchInput").value;
  const filteredRecipes = filterRecipesByName(recipeData, searchInputValue);
  updateResultsContainer(filteredRecipes);
  goToResultsPage();
}

// Helper Functions
function toggleHiddenClass(className) {
  const element = document.querySelector(`.${className}`);
  if (element) {
    element.classList.toggle("hidden");
  }
}

function goBackToMain() {
  mainContainer.classList.remove("hidden");
  resultPage.classList.add("hidden");
  homeButton.classList.add("hidden");
  recipePage.classList.add("hidden");
  favsButton.classList.add("hidden");
  removeFavsButton.classList.add("hidden");

}

function goToResultsPage() {
  mainContainer.classList.add("hidden");
  resultPage.classList.remove("hidden");
  homeButton.classList.remove("hidden");
  recipePage.classList.add("hidden");
  favsButton.classList.add("hidden");
  removeFavsButton.classList.add("hidden");

}

function goToRecipePage() {
  mainContainer.classList.add("hidden");
  resultPage.classList.add("hidden");
  homeButton.classList.remove("hidden");
  recipePage.classList.remove("hidden");
  favsButton.classList.remove("hidden");
  removeFavsButton.classList.remove("hidden");

}

export { showAllRecipes, showRecipePage, updateFilteredResults, getRecipeById };
