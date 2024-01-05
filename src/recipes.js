function filterRecipesByTag(recipes, tag) {
  const filteredRecipesByTag = recipes.filter((recipe) => {
    return recipe.tags.includes(tag);
  });
  return filteredRecipesByTag;
}

function filterRecipesByName(recipes, name) {
  const filteredRecipesByName = recipes.filter((recipe) => {
    const upperCaseRecipeName = recipe.name.toUpperCase();
    return upperCaseRecipeName.includes(name.toUpperCase());
  });
  if (!filterRecipesByName) {
    return;
  }
  return filteredRecipesByName;
}

function getIngredientNames(recipe, allFetchedIngredients) {
  return !recipe || !allFetchedIngredients
    ? "Error"
    : recipe.ingredients.map(
        (ingredient) =>
          getIngredientProperty(ingredient.id, allFetchedIngredients, "name") ||
          "Ingredient not found"
      );
}

function calculateRecipeCost(recipe, allFetchedIngredients) {
  const totalCost =
    !recipe || !allFetchedIngredients
      ? 0
      : recipe.ingredients.reduce((acc, ingredient) => {
          const ingredientCost = getIngredientProperty(
            ingredient.id,
            allFetchedIngredients,
            "estimatedCostInCents"
          );
          return (
            acc +
            (ingredientCost ? ingredientCost * ingredient.quantity.amount : 0)
          );
        }, 0);

  return (totalCost / 100).toFixed(2);
}

function getIngredientProperty(ingredientId, allFetchedIngredients, property) {
  const ingredientObject = allFetchedIngredients.find(
    (ingredientData) => ingredientData.id === ingredientId
  );
  return ingredientObject ? ingredientObject[property] : null;
}

function getRecipeDirections(recipe) {
  return recipe.instructions;
}

function getRandomUser(allFetchedUsers) {
  const randomIndex = Math.floor(Math.random() * allFetchedUsers.length);
  return allFetchedUsers[randomIndex];
}

function addToCook(recipe, user) {
  if (!user.recipesToCook.includes(recipe)) {
    user.recipesToCook.push(recipe);
  }
}

function removeFromCook(recipe, user) {
  user.recipesToCook = user.recipesToCook.filter(
    (currentRecipe) => currentRecipe.id !== recipe.id
  );
}



export {
  filterRecipesByTag,
  filterRecipesByName,
  getIngredientNames,
  calculateRecipeCost,
  getRecipeDirections,
  getIngredientProperty,
  getRandomUser,
  addToCook,
  removeFromCook,
};
