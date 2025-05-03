(() => {
  const api = "http://localhost:8080";
  let enrollments = [];
  let users = [];
  let courses = [];
  let instructors = [];
  let editId = null;
  let sortDirection = 1;

  // Save intended location
  sessionStorage.setItem("lastPageVisited", "adminEnrollment");

  const enrollmentForm = document.getElementById("enrollmentForm");
  const studentSelect = document.getElementById("userId");
  const courseSelect = document.getElementById("courseId");
  const enrollmentDateInput = document.getElementById("enrollmentDate");
  const submitBtn = document.getElementById("submit");
  const searchInput = document.getElementById("searchInput");
  const tbody = document.getElementById("enrollmentTableBody");

  async function loadData() {
    const [enrollmentRes, userRes, courseRes, instructorRes] =
      await Promise.all([
        fetch(`${api}/enrollments`),
        fetch(`${api}/users`),
        fetch(`${api}/courses`),
        fetch(`${api}/instructors`),
      ]);

    enrollments = await enrollmentRes.json();
    users = await userRes.json();
    courses = await courseRes.json();
    instructors = await instructorRes.json();

    populateDropdowns();
    renderEnrollments(enrollments);
  }

  function populateDropdowns() {
    studentSelect.innerHTML = '<option value="">--Select Student--</option>';
    courseSelect.innerHTML = '<option value="">--Select Course--</option>';

    users.forEach((u) => {
      studentSelect.innerHTML += `<option value="${u.userid}">${u.name}</option>`;
    });

    courses.forEach((c) => {
      courseSelect.innerHTML += `<option value="${c.courseID}">${c.title}</option>`;
    });
  }

  function renderEnrollments(data) {
    tbody.innerHTML = "";
    data.forEach((e) => {
      const student = users.find((u) => u.userid == e.userID);
      const course = courses.find((c) => c.courseID == e.courseID);
      const instructor = instructors.find(
        (i) => i.instructorID == course?.instructorID
      );

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${student?.name || "Unknown"}</td>
        <td>${course?.title || "Unknown"}</td>
        <td>${instructor?.name || "Unknown"}</td>
        <td>${e.enrollmentDate}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${
            e.enrollmentID
          }"><i class="fa fa-edit"></i></button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${
            e.enrollmentID
          }"><i class="fa fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        loadEdit(btn.getAttribute("data-id"))
      );
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        deleteEnrollment(btn.getAttribute("data-id"))
      );
    });
  }

  function loadEdit(id) {
    const data = enrollments.find((e) => e.enrollmentID == id);
    if (data) {
      studentSelect.value = data.userID;
      courseSelect.value = data.courseID;
      enrollmentDateInput.value = data.enrollmentDate;
      editId = data.userid;
      submitBtn.textContent = "Update Enrollment";
    }
  }

  function deleteEnrollment(id) {
    if (confirm("Are you sure you want to delete this enrollment?")) {
      fetch(`${api}/enrollments/${id}`, { method: "DELETE" }).then(() =>
        loadData()
      );
    }
  }

  function validateForm() {
    let isValid = true;

    if (!studentSelect.value) {
      studentSelect.classList.add("is-invalid");
      isValid = false;
    } else studentSelect.classList.remove("is-invalid");

    if (!courseSelect.value) {
      courseSelect.classList.add("is-invalid");
      isValid = false;
    } else courseSelect.classList.remove("is-invalid");

    if (!enrollmentDateInput.value) {
      enrollmentDateInput.classList.add("is-invalid");
      isValid = false;
    } else enrollmentDateInput.classList.remove("is-invalid");

    return isValid;
  }

  // function getNextId() {
  //   return enrollments.length
  //     ? Math.max(...enrollments.map((e) => e.enrollmentID)) + 1
  //     : 1;
  // }

  function submitForm(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const enrollmentData = {
      userID: parseInt(studentSelect.value),
      courseID: parseInt(courseSelect.value),
      enrollmentDate: enrollmentDateInput.value,
    };

    if (editId) {
      fetch(`${api}/enrollments/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...enrollmentData,
          EnrollmentID: parseInt(editId),
          id: parseInt(editId),
        }),
      }).then(() => {
        resetForm();
        loadData();
      });
    } else {
      fetch(`${api}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...enrollmentData }),
      }).then(() => {
        resetForm();
        loadData();
      });
    }
  }

  function resetForm() {
    enrollmentForm.reset();
    submitBtn.textContent = "Add Enrollment";
    editId = null;
    studentSelect.classList.remove("is-invalid");
    courseSelect.classList.remove("is-invalid");
    enrollmentDateInput.classList.remove("is-invalid");
  }

  function searchEnrollments() {
    const term = searchInput.value.toLowerCase();
    const filtered = enrollments.filter((e) => {
      const student =
        users.find((u) => u.userid == e.userID)?.name?.toLowerCase() || "";
      const course =
        courses.find((c) => c.courseID == e.courseID)?.title?.toLowerCase() ||
        "";
      return student.includes(term) || course.includes(term);
    });
    renderEnrollments(filtered);
  }

  function sortByColumn(key, getValue) {
    const sorted = [...enrollments].sort((a, b) => {
      const aVal = getValue(a).toLowerCase();
      const bVal = getValue(b).toLowerCase();
      return aVal.localeCompare(bVal) * sortDirection;
    });
    sortDirection *= -1;
    renderEnrollments(sorted);
  }

  document
    .querySelector("th:nth-child(1)")
    .addEventListener("click", () =>
      sortByColumn(
        "Student",
        (e) => users.find((u) => u.userid == e.userID)?.name || ""
      )
    );
  document
    .querySelector("th:nth-child(2)")
    .addEventListener("click", () =>
      sortByColumn(
        "Course",
        (e) => courses.find((c) => c.courseID == e.courseID)?.title || ""
      )
    );
  document.querySelector("th:nth-child(3)").addEventListener("click", () =>
    sortByColumn("Instructor", (e) => {
      const course = courses.find((c) => c.courseID == e.courseID);
      return (
        instructors.find((i) => i.instructorID == course?.instructorID)?.name ||
        ""
      );
    })
  );

  searchInput.addEventListener("input", searchEnrollments);
  enrollmentForm.addEventListener("submit", submitForm);

  loadData();
})();
