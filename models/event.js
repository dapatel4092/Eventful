const express = require("express");
const router = express.Router();


const eventbriteUrl = "https://www.eventbriteapi.com/v3/events/search/?token=QOOHC5WX4AP43WMELN2V";
const eventbriteKey = "BQ26PEGLUJPOJV34X6";
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

router.get("/", (req, res) => {
  res.render("index", { categories: getAllCategories() });
});

router.post("/", (req, res) => {
  const searchQuery = req.query.search;
  const category = req.query.category;

  const queryParams = {
    token: eventbriteKey,
    ...(searchQuery.includes(",") ? { "location.address": searchQuery } : { q: searchQuery }),
    ...(category ? { categories: getAllCategories()[category] } : {})
  };

  fetch(eventbriteUrl + "?" + new URLSearchParams(queryParams), {
    headers: {
      "Authorization": "Bearer " + eventbriteKey,
      "Content-Type": "application/json"
    },
    method: "GET"
  })
    .then(response => response.json())
    .then(eventbriteData => {
      const eventbriteEvents = eventbriteData.events || [];

      const bandsInTownQueryParams = {
        app_id: bandsInTownKey,
        ...(searchQuery.includes(",") ? { "location": searchQuery } : { "artist": searchQuery })
      };

      fetch(bandsInTownUrl + "?" + new URLSearchParams(bandsInTownQueryParams), {
        headers: {
          "Content-Type": "application/json"
        },
        method: "GET"
      })
        .then(response => response.json())
        .then(bandsInTownData => {
          const bandsInTownEvents = bandsInTownData || [];

          const allEvents = [...eventbriteEvents, ...bandsInTownEvents];

          res.json({ events: allEvents });
          console.log(allEvents);
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
