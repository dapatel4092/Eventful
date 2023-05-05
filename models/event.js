//API for event brite
const eventbriteUrl = "https://www.eventbriteapi.com/v3/users/me/?token="
const eventbriteKey = "LMZTLLTII2KJCUS7PBHH"

const bandstownKey = "3a9f493fc15e7dac615ac7e56581f4da"

fetch("https://www.eventbriteapi.com/v3/events/search/?q=music&location.address=San+Francisco&token=" + eventbriteKey, {
  headers: {
    "Authorization": "Bearer " + eventbriteKey,
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(data => {
  console.log(data); // put something with the event data
})
.catch(error => console.error(error));
