async function initStudentGraphs() {
  const api = "http://localhost:8080";
  const [courses, enrollments, users, instructors] = await Promise.all([
    fetch(`${api}/courses`).then((res) => res.json()),
    fetch(`${api}/enrollments`).then((res) => res.json()),
    fetch(`${api}/users`).then((res) => res.json()),
    fetch(`${api}/instructors`).then((res) => res.json()),
  ]);

  const ctx = (id) => {
    const el = document.getElementById(id);
    if (!el) {
      console.error(`Canvas element with ID "${id}" not found.`);
      return null;
    }
    if (!(el instanceof HTMLCanvasElement)) {
      console.error(`Element with ID "${id}" is not a <canvas>.`);
      return null;
    }
    return el.getContext("2d");
  };

  // 1. Top 5 Enrolled Courses
  const courseEnrollCount = {};
  enrollments.forEach((e) => {
    courseEnrollCount[e.courseID] = (courseEnrollCount[e.courseID] || 0) + 1;
  });
  const topCourses = Object.entries(courseEnrollCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      title: courses.find((c) => c.courseID == id)?.title || "Unknown",
      count,
    }));

  new Chart(ctx("topCoursesChart"), {
    type: "bar",
    data: {
      labels: topCourses.map((c) => c.title),
      datasets: [
        {
          label: "Enrollments",
          data: topCourses.map((c) => c.count),
          backgroundColor: "rgba(75, 192, 192, 0.7)",
        },
      ],
    },
  });

  // 2. Enrollment Trends
  const trends = {};
  enrollments.forEach((e) => {
    const date = new Date(e.enrollmentDate).toISOString().split("T")[0];
    trends[date] = (trends[date] || 0) + 1;
  });
  const trendDates = Object.keys(trends).sort();

  new Chart(ctx("enrollmentTrendsChart"), {
    type: "line",
    data: {
      labels: trendDates,
      datasets: [
        {
          label: "Enrollments Over Time",
          data: trendDates.map((d) => trends[d]),
          fill: false,
          borderColor: "orange",
        },
      ],
    },
  });

  // 3. Enrollments by Student
  const studentEnroll = {};
  enrollments.forEach((e) => {
    studentEnroll[e.userID] = (studentEnroll[e.userID] || 0) + 1;
  });

  const topStudents = Object.entries(studentEnroll)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      name: users.find((u) => u.userid == id)?.name || "Unknown",
      count,
    }));

  new Chart(ctx("enrollmentsByStudentChart"), {
    type: "doughnut",
    data: {
      labels: topStudents.map((s) => s.name),
      datasets: [
        {
          data: topStudents.map((s) => s.count),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#8B5CF6",
            "#10B981",
          ],
        },
      ],
    },
  });

  // 4. Instructor Course Count
  const instructorCourses = {};
  courses.forEach((c) => {
    instructorCourses[c.instructorID] =
      (instructorCourses[c.instructorID] || 0) + 1;
  });

  new Chart(ctx("instructorCourseCountChart"), {
    type: "bar",
    data: {
      labels: Object.keys(instructorCourses).map(
        (id) => instructors.find((i) => i.instructorID == id)?.name || "Unknown"
      ),
      datasets: [
        {
          label: "Courses",
          data: Object.values(instructorCourses),
          backgroundColor: "#3B82F6",
        },
      ],
    },
  });

  // 5. Revenue from Enrollments
  const revenueByCourse = {};
  enrollments.forEach((e) => {
    const course = courses.find((c) => c.courseID == e.courseID);
    if (course) {
      revenueByCourse[course.title] =
        (revenueByCourse[course.title] || 0) + Number(course.fees);
    }
  });

  const topRevenueCourses = Object.entries(revenueByCourse)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  new Chart(ctx("revenueChart"), {
    type: "polarArea",
    data: {
      labels: topRevenueCourses.map(([title]) => title),
      datasets: [
        {
          data: topRevenueCourses.map(([, revenue]) => revenue),
          backgroundColor: [
            "#f87171",
            "#60a5fa",
            "#34d399",
            "#facc15",
            "#c084fc",
          ],
        },
      ],
    },
  });
}
