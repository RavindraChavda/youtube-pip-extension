(function () {
  const BUTTON_ID = 'custom-pip-overlay-button';
  let lastUrl = location.href;

  function createPiPOverlayButton(video) {
    const btn = document.createElement('button');
    btn.id = BUTTON_ID;

    // SVG PiP icon - black fill
    btn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 7H5C3.9 7 3 7.9 3 9V15C3 16.1 3.9 17 5 17H19C20.1 17 21 16.1 21 15V9C21 7.9 20.1 7 19 7ZM19 15H5V9H19V15Z"/>
        <rect x="13" y="10" width="6" height="4" fill="black"/>
      </svg>
    `;

    // Light background, black icon
    btn.style.position = 'absolute';
    btn.style.bottom = '60px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.background = '#ffffff'; // White background
    btn.style.border = 'none';
    btn.style.padding = '6px';
    btn.style.borderRadius = '50%';
    btn.style.cursor = 'pointer';
    btn.style.display = 'none';
    btn.style.transition = 'opacity 0.3s ease';
    btn.style.opacity = '0.9';
    btn.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)'; // Light shadow for contrast

    btn.title = 'Picture-in-Picture';

    btn.onclick = async (e) => {
      e.stopPropagation();
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await video.requestPictureInPicture();
        }
      } catch (err) {
        console.error('PiP error:', err);
      }
    };

    return btn;
  }

  function insertOverlayButton() {
    const video = document.querySelector('video');
    const player = document.querySelector('.html5-video-player');

    if (!video || !player) return false;

    if (document.getElementById(BUTTON_ID)) return true;

    const btn = createPiPOverlayButton(video);
    player.appendChild(btn);

    setupHoverBehavior(player, btn);
    return true;
  }

  function setupHoverBehavior(container, btn) {
    let hideTimeout;

    function showButton() {
      btn.style.display = 'block';
      btn.style.opacity = '1';
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        btn.style.opacity = '0';
      }, 5000);
    }

    container.addEventListener('mousemove', showButton);
    container.addEventListener('mouseleave', () => {
      btn.style.opacity = '0';
      clearTimeout(hideTimeout);
    });
  }

  function tryInsertOverlayButton(maxRetries = 30, interval = 500) {
    let attempts = 0;
    const intervalId = setInterval(() => {
      const inserted = insertOverlayButton();
      attempts++;
      if (inserted || attempts >= maxRetries) {
        clearInterval(intervalId);
        if (!inserted) {
          console.warn('PiP button not inserted after retries.');
        }
      }
    }, interval);
  }

  // Watch for URL changes (SPA navigation)
  const urlObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      tryInsertOverlayButton();
    }
  });
  urlObserver.observe(document, { childList: true, subtree: true });

  // Initial insert
  window.addEventListener('load', () => {
    tryInsertOverlayButton();
  });

  // Backup check every 5s
  setInterval(() => {
    tryInsertOverlayButton(3, 300);
  }, 5000);
})();
