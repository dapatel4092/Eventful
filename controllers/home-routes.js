const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/search', async (req, res) => {
  const searchQuery = req.query.search;
  const category = req.query.category;

  const eventbriteUrl = 'https://www.eventbriteapi.com/v3/events/search/';
  const eventbriteKey = 'LMZTLLTII2KJCUS7PBHH';

  const queryParams = {
    token: eventbriteKey,
    ...(searchQuery.includes(',') ? { 'location.address': searchQuery } : { q: searchQuery }),
    categories: [],
  };

  try {
    const response = await fetch(eventbriteUrl + '?' + new URLSearchParams(queryParams), {
      headers: {
        Authorization: 'Bearer ' + eventbriteKey,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    res.render('homepage', { categories: [], events: data.events });
  } catch (error) {
    console.error(error);
    res.render('homepage', { categories: [], events: [] });
  }
});




router.get('/', async (req, res) => {
  res.render('login');
  res.render('homepage');
});



module.exports = router;
