require('dotenv').config();
const bcrypt = require('bcrypt');


    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: hashedPassword }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert('Failed to log in');
      }
    }
