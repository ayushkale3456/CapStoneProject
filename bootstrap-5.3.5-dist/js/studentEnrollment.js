(() => {
  const userId = sessionStorage.getItem("userId");
  const userType = sessionStorage.getItem("userType");

  if (!userId || userType !== "student") {
    window.location.href = "login.html";
    return;
  }

  loadStudentCourses(userId);
})()

async function loadStudentCourses(userId) {
  try {
    const [enrollmentsRes, coursesRes, instructorsRes] = await Promise.all([
      fetch("http://localhost:8080/enrollments"),
      fetch("http://localhost:8080/courses"),
      fetch("http://localhost:8080/instructors"),
    ]);

    const [enrollments, courses, instructors] = await Promise.all([
      enrollmentsRes.json(),
      coursesRes.json(),
      instructorsRes.json(),
    ]);

    const studentEnrollments = enrollments.filter((e) => e.userID == userId);
    const courseContainer = document.getElementById("course-container");

    courseContainer.innerHTML = "";

    if (studentEnrollments.length === 0) {
      courseContainer.innerHTML = `<div class="col"><p class="text-white">No enrolled courses found.</p></div>`;
      return;
    }

    studentEnrollments.forEach((enrollment) => {
      const course = courses.find((c) => c.courseID == enrollment.courseID);
      const instructor = instructors.find(
        (i) => i.instructorID == course?.instructorID
      );

      const cardHTML = `
          <div class="col">
            <div class="card h-100 bg-dark text-white">
              <div class="card-body">
                <h5 class="card-title">${
                  course?.title || "Untitled Course"
                }</h5>
                <p class="card-text">${
                  course?.description || "No description available."
                }</p>
                <p class="card-text"><strong>Instructor:</strong> ${
                  instructor?.name || "Unknown"
                }</p>
                <p class="card-text"><strong>Enrolled Date:</strong> ${new Date(
                  enrollment.enrollmentDate
                ).toLocaleDateString()}</p>
                <p class="card-text"><strong>Fees:</strong> ₹${
                  course?.fees || 0
                }</p>
              </div>
            </div>
          </div>
        `;

      courseContainer.insertAdjacentHTML("beforeend", cardHTML);
    });
  } catch (error) {
    console.error("Error loading enrolled courses:", error);
    document.getElementById(
      "course-container"
    ).innerHTML = `<div class="col text-danger">Failed to load courses.</div>`;
  }
}
