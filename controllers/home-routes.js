const router = require('express').Router();

router.get('/', async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  res.render('login');
  
});

function getAllCategories() {
  return Object.values(categories);
}

module.exports = router;

















