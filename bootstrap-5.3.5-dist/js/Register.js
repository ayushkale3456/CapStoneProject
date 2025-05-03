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

function validateUsername() {
    if (userName.value.trim().length >= 5) {
        userName.classList.add("is-valid");
        userName.classList.remove("is-invalid");
        return true;
    } else {
        userName.classList.add("is-invalid");
        userName.classList.remove("is-valid");
        return false;
    }
}

function validatePassword() {
    const pass = userPass.value;
    const passRegex = /^(?=.[a-z])(?=.*\W).{3,}$/;

    if (passRegex.test(pass)) {
        userPass.classList.add("is-valid");
        userPass.classList.remove("is-invalid");
        return true;
    } else {
        userPass.classList.add("is-invalid");
        userPass.classList.remove("is-valid");
        return false;
    }
}


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
let valid = allEmail.find(entry => entry.email === userEmail.value);

function validateEmail() {
    if (userEmail.value && userEmail.checkValidity()) {
        userEmail.classList.add("is-valid");
        userEmail.classList.remove("is-invalid");
        return true;

    } else {
        userEmail.classList.add("is-invalid");
        userEmail.classList.remove("is-valid");
        return false;
    }
    // fetch(`${apiUrl}`)
    //         .then(res => res.json())
    //         .then(users => {
    //             const user = users.find(u => u.email === userEmail.value);
    //             if (user) {
    //                 alert()
    //                 return false;
    //             }
    //         });
}


// async function validateEmail() {
//     const email = document.getElementById("email").value.trim();
//     if (!email) {
//       showFeedback("email", "Email is required.", false);
//       isValidEmail = false;
//       return false;
//     }
  
//     try {
//       const res = await fetch(URL);
//       const data = await res.json();
//       const exists = data.find(user => user.Email.toLowerCase() === email.toLowerCase());
  
//       if (exists) {
//         showFeedback("email", "Email already registered.", false);
//         alert("Exists");
//         isValidEmail = false;
//         return false;
//       } else {
//         showFeedback("email", "", true);
//         isValidEmail = true;
//         return true;
//       }
//     } catch (err) {
//       console.error("Error validating email:", err);
//       showFeedback("email", "Error validating email.", false);
//       isValidEmail = false;
//       return false;
//     }
// }


function validateMobile() {
    const mobileRegex = /^[789]\d{9}$/;
    if (mobileRegex.test(userphone.value.trim())) {
        userphone.classList.add("is-valid");
        userphone.classList.remove("is-invalid");
        return true;
    } else {
        userphone.classList.add("is-invalid");
        userphone.classList.remove("is-valid");
        return false;
    }
}


function validateType() {
    if (userType.value) {
        userType.classList.add("is-valid");
        userType.classList.remove("is-invalid");
        return true;
    } else {
        userType.classList.add("is-invalid");
        userType.classList.remove("is-valid");
        return false;
    }
}





form.addEventListener("submit", async function (e) {
    e.preventDefault();
    await fetchAndRender(); // make sure allEmail is up-to-date

    const valid = allEmail.find(entry => entry.email === userEmail.value.trim());
    if (valid) {
        alert("User Exists!!!")
    } else {
        if (validateUsername() & validateEmail() & validateMobile() & validatePassword() & validateType() & validatePassword()) {
            addUser();
        }
    }


});
function addUser() {

    // const nextUserID = allEmail.length
    //     ? Math.max(...allEmail.map(u => u.userid || u.id)) + 1 : 1;
    const users = {
        // userid: nextUserID,
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