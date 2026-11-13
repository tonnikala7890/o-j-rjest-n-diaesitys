let currentSlide = 1;
    const totalSlides = 10;
    let soundEnabled = true;
    let audioCtx = null;
    let tunaClickStage = 0;

    const slideTitles = {
      1: "Sivu 1: Virallinen kutsukirje (Timin numero)",
      2: "Sivu 2: Mikä on O-järjestö?",
      3: "Sivu 3: O-järjestön raportit & kokoukset",
      4: "Sivu 4: Raivostuva ja mureneva tonnikala",
      5: "Sivu 5: O-järjestön yhtiöt",
      6: "Sivu 6: iPhone 18 Pro Max (4K)",
      7: "Sivu 7: Sammen kaviaari",
      8: "Sivu 8: Höh öö – Kalkkunan sisältä!",
      9: "Sivu 9: Kattava yhteenveto",
      10: "Sivu 10: Iso kala joka syö sinut – Loppu!"
    };

    function getAudioCtx() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function toggleAudio() {
      soundEnabled = !soundEnabled;
      const icon = document.getElementById('audioIcon');
      const label = document.getElementById('audioLabel');
      if (soundEnabled) {
        icon.className = 'fa-solid fa-volume-high text-emerald-400';
        if (label) label.textContent = 'Äänet';
      } else {
        icon.className = 'fa-solid fa-volume-xmark text-rose-400';
        if (label) label.textContent = 'Mykistetty';
      }
    }

    // Tornado Wind Sound Synthesizer
    function playTornadoSound() {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const duration = 0.6;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(160, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + duration * 0.5);
        filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);
        filter.Q.value = 3.2;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } catch (e) {}
    }

    // Tuna Explosion Sound
    function playExplosionSound() {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(24, ctx.currentTime + 0.65);

        gain.gain.setValueAtTime(0.45, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
      } catch (e) {}
    }

    // Turkey Gobble Sound (Slide 8)
    function playGobbleSound() {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          const start = ctx.currentTime + i * 0.11;
          osc.frequency.setValueAtTime(520, start);
          osc.frequency.exponentialRampToValueAtTime(280, start + 0.09);
          gain.gain.setValueAtTime(0.3, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.09);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.09);
        }
        showToast('🦃 ”HÖH ÖÖ!” kuuluu kalkkunan sisältä!');
      } catch (e) {}
    }

    // Slide Navigation with Tornado Swirl
    function changeSlide(target) {
      if (target < 1 || target > totalSlides || target === currentSlide) return;

      const overlay = document.getElementById('tornadoOverlay');
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
      playTornadoSound();

      setTimeout(() => {
        for (let i = 1; i <= totalSlides; i++) {
          const el = document.getElementById('slide-' + i);
          const dot = document.getElementById('navDot-' + i);
          if (i === target) {
            el.classList.remove('hidden');
            el.classList.remove('tornado-enter');
            void el.offsetWidth;
            el.classList.add('tornado-enter');
            if (dot) dot.className = 'w-8 h-8 rounded-lg font-display font-bold text-xs bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/40 transition cursor-pointer';
          } else {
            el.classList.add('hidden');
            if (dot) dot.className = 'w-8 h-8 rounded-lg font-display font-bold text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer';
          }
        }
        currentSlide = target;
        document.getElementById('slideCounterNum').textContent = target;
        const sub = document.getElementById('headerSlideSubtitle');
        if (sub) sub.textContent = slideTitles[target] || '';
      }, 240);

      setTimeout(() => {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
      }, 560);
    }

    function nextSlide() {
      if (currentSlide < totalSlides) changeSlide(currentSlide + 1);
      else changeSlide(1);
    }

    function prevSlide() {
      if (currentSlide > 1) changeSlide(currentSlide - 1);
      else changeSlide(totalSlides);
    }

    function triggerManualTornado() {
      const overlay = document.getElementById('tornadoOverlay');
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
      playTornadoSound();
      setTimeout(() => {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
      }, 650);
    }

    // SLIDE 4: INTERACTIVE TUNA RAGE & SHATTER
    function triggerTunaClick() {
      if (tunaClickStage === 2) return;

      const wrapper = document.getElementById('tunaFishWrapper');
      const banner = document.getElementById('tunaStatusBanner');
      const rageBar = document.getElementById('tunaRageBar');
      const ragePct = document.getElementById('tunaRagePercent');
      const arena = document.getElementById('tunaArena');
      const resetBtn = document.getElementById('tunaResetBtn');

      tunaClickStage = 2;
      rageBar.style.width = '100%';
      ragePct.textContent = '100 % – RAIVO!!';
      banner.innerHTML = '😡🔥 TONNIKALA RAIVOSTUU SILMITTÖMÄSTI!! VARO!! 🔥😡';
      banner.className = 'text-sm sm:text-xl font-display font-extrabold text-white mb-4 px-5 py-2 rounded-full bg-rose-600 border border-rose-300 shadow-xl z-20 text-center';
      wrapper.classList.add('rage-shaking');
      playExplosionSound();

      setTimeout(() => {
        wrapper.classList.remove('rage-shaking');
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'scale(0.1)';
        banner.innerHTML = '💥 POKS! Tonnikala mureni 55 lentäväksi palaseksi! 💥';
        playExplosionSound();

        const colors = ['#ef4444', '#f97316', '#38bdf8', '#fbbf24', '#e11d48', '#ffffff'];
        for (let i = 0; i < 55; i++) {
          const shard = document.createElement('div');
          shard.className = 'tuna-shard';
          const sz = 12 + Math.random() * 26;
          shard.style.width = sz + 'px';
          shard.style.height = sz + 'px';
          shard.style.left = '50%';
          shard.style.top = '55%';
          shard.style.background = colors[Math.floor(Math.random() * colors.length)];
          arena.appendChild(shard);

          const angle = Math.random() * Math.PI * 2;
          const dist = 100 + Math.random() * 420;
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist;
          const rot = (Math.random() - 0.5) * 1080;

          shard.animate([
            { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0) rotate(${rot}deg)`, opacity: 0 }
          ], {
            duration: 850 + Math.random() * 550,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'forwards'
          });

          setTimeout(() => shard.remove(), 1450);
        }

        resetBtn.classList.remove('hidden');
      }, 950);
    }

    function resetTuna(e) {
      if (e) e.stopPropagation();
      tunaClickStage = 0;
      const wrapper = document.getElementById('tunaFishWrapper');
      const banner = document.getElementById('tunaStatusBanner');
      const rageBar = document.getElementById('tunaRageBar');
      const ragePct = document.getElementById('tunaRagePercent');
      const resetBtn = document.getElementById('tunaResetBtn');

      wrapper.style.opacity = '1';
      wrapper.style.transform = 'scale(1)';
      rageBar.style.width = '0%';
      ragePct.textContent = '0 %';
      banner.innerHTML = '👆 KLIKKAA TONNIKALAA! Se raivostuu silmittömästi ja murenee palasiksi!';
      banner.className = 'text-sm sm:text-xl font-display font-extrabold text-amber-300 mb-4 px-5 py-2 rounded-full bg-slate-900/90 border border-amber-400/40 shadow-lg z-20 text-center';
      resetBtn.classList.add('hidden');
    }

    // SLIDE 10: GIANT PREDATOR FISH EATS YOU
    function triggerGiantFishBite() {
      const fish = document.getElementById('giantFishContainer');
      playExplosionSound();
      fish.style.transform = 'scale(4.5) rotate(6deg)';
      setTimeout(() => {
        const eaten = document.getElementById('eatenOverlay');
        eaten.classList.remove('hidden');
        eaten.classList.add('flex');
      }, 280);
    }

    function restartFromEaten() {
      const eaten = document.getElementById('eatenOverlay');
      const fish = document.getElementById('giantFishContainer');
      eaten.classList.add('hidden');
      eaten.classList.remove('flex');
      fish.style.transform = 'scale(1)';
      changeSlide(1);
    }

    // ==========================================
    // FILE DOWNLOAD & PURE-JS ZIP GENERATOR ENGINE
    // ==========================================
    function showToast(msg) {
      const toast = document.getElementById('statusToast');
      toast.textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 3500);
    }

    function openDownloadHubModal() {
      const m = document.getElementById('downloadHubModal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeDownloadHubModal() {
      const m = document.getElementById('downloadHubModal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    // Trigger Browser File Download with Blob + Data URL Fallback
    function triggerFileDownload(filename, contentBlob, rawTextFallback, mimeType) {
      try {
        const url = URL.createObjectURL(contentBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 1200);
        showToast('📥 Ladattiin tiedosto: ' + filename);
      } catch (err) {
        if (rawTextFallback) {
          const dataUrl = 'data:' + (mimeType || 'text/plain') + ';charset=utf-8,' + encodeURIComponent(rawTextFallback);
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showToast('📥 Ladattiin tiedosto: ' + filename);
        }
      }
    }

    // 1. Download Complete Self-Contained HTML File
    function downloadStandaloneHTML() {
      const fullHtml = '<!DOCTYPE html>\n<html lang="fi" class="dark">\n' + document.documentElement.innerHTML + '\n</html>';
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      triggerFileDownload('o_jarjesto_4k_sivusto.html', blob, fullHtml, 'text/html');
    }

    // Extract separated index.html, style.css, script.js for folder downloads
    function getSeparatedFolderFiles() {
      const cssContent = document.getElementById('main-stylesheet').textContent.trim();
      const jsContent = document.getElementById('main-script').textContent.trim();
      const bodyClone = document.body.cloneNode(true);
      const inlineScript = bodyClone.querySelector('#main-script');
      if (inlineScript) inlineScript.remove();

      const indexHtmlContent = `<!DOCTYPE html>
<html lang="fi" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>O-Järjestö — Virallinen 10-sivuinen 4K Interaktiivinen Sivusto</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body class="relative flex flex-col justify-between select-none bg-slate-950 text-slate-100">
${bodyClone.innerHTML}
  <script src="script.js"><\/script>
</body>
</html>`;

      const readmeContent = `O-JÄRJESTÖ 4K VERKKOSIVUSTO (10 DIAA)
======================================
Timin numero: +358 44 9854292
Virallinen lähde: https://yritysjarjesto-c84810.webnode.fi/

Kansion tiedostot:
- index.html : Sivuston rakenne ja kaikki 10 diaa
- style.css  : 4K-tyylit, kutsukirje ja tornado-animaatiot
- script.js  : Tornado-siirtymä, ääniefektit, mureneva tonnikala ja hyökkäävä iso kala

Käyttöohje:
Avaa "index.html" tuplaklikkaamalla missä tahansa selaimessa!`;

      return {
        'index.html': indexHtmlContent,
        'style.css': cssContent,
        'script.js': jsContent,
        'LUE_MINUT.txt': readmeContent
      };
    }

    // 2. Download Individual File (index.html, style.css, script.js)
    function downloadSinglePart(partName) {
      const files = getSeparatedFolderFiles();
      const content = files[partName];
      if (!content) return;
      const mime = partName.endsWith('.html') ? 'text/html' : (partName.endsWith('.css') ? 'text/css' : 'application/javascript');
      const blob = new Blob([content], { type: mime + ';charset=utf-8' });
      triggerFileDownload(partName, blob, content, mime);
    }

    // 3. Pure JavaScript Standard ZIP Builder (Zero Dependencies)
    function crc32(bytes) {
      let c = -1;
      for (let i = 0; i < bytes.length; i++) {
        c = (c >>> 8) ^ crc32Table[(c ^ bytes[i]) & 0xFF];
      }
      return (c ^ -1) >>> 0;
    }
    const crc32Table = (() => {
      const t = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        t[i] = c >>> 0;
      }
      return t;
    })();

    function downloadWebsiteZip() {
      const folderFiles = getSeparatedFolderFiles();
      const encoder = new TextEncoder();
      const fileEntries = [];
      let offset = 0;

      for (const [name, text] of Object.entries(folderFiles)) {
        const pathBytes = encoder.encode('o_jarjesto_sivusto_kansio/' + name);
        const dataBytes = encoder.encode(text);
        const crc = crc32(dataBytes);

        const localHeader = new Uint8Array(30 + pathBytes.length);
        const lv = new DataView(localHeader.buffer);
        lv.setUint32(0, 0x04034b50, true); // Local file header signature
        lv.setUint16(4, 20, true);         // Version needed
        lv.setUint16(6, 0x0800, true);     // UTF-8 flag
        lv.setUint16(8, 0, true);          // Store method (0)
        lv.setUint16(10, 0, true);
        lv.setUint16(12, 0, true);
        lv.setUint32(14, crc, true);
        lv.setUint32(18, dataBytes.length, true);
        lv.setUint32(22, dataBytes.length, true);
        lv.setUint16(26, pathBytes.length, true);
        lv.setUint16(28, 0, true);
        localHeader.set(pathBytes, 30);

        fileEntries.push({ pathBytes, dataBytes, crc, localHeader, offset });
        offset += localHeader.length + dataBytes.length;
      }

      const centralParts = [];
      let centralSize = 0;

      for (const entry of fileEntries) {
        const cdHeader = new Uint8Array(46 + entry.pathBytes.length);
        const cv = new DataView(cdHeader.buffer);
        cv.setUint32(0, 0x02014b50, true); // Central directory signature
        cv.setUint16(4, 20, true);
        cv.setUint16(6, 20, true);
        cv.setUint16(8, 0x0800, true);
        cv.setUint16(10, 0, true);
        cv.setUint16(12, 0, true);
        cv.setUint16(14, 0, true);
        cv.setUint32(16, entry.crc, true);
        cv.setUint32(20, entry.dataBytes.length, true);
        cv.setUint32(24, entry.dataBytes.length, true);
        cv.setUint16(28, entry.pathBytes.length, true);
        cv.setUint16(30, 0, true);
        cv.setUint16(32, 0, true);
        cv.setUint16(34, 0, true);
        cv.setUint16(36, 0, true);
        cv.setUint32(38, 0, true);
        cv.setUint32(42, entry.offset, true);
        cdHeader.set(entry.pathBytes, 46);

        centralParts.push(cdHeader);
        centralSize += cdHeader.length;
      }

      const eocd = new Uint8Array(22);
      const ev = new DataView(eocd.buffer);
      ev.setUint32(0, 0x06054b50, true); // End of central directory
      ev.setUint16(4, 0, true);
      ev.setUint16(6, 0, true);
      ev.setUint16(8, fileEntries.length, true);
      ev.setUint16(10, fileEntries.length, true);
      ev.setUint32(12, centralSize, true);
      ev.setUint32(16, offset, true);
      ev.setUint16(20, 0, true);

      const blobParts = [];
      for (const entry of fileEntries) {
        blobParts.push(entry.localHeader, entry.dataBytes);
      }
      for (const cd of centralParts) {
        blobParts.push(cd);
      }
      blobParts.push(eocd);

      const zipBlob = new Blob(blobParts, { type: 'application/zip' });
      triggerFileDownload('o_jarjesto_sivusto_kansio.zip', zipBlob);
    }

    // 4. Copy Full HTML Code to Clipboard
    function copyFullWebsiteCode() {
      const fullHtml = '<!DOCTYPE html>\n<html lang="fi" class="dark">\n' + document.documentElement.innerHTML + '\n</html>';
      const ta = document.createElement('textarea');
      ta.value = fullHtml;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);

      const btnText = document.getElementById('copyCodeBtnText');
      if (btnText) btnText.textContent = '✅ Koko HTML-koodi kopioitu leikepöydälle!';
      showToast('📋 Koko sivuston HTML-koodi kopioitu leikepöydälle!');
    }

    // Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    // 4K Ambient Background Canvas Particles
    window.addEventListener('DOMContentLoaded', () => {
      const canvas = document.getElementById('ambientCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let w = canvas.width = window.innerWidth;
      let h = canvas.height = window.innerHeight;

      window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      });

      const particles = Array.from({ length: 65 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      }));

      function animateBg() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        requestAnimationFrame(animateBg);
      }
      animateBg();
    });