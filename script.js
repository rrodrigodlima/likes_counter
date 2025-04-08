const API_KEY = 'AIzaSyDsWlWYIgCWc7SN4SZkJIhswcmWXN-l94M'; // Substitua pela sua chave
const CHANNEL_ID = 'UCOfeXQqErsQbDxassRb7rjg'; // Substitua pelo ID do seu canal

const likesElement = document.getElementById('likes');
const metaElement = document.getElementById('meta');
const progressBar = document.getElementById('progress-bar');

let meta = 50;
let likes = 0;
const incremento = 50;

async function getLiveVideoId() {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`
  );
  const data = await res.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].id.videoId;
  } else {
    return null;
  }
}

async function fetchLikes() {
  try {
    const videoId = await getLiveVideoId();
    if (!videoId) {
      likesElement.textContent = 'Live não encontrada';
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

      // Animações de comemoração
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

// Atualiza likes a cada 5 segundos
setInterval(fetchLikes, 30000);

// Chamada inicial
fetchLikes();
