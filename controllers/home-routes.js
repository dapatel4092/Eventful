const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Import the code from the other file
const {
  getAllCategories,
  eventbriteUrl,
  eventbriteKey,
  bandsInTownUrl,
  bandsInTownKey,
} = require('../models/event.js');

// Define the route handlers

router.get('/', async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  res.render('homepage');
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/homepage');
    return;
  }

  res.render('login');
});

router.post('/search', (req, res) => {
  const searchQuery = req.body.search;
  const categoryId = req.body.category;

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
          console.log(allEvents);
        });
      })
});


module.exports = router;
