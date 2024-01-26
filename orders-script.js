const menu = document.getElementById("selectOption");
const selectedOption = document.getElementById("selectOption");
const orderConfirmation = document.getElementById("order_confirmation");


const getAllDish = async () => {
    try {
        const response = await fetch('http://localhost:3000/dishes/all');
        const data = await response.json();

        menu.innerHTML = "";

        if (data.success) {
            // Iterate through each product and append to the table
            data.products.forEach((product, index) => {
                menu.innerHTML += `
                <option value="${product._id}-${product.product_price}">
                ${product.product_name} - ${product.product_price}$
                </option>
                `;
            });
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

getAllDish();

document.getElementById("myForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const [productId, productPrice] = selectedOption.value.split('-');
    const userId = await fetchUserInfo(); // Assuming you have a function to get the user ID

    submitOrder(productId, productPrice, userId);

    console.log("Order Submission");
});



// Function to submit order with user ID
function submitOrder(id, price, userId) {
    const productId = id;
    const productPrice = price;
    const returnUserId = userId;

    fetch("http://localhost:3000/orders/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            total_price: productPrice,
            products: productId,
            user: returnUserId,
        }),
    })
    .then(response => {
        console.log(response);
        if (!response.ok) {
            throw new Error(`Failed to update the JSON file. Status: ${response.status}, ${response.statusText}`);
        }
        document.getElementById('myForm').reset();
        getUserOrders(returnUserId,productId)
    })
    .catch(error => {
        console.error('Error:', error.message);
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
  
        const loggedInUser = clients.find(user => user._id.toString() === loggedInUserId);
        return loggedInUser._id;
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


  const getUserOrders = async (userId,productId) => {
    try {
        const response = await fetch('http://localhost:3000/orders/all');
        const data = await response.json();

        if (data.success) {
            // Filter orders based on userId
            const filteredOrders = data.orders.filter((order) => {
              return order.user._id === userId && order.products.some(product => product._id === productId);
          });

          const lastProductOrder = filteredOrders[filteredOrders.length - 1];
            console.log(lastProductOrder);

            orderConfirmation.innerHTML += `
            <div class="alert alert-success confirmation-message" role="alert">
              <h4 class="alert-heading">🎉 Order Confirmed!</h4>
              <p>Thank you for choosing us! Your order has been successfully placed.</p>
              <hr>
              <p class="mb-0">Order Number: <span>${lastProductOrder._id}</span></p>
              <p class="mb-0">Dish Name: <span>${lastProductOrder.products[0].product_name}</span></p>
              <p class="mb-0">Total Price: <span>$${lastProductOrder.total_price.toFixed(2)}</span></p>
              <p>Your delicious meal is on its way. Enjoy!</p>
            </div>
          `;
          
    
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};