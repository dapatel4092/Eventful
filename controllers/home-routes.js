const router = require('express').Router();

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/homepage');
    return;
  }

  res.render('login');
});



router.get('/', async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  
  res.render('homepage');

});

function getAllCategories() {
  // Assuming 'categories' is an object containing all event categories
  return Object.values(categories);
}

module.exports = router;












