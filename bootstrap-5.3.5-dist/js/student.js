(() => {
  const tableBody = document.getElementById("studentTableBody");
  const apiUrl = "http://localhost:8080/users";
  let allStudents = [];

  // Save intended location
  sessionStorage.setItem("lastPageVisited", "StudentMaster");

  let sortDirection = 1;

  // Create and add the search input
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("placeholder", "Search Students...");
  searchInput.classList.add("form-control", "mb-3");
  document
    .querySelector(".table")
    .parentNode.insertBefore(searchInput, document.querySelector(".table"));

  // Handle searching
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = allStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm)
    );
    renderStudents(filtered);
  });

  function showErrorPopup(messages) {
    const popup = document.getElementById("errorPopup");
    popup.innerHTML = messages.map((msg) => `<div>${msg}</div>`).join("");
    popup.classList.remove("d-none");

    setTimeout(() => {
      popup.classList.add("d-none");
    }, 5000);
  }

  // Fetch and render only students
  async function fetchStudents() {
    const res = await fetch(apiUrl);
    const data = await res.json();
    allStudents = data.filter((user) => user.usertype === "student");
    renderStudents(allStudents);
  }

  //sorting
  document.querySelector("th:nth-child(1)").style.cursor = "pointer";
  document.querySelector("th:nth-child(1)").addEventListener("click", () => {
    const sorted = [...allStudents].sort(
      (a, b) => a.name.localeCompare(b.name) * sortDirection
    );
    sortDirection *= -1;
    renderStudents(sorted);
  });

  document.querySelector("th:nth-child(2)").style.cursor = "pointer";
  document.querySelector("th:nth-child(2)").addEventListener("click", () => {
    const sorted = [...allStudents].sort(
      (a, b) => a.email.localeCompare(b.email) * sortDirection
    );
    sortDirection *= -1;
    renderStudents(sorted);
  });

  function renderStudents(students) {
    tableBody.innerHTML = "";

    students.forEach((student) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.phone}</td>
          <td>${student.password}</td>
          <td>
              <button class="btn btn-sm btn-outline-primary me-1 edit-btn" onclick="editStudent('${student.userid}')"><i class="fa fa-edit"></i></button>
              <button class="btn btn-sm btn-outline-danger delete-btn" onclick="deleteStudent('${student.userid}')"><i class="fa fa-trash"></i></button>
          </td>`;
      tableBody.appendChild(tr);
    });
  }

  // Edit
  window.editStudent = async function (id) {
    const res = await fetch(`${apiUrl}/${id}`);
    const student = await res.json();

    document.getElementById("editStudentSection").style.display = "block";
    document.getElementById("editId").value = student.userid;
    document.getElementById("editName").value = student.name;
    document.getElementById("editEmail").value = student.email;
    document.getElementById("editPhone").value = student.phone;
    document.getElementById("editPassword").value = student.password;
  };

  document
    .getElementById("editStudentForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const id = document.getElementById("editId").value;
      const updatedStudent = {
        name: document.getElementById("editName").value.trim(),
        email: document.getElementById("editEmail").value.trim(),
        phone: document.getElementById("editPhone").value.trim(),
        password: document.getElementById("editPassword").value.trim(),
        usertype: "student",
      };

      await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      }).then(async (res) => {
        if (!res.ok) {
          console.log("Sending PUT data:", updatedStudent);
          const errorData = await res.json();
          showErrorPopup(errorData);
        } else {
          console.log("Sending PUT data:", updatedStudent);

          fetchStudents();
          document.getElementById("editStudentForm").reset();
          document.getElementById("editStudentSection").style.display = "none";
        }
      });
    });

  // Delete
  window.deleteStudent = async function (id) {
    if (confirm("Are you sure you want to delete this student?")) {
      await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });
      fetchStudents();
    }
  };

  // Initial fetch
  fetchStudents();
})();
