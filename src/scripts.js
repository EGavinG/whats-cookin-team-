//NOTE: Data model and non-dom manipulating logic will live in this file.
// File Imports
import "./styles.css";
import "./apiCalls";
import "./images/turing-logo.png";
import recipeData from "./data/recipes";
import usersData from "./data/users";

// Function Imports
import { getRandomUser } from "./recipes";
import {
  showAllRecipes,
} from "./domUpdates";

// OnLoad Function Invokation
window.addEventListener("load", function () {
  showAllRecipes(recipeData);
  getRandomUser(usersData)
});
