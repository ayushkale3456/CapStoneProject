async function initStudentDashboard() {
  try {
    const response = await fetch("../example.json");
    const api = "http://localhost:8080";
    const database = await response.json();


    // 🔐 Get logged-in student ID from sessionStorage
    const userID = parseInt(sessionStorage.getItem("userId"));
    if (!userID || isNaN(userID)) {
      alert("User not logged in. Redirecting to login...");
      window.location.href = "../pages/signIn.html"; // redirect if not logged in
      return;
    }

    const [usersRes, coursesRes, enrollmentsRes] = await Promise.all([
      fetch(`${api}/users`),
      fetch(`${api}/courses`),
      fetch(`${api}/enrollments`),
    ]);

    const [users, courses, enrollments] = await Promise.all([
      usersRes.json(),
      coursesRes.json(),
      enrollmentsRes.json(),
    ]);

    const students = users.filter((user) => user.usertype === "student");
    const totalStudents = students.length;
    const totalCourses = courses.length;

    const enrolledCourses = enrollments.filter((e) => e.userID === userID);
    // const assignmentsSubmitted = enrolledCourses.length; // Placeholder

    // Update counts
    document.getElementById("courses-enrolled").innerText = enrolledCourses.length;
    document.getElementById("total-students").innerText = totalStudents;
    document.getElementById("total-courses").innerText = totalCourses;

    const ctx = document.getElementById("studentCourseChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Students", "Courses"],
        datasets: [
          {
            label: "Count",
            data: [totalStudents, totalCourses],
            backgroundColor: ["#0d6efd", "#20c997"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });

    // Chart 2: Course Popularity
    const courseEnrollCounts = {};
    enrollments.forEach((enrollment) => {
      const courseID = enrollment.courseID;
      courseEnrollCounts[courseID] = (courseEnrollCounts[courseID] || 0) + 1;
    });

    const courseLabels = [];
    const courseData = [];

    courses.forEach((course) => {
      courseLabels.push(course.title);
      courseData.push(courseEnrollCounts[course.courseID] || 0);
    });

    const ctxPopularity = document
      .getElementById("coursePopularityChart")
      .getContext("2d");
    new Chart(ctxPopularity, {
      type: "bar",
      data: {
        labels: courseLabels,
        datasets: [
          {
            label: "Enrollments",
            data: courseData,
            backgroundColor: "#ffc107",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y} students`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Number of Students" },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}
// initStudentDashboard();
