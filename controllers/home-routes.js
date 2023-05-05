const router = require('express').Router();

router.get('/', async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  res.render('homepage');
  
});

function getAllCategories() {
  return Object.values(categories);
}

module.exports = router;

















