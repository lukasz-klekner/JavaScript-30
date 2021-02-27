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

    let pixels = ctx.getImageData(0, 0, width, height);
    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);

    requestAnimationFrame(drawOntoCanvas)
}

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

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 200;
      pixels.data[i + 1] = pixels.data[i + 1] - 50;
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
    }
    return pixels;
  }

  function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0];
      pixels.data[i + 500] = pixels.data[i + 1];
      pixels.data[i - 550] = pixels.data[i + 2];
    }
    return pixels;
  }

  function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];

      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        pixels.data[i + 3] = 0;
      }
    }

    return pixels;
  }

getMedia().catch(err => {
    console.error(err);
});
video.addEventListener('canplay', drawOntoCanvas);