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

function loadLesson(categoryId, lessonId) {
    const category = coursesData.find(c => c.id === categoryId);
    const lesson = category.lessons.find(l => l.id === lessonId);

    document.getElementById("lesson-title").textContent = lesson.title;
    document.getElementById("lesson-video").src = lesson.video;
    
    let video = document.getElementById("lesson-video");
    video.onerror = function() {
        console.error(`Ошибка загрузки видео: ${lesson.video}`);
        alert("Ошибка загрузки видео. Проверьте, что файл находится в папке /videos и имеет правильное имя.");
    };

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
        updateProgresss(index + 1, lesson.steps.length);
    });

    updateButtonState(lesson.title);
    document.getElementById("lesson-details").style.display = "block";
    updateProgresss(0, lesson.steps.length);
}

function updateProgresss(currentStep, totalSteps) {
    let progress = (currentStep / totalSteps) * 100;
    document.getElementById("progress-bar-inner").style.width = progress + "%";
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

function preloadVideo(videoSrc) {
    let video = document.createElement("video");
    video.src = videoSrc;
    video.preload = "auto";
    document.body.appendChild(video);
    video.style.display = "none"; 
}


function hideLesson() {
    document.getElementById("lesson-details").style.display = "none";
}

document.getElementById("theme-toggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

window.onload = async () => {
    await loadCourses();
    updateProgress();
    preloadVideo(lesson.video);
};
