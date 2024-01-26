console.log("From the frontend");

const alldishes = document.querySelector("#all_dishes");

const url = 'http://localhost:3000/dishes/all';


let dishes;

async function getDishesFromDB() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        dishes = data;
        console.log(dishes);
        printDishes(data);
    } catch (error) {
        console.log('Error:', error);
    }
}

getDishesFromDB();


function printDishes(dishes){
    alldishes.innerHTML = ''

    dishes.products.forEach(function (dishes)  {
        alldishes.innerHTML += `
        <div class="card">
          <img src="${dishes.product_image}" class="card-img-top img-fluid">
          <div class="card-body">
            <h5 class="card-title">${dishes.product_name}</h5>
            <p class="card-text">${dishes.product_description}</p>
            <p class="card-text"><small class="text-body-secondary">${dishes.product_price}</small></p>
          </div>
        </div>
        `
    });
};


async function fetchUserInfo() {
    try {
      const response = await fetch('http://localhost:3000/clients/all');
      const data = await response.json();
      const clients = data.clients;
      console.log(clients)
  
      const token = getCookie('token'); // Assume you have a function to get cookies named getCookie
  
      if (token) {
        const payload = parseJwt(token);
        const loggedInUserId = payload.user_id;
        const isAdmin = Number(payload.premission);

  
        const loggedInUser = clients.find(user => user._id.toString() === loggedInUserId);
  
        const userNameElement = document.querySelector(".user_name");
        const navBar = document.querySelector(".user_name");
        const userLogout = document.querySelector(".userLOut");
        const desplay = document.querySelectorAll(".desplay");
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
               <a class="nav-link text-primary" href="managin.html">Managment</a>
               <a class="nav-link text-primary" href="index.html" onclick="logOut()">LogOut</a>
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
            `
          userNameElement.innerHTML += `<small class="text-right">Welcome ${loggedInUser.user_name}</small>`;
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