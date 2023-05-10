const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const eventbriteUrl = "https://www.eventbriteapi.com/v3/events/search/";
const eventbriteKey = "LMZTLLTII2KJCUS7PBHH";
const bandsInTownUrl = "https://rest.bandsintown.com/v4/events/";
const bandsInTownKey = "3a9f493fc15e7dac615ac7e56581f4da";

const categories = [
  {id: "101", name: "Business"},
  {id: "110", name: "FoodDrink"},
  {id: "113", name: "Community"},
  {id: "103", name: "Music"},
  {id: "104", name: "FilmMedia"},
  {id: "105", name: "PerformingVisualArts"},
  {id: "108", name: "SportsFitness"},
  {id: "109", name: "TravelOutdoor"},
  {id: "111", name: "CharityCauses"},
  {id: "112", name: "Government"},
  {id: "102", name: "ScienceTechnology"},
  {id: "106", name: "Fashion"},
  {id: "107", name: "HomeLifestyle"},
];

function getAllCategories() {
  return categories;
}

const app = express();

app.get("/", (req, res) => {
  res.render("index", { categories: getAllCategories() });
});

app.post("/", (req, res) => {
  const searchQuery = req.query.search;
  const category = req.query.category;

  const queryParams = {
    token: eventbriteKey,
    ...(searchQuery.includes(",") ? { "location.address": searchQuery } : { q: searchQuery }),
    ...(category ? { categories: getAllCategories()[category] } : {})
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
          const allEvents = [...eventbriteEvents, ...bandsInTownEvents];
          res.json({ events: allEvents });
        });
      })
});

module.exports = router;
