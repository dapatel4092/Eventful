//Apis
const eventbriteUrl = "https://www.eventbriteapi.com/v3/events/search/";
const eventbriteKey = "LMZTLLTII2KJCUS7PBHH";
const bandsInTownUrl = "https://rest.bandsintown.com/v4/events/";
const bandsInTownKey = "3a9f493fc15e7dac615ac7e56581f4da";
const { all, getAllCategories } = require("../controllers/home-routes");


// Prompts user to enter a city or an event to search for
const searchQuery = prompt("Enter a city or an event to search for on Eventbrite and BandsInTown:");


const categories = {
  Business: 101,
  FoodDrink: 110,
  Community: 113,
  Music: 103,
  FilmMedia: 104,
  PerformingVisualArts: 105,
  SportsFitness: 108,
  TravelOutdoor: 109,
  CharityCauses: 111,
  Government: 112,
  ScienceTechnology: 102,
  Fashion: 106,
  HomeLifestyle: 107,
  All: getAllCategories()
};


const queryParams = {
  token: eventbriteKey,
  ...(searchQuery.includes(",") ? { "location.address": searchQuery } : { q: searchQuery }),
  categories: Object.values(categories)

};


fetch(eventbriteUrl, {
    headers: {
      "Authorization": "Bearer " + eventbriteKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(queryParams),
    method: "POST"
  })
  .then(response => response.json())
  .then(eventbriteData => {

    const eventbriteEvents = eventbriteData.events || [];
    const bandsInTownQueryParams = {
      app_id: bandsInTownKey,
      ...(searchQuery.includes(",") ? { "location": searchQuery } : { "keyword": searchQuery })
    };

    return fetch(bandsInTownUrl + "?" + new URLSearchParams(bandsInTownQueryParams))
      .then(response => response.json())
      .then(bandsInTownData => {
        // List of events from the BandsInTown API response
        const bandsInTownEvents = bandsInTownData || [];

        // Combining lists of events and logs the results
        const allEvents = [...eventbriteEvents, ...bandsInTownEvents];
        console.log(`Found ${allEvents.length} events:`);
        allEvents.forEach(event => {
          const eventDate = event.starts_at || event.datetime_local;
          console.log(`${event.title} (${eventDate}): ${event.description} - ${event.venue.city}, ${event.venue.region}`);
        });
      })
      .catch(error => console.error(error));
  })
  .catch(error => console.error(error));

 