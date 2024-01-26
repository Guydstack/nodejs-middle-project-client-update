console.log("From the frontend");


const url = 'http://localhost:3000/clients/register';

let users;


document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve values from form fields
    var email = document.getElementById('exampleInputEmail1').value;
    var password = document.getElementById('exampleInputPassword1').value;
    var userName = document.getElementById('exampleInputname').value

    // Use the values as needed
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('name', userName);

    // Call your function or perform other actions here
    addUser(email,password,userName)
});

function addUser(email, password, userName) {
    const userE = email;
    const userN = userName;
    const userP = password;
    console.log(email);

    // Check if the user already exists in the database
    // ...

    fetch( "http://localhost:3000/clients/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email: userE, user_password: userP, user_name: userN })
    }) 
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error(`Failed to update the JSON file. Status: ${response.status}, ${response.statusText}`);
            }
            document.getElementById('myForm').reset();
            transferUser();
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}


function transferUser(){

    window.location.href = "/login.html";

}


// function updateUser(id, name, email, password) {
//     fetch(`http://localhost:3000/users/update_user/${id}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ user_name: name, user_email: email, user_occupancy: role, user_password: password }),
//     })
//         .then(response => {
//             if (response.status === 200) {
//                 getusersFromDB();
//                 document.getElementById('userForm').reset();
//             } else {
//                 console.error("Failed to update user");
//             }
//         })
//         .catch(error => {
//             console.error("An error occurred while updating the user:", error);
//         });
// }