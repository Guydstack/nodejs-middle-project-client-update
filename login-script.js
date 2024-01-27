console.log("From the frontend");


const url = 'https://nodejs-middle-project-update.onrender.com/workers/login';
// const admin = "info@gmail.com"
let users;


document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve values from form fields
    var email = document.getElementById('exampleInputEmail1').value;
    var password = document.getElementById('exampleInputPassword1').value;
    let select = document.getElementById('inputGroupSelect02').value;

    // Use the values as needed
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('select:', select);

    // Call your function or perform other actions here
    userLoged(email,password,select)
});

function userLoged(email, password, select) {
    const userE = email;
    const userP = password;
    const UserS = select;
    if (UserS === "worker") {

    fetch( "https://nodejs-middle-project-update.onrender.com/workers/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email: userE, user_password: userP })
    }) 
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error(`Failed to update the JSON file. Status: ${response.status}, ${response.statusText}`);
            }
            document.getElementById('myForm').reset();
            // Parse the JSON response from the server
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Check the isAdmin property in the JWT payload
            const isAdmin = data.user.premission;
            const isToken = data.token;

            document.cookie = `token=${isToken}; path=/; secure; samesite=None`;

            // Redirect based on user role
            redirectUser(isAdmin,UserS);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}else {

fetch( "https://nodejs-middle-project-update.onrender.com/clients/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_email: userE, user_password: userP })
}) 
    .then(response => {
        console.log(response);
        if (!response.ok) {
            throw new Error(`Failed to update the JSON file. Status: ${response.status}, ${response.statusText}`);
        }
        document.getElementById('myForm').reset();
        // Parse the JSON response from the server
        return response.json();
    })
    .then(data => {
        console.log(data);
        // Check the isAdmin property in the JWT payload
        const isAdmin = data.user.premission;
        const isToken = data.token;
        
            document.cookie = `token=${isToken}; path=/; secure; samesite=None`;

        // Redirect based on user role
        redirectUser(isAdmin,UserS);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
        
}}


function redirectUser(isAdmin,type) {

    if (isAdmin === 10 && type === "worker") {
        // Admin user or user with admin email, redirect to managing.html
        window.location.href = "/managin.html";
    } else {
        // Regular user, redirect to index.html
        window.location.href = "/index.html";
    }
}
