const player = document.querySelector('.player');
const video = document.querySelector('.viewer');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress__filled');

const playBtn = document.querySelector('.player__button'); // toggle
const ranges = document.querySelectorAll('.player__slider');
const skipButtons = document.querySelectorAll('[data-skip]');

const fullScreenBtn = document.querySelector('.full-screen');

let play=false;

function togglePlay(){
    play = !play;
    if(play) {
    video.play();
    playBtn.textContent='||';
    } else {
    video.pause();
    playBtn.textContent='►';
    }
}

function skip(){
    let currentTime =video.currentTime;
    const timeToSkip = parseFloat(this.dataset.skip);

    if(currentTime +timeToSkip > 0 && currentTime+timeToSkip < video.duration) {
        video.currentTime = currentTime + timeToSkip;
    } else {
        video.currentTime = 0;
    }
}

function handleRange(){
    if(this.name === 'volume'){
        video.volume = this.value;
    } else {
        video.playbackRate = this.value;
    }
}

function updateProgressBar(){
    //video.playbackRate = (this.value/this.max) * video.duration;
    const currentTime = (video.currentTime * 100)/video.duration;
    progressBar.style.flexBasis = `${currentTime}%`;

}

function scrub(e){
    const scrubTime = (e.offsetX/progress.offsetWidth)*video.duration;
    video.currentTime = scrubTime;
}

function fullScreen(){
    video.requestFullscreen();
}


playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRange));
video.addEventListener('timeupdate', updateProgressBar);
progress.addEventListener('click', scrub);

let mousedown = false;
progress.addEventListener('mousemove', (e)=> {
    if(mousedown) {
        scrub(e);
    }
});
progress.addEventListener('mousedown', () => mousedown=true);
progress.addEventListener('mouseup', () => mousedown=false);
fullScreenBtn.addEventListener('click', fullScreen)