(() => {
  const api = "http://localhost:8080";
  let allInstructor = [];
  let allCourses = [];
  let editId = null;
  const courseForm = document.getElementById("courseForm");
  const courseNameInput = document.getElementById("name");
  const courseDescriptionInput = document.getElementById("description");
  const instructorSelect = document.getElementById("instructorId");
  const coursePriceInput = document.getElementById("fees");
  const submitBtn = document.getElementById("submit");
  let searchInput = document.createElement("input");

  // Store the last page visited in session storage
  sessionStorage.setItem("lastPageVisited", "CourseMaster");

  //sorting
  let sortDirection = 1;

  document.querySelector("th:nth-child(1)").style.cursor = "pointer";
  document.querySelector("th:nth-child(1)").addEventListener("click", () => {
    const sorted = [...allCourses].sort(
      (a, b) => a.title.localeCompare(b.title) * sortDirection
    );
    sortDirection *= -1;
    renderCourses(sorted);
  });

  document.querySelector("th:nth-child(2)").style.cursor = "pointer";
  document.querySelector("th:nth-child(2)").addEventListener("click", () => {
    const sorted = [...allCourses].sort(
      (a, b) => a.description.localeCompare(b.description) * sortDirection
    );
    sortDirection *= -1;
    renderCourses(sorted);
  });

  document.querySelector("th:nth-child(3)").style.cursor = "pointer";
  document.querySelector("th:nth-child(3)").addEventListener("click", () => {
    const sorted = [...allCourses].sort(
      (a, b) => (a.instructorID - b.instructorID) * sortDirection
    );
    sortDirection *= -1;
    renderCourses(sorted);
  });

  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("placeholder", "Search Instructors...");
  searchInput.classList.add("form-control", "mb-3");
  document
    .querySelector(".table")
    .parentNode.insertBefore(searchInput, document.querySelector(".table"));
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    let filtered = allCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm)
    );
    // const instructor = allInstructor.find(i => i.InstructorID == c.InstructorID);
    // const instructorName = instructor ? instructor.Name : "N/A";
    renderCourses(filtered);
  });

  function loadInstructors() {
    fetch(`${api}/instructors`)
      .then((res) => res.json())
      .then((data) => {
        allInstructor = data;
        const insSelect = document.getElementById("instructorId");
        data.forEach((ins) => {
          instructorSelect.innerHTML += `<option value="${ins.instructorID}">${ins.name}</option>`;
        });
      });
  }
  loadInstructors();

  function fetchAndRenderCourses() {
    fetch(`${api}/courses`)
      .then((res) => res.json())
      .then((data) => {
        allCourses = data;
        renderCourses(data);
      });
  }

  function renderCourses(Courses) {
    const tbody = document.getElementById("courseTableBody");
    tbody.innerHTML = "";

    Courses.forEach((c) => {
      const instructor = allInstructor.find(
        (i) => i.instructorID == c.instructorID
      );
      const instructorName = instructor ? instructor.name : "N/A";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.title}</td>
        <td>${c.description}</td>
        <td>${instructorName}</td>
        <td>${c.fees}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${c.courseID}">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${c.courseID}">
                <i class="bi bi-trash"></i>
            </button>
        </td>
        `;
      tbody.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        loadCourseForEdit(id);
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        deleteCourse(id);
      });
    });
  }

  function loadCourseForEdit(id) {
    fetch(`${api}/courses/${id}`)
      .then((response) => response.json())
      .then((data) => {
        courseNameInput.value = data.title;
        courseDescriptionInput.value = data.description;
        instructorSelect.value = data.instructorID;
        coursePriceInput.value = data.fees;
        editId = id;
        submitBtn.textContent = "Update Course";
      });
  }

  function updateCourse() {
    const updatedCourse = {
      // courseID: parseInt(editId),
      title: courseNameInput.value.trim(),
      description: courseDescriptionInput.value.trim(),
      instructorID: parseInt(instructorSelect.value),
      fees: parseInt(coursePriceInput.value),
    };

    console.log("Sending PUT payload:", JSON.stringify(updatedCourse));

    fetch(`${api}/courses/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updatedCourse }),
    }).then(() => {
      courseForm.reset();
      clearValidation();
      submitBtn.textContent = "Add Course";
      editId = null;
      fetchAndRenderCourses();
    });
  }

  function deleteCourse(id) {
    if (confirm("Are you sure you want to delete this course?")) {
      fetch(`${api}/courses/${id}`, {
        method: "DELETE",
      }).then(() => fetchAndRenderCourses());
    }
  }

  function validateCourseName() {
    let isValid = true;
    if (courseNameInput.value.trim().length < 5) {
      courseNameInput.classList.add("is-invalid");
      isValid = false;
    } else {
      courseNameInput.classList.remove("is-invalid");
    }
    return isValid;
  }

  function validateCourseDesc() {
    let isValid = true;
    if (courseDescriptionInput.value.trim().length < 10) {
      courseDescriptionInput.classList.add("is-invalid");
      isValid = false;
    } else {
      courseDescriptionInput.classList.remove("is-invalid");
    }
    return isValid;
  }

  function validateInstructor() {
    let isValid = true;
    if (!instructorSelect.value) {
      instructorSelect.classList.add("is-invalid");
      isValid = false;
    } else {
      instructorSelect.classList.remove("is-invalid");
    }
    return isValid;
  }

  function validateFees() {
    let isValid = true;
    if (!coursePriceInput.value || parseInt(coursePriceInput.value) <= 0) {
      coursePriceInput.classList.add("is-invalid");
      isValid = false;
    } else {
      coursePriceInput.classList.remove("is-invalid");
    }
    return isValid;
  }

  courseForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const exists = allCourses.find(
      (entry) => entry.Title === courseNameInput.value.trim()
    );
    if (exists) {
      alert("Course already exists");
    } else {
      if (
        validateCourseName() &&
        validateCourseDesc() &&
        validateInstructor() &&
        validateFees()
      ) {
        if (editId) {
          updateCourse();
        } else {
          addCourse();
        }
      }
    }
  });

  function addCourse() {
    const maxId =
      allCourses.length > 0
        ? Math.max(...allCourses.map((course) => course.courseID || 0))
        : 0;

    const newCourse = {
      // courseID: maxId + 1,
      title: courseNameInput.value.trim(),
      description: courseDescriptionInput.value.trim(),
      instructorID: instructorSelect.value,
      fees: coursePriceInput.value.trim(),
    };

    console.log("Sending POST payload:", JSON.stringify(newCourse));

    fetch(`${api}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    }).then(() => {
      courseForm.reset();
      clearValidation();
      fetchAndRenderCourses();
    });
  }

  function clearValidation() {
    courseNameInput.classList.remove("is-invalid");
    courseDescriptionInput.classList.remove("is-invalid");
    instructorSelect.classList.remove("is-invalid");
    coursePriceInput.classList.remove("is-invalid");
  }

  fetchAndRenderCourses();
})();
