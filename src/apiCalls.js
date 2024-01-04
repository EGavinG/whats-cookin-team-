function fetchData(set) {
  return fetch(`http://localhost:3001/api/v1/${set}`)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export { fetchData };

