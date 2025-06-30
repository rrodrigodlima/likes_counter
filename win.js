const API_KEY = 'AIzaSyCaduz-39bx3C3TV8Tgs6l-f0tFuqAox-s';
const CHANNEL_ID = 'UCzQxwimPyDbJ-LUNjIw6pAw';

const subsElement = document.getElementById('subscribers');
const metaElement = document.getElementById('sub-meta');
const progressBar = document.getElementById('progress-bar');

let meta = null;

async function fetchSubscribers() {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
    const data = await res.json();

    if (!data.items || data.items.length === 0 || !data.items[0].statistics) {
      throw new Error('Resposta da API inválida');
    }

    const subs = parseInt(data.items[0].statistics.subscriberCount, 10);
    subsElement.textContent = subs;

    // Define a meta inicial como 50 a mais que o valor atual
    if (meta === null) {
      meta = subs + 50;
    }

    metaElement.textContent = meta;

    // Calcula o progresso com base na meta total
    const progress = Math.min(subs / meta, 1) * 100;
    progressBar.style.width = `${progress}%`;

    // Se a meta for batida, apenas adiciona +50 na meta
    if (subs >= meta) {
      meta += 50;
      metaElement.textContent = meta;

      subsElement.classList.add('pop-animation');
      metaElement.classList.add('pulse-animation');
      progressBar.classList.add('pulse-bar');

      setTimeout(() => {
        subsElement.classList.remove('pop-animation');
        metaElement.classList.remove('pulse-animation');
        progressBar.classList.remove('pulse-bar');
      }, 1500);
    }

  } catch (err) {
    console.error('Erro ao buscar inscritos:', err);
    subsElement.textContent = 'Erro';
  }
}

setInterval(fetchSubscribers, 30000);
fetchSubscribers();
