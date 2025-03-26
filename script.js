let coursesData = {};
let userProgress = JSON.parse(localStorage.getItem("progress")) || {};

async function loadCourses() {
    try {
        const response = await fetch("courses.json");
        coursesData = (await response.json()).courses;
    } catch (error) {
        console.error("Ошибка загрузки курсов: ", error);
    }
}

function loadCategory(categoryId) {
    hideLesson() 
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



function markAsCompleted() {
    const title = document.getElementById("lesson-title").textContent;
    
    if (userProgress[title]) {
        delete userProgress[title];  // Убираем из списка пройденных
    } else {
        userProgress[title] = true;  // Добавляем в пройденные
    }

    localStorage.setItem("progress", JSON.stringify(userProgress));
    updateProgress();
    updateButtonState(title);
}

function hideLesson() {
    document.getElementById("lesson-details").style.display = "none";
}

function preloadVideo(videoSrc) {
    let video = document.createElement("video");
    video.src = videoSrc;
    video.preload = "auto";
    document.body.appendChild(video);
    video.style.display = "none"; 
}


function updateButtonState(title) {
    const button = document.getElementById("mark-button");
    
    if (!button) return;

    if (userProgress[title]) {
        button.textContent = "Убрать из пройденного";
    } else {
        button.textContent = "Отметить как пройденное";
    }
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

// Переключение темы (светлая/темная)
document.getElementById("theme-toggle").addEventListener("click", function() {
   // Переключение темы (светлая/темная)
document.getElementById("theme-toggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

// Прогресс-бар в уроке
function updateProgresss(currentStep, totalSteps) {
    let progress = (currentStep / totalSteps) * 100;
    document.getElementById("progress-bar-inner").style.width = progress + "%";
}

// Функция загрузки урока с шагами
function loadLesson(categoryId, lessonId) {
    const category = coursesData.courses.find(c => c.id === categoryId);
    const lesson = category.lessons.find(l => l.id === lessonId);

    document.getElementById("lesson-title").textContent = lesson.title;
    let videoElement = document.getElementById("lesson-video");

    videoElement.src = lesson.video;
    videoElement.load();

    let stepsContainer = document.getElementById("lesson-steps");
    stepsContainer.innerHTML = "";

    lesson.steps.forEach((step, index) => {
        let stepElement = document.createElement("li");
        stepElement.textContent = step;
        stepElement.onclick = function () {
            updateProgresss(index + 1, lesson.steps.length);
        };
        stepsContainer.appendChild(stepElement);
    });

    updateProgresss(0, lesson.steps.length);
}


    
window.onload = async () => {
    await loadCourses();
    updateProgress();
    preloadVideo(lesson.video);
};
