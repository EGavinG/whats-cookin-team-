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
const tagsContainer = document.querySelector('.tags');
const resultsContainer = document.querySelector(".results-container");
const recipePage = document.getElementById("recipe-page");
const element = document.querySelector(`.${className}`);
const searchInputValue = document.getElementById("searchInput").value;
// Event listeners
tagsContainer.addEventListener('click', function(event){
  displayFilterByTag(event)
});

document.querySelector(".search-bar input").addEventListener("input", () => {
  updateFilteredResults(recipeData);
});

document.querySelectorAll(".tags a").forEach((tag) => {
  tag.addEventListener("click", () => {
    tag.classList.toggle("selected");
    updateFilteredResults(recipeData);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  setupSubmitButtonListener();
});
// DOM manipulation functions


function displayFilterByTag(event) {
    const clickedTag = event.target.closest('.tag-btn')
    console.log(clickedTag.id);
    if(clickedTag) {
      const tag = clickedTag.id
      console.log(tag);
    // const filteredRecipesByTag = filterRecipesByTag(recipeData, tag)
    // showAllRecipes(filterRecipesByTag)
    }
}

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
    <!-- Add other details about the recipe -->
  `;
}

function updateFilteredResults(recipes) {
  const searchInput = document.querySelector(".search-bar input");
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

  const blurb = document.createElement("p");
  // blurb.textContent = 'A blurb of the recipe.'; // You can replace this with actual recipe information
  recipeCard.appendChild(blurb);

  recipeCard.addEventListener("click", () => {
    showRecipePage(recipe);
  });

  return recipeCard;
}

function setupSubmitButtonListener() {
  const submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", search);
}

function search() {
  
  filterRecipesByName(searchInputValue);
  displayResults(searchInputValue);
}

// Helper Functions
function toggleHiddenClass(className) {
 
  if (element) {
    element.classList.toggle("hidden");
  }
}

function goBackToMain() {
  toggleHiddenClass("main-container");
  toggleHiddenClass("result-page");
}

export { showAllRecipes, updateFilteredResults, displayFilterByTag };
