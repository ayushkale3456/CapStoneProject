// (() => {
//   const apiurl = "http://localhost:8080/instructors";
//   let editID = null;
//   let form = document.getElementById("instructorForm");
//   let allInstructors = [];
//   let instructorNameInput = document.getElementById("name");
//   let instructorExpertise = document.getElementById("expertise");
//   let submitbtn = document.getElementById("submit");
//   let searchInput = document.createElement("input");

//   // Save intended location
//   sessionStorage.setItem("lastPageVisited", "InstructorMaster");

//   //sorting
//   let sortDirection = 1;

//   document.querySelector("th:nth-child(1)").style.cursor = "pointer";
//   document.querySelector("th:nth-child(1)").addEventListener("click", () => {
//     const sorted = [...allInstructors].sort(
//       (a, b) => a.name.localeCompare(b.name) * sortDirection
//     );
//     sortDirection *= -1;
//     renderInstructors(sorted);
//   });

//   document.querySelector("th:nth-child(2)").style.cursor = "pointer";
//   document.querySelector("th:nth-child(2)").addEventListener("click", () => {
//     const sorted = [...allInstructors].sort(
//       (a, b) => a.expertise.localeCompare(b.expertise) * sortDirection
//     );
//     sortDirection *= -1;
//     renderInstructors(sorted);
//   });

//   //search bar
//   searchInput.setAttribute("type", "text");
//   searchInput.setAttribute("placeholder", "Search Instructors...");
//   searchInput.classList.add("form-control", "mb-3");
//   document
//     .querySelector(".table")
//     .parentNode.insertBefore(searchInput, document.querySelector(".table"));
//   searchInput.addEventListener("input", () => {
//     const searchTerm = searchInput.value.toLowerCase();
//     const filtered = allInstructors.filter(
//       (ins) =>
//         ins.name.toLowerCase().includes(searchTerm) ||
//         ins.expertise.toLowerCase().includes(searchTerm)
//     );
//     renderInstructors(filtered);
//   });



(() => {
  const apiurl = "http://localhost:8080/instructors";
  let editID = null;
  let form = document.getElementById("instructorForm");
  let allInstructors = [];
  let instructorNameInput = document.getElementById("name");
  let instructorExpertise = document.getElementById("expertise");
  let submitbtn = document.getElementById("submit");
  let searchInput = document.createElement("input");

  // Save intended location
  sessionStorage.setItem("lastPageVisited", "InstructorMaster");

  //sorting
  let sortDirection = 1;

  document.querySelector("th:nth-child(1)").style.cursor = "pointer";
  document.querySelector("th:nth-child(1)").addEventListener("click", () => {
    const sorted = [...allInstructors].sort(
      (a, b) => a.name.localeCompare(b.name) * sortDirection
    );
    sortDirection *= -1;
    renderInstructors(sorted);
  });

  document.querySelector("th:nth-child(2)").style.cursor = "pointer";
  document.querySelector("th:nth-child(2)").addEventListener("click", () => {
    const sorted = [...allInstructors].sort(
      (a, b) => a.expertise.localeCompare(b.expertise) * sortDirection
    );
    sortDirection *= -1;
    renderInstructors(sorted);
  });

  //search bar
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("placeholder", "Search Instructors...");
  searchInput.classList.add("form-control", "mb-3");
  document
    .querySelector(".table")
    .parentNode.insertBefore(searchInput, document.querySelector(".table"));
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = allInstructors.filter(
      (ins) =>
        ins.name.toLowerCase().includes(searchTerm) ||
        ins.expertise.toLowerCase().includes(searchTerm)
    );
    renderInstructors(filtered);
  });

  function showErrorPopup(messages) {
    const popup = document.getElementById("errorPopup");
    popup.innerHTML = messages.map((msg) => `<div>${msg}</div>`).join("");
    popup.classList.remove("d-none");

    setTimeout(() => {
      popup.classList.add("d-none");
    }, 5000);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const instructor = {
      name: instructorNameInput.value.trim(),
      expertise: instructorExpertise.value.trim(),
    };

    if (editID) {
      fetch(`${apiurl}/${editID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instructor),
      }).then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          showErrorPopup(errorData);
        } else {
          fetchAndRenderInstructors();
          form.reset();
          editID = null;
          submitbtn.textContent = "Add Instructor";
        }
      });
    } else {
      fetch(`${apiurl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instructor),
      }).then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          showErrorPopup(errorData);
        } else {
          alert("Instructor added successfully!");
          form.reset();
          fetchAndRenderInstructors();
        }
      });
    }
  });

  function fetchAndRenderInstructors() {
    fetch(apiurl)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          showErrorPopup(errorData);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          allInstructors = data;
          renderInstructors(data);
        }
      })
      .catch((err) => {
        showErrorPopup("Error fetching instructors: " + err.message);
      });
  }

  function renderInstructors(Instructors) {
    const tbody = document.getElementById("instructorTableBody");
    tbody.innerHTML = "";

    Instructors.forEach((ins) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${ins.name}</td>
        <td>${ins.expertise}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${ins.instructorID}">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${ins.instructorID}">
                <i class="bi bi-trash"></i>
            </button>
        </td>
        `;
      tbody.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        loadInstructorForEdit(id);
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        deleteInstructor(id);
      });
    });
  }

  function loadInstructorForEdit(id) {
    fetch(`${apiurl}/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          showErrorPopup(errorData);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          instructorNameInput.value = data.name;
          instructorExpertise.value = data.expertise;
          editID = id;
          submitbtn.textContent = "Update Instructor";
        }
      })
      .catch((err) => {
        showErrorPopup("Error loading instructor: " + err.message);
      });
  }

  function deleteInstructor(id) {
    if (confirm("Are you sure you want to delete this Instructor?")) {
      fetch(`${apiurl}/${id}`, {
        method: "DELETE",
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          showErrorPopup(errorData);
        } else {
          alert("Instructor deleted successfully!");
          fetchAndRenderInstructors();
        }
      })
      .catch((err) => {
        showErrorPopup("Error deleting instructor: " + err.message);
      });
    }
  }

  fetchAndRenderInstructors();
})();
