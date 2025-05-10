async function initStudentDashboard() {
  try {
    const userID = parseInt(sessionStorage.getItem("userId"));
    if (!userID || isNaN(userID)) {
      alert("User not logged in. Redirecting to login...");
      window.location.href = "../pages/signIn.html"; // redirect if not logged in
      return;
    }

    const response = await fetch(`http://localhost:8080/users/student-dashboard/${userID}`);
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const dashboardData = await response.json();

    const { totalStudents, totalCourses, enrolledCourses, coursePopularity } = dashboardData;

    document.getElementById("courses-enrolled").innerText = enrolledCourses;
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
    // const courseEnrollCounts = {};
    // enrollments.forEach((enrollment) => {
    //   const courseID = enrollment.courseID;
    //   courseEnrollCounts[courseID] = (courseEnrollCounts[courseID] || 0) + 1;
    // });

    // const courseLabels = [];
    // const courseData = [];

    // courses.forEach((course) => {
    //   courseLabels.push(course.title);
    //   courseData.push(courseEnrollCounts[course.courseID] || 0);
    // });

    const courseLabels = Object.keys(coursePopularity);
    const courseData = Object.values(coursePopularity);

    const ctxPopularity = document.getElementById("coursePopularityChart").getContext("2d");
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
