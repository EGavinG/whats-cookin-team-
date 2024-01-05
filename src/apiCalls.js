function fetchData(set) {
  return fetch(`http://localhost:3001/api/v1/${set}`)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

function postSavedRecipe (userId, recipeId) {

  const url = 'http://localhost:3001/api/v1/usersRecipes';

  const requestData = {
      userID: userId,
      recipeID: recipeId,
    };

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      alert('Error');
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch((err) => alert(err))
}


export { fetchData, postSavedRecipe };