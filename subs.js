const API_KEY = 'AIzaSyB34hJD_bSwgILsK8lgdVJuaPITN7yIW2g';
const CHANNEL_ID = 'UCDROwiV1r1o20W892Fq6kTQ';

const subsElement = document.getElementById('subscribers');
const metaElement = document.getElementById('sub-meta');
const progressBar = document.getElementById('progress-bar');

let meta = null;
let base = null;

async function fetchSubscribers() {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
    const data = await res.json();

    if (!data.items || data.items.length === 0 || !data.items[0].statistics) {
      throw new Error('Resposta da API inválida');
    }

    const subs = parseInt(data.items[0].statistics.subscriberCount, 10);
    subsElement.textContent = subs;

    if (meta === null || base === null) {
      meta = subs + 50;
      base = subs;
    }

    metaElement.textContent = meta;

    const progress = Math.min((subs - base) / (meta - base), 1) * 100;
    progressBar.style.width = `${progress}%`;

    if (subs >= meta) {
      // Atualiza a base e a meta
      base = meta;
      meta += 50;
      metaElement.textContent = meta;

      // Animações
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
