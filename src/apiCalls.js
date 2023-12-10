// Your fetch requests will live here!

function fetchRecipesData() {
  return fetch(`https://what-s-cookin-starter-kit.herokuapp.com/api/v1/recipes`)
  .then(response => response.json())
  .catch(error => console.log(error));
}


function fetchIngredientsData() {
  return fetch(`https://what-s-cookin-starter-kit.herokuapp.com/api/v1/ingredients`)
  .then(response => response.json())
  .catch(error => console.log(error));
}

function fetchUsersData() {
  return fetch(`https://what-s-cookin-starter-kit.herokuapp.com/api/v1/users`)
  .then(response => response.json())
  .catch(error => console.log(error));
}


// function fetchAllData() {
//   return Promise.all([fetchData('recipes'), fetchData('ingredients'), fetchData('users')]);
// }

export {
  fetchRecipesData,
  fetchIngredientsData,
  fetchUsersData
  // fetchAllData
}