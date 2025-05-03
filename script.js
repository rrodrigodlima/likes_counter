const API_KEY = 'AIzaSyB34hJD_bSwgILsK8lgdVJuaPITN7yIW2g'; // Substitua pela sua chave
const likesElement = document.getElementById('likes');
const metaElement = document.getElementById('meta');
const progressBar = document.getElementById('progress-bar');

let meta = 30;
let likes = 0;
const incremento = 30;
let intervalId = null;

function getVideoIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("videoId");
}

async function isLive(videoId) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${videoId}&key=${API_KEY}`
    );
    const data = await res.json();
    if (!data.items || data.items.length === 0) return false;

    const liveDetails = data.items[0].snippet.liveBroadcastContent;
    return liveDetails === 'live'; // pode ser 'live', 'none' ou 'upcoming'

  } catch (err) {
    console.error("Erro ao checar se está ao vivo:", err);
    return false;
  }
}

async function fetchLikes() {
  const videoId = getVideoIdFromURL();
  if (!videoId) return;

  try {
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

async function startIfLive() {
  const videoId = getVideoIdFromURL();
  if (!videoId) {
    likesElement.textContent = 'ID inválido';
    return;
  }

  likesElement.textContent = 'Verificando live...';
  const live = await isLive(videoId);

  if (live) {
    likesElement.textContent = 'Carregando likes...';
    fetchLikes();
    intervalId = setInterval(fetchLikes, 10000); // atualiza a cada 10s
  } else {
    likesElement.textContent = 'Live não está ativa';
  }
}

startIfLive();
