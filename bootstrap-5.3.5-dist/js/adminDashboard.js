(async () => {
    const api = "http://localhost:8080";
    const studentCountEl = document.getElementById("student-count");
    const instructorCountEl = document.getElementById("instructor-count");
    const courseCountEl = document.getElementById("course-count");
    const enrollmentCountEl = document.getElementById("enrollment-count");
    const recentTableBody = document.getElementById("recentEnrollmentBody");
  
    // const usersURL = "http://localhost:3000/users";
    // const instructorsURL = "http://localhost:3000/Instructors";
    // const coursesURL = "http://localhost:3000/Courses";
    // const enrollmentsURL = "http://localhost:3000/Enrollments";
  
    try {
      const [usersRes, instructorsRes, coursesRes, enrollmentsRes] = await Promise.all([
        fetch(`${api}/users`),
        fetch(`${api}/instructors`),
        fetch(`${api}/courses`),
        fetch(`${api}/enrollments`),
      ]);
  
      const users = await usersRes.json();
      const instructors = await instructorsRes.json();
      const courses = await coursesRes.json();
      const enrollments = await enrollmentsRes.json();
  
      // Student Count
      const studentCount = users.filter(user => user.usertype === "student").length;
      studentCountEl.textContent = studentCount;
  
      // Instructor Count
      instructorCountEl.textContent = instructors.length;
  
      // Course Count
      courseCountEl.textContent = courses.length;
  
      // Enrollment Count
      enrollmentCountEl.textContent = enrollments.length;
  
      // Recent Enrollments (latest 5)
      const recentEnrollments = enrollments
        .sort((a, b) => new Date(b.EnrollmentDate) - new Date(a.EnrollmentDate))
        .slice(0, 5);
  
      recentTableBody.innerHTML = "";
  
      recentEnrollments.forEach((enroll, index) => {
        const student = users.find(user => user.userid == enroll.userID);
        const course = courses.find(c => c.courseID == enroll.courseID);
  
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${student?.name || "Unknown"}</td>
          <td>${course?.title || "Unknown"}</td>
          <td>${enroll.enrollmentDate}</td>
        `;
        recentTableBody.appendChild(row);
      });
  
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      studentCountEl.textContent = "Error";
      instructorCountEl.textContent = "Error";
      courseCountEl.textContent = "Error";
      enrollmentCountEl.textContent = "Error";
    }
  })();
  