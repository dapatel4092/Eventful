const express = require('express');
const router = express.Router();

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
  const { search, category } = req.body;
  const eventbriteQueryParams = { q: search, ...getAllCategories(category), token: eventbriteKey };
  const bandsInTownQueryParams = { app_id: bandsInTownKey, location: search };

  Promise.all([
    fetch(eventbriteUrl + "?" + new URLSearchParams(eventbriteQueryParams)).then(response => response.json()),
    fetch(bandsInTownUrl + "?" + new URLSearchParams(bandsInTownQueryParams)).then(response => response.json())
  ])
  .then(([eventbriteData, bandsInTownData]) => {
    // List of events from the Eventbrite API response
    const eventbriteEvents = eventbriteData.events || [];
    // List of events from the BandsInTown API response
    const bandsInTownEvents = bandsInTownData || [];
    const allEvents = [...eventbriteEvents, ...bandsInTownEvents];

    // Set the searchPage property to true
    res.locals.searchPage = true;

    res.render('events', { events: allEvents });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: "An error occurred while searching for events" });
  });
});

console.log(Promise.all)

module.exports = router;
