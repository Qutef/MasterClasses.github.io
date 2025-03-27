let coursesData = {};
let userProgress = JSON.parse(localStorage.getItem("progress")) || {};

// Загрузка курсов из data.js
function loadCourses() {
    coursesData = lessonsData; // lessonsData — это данные, экспортированные из data.js
    updateCategories();
}

// Обновление списка категорий
function updateCategories() {
    const categoryList = document.getElementById("category-list");
    categoryList.innerHTML = ''; // Очищаем список перед загрузкой

    Object.keys(coursesData).forEach(categoryName => {
        let category = coursesData[categoryName];
        let btn = document.createElement("button");
        btn.textContent = categoryName;
        btn.onclick = () => loadCategory(categoryName);
        categoryList.appendChild(btn);
    });
}

// Загрузка уроков из выбранной категории
function loadCategory(categoryName) {
    const category = coursesData[categoryName];
    const lessonList = document.getElementById("lesson-list");
    lessonList.innerHTML = `<h2>${categoryName}</h2>`;

    category.forEach(lesson => {
        let btn = document.createElement("button");
        btn.textContent = lesson.title;
        btn.onclick = () => loadLesson(categoryName, lesson.title);
        lessonList.appendChild(btn);
    });
}

// Загрузка выбранного урока
function loadLesson(categoryName, lessonTitle) {
    const category = coursesData[categoryName];
    const lesson = category.find(l => l.title === lessonTitle);

    // Загружаем информацию о уроке
    document.getElementById("lesson-title").textContent = lesson.title;
    document.getElementById("lesson-video").src = lesson.video;

    // Загружаем оборудование
    const equipList = document.getElementById("equipment-list");
    equipList.innerHTML = "";
    lesson.equipment.forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        equipList.appendChild(li);
    });

    // Загружаем шаги
    const stepList = document.getElementById("lesson-steps");
    stepList.innerHTML = "";
    lesson.steps.forEach(step => {
        let li = document.createElement("li");
        li.textContent = step;
        stepList.appendChild(li);
    });

    // Показываем детали урока
    document.getElementById("lesson-details").style.display = "block";
}

// Отметить урок как завершённый
function markAsCompleted() {
    const title = document.getElementById("lesson-title").textContent;
    userProgress[title] = true;
    localStorage.setItem("progress", JSON.stringify(userProgress));
    updateProgress();
}

// Обновить прогресс
function updateProgress() {
    const progressDiv = document.getElementById("progress");
    progressDiv.innerHTML = "";
    Object.keys(userProgress).forEach(title => {
        let p = document.createElement("p");
        p.textContent = `✔ ${title}`;
        progressDiv.appendChild(p);
    });
}

// Функция загрузки курсов при старте страницы
window.onload = () => {
    loadCourses(); // Загружаем курсы из data.js
    updateProgress();
};
