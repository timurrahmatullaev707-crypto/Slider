/**
 * ==========================================================================
 * ULTRA 4K 3D CINEMA SLIDER ENGINE (AWWWARDS WOW EDITION)
 * ==========================================================================
 */

// DOM Elements
const slidesContainer = document.getElementById("slides-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const slideCounter = document.getElementById("slide-counter");
const dotsContainer = document.getElementById("dots-container");
const thumbnailsBar = document.getElementById("thumbnails-bar");
const progressBar = document.getElementById("progress-bar");
const autoplayBtn = document.getElementById("autoplay-btn");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const soundBtn = document.getElementById("sound-btn");
const soundOnIcon = document.getElementById("sound-on-icon");
const soundOffIcon = document.getElementById("sound-off-icon");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const effectSelect = document.getElementById("animation-mode-select");
const urlForm = document.getElementById("url-form");
const urlInput = document.getElementById("url-input");
const imageUpload = document.getElementById("image-upload");
const clearBtn = document.getElementById("clear-btn");
const toast = document.getElementById("toast");
const sliderViewport = document.getElementById("slider-viewport");
const ambientBackdrop = document.getElementById("ambient-backdrop");
const presetButtons = document.querySelectorAll(".pill-btn");

// State Variables
let slides = [];
let currentIndex = 0;
let isAnimating = false;
let autoplayInterval = null;
let progressInterval = null;
let isAutoplayActive = false;
const AUTOPLAY_DURATION = 5000; // 5 seconds
let progressTime = 0;
let isSoundEnabled = true;
let audioCtx = null;

/**
 * 4K Curated Presets Library
 */
const PRESETS = {
  nature: [
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85",
      full: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=3840&q=100",
      tag: "🏔️ 4K ULTRA NATURE",
      title: "Yosemite Oltin Quyosh Botishi",
      desc: "Kristalldek tiniq suv aksida buyuk tog' cho'qqilari va quyoshning so'nggi nurlari."
    },
    {
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=85",
      full: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=3840&q=100",
      tag: "🌲 MISTY FOREST 4K",
      title: "Tumanli Qadimiy O'rmonlar",
      desc: "Ertalabki quyuq tuman va qalin qarag'ayzorlar bag'ridagi osoyishtalik."
    },
    {
      src: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2000&q=85",
      full: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=3840&q=100",
      tag: "☀️ SUNLIGHT CANOPY",
      title: "Yashil Tabiat Nafasi",
      desc: "Daraxt yaproqlari orasidan taralayotgan zumrad nur jilosi."
    }
  ],
  cyber: [
    {
      src: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=85",
      full: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=3840&q=100",
      tag: "⚡ CYBERPUNK 2077",
      title: "Neon Shinjuku Tungi Shahri",
      desc: "Tungi yomg'ir, pushti-binafsharang neon chiroqlari va kelajak megapolisining sur'ati."
    },
    {
      src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2000&q=85",
      full: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=3840&q=100",
      tag: "🎮 FUTURE GAMING",
      title: "Cyberpunk Gaming Setup",
      desc: "Kvant hisoblash texnologiyalari va RGB chiroqlarning futuristik sintezi."
    },
    {
      src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=85",
      full: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=3840&q=100",
      tag: "🌃 METROPOLIS NIGHTS",
      title: "Kiber Shahar Ufq Chizig'i",
      desc: "Osmono'par binolar va tuman ichidagi tungi chiroqlar daryosi."
    }
  ],
  space: [
    {
      src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=85",
      full: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=3840&q=100",
      tag: "🌌 DEEP COSMOS",
      title: "Koinot Tubi va Yulduzlar Tizimi",
      desc: "Cheksiz fazodagi yorug'lik tumanliklari va yulduzlarning tug'ilish jarayoni."
    },
    {
      src: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2000&q=85",
      full: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=3840&q=100",
      tag: "🌍 ORBITAL VIEW",
      title: "Moviy Sayyora Fazodan",
      desc: "Atmosfera qatlami va quyosh nurlarining ona sayyoramizdagi aksi."
    }
  ],
  cars: [
    {
      src: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85",
      full: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=3840&q=100",
      tag: "🏎️ HYPER AUTOMOTIVE",
      title: "Dark Shadow Hypercar",
      desc: "Aerodinamik mukammallik, uglerod tolali korpus va drakonik quvvat simfoniyasi."
    },
    {
      src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85",
      full: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=3840&q=100",
      tag: "⚡ SPEED DEMON",
      title: "Porsche GT3 RS Edition",
      desc: "Poyga yo'llarining afsonasi va nemis muhandisligining cho'qqisi."
    }
  ]
};

/**
 * Web Audio API Sound Synthesizer (Futuristic Cinematic Swoosh)
 */
function playSlideSound() {
  if (!isSoundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(280, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, audioCtx.currentTime + 0.06);
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } catch (err) {
    // Audio fallback
  }
}

/**
 * Toast Notification Helper
 */
let toastTimeout;
function showToast(message, isError = false) {
  if (!toast) return;
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.className = `toast show ${isError ? "error" : ""}`;
  toastTimeout = setTimeout(() => {
    toast.className = "toast";
  }, 3200);
}

/**
 * Update Dynamic Ambient Backdrop (Mirrors current slide)
 */
function updateAmbientBackdrop() {
  if (!ambientBackdrop || slides.length === 0) return;
  const currentImg = slides[currentIndex]?.querySelector("img");
  if (currentImg && currentImg.src) {
    ambientBackdrop.style.backgroundImage = `url("${currentImg.src}")`;
  }
}

/**
 * Initialize / Refresh Slides Collection
 */
function updateSliderState() {
  slides = Array.from(slidesContainer.querySelectorAll(".slide"));

  if (currentIndex >= slides.length) {
    currentIndex = Math.max(0, slides.length - 1);
  }

  if (slides.length > 0) {
    slides.forEach((s, idx) => {
      if (idx === currentIndex) s.classList.add("active");
      else s.classList.remove("active");
    });
  }

  updateCounter();
  renderDots();
  renderThumbnails();
  updateAmbientBackdrop();
}

/**
 * Update Counter Display (e.g. 01 / 05)
 */
function updateCounter() {
  if (!slideCounter) return;
  if (slides.length === 0) {
    slideCounter.textContent = "00 / 00";
    return;
  }
  const currentFormatted = String(currentIndex + 1).padStart(2, "0");
  const totalFormatted = String(slides.length).padStart(2, "0");
  slideCounter.textContent = `${currentFormatted} / ${totalFormatted}`;
}

/**
 * Render Interactive Pagination Dots
 */
function renderDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = "";

  slides.forEach((_, idx) => {
    const dot = document.createElement("div");
    dot.className = `dot ${idx === currentIndex ? "active" : ""}`;
    dot.title = `${idx + 1}-slaydga o'tish`;
    dot.addEventListener("click", () => {
      if (idx !== currentIndex && !isAnimating) {
        goToSlide(idx, idx > currentIndex ? "next" : "prev");
        resetAutoplayProgress();
      }
    });
    dotsContainer.appendChild(dot);
  });
}

/**
 * Render Interactive Filmstrip / Thumbnails Bar
 */
function renderThumbnails() {
  if (!thumbnailsBar) return;
  thumbnailsBar.innerHTML = "";

  slides.forEach((slide, idx) => {
    const img = slide.querySelector("img");
    if (!img) return;

    const thumb = document.createElement("div");
    thumb.className = `thumb-item ${idx === currentIndex ? "active" : ""}`;
    thumb.title = `${idx + 1}-rasm`;

    const thumbImg = document.createElement("img");
    thumbImg.src = img.src;
    thumbImg.alt = `Thumb ${idx + 1}`;

    thumb.appendChild(thumbImg);

    thumb.addEventListener("click", () => {
      if (idx !== currentIndex && !isAnimating) {
        goToSlide(idx, idx > currentIndex ? "next" : "prev");
        resetAutoplayProgress();
      }
    });

    thumbnailsBar.appendChild(thumb);
  });

  const activeThumb = thumbnailsBar.querySelector(".thumb-item.active");
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
}

/**
 * Clean up transition classes on all non-active slides
 */
function cleanUpSlides() {
  slides.forEach((slide, idx) => {
    if (idx !== currentIndex) {
      slide.classList.remove("active", "exit-left", "exit-right", "slide-next", "slide-prev");
    }
  });
}

/**
 * Core 3D Directional Slide Transition
 */
function goToSlide(targetIndex, direction = "next") {
  if (isAnimating || slides.length <= 1 || targetIndex === currentIndex) return;

  isAnimating = true;
  playSlideSound();

  const currentSlide = slides[currentIndex];
  const targetSlide = slides[targetIndex];

  if (direction === "next") {
    currentSlide.classList.remove("active", "slide-prev", "slide-next");
    currentSlide.classList.add("exit-left");

    targetSlide.classList.remove("exit-left", "exit-right", "active", "slide-prev");
    targetSlide.classList.add("slide-next");

    void targetSlide.offsetWidth; // Force reflow

    targetSlide.classList.remove("slide-next");
    targetSlide.classList.add("active");
  } else {
    currentSlide.classList.remove("active", "slide-prev", "slide-next");
    currentSlide.classList.add("exit-right");

    targetSlide.classList.remove("exit-left", "exit-right", "active", "slide-next");
    targetSlide.classList.add("slide-prev");

    void targetSlide.offsetWidth; // Force reflow

    targetSlide.classList.remove("slide-prev");
    targetSlide.classList.add("active");
  }

  currentIndex = targetIndex;
  updateCounter();
  renderDots();
  renderThumbnails();
  updateAmbientBackdrop();

  setTimeout(() => {
    cleanUpSlides();
    isAnimating = false;
  }, 860);
}

/**
 * Navigation Arrow Handlers
 */
function handleNext() {
  if (slides.length <= 1) return;
  const nextIdx = (currentIndex + 1) % slides.length;
  goToSlide(nextIdx, "next");
  resetAutoplayProgress();
}

function handlePrev() {
  if (slides.length <= 1) return;
  const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
  goToSlide(prevIdx, "prev");
  resetAutoplayProgress();
}

if (nextBtn) nextBtn.addEventListener("click", (e) => { e.preventDefault(); handleNext(); });
if (prevBtn) prevBtn.addEventListener("click", (e) => { e.preventDefault(); handlePrev(); });

/**
 * Interactive 3D Card Parallax Tilt & Mouse Glare
 */
if (sliderViewport) {
  sliderViewport.addEventListener("mousemove", (e) => {
    const rect = sliderViewport.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    sliderViewport.style.transform = `perspective(1600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    sliderViewport.style.setProperty("--mouse-x", `${x}px`);
    sliderViewport.style.setProperty("--mouse-y", `${y}px`);
  });

  sliderViewport.addEventListener("mouseleave", () => {
    sliderViewport.style.transform = "perspective(1600px) rotateX(0deg) rotateY(0deg)";
  });
}

/**
 * Dynamically Add an Image to the Slider
 */
function addImageToSlider(src, title = "Yangi 4K Rasm", tag = "✨ 4K ULTRA", desc = "Chrome yoki fayldan kiritilgan yuqori aniqlikdagi rasm.") {
  if (!src) return;

  const slideDiv = document.createElement("div");
  slideDiv.className = "slide";

  const img = document.createElement("img");
  img.src = src;
  img.alt = title;

  img.onerror = () => {
    showToast("⚠️ Rasm yuklanmadi. Havolani tekshiring!", true);
    slideDiv.remove();
    updateSliderState();
  };

  img.onload = () => {
    showToast(`Rasm qo'shildi! Jami: ${slides.length} ta 📸`);
  };

  const overlay = document.createElement("div");
  overlay.className = "slide-overlay";
  overlay.innerHTML = `
    <span class="slide-tag">${tag}</span>
    <h2 class="slide-title">${title}</h2>
    <p class="slide-desc">${desc}</p>
    <div class="slide-actions">
      <a href="${src}" target="_blank" class="slide-link-btn">
        <span>Asl formatda ko'rish</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </div>
  `;

  slideDiv.appendChild(img);
  slideDiv.appendChild(overlay);
  slidesContainer.appendChild(slideDiv);

  updateSliderState();
  goToSlide(slides.length - 1, "next");
  resetAutoplayProgress();
}

/**
 * 1. Add Image via URL (Form Input)
 */
if (urlForm) {
  urlForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();
    if (!url) return;

    if (!isValidUrl(url)) {
      showToast("⚠️ Iltimos, to'g'ri rasm linkini (URL) kiriting!", true);
      return;
    }

    addImageToSlider(url, "Chrome 4K Rasm", "🌐 INTERNET 4K", "Chrome brauzeridan kiritilgan media.");
    urlInput.value = "";
  });
}

function isValidUrl(str) {
  return str.startsWith("http://") || 
         str.startsWith("https://") || 
         str.startsWith("data:image/") || 
         str.startsWith("blob:");
}

/**
 * 2. Add Image via Chrome Paste (Ctrl + V anywhere on page)
 */
window.addEventListener("paste", (e) => {
  if (document.activeElement === urlInput) return;

  const clipboardData = e.clipboardData || window.clipboardData;
  if (!clipboardData) return;

  const items = clipboardData.items;
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        const blobUrl = URL.createObjectURL(file);
        addImageToSlider(blobUrl, "Clipboard Rasmi", "📋 CLIPBOARD", "To'g'ridan-to'g'ri nusxalangan rasm.");
        showToast("Clipboard'dan rasm yuklandi! ✨");
        return;
      }
    }
  }

  const pastedText = clipboardData.getData("text").trim();
  if (isValidUrl(pastedText)) {
    addImageToSlider(pastedText, "Chrome Link Rasmi", "🌐 CHROME 4K", "Nusxalangan havola orqali qo'shilgan slayd.");
    showToast("Chrome havolasi orqali rasm qo'shildi! 🚀");
  }
});

/**
 * 3. Add Image via File Upload
 */
if (imageUpload) {
  imageUpload.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      const blobUrl = URL.createObjectURL(file);
      addImageToSlider(blobUrl, file.name, "📁 FAYL 4K", "Qurilmadan yuklangan rasm.");
    });

    imageUpload.value = "";
  });
}

/**
 * 4. Clear All Slides
 */
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (slides.length === 0) {
      showToast("Sliderda rasmlar mavjud emas!");
      return;
    }
    if (confirm("Barcha slaydlarni tozalab, bo'shatmoqchimisiz?")) {
      slidesContainer.innerHTML = "";
      updateSliderState();
      showToast("Barcha rasmlar tozalandi. Yangi 4K rasmlar qo'shing!");
    }
  });
}

/**
 * 5. Quick 4K Presets Switcher
 */
presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    presetButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const presetKey = btn.dataset.preset;
    loadPreset(presetKey);
  });
});

function loadPreset(key) {
  let items = [];
  if (key === "all") {
    items = [
      ...PRESETS.nature.slice(0, 1),
      ...PRESETS.cyber.slice(0, 1),
      ...PRESETS.space.slice(0, 1),
      ...PRESETS.cars.slice(0, 1),
      PRESETS.nature[1]
    ];
  } else if (PRESETS[key]) {
    items = PRESETS[key];
  }

  if (items.length === 0) return;

  slidesContainer.innerHTML = "";
  items.forEach((item, idx) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = `slide ${idx === 0 ? "active" : ""}`;
    slideDiv.innerHTML = `
      <img src="${item.src}" alt="${item.title}" />
      <div class="slide-overlay">
        <span class="slide-tag">${item.tag}</span>
        <h2 class="slide-title">${item.title}</h2>
        <p class="slide-desc">${item.desc}</p>
        <div class="slide-actions">
          <a href="${item.full || item.src}" target="_blank" class="slide-link-btn">
            <span>Asl 4K formatda ko'rish</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
    `;
    slidesContainer.appendChild(slideDiv);
  });

  currentIndex = 0;
  updateSliderState();
  showToast(`4K to'plam faollashtirildi! 🔥`);
}

/**
 * 6. Sound Effects Toggle
 */
if (soundBtn) {
  soundBtn.addEventListener("click", () => {
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
      soundOnIcon.classList.remove("hidden");
      soundOffIcon.classList.add("hidden");
      showToast("Tovush effektlari: YOQILDI 🔊");
      playSlideSound();
    } else {
      soundOnIcon.classList.add("hidden");
      soundOffIcon.classList.remove("hidden");
      showToast("Tovush effektlari: O'CHIRILDI 🔇");
    }
  });
}

/**
 * 7. Fullscreen Toggle
 */
if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      document.body.classList.add("is-fullscreen");
      showToast("Katta ekran rejimi (Chiqish uchun Esc) ⛶");
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      document.body.classList.remove("is-fullscreen");
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      document.body.classList.remove("is-fullscreen");
    }
  });
}

/**
 * 8. Animation Mode Selector
 */
if (effectSelect) {
  effectSelect.addEventListener("change", (e) => {
    document.body.dataset.effect = e.target.value;
    showToast(`Effekt o'zgartirildi: ${e.target.options[e.target.selectedIndex].text} ✨`);
  });
}

/**
 * 9. Autoplay & Progress Bar System
 */
function startAutoplay() {
  isAutoplayActive = true;
  playIcon.classList.add("hidden");
  pauseIcon.classList.remove("hidden");

  progressTime = 0;
  clearInterval(progressInterval);
  clearInterval(autoplayInterval);

  const step = 50;
  progressInterval = setInterval(() => {
    progressTime += step;
    const percentage = Math.min((progressTime / AUTOPLAY_DURATION) * 100, 100);
    if (progressBar) progressBar.style.width = `${percentage}%`;

    if (progressTime >= AUTOPLAY_DURATION) {
      progressTime = 0;
      handleNext();
    }
  }, step);
}

function pauseAutoplay() {
  isAutoplayActive = false;
  playIcon.classList.remove("hidden");
  pauseIcon.classList.add("hidden");
  clearInterval(progressInterval);
  clearInterval(autoplayInterval);
  if (progressBar) progressBar.style.width = "0%";
}

function resetAutoplayProgress() {
  if (isAutoplayActive) {
    progressTime = 0;
    if (progressBar) progressBar.style.width = "0%";
  }
}

if (autoplayBtn) {
  autoplayBtn.addEventListener("click", () => {
    if (isAutoplayActive) {
      pauseAutoplay();
      showToast("Avtomatik o'tish to'xtatildi ⏸️");
    } else {
      startAutoplay();
      showToast("Avtomatik o'tish faollashtirildi ▶️");
    }
  });
}

if (sliderViewport) {
  sliderViewport.addEventListener("mouseenter", () => {
    if (isAutoplayActive) clearInterval(progressInterval);
  });

  sliderViewport.addEventListener("mouseleave", () => {
    if (isAutoplayActive) startAutoplay();
  });
}

/**
 * 10. Keyboard Navigation
 */
window.addEventListener("keydown", (e) => {
  if (document.activeElement === urlInput) return;

  if (e.key === "ArrowRight") {
    handleNext();
  } else if (e.key === "ArrowLeft") {
    handlePrev();
  } else if (e.key === " ") {
    e.preventDefault();
    if (isAutoplayActive) pauseAutoplay();
    else startAutoplay();
  } else if (e.key.toLowerCase() === "f") {
    fullscreenBtn.click();
  } else if (e.key.toLowerCase() === "m") {
    soundBtn.click();
  }
});

/**
 * 11. Touch / Mouse Drag Swipe Navigation
 */
let startX = 0;
let endX = 0;
let isDragging = false;

sliderViewport.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
});

sliderViewport.addEventListener("mouseup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  endX = e.clientX;
  handleSwipe();
});

sliderViewport.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
}, { passive: true });

sliderViewport.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const threshold = 50;
  const diff = startX - endX;

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  }
}

// Initial Boot
updateSliderState();
showToast("WOW Edition 4K Cinema Slider ishga tushdi! 🚀");