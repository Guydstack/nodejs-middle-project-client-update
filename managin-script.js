console.log("From the frontend");


// const url = 'http://localhost:3000/events/add';

    // Your form submission logic goes here
var title = document.getElementById("exampleInputname");
var information = document.getElementById("validationTextarea");
var selectedOption = document.getElementById("selectOption");
var amount = document.getElementById("amountInput");
var fileInput = document.getElementById("validatedCustomFile");
var eventUrl = document.getElementById("exampleInputUrl");
const eventsL = document.getElementById("eventList");


// check if need to add async
document.getElementById("myForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData();
    formData.append('event_image', fileInput.files[0]);
    console.log(fileInput.files[0]);

    if (selectedOption.value !== "event") {
        console.log("Menu Submition");
        const imageUrl = eventUrl.value.trim();
    if (imageUrl) {
        console.log("User provided URL:", imageUrl);
        addDish(title.value, information.value, amount.value, imageUrl);
    } else if (fileInput.files.length > 0){
        const fileData = fileInput.files[0].name;
        console.log("User uploaded file:", fileData);
        addDish(title.value, information.value, amount.value, fileData, formData);
    } else {
        console.log("No URL or file provided");
    }
    } else {
        // Check if the user provided a URL or uploaded a file
        const imageUrl = eventUrl.value.trim();
        if (imageUrl) {
            console.log("User provided URL:", imageUrl);
            addEvent(title.value, information.value, amount.value, imageUrl);
        } else if (fileInput.files.length > 0) {
            const fileData = fileInput.files[0].name;
            console.log("User uploaded file:", fileData);
            addEvent(title.value, information.value, amount.value, fileData, formData);
        } else {
            console.log("No URL or file provided");
        }

        console.log("Event Submition");
    }
});


function addEvent(title, information, amount, eventUrl, formData) {
    const event_t = title;
    const event_i = information;
    const event_a = amount;
    const event_u = eventUrl;

    // Create a new FormData object
    const mixedFormData = new FormData();

    // Append JSON data as text fields
    mixedFormData.append('event_name', event_t);
    mixedFormData.append('event_description', event_i);
    mixedFormData.append('event_price', event_a);

        // Append the file data
    if (formData) {
        mixedFormData.append('event_image', formData.get('event_image'));
    } else {
        mixedFormData.append('event_image', event_u);
    }

console.log(mixedFormData);
    // Send the mixed FormData in the fetch request
    // check if need to add await
    fetch("http://localhost:3000/events/add", {
        method: "POST",
        body: mixedFormData
    })
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error(`Failed to update the JSON file. Status: ${response.status}, ${response.statusText}`);
            }
            document.getElementById('myForm').reset();
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
};

function addDish(title, information, amount, dishUrl, fileData) {

    const dish_t = title;
    const dish_i = information;
    const dish_a = amount;
    const dish_u = dishUrl;


    fetch("http://localhost:3000/dishes/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            product_name: dish_t,
            product_description: dish_i,
            product_price: dish_a,
            product_image: dish_u,
        }),
    })
    .then(response => {
        console.log(response);
        if (!response.ok) {
            throw new Error(`Failed to update the JSON file. Status: ${response.status}, ${response.statusText}`);
        }
        document.getElementById('myForm').reset();
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
};


const getAllProducts = async () => {
    try {
        const response = await fetch('http://localhost:3000/events/all');
        const data = await response.json();
        eventsL.innerHTML = "";

        if (data.success) {
            // Iterate through each product and append to the table
            data.products.forEach((product, index) => {
                eventsL.innerHTML += `
                    <tr>
                        <th scope="row">${index + 1}</th>
                        <td contenteditable="true" onblur="editValue('${product._id}', this.innerText, 'event_name')">${product.event_name}</td>
                        <td contenteditable="true" onblur="editValue('${product._id}', this.innerText, 'event_description')">${product.event_description}</td>
                        <td contenteditable="true" onblur="editValue('${product._id}', this.innerText, 'event_price')">${product.event_price}</td>
                        <td>${product.event_image ? `<img src="${product.event_image}" alt="Event Image" style="max-width: 100px;">` : 'No Image'}</td>
                        <td><button class="border-0 rounded-circle bg-primary text-white" onclick="removeEvent('${product._id}')">X</button></td>
                    </tr>`;
            });
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};



const getAllDish = async () => {
    try {
        const response = await fetch('http://localhost:3000/dishes/all');
        const data = await response.json();
        eventsL.innerHTML = "";

        if (data.success) {
            // Iterate through each product and append to the table
            data.products.forEach((product, index) => {
                eventsL.innerHTML += `
                    <tr>
                        <th scope="row">${index + 1}</th>
                        <td contenteditable="true" onblur="editManuValue('${product._id}', this.innerText, 'product_name')">${product.product_name}</td>
                        <td contenteditable="true" onblur="editManuValue('${product._id}', this.innerText, 'product_description')">${product.product_description}</td>
                        <td contenteditable="true" onblur="editManuValue('${product._id}', this.innerText, 'product_price')">${product.product_price}</td>
                        <td>${product.product_image ? `<img src="${product.product_image}" alt="Product Image" style="max-width: 100px;">` : 'No Image'}</td>
                        <td><button class="border-0 rounded-circle bg-primary text-white" onclick="removeManu('${product._id}')">X</button></td>
                    </tr>`;
            });
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

function editValue(productId, newValue, type) {
    // Construct the body based on the type of value to update
    const body = {};
    if (type === "event_name") {
        body.event_name = newValue;
    } else if (type === "event_description") {
        body.event_description = newValue;
    } else if (type === "event_price") {
        body.event_price = newValue;
    }

    // Send a request to your server to update the value in the database
    fetch(`http://localhost:3000/events/update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Successfully updated ${type} for ${productId} with new value: ${newValue}`);
        } else {
            console.error(`Error updating ${type} for ${productId}: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
}

function editManuValue(productId, newValue, type) {
    // Construct the body based on the type of value to update
    const body = {};
    if (type === "product_name") {
        body.product_name = newValue;
    } else if (type === "product_description") {
        body.product_description = newValue;
    } else if (type === "product_price") {
        body.product_price = newValue;
    }

    // Send a request to your server to update the value in the database
    fetch(`http://localhost:3000/dishes/update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Successfully updated ${type} for ${productId} with new value: ${newValue}`);
        } else {
            console.error(`Error updating ${type} for ${productId}: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
}

function removeEvent(productId) {

    // Send a request to your server to update the value in the database
    fetch(`http://localhost:3000/events/delete/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Successfully delete ${productId}`);
            getAllProducts();
        } else {
            console.error(`Error updating ${type} for ${productId}: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
}


function removeManu(productId) {

    // Send a request to your server to update the value in the database
    fetch(`http://localhost:3000/dishes/delete/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Successfully delete ${productId}`);
            getAllDish();
        } else {
            console.error(`Error updating ${type} for ${productId}: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
}

async function fetchUserInfo() {
    try {
      const response = await fetch('http://localhost:3000/workers/all');
      const data = await response.json();
      const workers = data.Workers;
  
      const token = getCookie('token'); // Assume you have a function to get cookies named getCookie
  
      if (token) {
        const payload = parseJwt(token);
        const loggedInUserId = payload.user_id;
        const isAdmin = Number(payload.premission);
  
        const loggedInUser = workers.find(user => user._id.toString() === loggedInUserId);
  
        const userNameElement = document.querySelector(".user_name");
        const navBar = document.querySelector(".user_name");
        if (navBar && loggedInUser && isAdmin === 10){
           navBar.innerHTML += `
           <small class="text-right">Welcome ${loggedInUser.user_name}
           <a class="nav-link" href="managin.html">Managment</a>
           </small>
               `;
         }
        else if (userNameElement && loggedInUser) {
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
