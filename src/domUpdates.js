// Import the recipe.js functions
import {
  filterRecipesByTag,
  filterRecipesByName,
  getIngredientNames,
  calculateRecipeCost,
  getRecipeDirections,
} from "../src/recipes";

import recipeData from "./data/recipes";
import ingredientsData from "./data/ingredients";
// Query Selectors
const resultsContainer = document.querySelector(".results-container");
const recipePage = document.getElementById("recipe-page");
const searchInput = document.querySelector(".search-bar input");
const submitButton = document.getElementById("submitButton");
const tagsContainer = document.querySelector('.tags');

// Event listeners

submitButton.addEventListener("click", function (){
  search();
});

tagsContainer.addEventListener('click', function(event){
  displayFilterByTag(event)
});


document.addEventListener("DOMContentLoaded", function () {
  setupSubmitButtonListener();
});

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
  
  recipePage.innerHTML = `
    <h1>${recipe.title}</h1>
    <img src="${recipe.image}" alt="${recipe.title}">
  `;
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

  recipeCard.addEventListener("click", () => {
    showRecipePage(recipe);
  });

  return recipeCard;
}

function displayFilterByTag(event) {
  const clickedTag = event.target.closest('.tag-btn')
  console.log(clickedTag.id);
  if(clickedTag) {
    const tag = clickedTag.id
    console.log(tag);
  const filteredRecipesByTag = filterRecipesByTag(recipeData, tag)
  console.log(filteredRecipesByTag);
  updateResultsContainer(filteredRecipesByTag);
  goBackToMain();
  // showAllRecipes(filterRecipesByTag)
  }
}

function search() {
  const searchInputValue = document.getElementById("searchInput").value;
  const filteredRecipes = filterRecipesByName(recipeData, searchInputValue);
  updateResultsContainer(filteredRecipes);
  goBackToMain();
}

// Helper Functions
function toggleHiddenClass(className) {
  const element = document.querySelector(`.${className}`);
  if (element) {
    element.classList.toggle("hidden");
  }
}

function goBackToMain() {
  toggleHiddenClass("main-container");
  toggleHiddenClass("result-page");
}

export { showAllRecipes, updateFilteredResults };
