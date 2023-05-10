// Listen for the form submission event
const form = document.querySelector("form");
form.addEventListener("submit", event => {
  event.preventDefault();

  // Get the search query and category values
  const searchQuery = document.querySelector("#search").value;
  const category = document.querySelector("#category").value;

  // Send a GET request to the server with the search query and category parameters
  fetch(`/events?search=${searchQuery}&category=${category}`)
    .then(response => response.json())
    .then(data => {
      // Render the search results using Handlebars
      const template = Handlebars.compile(document.querySelector("#search-results-template").innerHTML);
      const html = template(data);
      document.querySelector("#search-results").innerHTML = html;
    })
    .catch(error => console.error(error));
});
