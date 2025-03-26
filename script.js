let coursesData = {};
let userProgress = JSON.parse(localStorage.getItem("progress")) || {};

async function loadCourses() {
    const response = await fetch("courses.json");
    const data = await response.json();
    coursesData = data.courses;
}

function loadCategory(categoryId) {
    const category = coursesData.find(c => c.id === categoryId);
    const lessonList = document.getElementById("lesson-list");
    lessonList.innerHTML = `<h2>${category.name}</h2>`;

    category.lessons.forEach(lesson => {
        let btn = document.createElement("button");
        btn.textContent = lesson.title;
        btn.onclick = () => loadLesson(categoryId, lesson.id);
        lessonList.appendChild(btn);
    });
}

function loadLesson(categoryId, lessonId) {
    const category = coursesData.find(c => c.id === categoryId);
    const lesson = category.lessons.find(l => l.id === lessonId);

    document.getElementById("lesson-title").textContent = lesson.title;
    document.getElementById("lesson-video").src = lesson.video;

    const equipList = document.getElementById("equipment-list");
    equipList.innerHTML = "";
    lesson.equipment.forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        equipList.appendChild(li);
    });

    const stepList = document.getElementById("lesson-steps");
    stepList.innerHTML = "";
    lesson.steps.forEach(step => {
        let li = document.createElement("li");
        li.textContent = step;
        stepList.appendChild(li);
    });

    document.getElementById("lesson-details").style.display = "block";
}

function markAsCompleted() {
    const title = document.getElementById("lesson-title").textContent;
    userProgress[title] = true;
    localStorage.setItem("progress", JSON.stringify(userProgress));
    updateProgress();
}

function updateProgress() {
    const progressDiv = document.getElementById("progress");
    progressDiv.innerHTML = "";
    Object.keys(userProgress).forEach(title => {
        let p = document.createElement("p");
        p.textContent = `✔ ${title}`;
        progressDiv.appendChild(p);
    });
}

window.onload = async () => {
    await loadCourses();
    updateProgress();
};
