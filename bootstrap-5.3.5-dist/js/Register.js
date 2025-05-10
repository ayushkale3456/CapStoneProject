const apiUrl = "http://localhost:8080/users";
let allUsers = [];
const form = document.getElementById("userForm");
const userName = document.getElementById("name");
const userEmail = document.getElementById("signupEmail");
const userphone = document.getElementById("signupPhone");
const userPass = document.getElementById("signupPassword");
const userType = document.getElementById("userType");
const submit = document.getElementById("submit");
let allEmail = [];
let editId = null;

function fetchAndRender() {
    // fetch(`${apiUrl}`)
    //     .then(res => res.json())
    //     .then(data => {
    //         allEmail = data;

    //     });
    return fetch(`${apiUrl}`)
        .then(res => res.json())
        .then(data => {
            allEmail = data;
        });
}



form.addEventListener("submit", async function (e) {
    e.preventDefault();
    await fetchAndRender();

    const valid = allEmail.find(entry => entry.email === userEmail.value.trim());
    if (valid) {
        alert("User Exists!!!")
    } else {
        addUser();
    }


});
function addUser() {
    const users = {
        name: userName.value.trim(),
        email: userEmail.value.trim(),
        password: userPass.value.trim(),
        phone: Number(userphone.value.trim()),
        usertype: userType.value.trim(),

    };

    try {
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(users)
        });
        window.location.href = "../pages/signIn.html";
    } catch (error) {
        console.error("Error adding user:", error);
    }
    
}