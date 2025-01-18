const videoContainer = document.querySelector(".video-container");
const cotrolsCon = document.querySelector(".controls-container");
const video = document.querySelector("video");
const playPauseIcon = document.querySelector(".play-pause-btn");
const play = document.querySelector(".play");
const soundIconCon = document.querySelector(".sound-icons");
const volumeRange = document.querySelector(".volume-range");
const muteIcon = document.querySelector(".fa-volume-xmark");
const highIcon = document.querySelector(".fa-volume-high");
const videoTime = document.querySelector(".video-time");
const totalTime = document.querySelector(".total-time");
const vidcurrentTime = document.querySelector(".current-time");
const forward = document.querySelector(".skip-time.forward");
const backward = document.querySelector(".skip-time.backward");
const videoTimeLine = document.querySelector(".video-timeline");
const progressBar = document.querySelector(".progress-bar");
const fullScreen = document.querySelector(".full-screen");
const expandIcon = document.querySelector(".expand");
const compressIcon = document.querySelector(".compress");
const theaterMode = document.querySelector(".theater-mode");
const miniPlayer = document.querySelector(".mini-player");
const speed = document.querySelector(".speed");
const timelineContainer = document.querySelector(".video-timeline-container");
const previewImg = document.querySelector(".preview-img");
const thumbnailImg = document.querySelector(".thumbnail-img");

window.addEventListener("keydown", (e) => {
    const tagName = document.activeElement.tagName.toLowerCase();
    if (tagName === "input") {
        return;
    } else if (e.code === "Space") {
        if (tagName === "button") {
            return;
        } else {
            playPause();
        }
    } else if (e.code === "KeyK") {
        playPause();
    } else if (e.code === "KeyM") {
        toggleSound();
    } else if (e.code === "KeyF" || e.code === "Escape") {
        expandCompressScreen();
    } else if (e.code === "KeyT") {
        activeDeactiveTheaterMode();
    } else if (e.code === "KeyI") {
        miniPlayerMode();
    } else if (e.key === "ArrowRight" || e.code === "KeyL") {
        video.currentTime += 5;
        forward.style.display = "flex";
        setTimeout(() => {
            forward.style.display = "none";
        }, 1000);
    } else if (e.key === "ArrowLeft" || e.code === "KeyJ") {
        video.currentTime -= 5;
        backward.style.display = "flex";
        setTimeout(() => {
            backward.style.display = "none";
        }, 1000);
    }
});

// Play and pause
video.addEventListener("click", playPause);
playPauseIcon.addEventListener("click", playPause);

function playPause() {
    if (videoContainer.classList.contains("paused")) {
        video.play();
        videoContainer.classList.remove("paused");
    } else {
        video.pause();
        videoContainer.classList.add("paused");
    }
}
play.addEventListener("click", () => {
    video.play();
    videoContainer.classList.remove("paused");
});

// Sound volume
volumeRange.addEventListener("input", () => {
    volumeRange.value == 0
        ? (videoContainer.dataset.volume = "muted")
        : volumeRange.value <= 0.5
        ? (videoContainer.dataset.volume = "low")
        : (videoContainer.dataset.volume = "high");
    video.volume = volumeRange.value;
});
soundIconCon.addEventListener("click", toggleSound);
function toggleSound() {
    if (video.muted) {
        video.muted = false;
        videoContainer.dataset.volume = "high";
        video.volume = volumeRange.value = 1;
    } else {
        video.muted = true;
        videoContainer.dataset.volume = "muted";
        video.volume = volumeRange.value = 0;
    }
}

// time
video.addEventListener("loadeddata", () => {
    vidcurrentTime.textContent = "0:00";
    totalTime.textContent = formatDuration(video.duration);
});
video.addEventListener("timeupdate", () => {
    vidcurrentTime.textContent = formatDuration(video.currentTime);
    const percent = video.currentTime / video.duration;
    timelineContainer.style.setProperty("--progress-position", percent);
});

function formatDuration(time) {
    let seconds = Math.floor(time % 60);
    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600);
    if (hours === 0) {
        return (
            minutes +
            ":" +
            new Intl.NumberFormat(undefined, {
                minimumIntegerDigits: 2,
            }).format(seconds)
        );
    } else {
        return (
            hours +
            ":" +
            new Intl.NumberFormat(undefined, {
                minimumIntegerDigits: 2,
            }).format(minutes) +
            ":" +
            new Intl.NumberFormat(undefined, {
                minimumIntegerDigits: 2,
            }).format(seconds)
        );
    }
}
// progress bar
timelineContainer.addEventListener("mousemove", handlepreviewImg);
timelineContainer.addEventListener("mousedown", toggleScrubbing);
document.addEventListener("mouseup", (e) => {
    if (isScrubbing) toggleScrubbing(e);
});
document.addEventListener("mousemove", (e) => {
    if (isScrubbing) handlepreviewImg(e);
});

let isScrubbing = false;
let wasPaused;

function toggleScrubbing(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = e.buttons === 1;
    videoContainer.classList.toggle("scrubbing", isScrubbing);
    if (isScrubbing) {
        wasPaused = video.paused;
        video.pause();
    } else {
        video.currentTime = percent * video.duration;
        if (!wasPaused) video.play();
    }
}

function handlepreviewImg(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    const previewImgNumber = Math.max(
        1,
        Math.floor((percent * video.duration) / 10)
    );
    previewImg.src = `assets/previewImgs/preview(${previewImgNumber}).jpg`;
    timelineContainer.style.setProperty("--preview-position", percent);
    if (isScrubbing) {
        e.preventDefault();
        thumbnailImg.src = previewImg.src;
        timelineContainer.style.setProperty("--progress-position", percent);
    }
}

// Caption
const caption = document.querySelector(".caption");
const captionBtn = document.querySelector(".caption-btn");
const captionOptionsContainer = document.querySelector(".select-caption");
const tracks = Object.values(video.textTracks);

let markup = `<p>off</p>`;
tracks.forEach((track) => {
    markup += `<p>${track.label}</p>`;
    captionOptionsContainer.innerHTML = markup;
});

captionBtn.addEventListener("click", toggleCaption);
function toggleCaption() {
    caption.classList.toggle("opened");
}

captionOptionsContainer.addEventListener("click", handleSelectCaption);
function handleSelectCaption(e) {
    if (e.target.nodeName !== "P") return;

    const captionOptions = document.querySelectorAll(".select-caption p");
    captionOptions.forEach((captionEle) => {
        captionEle.classList.remove("active");
        captionBtn.classList.remove("active");
    });

    tracks.forEach((track, i) => {
        if (track.label === e.target.textContent) {
            video.textTracks[i].mode = "showing";
            e.target.classList.add("active");
            captionBtn.classList.add("active");
        }

        if (track.label !== e.target.textContent) {
            video.textTracks[i].mode = "disabled";
        }
    });
}

// Full screen
fullScreen.addEventListener("click", expandCompressScreen);
function expandCompressScreen() {
    if (videoContainer.classList.contains("expanded")) {
        document.exitFullscreen();
        videoContainer.classList.remove("expanded");
    } else {
        document.documentElement.requestFullscreen();
        videoContainer.classList.add("expanded");
    }
}

// Theater mode
theaterMode.addEventListener("click", activeDeactiveTheaterMode);
function activeDeactiveTheaterMode() {
    videoContainer.classList.toggle("t-mode-on");
}

// mini player mode
miniPlayer.addEventListener("click", miniPlayerMode);
function miniPlayerMode() {
    if (videoContainer.classList.contains("mini-on")) {
        document.exitPictureInPicture();
        videoContainer.classList.remove("mini-on");
    } else {
        video.requestPictureInPicture();
        videoContainer.classList.add("mini-on");
    }
}

// Speed
speed.addEventListener("click", () => {
    video.playbackRate += 0.25;
    if (video.playbackRate > 2) {
        video.playbackRate = 0.25;
    }
    speed.textContent = `${video.playbackRate}x`;
    console.log(video.playbackRate);
});
