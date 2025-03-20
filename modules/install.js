export function installButton(){
    let deferredPrompt;
      const installBtn = document.querySelector('.btn-install');
      installBtn.style.display = 'none';
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
  
    installBtn.addEventListener('click', (e) => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    });
  });
  }
