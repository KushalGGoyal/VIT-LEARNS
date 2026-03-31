const COURSES = [
  {
    id: 1,
    title: "UI/UX Design Fundamentals",
    description: "Learn design thinking, wireframing, and prototyping to craft delightful user experiences.",
    category: "design",
    color: "#818cf8",
    modules: ["Intro to Design Thinking", "Wireframing Basics", "Figma Crash Course", "Usability Testing"]
  },
  {
    id: 2,
    title: "HTML & CSS Mastery",
    description: "Build beautiful, responsive websites from scratch using modern HTML5 and CSS3.",
    category: "development",
    color: "#6ee7b7",
    modules: ["HTML Semantics", "CSS Box Model", "Flexbox & Grid", "Responsive Design"]
  },
  {
    id: 3,
    title: "JavaScript for Beginners",
    description: "Understand core JS concepts: variables, functions, DOM, events, and ES6+ features.",
    category: "development",
    color: "#fcd34d",
    modules: ["Variables & Data Types", "Functions & Scope", "DOM Manipulation", "Fetch API & JSON"]
  },
  {
    id: 4,
    title: "Python & Data Analysis",
    description: "Use Python, Pandas, and Matplotlib to explore and visualize real-world datasets.",
    category: "data",
    color: "#f9a8d4",
    modules: ["Python Basics", "Pandas DataFrames", "Data Cleaning", "Matplotlib Charts"]
  },
  {
    id: 5,
    title: "Machine Learning A–Z",
    description: "From linear regression to neural networks — understand ML algorithms with hands-on projects.",
    category: "data",
    color: "#fb923c",
    modules: ["Linear Regression", "Decision Trees", "Neural Networks", "Model Evaluation"]
  },
  {
    id: 6,
    title: "Digital Marketing Essentials",
    description: "Master SEO, content strategy, social media marketing, and Google Analytics.",
    category: "marketing",
    color: "#a78bfa",
    modules: ["SEO Basics", "Content Marketing", "Social Media Strategy", "Google Analytics"]
  },
  {
    id: 7,
    title: "Graphic Design with Figma",
    description: "Create stunning graphics, logos, and brand identities using Figma.",
    category: "design",
    color: "#67e8f9",
    modules: ["Figma Interface", "Typography", "Color Theory", "Logo Design Project"]
  },
  {
    id: 8,
    title: "Full-Stack Web Development",
    description: "Build complete web applications with Node.js, Express, and MongoDB.",
    category: "development",
    color: "#86efac",
    modules: ["Node.js Basics", "Express Routing", "MongoDB CRUD", "REST API Design"]
  }
];

let activeFilter = "all";

const coursesGrid  = document.getElementById("coursesGrid");
const filterBar    = document.getElementById("filterBar");
const enrollForm   = document.getElementById("enrollForm");
const courseSelect = document.getElementById("courseSelect");
const enrolledList = document.getElementById("enrolledList");
const clearBtn     = document.getElementById("clearEnrolled");

function renderCourses(filter) {
  const filtered = filter === "all"
    ? COURSES
    : COURSES.filter(c => c.category === filter);

  if (filtered.length === 0) {
    coursesGrid.innerHTML = `<p class="empty-state">No courses found in this category.</p>`;
    return;
  }

  coursesGrid.innerHTML = filtered.map(course => `
    <article class="course-card" data-id="${course.id}">
      <div class="card-color-bar" style="background:${course.color};"></div>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-category">${course.category}</span>
          <span class="card-modules-count">${course.modules.length} modules</span>
        </div>
        <h3 class="card-title">${course.title}</h3>
        <p class="card-desc">${course.description}</p>
      </div>
      <div class="accordion">
        <button class="accordion-toggle" data-id="${course.id}">
          View curriculum
          <i class="accordion-arrow">↓</i>
        </button>
        <div class="accordion-content" id="modules-${course.id}">
          <ul class="module-list">
            ${course.modules.map(mod => `<li>${mod}</li>`).join("")}
          </ul>
        </div>
      </div>
    </article>
  `).join("");
}

function populateCourseSelect() {
  COURSES.forEach(course => {
    const option = document.createElement("option");
    option.value = course.title;
    option.textContent = course.title;
    courseSelect.appendChild(option);
  });
}

coursesGrid.addEventListener("click", function(e) {
  const toggle = e.target.closest(".accordion-toggle");
  if (!toggle) return;
  const id = toggle.getAttribute("data-id");
  const content = document.getElementById(`modules-${id}`);
  toggle.classList.toggle("open");
  content.classList.toggle("open");
});

filterBar.addEventListener("click", function(e) {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.getAttribute("data-category");
  renderCourses(activeFilter);
});

function validateForm() {
  const name   = document.getElementById("studentName").value.trim();
  const email  = document.getElementById("studentEmail").value.trim();
  const course = courseSelect.value;

  const nameError   = document.getElementById("nameError");
  const emailError  = document.getElementById("emailError");
  const courseError = document.getElementById("courseError");

  nameError.textContent = emailError.textContent = courseError.textContent = "";

  let valid = true;

  if (!name || name.length < 2) {
    nameError.textContent = "Please enter your full name (min 2 characters).";
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    valid = false;
  }

  if (!course) {
    courseError.textContent = "Please select a course.";
    valid = false;
  }

  return valid;
}

enrollForm.addEventListener("submit", function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const enrollment = {
    id:     Date.now(),
    name:   document.getElementById("studentName").value.trim(),
    email:  document.getElementById("studentEmail").value.trim(),
    course: courseSelect.value
  };

  const enrollments = JSON.parse(localStorage.getItem("enrollments")) || [];
  enrollments.push(enrollment);
  localStorage.setItem("enrollments", JSON.stringify(enrollments));

  const successEl = document.getElementById("formSuccess");
  successEl.textContent = `✓ Enrolled in "${enrollment.course}"`;

  enrollForm.reset();
  renderEnrolled();

  setTimeout(() => { successEl.textContent = ""; }, 3500);
});

function renderEnrolled() {
  const enrollments = JSON.parse(localStorage.getItem("enrollments")) || [];

  if (enrollments.length === 0) {
    enrolledList.innerHTML = `<p class="empty-state">No enrollments yet. Begin your journey above.</p>`;
    return;
  }

  enrolledList.innerHTML = enrollments.map(e => `
    <div class="enrolled-card">
      <button class="remove-btn" data-id="${e.id}" title="Remove">✕</button>
      <p class="enrolled-course">${e.course}</p>
      <p class="enrolled-name">${e.name}</p>
      <p class="enrolled-email">${e.email}</p>
    </div>
  `).join("");
}

enrolledList.addEventListener("click", function(e) {
  const btn = e.target.closest(".remove-btn");
  if (!btn) return;
  const idToRemove = Number(btn.getAttribute("data-id"));
  let enrollments = JSON.parse(localStorage.getItem("enrollments")) || [];
  enrollments = enrollments.filter(e => e.id !== idToRemove);
  localStorage.setItem("enrollments", JSON.stringify(enrollments));
  renderEnrolled();
});

clearBtn.addEventListener("click", function() {
  if (window.confirm("Clear all enrollments?")) {
    localStorage.removeItem("enrollments");
    renderEnrolled();
  }
});

function init() {
  renderCourses("all");
  populateCourseSelect();
  renderEnrolled();
}


init();
