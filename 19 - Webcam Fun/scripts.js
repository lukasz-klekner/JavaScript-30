const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

async function getMedia(){
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: 1280,
            height: 720,
        }
    });

    video.srcObject = stream;
    await video.play();
}

function drawOntoCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height

    ctx.drawImage(video, 0, 0, width, height)
    requestAnimationFrame(drawOntoCanvas)
}

getMedia().catch(err => {
    console.error(err);
});

function takePhoto(){
    snap.currentTime=0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg')
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'myPhoto');
    link.innerHTML = `
     <img src="${data}" alt="A man">
    `;
    strip.insertAdjacentElement('afterbegin', link);
}

video.addEventListener('canplay', drawOntoCanvas);