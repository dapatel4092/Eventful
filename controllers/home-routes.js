const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

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

router.post('/search', async (req, res) => {
  const searchQuery = req.body.search;
  const categoryId = req.body.category;

  const queryParams = {
    token: eventbriteKey,
    ...(searchQuery.includes(",") ? { "location.address": searchQuery } : { q: searchQuery }),
    ...(categoryId ? { categories: getAllCategories()[categoryId] } : {})
  };

  try {
    const response = await fetch(eventbriteUrl, {
      headers: {
        "Authorization": "Bearer " + eventbriteKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(queryParams),
      method: "POST"
    });
    const eventbriteData = await response.json();
    const eventbriteEvents = eventbriteData.events || [];

    const bandsInTownQueryParams = {
      app_id: bandsInTownKey,
      ...(searchQuery.includes(",") ? { "location": searchQuery } : { "keyword": searchQuery })
    };

    const bandsInTownResponse = await fetch(bandsInTownUrl + "?" + new URLSearchParams(bandsInTownQueryParams));
    const bandsInTownData = await bandsInTownResponse.json();
    const bandsInTownEvents = bandsInTownData || [];

    const allEvents = [...eventbriteEvents, ...bandsInTownEvents];
    res.json({ events: allEvents });
    console.log(allEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
