// function loadPage(page) {
//     fetch(`pages/${page}`)
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('main-content').innerHTML = data;

//             if (page === "adminDashboard.html") {
//                 loadDashboardCards();
//               }
//         })
//         .catch(err => {
//             document.getElementById('main-content').innerHTML = '<p class="text-danger">Failed to load content.</p>';
//         });
// }

function loadPage(page) {
  fetch(`pages/${page}`)
    .then((response) => response.text())
    .then((data) => {
      const container = document.getElementById("main-content");
      container.innerHTML = data;

      // Extract and evaluate scripts manually
      const scripts = container.querySelectorAll("script");
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
        script.remove(); // Optional: remove the original script tag
      });
    })
    .catch((err) => {
      document.getElementById("main-content").innerHTML =
        '<p class="text-danger">Failed to load content.</p>';
      console.error(err);
    });
}

// Check for last visited page and handle it
let lastPage = sessionStorage.getItem("lastPageVisited");
// console.log(lastPage);
if (lastPage === "adminProfile") {
  sessionStorage.removeItem("lastPageVisited");
  loadPage("adminProfile.html");
} else if (lastPage === "CourseMaster") {
  sessionStorage.removeItem("lastPageVisited");
  loadPage("CourseMaster.html");
} else if (lastPage === "InstructorMaster") {
  sessionStorage.removeItem("lastPageVisited");
  loadPage("InstructorMaster.html");
} else if (lastPage === "StudentMaster") {
  sessionStorage.removeItem("lastPageVisited");
  loadPage("StudentMaster.html");
} else if (lastPage === "adminEnrollment") {
  sessionStorage.removeItem("lastPageVisited");
  loadPage("EnrollementTransaction.html");
} else if (lastPage === "studentProfile") {
  sessionStorage.removeItem("lastPageVisited");
  loadPage("studentProfile.html");
} else if (lastPage === "studentAvailableCourses") {
  sessionStorage.removeItem("lastPageVisited");
  loadPage("studentAvailableCourses.html");
}


function loadDashboardCards() {
  const data = [
    { title: "Total Users", value: 128, icon: "fa-users" },
    { title: "Total Courses", value: 34, icon: "fa-book-open" },
    { title: "Instructors", value: 12, icon: "fa-chalkboard-teacher" },
    { title: "Enrollments", value: 87, icon: "fa-user-pen" },
  ];

  const container = document.getElementById("dashboard-cards");
  if (!container) return;

  container.innerHTML = "";
  data.forEach((item) => {
    container.innerHTML += `
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card border-secondary h-100 bg-dark text-white">
            <div class="card-body d-flex align-items-center">
              <i class="fa ${item.icon} fa-2x me-3" style="color: #B9B4C7;"></i>
              <div>
                <h6 class="card-title text-secondary">${item.title}</h6>
                <h4 class="card-text" style="color: #B9B4C7;">${item.value}</h4>
              </div>
            </div>
          </div>
        </div>
      `;
  });
}
