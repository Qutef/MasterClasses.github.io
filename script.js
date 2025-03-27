let currentLesson = null;
let currentStep = 0;

// Загружаем категории
document.addEventListener("DOMContentLoaded", () => {
    let categoryList = document.getElementById("category-list");

    Object.keys(lessonsData).forEach(category => {
        let btn = document.createElement("button");
        btn.textContent = category;
        btn.onclick = () => showLessons(category);
        categoryList.appendChild(btn);
    });

    loadProgress();
});

// Показываем уроки категории
function showLessons(category) {
    document.getElementById("categories").classList.add("hidden");
    document.getElementById("lessons").classList.remove("hidden");

    let lessonList = document.getElementById("lesson-list");
    lessonList.innerHTML = "";

    lessonsData[category].forEach(lesson => {
        let btn = document.createElement("button");
        btn.textContent = lesson.title;
        btn.onclick = () => startLesson(lesson);
        lessonList.appendChild(btn);
    });
}

// Запускаем урок
function startLesson(lesson) {
    currentLesson = lesson;
    currentStep = 0;

    document.getElementById("lessons").classList.add("hidden");
    document.getElementById("lesson-detail").classList.remove("hidden");

    document.getElementById("lesson-title").textContent = lesson.title;
    document.getElementById("equipment").textContent = lesson.equipment;
    document.getElementById("video-source").src = lesson.video;
    document.getElementById("video-player").load();

    updateStep();
}

// Показываем шаг
function updateStep() {
    document.getElementById("step-text").textContent = currentLesson.steps[currentStep];
}

// Следующий шаг
function nextStep() {
    if (currentStep < currentLesson.steps.length - 1) {
        currentStep++;
        updateStep();
    }
}

// Предыдущий шаг
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        updateStep();
    }
}

// Завершаем урок
function completeLesson() {
    let progress = JSON.parse(localStorage.getItem("progress")) || [];
    if (!progress.includes(currentLesson.title)) {
        progress.push(currentLesson.title);
        localStorage.setItem("progress", JSON.stringify(progress));
    }
    loadProgress();
}

// Загружаем прогресс
function loadProgress() {
    let progressList = document.getElementById("progress-list");
    progressList.innerHTML = "";

    let progress = JSON.parse(localStorage.getItem("progress")) || [];
    progress.forEach(title => {
        let li = document.createElement("li");
        li.textContent = title;
        progressList.appendChild(li);
    });
}

// Запрос ссылки на канал
function requestChannelLink() {
    alert("Напишите боту @YourBot в Telegram, чтобы получить ссылку на канал!");
}
