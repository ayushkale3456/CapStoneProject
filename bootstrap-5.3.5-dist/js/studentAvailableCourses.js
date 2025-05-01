// (() => {
//   const api = "http://localhost:8080";
//   const userId = sessionStorage.getItem("userId");
//   const userType = sessionStorage.getItem("userType");

//   // Save intended location
//   sessionStorage.setItem("lastPageVisited", "studentAvailableCourses");

//   if (!userId || userType !== "student") {
//     window.location.href = "../pages/signIn.html";
//     return;
//   }

//   loadAvailableCourses(userId);

//   async function loadAvailableCourses(userId) {
//     try {
//       const [coursesRes, instructorsRes, enrollmentsRes] = await Promise.all([
//         fetch(`${api}/courses`),
//         fetch(`${api}/instructors`),
//         fetch(`${api}/enrollments`),
//       ]);

//       const [courses, instructors, enrollments] = await Promise.all([
//         coursesRes.json(),
//         instructorsRes.json(),
//         enrollmentsRes.json(),
//       ]);

//       const studentEnrollments = enrollments.filter((e) => e.UserID == userId);
//       const enrolledCourseIds = studentEnrollments.map((e) => e.CourseID);

//       const container = document.getElementById("available-courses-container");
//       container.innerHTML = "";

//       courses.forEach((course) => {
//         const instructor = instructors.find(
//           (i) => i.InstructorID == course.InstructorID
//         );
//         const isEnrolled = enrolledCourseIds.includes(course.CourseID);

//         const card = document.createElement("div");
//         card.className = "col";

//         card.innerHTML = `
//             <div class="card h-100 bg-dark text-white">
//               <div class="card-body">
//                 <h5 class="card-title">${course.Title}</h5>
//                 <p class="card-text">${course.Description}</p>
//                 <p class="card-text"><strong>Instructor:</strong> ${
//                   instructor?.Name || "Unknown"
//                 }</p>
//                 <p class="card-text"><strong>Fees:</strong> ₹${course.Fees}</p>
//                 <button class="btn btn-${
//                   isEnrolled ? "secondary" : "success"
//                 } w-100 enroll-btn" 
//                   data-courseid="${course.CourseID}" ${
//           isEnrolled ? "disabled" : ""
//         }>
//                   ${isEnrolled ? "Enrolled" : "Enroll"}
//                 </button>
//               </div>
//             </div>
//           `;

//         container.appendChild(card);
//       });

//       document.querySelectorAll(".enroll-btn").forEach((btn) => {
//         btn.addEventListener("click", async (e) => {
//           e.preventDefault();
//           const courseId = btn.getAttribute("data-courseid");
//           await enrollInCourse(userId, courseId);
//         });
//       });
//     } catch (error) {
//       console.error("Error loading available courses:", error);
//     }
//   }

//   async function enrollInCourse(userId, courseId) {
//     try {
//       // Fetch current enrollments to calculate next EnrollmentID
//       const enrollmentsRes = await fetch(`${api}/Enrollments`);
//       const enrollments = await enrollmentsRes.json();

//       const maxId =
//         enrollments.length > 0
//           ? Math.max(...enrollments.map((e) => e.EnrollmentID || 0))
//           : 0;

//       const enrollmentDate = new Date().toISOString().split("T")[0];

//       // const newEnrollment = {
//       //   EnrollmentID: maxId + 1,
//       //   UserID: parseInt(userId),
//       //   CourseID: parseInt(courseId),
//       //   EnrollmentDate: enrollmentDate,
//       // };

//       const newEnrollment = {
//         enrollmentID: maxId + 1,
//         userID: parseInt(userId),
//         courseID: parseInt(courseId),
//         enrollmentDate: enrollmentDate,
//       };
      

//       await fetch(`${api}/Enrollments`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newEnrollment),
//       });

//       loadAvailableCourses(userId); // Refresh the UI
//     } catch (error) {
//       console.error("Error during enrollment:", error);
//     }
//   }
// })();


(() => {
  const api = "http://localhost:8080";
  const userId = sessionStorage.getItem("userId");
  const userType = sessionStorage.getItem("userType");

  // Save intended location
  sessionStorage.setItem("lastPageVisited", "studentAvailableCourses");

  if (!userId || userType !== "student") {
    window.location.href = "../pages/signIn.html";
    return;
  }

  loadAvailableCourses(userId);

  async function loadAvailableCourses(userId) {
    try {
      const [coursesRes, instructorsRes, enrollmentsRes] = await Promise.all([
        fetch(`${api}/courses`),
        fetch(`${api}/instructors`),
        fetch(`${api}/enrollments`),
      ]);

      const [courses, instructors, enrollments] = await Promise.all([
        coursesRes.json(),
        instructorsRes.json(),
        enrollmentsRes.json(),
      ]);

      const studentEnrollments = enrollments.filter((e) => e.userID == userId);
      const enrolledCourseIds = studentEnrollments.map((e) => e.courseID);

      const container = document.getElementById("available-courses-container");
      container.innerHTML = "";

      if (courses.length === 0) {
        container.innerHTML = `<div class="col"><p class="text-white">No courses available.</p></div>`;
        return;
      }

      courses.forEach((course) => {
        const instructor = instructors.find(
          (i) => i.instructorID == course.instructorID
        );
        const isEnrolled = enrolledCourseIds.includes(course.courseID);

        const card = document.createElement("div");
        card.className = "col";

        card.innerHTML = `
          <div class="card h-100 bg-dark text-white">
            <div class="card-body">
              <h5 class="card-title">${course.title}</h5>
              <p class="card-text">${course.description}</p>
              <p class="card-text"><strong>Instructor:</strong> ${
                instructor?.name || "Unknown"
              }</p>
              <p class="card-text"><strong>Fees:</strong> ₹${course.fees}</p>
              <button class="btn btn-${
                isEnrolled ? "secondary" : "success"
              } w-100 enroll-btn" 
                data-courseid="${course.courseID}" ${
          isEnrolled ? "disabled" : ""
        }>
                ${isEnrolled ? "Enrolled" : "Enroll"}
              </button>
            </div>
          </div>
        `;

        container.appendChild(card);
      });

      document.querySelectorAll(".enroll-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          const courseId = btn.getAttribute("data-courseid");
          await enrollInCourse(userId, courseId);
        });
      });
    } catch (error) {
      console.error("Error loading available courses:", error);
    }
  }

  async function enrollInCourse(userId, courseId) {
    try {
      // Fetch current enrollments to calculate next EnrollmentID
      const enrollmentsRes = await fetch(`${api}/enrollments`);
      const enrollments = await enrollmentsRes.json();

      const maxId =
        enrollments.length > 0
          ? Math.max(...enrollments.map((e) => e.enrollmentID || 0))
          : 0;

      const enrollmentDate = new Date().toISOString().split("T")[0];

      const newEnrollment = {
        enrollmentID: maxId + 1,
        userID: parseInt(userId),
        courseID: parseInt(courseId),
        enrollmentDate: enrollmentDate,
      };

      await fetch(`${api}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEnrollment),
      });

      loadAvailableCourses(userId); // Refresh the UI
    } catch (error) {
      console.error("Error during enrollment:", error);
    }
  }
})();
