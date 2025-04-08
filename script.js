const API_KEY = 'AIzaSyDsWlWYIgCWc7SN4SZkJIhswcmWXN-l94M'; // Substitua pela sua chave
const likesElement = document.getElementById('likes');
const metaElement = document.getElementById('meta');
const progressBar = document.getElementById('progress-bar');

let meta = 50;
let likes = 0;
const incremento = 50;

function getVideoIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("videoId");
}

async function fetchLikes() {
  try {
    const videoId = getVideoIdFromURL();
    if (!videoId) {
      likesElement.textContent = 'ID inválido';
      metaElement.textContent = '';
      return;
    }

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`
    );
    const data = await res.json();
    likes = parseInt(data.items[0].statistics.likeCount, 10);
    likesElement.textContent = likes;

    if (likes >= meta) {
      meta += incremento;
      likesElement.classList.add('pop-animation');
      metaElement.classList.add('pulse-animation');

      setTimeout(() => {
        likesElement.classList.remove('pop-animation');
        metaElement.classList.remove('pulse-animation');
      }, 1500);
    }

    metaElement.textContent = meta;
    updateProgress();

  } catch (err) {
    likesElement.textContent = 'Erro';
    console.error(err);
  }
}

function updateProgress() {
  const progress = Math.min(likes / meta, 1) * 100;
  progressBar.style.width = `${progress}%`;

  if (likes >= meta) {
    progressBar.classList.add('pulse-bar');
    setTimeout(() => {
      progressBar.classList.remove('pulse-bar');
    }, 1500);
  }
}

setInterval(fetchLikes, 5000);
fetchLikes();