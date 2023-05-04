const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect to the login page
  if (!req.session.loggedIn) {
    res.redirect('/login');
  }
  else {
    next();
  }
};

module.exports = withAuth;