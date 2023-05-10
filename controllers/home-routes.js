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

router.post("/search", (req, res) => {
  const searchQuery = req.body.search;
  const categoryId = req.body.category;

  // Set up Eventbrite API query params
  const eventbriteQueryParams = {
    token: eventbriteKey,
    ...(searchQuery.includes(",") ? { "location.address": searchQuery } : { q: searchQuery }),
  };
  if (categoryId !== "") {
    eventbriteQueryParams["categories"] = categoryId;
  }

  // Call Eventbrite API
  fetch(eventbriteUrl + "?" + new URLSearchParams(eventbriteQueryParams), {
      headers: {
        "Authorization": "Bearer " + eventbriteKey,
        "Content-Type": "application/json"
      },
      method: "GET"
    })
    .then(response => response.json())
    .then(eventbriteData => {
      const eventbriteEvents = eventbriteData.events || [];

      // Set up BandsInTown API query params
      const bandsInTownQueryParams = {
        app_id: bandsInTownKey,
        ...(searchQuery.includes(",") ? { "location": searchQuery } : { "keyword": searchQuery })
      };
      if (categoryId !== "") {
        bandsInTownQueryParams["classification_name"] = categories.find(category => category.id === categoryId).name;
      }

      // Call BandsInTown API
      return fetch(bandsInTownUrl + "?" + new URLSearchParams(bandsInTownQueryParams), {
          method: "GET"
        })
        .then(response => response.json())
        .then(bandsInTownData => {
          // List of events from the BandsInTown API response
          const bandsInTownEvents = bandsInTownData || [];

          // Combine the list of events and send the response
          const allEvents = [...eventbriteEvents, ...bandsInTownEvents];
          res.json(allEvents);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router


router.get('/', async (req, res) => {
  res.render('login');
  res.render('homepage');
});



module.exports = router;
