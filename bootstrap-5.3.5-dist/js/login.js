document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  verify();
});

function verify() {
  const email = document.getElementById("signinEmail").value.toLowerCase();
  const password = document.getElementById("signinPassword").value;

  fetch("http://localhost:8080/users")
    .then((res) => res.json())
    .then((users) => {
      const user = users.find(
        (u) => u.email.toLowerCase() === email && u.password === password
      );

      if (user) {
        console.log("User found:", user);

        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        sessionStorage.setItem("userId", user.userid || user.id);
        sessionStorage.setItem("userName", user.name);
        sessionStorage.setItem("userType", user.usertype);
        sessionStorage.setItem("userEmail", user.email);
        sessionStorage.setItem("userContact", user.phone);

        if (user.usertype === "admin") {
          alert("Redirecting to admin.html");
          window.location.href = "../admin.html";
        } else if (user.usertype === "student") {
          alert("Redirecting to student.html");
          window.location.href = "../student.html";
        } else {
          alert("Unknown user type: " + user.usertype);
        }
      } else {
        alert("Invalid email or password.");
      }
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
    });
}

function getUserId() {
  return sessionStorage.getItem("userId");
}

function getUserName() {
  return sessionStorage.getItem("userName");
}

function getUserType() {
  return sessionStorage.getItem("userType");
}

function logout() {
  sessionStorage.clear();
  sessionStorage.setItem("loggedOut", "true");
  window.location.href = "../pages/signIn.html";
}
