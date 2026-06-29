(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/service-worker.js').catch(function () {});
        });
    }

    let deferredPrompt = null;
    let installButton = null;

    function ensureInstallButton() {
        if (installButton) {
            return installButton;
        }

        installButton = document.createElement('button');
        installButton.type = 'button';
        installButton.className = 'install-app-button';
        installButton.textContent = 'Install App';
        installButton.hidden = true;
        installButton.addEventListener('click', async function () {
            if (!deferredPrompt) {
                return;
            }

            deferredPrompt.prompt();
            await deferredPrompt.userChoice.catch(function () {});
            deferredPrompt = null;
            installButton.hidden = true;
        });
        document.body.appendChild(installButton);
        return installButton;
    }

    window.addEventListener('beforeinstallprompt', function (event) {
        event.preventDefault();
        deferredPrompt = event;
        ensureInstallButton().hidden = false;
    });

    window.addEventListener('appinstalled', function () {
        deferredPrompt = null;
        if (installButton) {
            installButton.hidden = true;
        }
    });
}());
