(() => {
  const apiUrl = "http://localhost:8080";
  const coursesUrl = `${apiUrl}/courses`;
  const enrollmentsUrl = `${apiUrl}/enrollments`;
  const instructorUrl = `${apiUrl}/instructors`;

  let allCourses = [];
  let enrollmentCountMap = {};
  let allInstructor = [];

  const searchInput = document.getElementById("searchInput");
  const tbody = document.getElementById("courseEnrollmentTableBody");

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filtered = allCourses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm)
    );
    renderCourses(filtered);
  });


  const searchInput2 = document.getElementById("searchInput2");
  searchInput2.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filtered = allInstructor.filter((instructor) =>
      instructor.name.toLowerCase().includes(searchTerm)
    );
    renderInstructorWiseCourses(filtered, allCourses);
  });

  async function fetchAndRenderCourses() {
    try {
      const [courseRes, enrollmentRes, instructorRes] = await Promise.all([
        fetch(coursesUrl),
        fetch(enrollmentsUrl),
        fetch(instructorUrl),
      ]);

      const courses = await courseRes.json();
      const enrollments = await enrollmentRes.json();
      const instructors = await instructorRes.json();

      // Count enrollments per CourseID
      enrollmentCountMap = {};
      enrollments.forEach((e) => {
        const courseId = e.courseID;
        if (!enrollmentCountMap[courseId]) {
          enrollmentCountMap[courseId] = 0;
        }
        enrollmentCountMap[courseId]++;
      });

      allInstructor = instructors;
      allCourses = courses;
      renderCourses(courses);
      renderInstructorWiseCourses(instructors, courses);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }

  function renderCourses(courses) {
    tbody.innerHTML = "";
    courses.forEach((course) => {
      const enrolled = enrollmentCountMap[course.courseID] || 0;
      const instructor = allInstructor.find(
        (i) => i.instructorID == course.instructorID
      );
      const instructorName = instructor ? instructor.name : "N/A";

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${course.title}</td>
                <td>${instructorName}</td>
                <td>${enrolled}</td>
            `;
      tbody.appendChild(row);
    });
  }

  const instructorCoursesTbody = document.getElementById(
    "instructorCoursesTableBody"
  );

  function renderInstructorWiseCourses(instructors, courses) {
    instructorCoursesTbody.innerHTML = "";

    instructors.forEach((instructor) => {
      const instructorCourses = courses
        .filter((c) => c.instructorID === instructor.instructorID)
        .map((c) => c.title);

      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${instructor.name}</td>
            <td>${
              instructorCourses.length
                ? instructorCourses.join(", ")
                : "No Courses"
            }</td>
            <td>${instructorCourses.length}</td>
        `;
      instructorCoursesTbody.appendChild(row);
    });
  }

  fetchAndRenderCourses();
})();
