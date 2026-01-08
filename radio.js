
    const player = document.getElementById('miReproductor');
    const srcHls = document.getElementById('srcHls');
    const estado = document.getElementById('estado');

    // Diagnóstico útil en iOS
    player.addEventListener('canplay', () => console.log('canplay -> listo'));
    player.addEventListener('error', () => {
      console.error('Error de reproducción:', player.error);
      estado.innerText = 'Error al reproducir. Si abriste este HTML como archivo local (file://), algunos streams bloquean por CORS/Referer. Prueba a abrirlo desde HTTP/HTTPS.';
    });

    async function reproducir(url, nombre) {
      try {
        estado.innerText = 'Cargando: ' + nombre + ' …';
        player.pause();
        // Si el stream es MP3, podrías cambiar el type a audio/mpeg dinámicamente.
        srcHls.src = url;
        player.load();               // Safari necesita load() tras cambiar la fuente
        await player.play();         // el gesto del usuario permite play()
        estado.innerText = 'Escuchando: ' + nombre;
      } catch (err) {
        console.log('iOS/Safari bloqueó o falló el HLS:', err);
        estado.innerText = 'Toca ▶️ en el reproductor. Si sigue sin sonar, abre esta página desde HTTP/HTTPS (no file://).';
      }
    }

    // Botón Detener: corta el audio y libera el manifest
    document.getElementById('btnStop').addEventListener('click', () => {
      try {
        player.pause();
        srcHls.src = '';
        if (typeof player.load === 'function') player.load();
        estado.innerText = 'Reproducción detenida.';
      } catch(_) {}
    });

    // Botón Cerrar / Salir: intenta cerrar y aplica fallbacks
    document.getElementById('btnExit').addEventListener('click', () => {
      // siempre detenemos antes
      try {
        player.pause();
        srcHls.src = '';
        player.load?.();
      } catch(_) {}

      // 1) cierre (solo si la pestaña fue abierta por window.open)
      window.close();

      // 2) volver atrás si hay historial
      if (history.length > 1) {
        history.back();
        return;
      }

      // 3) salir a página mínima
      window.location.replace('about:blank');
    });
  