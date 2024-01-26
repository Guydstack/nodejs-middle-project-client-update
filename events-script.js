console.log("From the frontend");

const allEvents = document.querySelector(".carousel-inner");

const url = 'http://localhost:3000/events/all';


let events;

async function getDishesFromDB() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        events = data;
        console.log(events);
        printDishes(data);
    } catch (error) {
        console.log('Error:', error);
    }
}

getDishesFromDB();


function printDishes(events) {
    events.products.forEach(function (event) {
      console.log(event.event_name);
      
      // Create a new carousel item HTML
      const newCarouselItem = `
        <div class="carousel-item">
          <img src="${event.event_image}" class="d-block w-100" alt="...">
          <div class="carousel-caption d-none d-md-block">
            <h5>${event.event_name}</h5>
            <p>${event.event_description}</p>
            <small>${event.event_price}</small>
          </div>
        </div>
      `;
      
      // Insert the new carousel item after the last carousel item
      allEvents.insertAdjacentHTML('beforeend', newCarouselItem);
    });
  }
  
  async function fetchUserInfo() {
    try {
      const response = await fetch('http://localhost:3000/clients/all');
      const data = await response.json();
      const clients = data.clients;
      const token = getCookie('token'); // Assume you have a function to get cookies named getCookie
  
      if (token) {
        const payload = parseJwt(token);
        const loggedInUserId = payload.user_id;
        const isAdmin = Number(payload.premission);
  
        const loggedInUser = clients.find(user => user._id.toString() === loggedInUserId);
        const userNameElement = document.querySelector(".user_name");
        const userLogout = document.querySelector(".userLOut")
        const navBar = document.querySelector(".user_name");
        const desplay = document.querySelectorAll(".desplay")
        const navLink = document.querySelector(".nav-link");
         if (navBar && loggedInUser && isAdmin === 10){
            // Check if there are elements with the class "desplay"
            if (desplay.length > 0) {
              // Iterate through each element and hide it
              desplay.forEach(element => {
                  element.style.display = "none";
              });
            } else {
              console.error('No elements with class "desplay" found.');
            }
           navBar.innerHTML += `
               <small class="text-right">Welcome ${loggedInUser.user_name}
               <a class="nav-link" href="index.html" onclick="logOut()">LogOut</a>
               <a class="nav-link text-primary" href="managin.html">Managment</a>
               </small>
               `;
         }
        else if (userNameElement && loggedInUser) {

            // Check if there are elements with the class "desplay"
            if (desplay.length > 0) {
              // Iterate through each element and hide it
              desplay.forEach(element => {
                  element.style.display = "none";
              });
            } else {
              console.error('No elements with class "desplay" found.');
            }
            userLogout.innerHTML += `
            <li class="nav-item">
            <a class="nav-link" href="index.html" onclick="logOut()">LogOut</a>
            </li>
            `;
          userNameElement.innerHTML += `
          <small class="text-right">Welcome ${loggedInUser.user_name}</small>`;
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  // Function to get cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  // Function to parse JWT
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error.message);
      return {};
    }
  }
  

        // Call the function when the page loads
        fetchUserInfo();


        function logOut(){
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        };