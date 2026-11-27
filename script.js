(() => {
  const data = window.WEDDING || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const text = (selector, value, root = document) => { const el = $(selector, root); if (el && value !== undefined && value !== null) el.textContent = value; };
  const link = (selector, value) => { const el = $(selector); if (el && value) el.href = value; };
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const guest = new URLSearchParams(location.search).get("to") || data.guestDefault || "Nama Tamu";
  const groom = data.groom || {}, bride = data.bride || {};
  const groomName = groom.name || "Rangga Pratama", brideName = bride.name || "Anggun Putri";
  const date = new Date(data.dateISO || "2026-12-12T08:00:00+07:00");

  text("#guestName", guest.replace(/\+/g, " "));
  $("#coverNames").innerHTML = `${safe(groomName)} <span>&</span> ${safe(brideName)}`;
  $("#heroNames").innerHTML = `${safe(groomName)} <span>&</span> ${safe(brideName)}`;
  text("#footerNames", `${groomName} & ${brideName}`);
  text("#groomName", groomName); text("#groomParents", groom.parents);
  text("#brideName", brideName); text("#brideParents", bride.parents);
  text("#eventDateText", data.dateLabel || "");
  text("#akadDate", data.akad?.date); text("#akadTime", data.akad?.time);
  text("#resepsiDate", data.resepsi?.date); text("#resepsiTime", data.resepsi?.time);
  text("#venueName", data.venue); text("#venueName2", data.venue);
  text("#venueAddress", data.address); text("#venueAddress2", data.address);
  text("#copyrightYear", String(date.getFullYear()));
  link("#mapAkad", data.mapUrl); link("#mapResepsi", data.mapUrl);
  link("#groomInstagram", groom.instagram); link("#brideInstagram", bride.instagram);

  if (!Number.isNaN(date.getTime())) {
    text("#dateMonth", new Intl.DateTimeFormat("id-ID", { month: "long" }).format(date).toUpperCase());
    text("#dateDay", String(date.getDate()).padStart(2, "0"));
    text("#dateYear", String(date.getFullYear()));
    text("#dateWeekday", `${new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date).toUpperCase()} · ${new Intl.DateTimeFormat("id-ID", { hour:"2-digit", minute:"2-digit", hour12:false }).format(date)} WIB`);
  }

  function setPhoto(selector, src) {
    const el = $(selector);
    if (!el || !src) return;
    el.style.backgroundImage = `url("${src}")`;
    el.classList.add("has-photo");
    const label = $("span", el); if (label) label.remove();
  }
  setPhoto("#groomPhoto", groom.photo);
  setPhoto("#bridePhoto", bride.photo);
  setPhoto("#heroPhoto", data.heroPhoto);
  setPhoto("#rsvpPhoto", data.rsvpPhoto || data.heroPhoto);
  setPhoto("#footerPhoto", data.footerPhoto || data.heroPhoto);

  // Stories: preserve the designed timeline; replace copy and image only.
  const storyCards = $$(".timeline-container");
  (data.story || []).forEach((item, i) => {
    const card = storyCards[i]; if (!card) return;
    text(".story-date", item.date, card);
    text("h3", item.title, card);
    text("p", item.text, card);
    setPhotoIn(card.querySelector(".story-image"), item.photo);
  });
  function setPhotoIn(el, src) {
    if (!el || !src) return;
    el.style.backgroundImage = `url("${src}")`; el.classList.add("has-photo");
    const label = $("span", el); if (label) label.remove();
  }

  // Gallery assets are supplied by the client, not copied from the reference wedding.
  const gallery = $$(".gallery-item");
  (data.gallery || []).forEach((src, i) => {
    const el = gallery[i]; if (!el || !src) return;
    el.style.backgroundImage = `url("${src}")`; el.classList.add("has-photo");
    const label = $("span", el); if (label) label.remove();
  });

  // Open envelope; template-style cover slides away, then page animations start.
  let isMusicAllowedToPlay = false;
  const cover = $("#cover"), music = $("#bgMusic"), musicControl = $("#musicControl"), playPause = $("#playPause");
  if (data.musicUrl) { music.src = data.musicUrl; musicControl.hidden = false; }
  function musicPlay(shouldPlay = true) {
    if (!music || !data.musicUrl) return;
    if (shouldPlay && isMusicAllowedToPlay) {
      music.loop = true;
      music.play().then(() => { if (playPause) playPause.textContent = "Ⅱ"; }).catch(() => {});
    } else {
      music.pause();
      if (playPause) playPause.textContent = "♫";
    }
  }
  $("#btn-envelope")?.addEventListener("click", () => {
    document.body.classList.remove("locked");
    isMusicAllowedToPlay = true;
    cover.classList.add("cover-opened");
    runOrnamentAnimations();
    initParallax();
    musicPlay(true);
    setTimeout(() => { cover.hidden = true; }, 1800);
    $("#header")?.scrollIntoView({ behavior:"smooth", block:"start" });
  });
  musicControl?.addEventListener("click", () => music.paused ? musicPlay(true) : musicPlay(false));
  document.addEventListener("visibilitychange", () => { if (document.hidden) musicPlay(false); });

  // GSAP / ScrollTrigger: entrance animations and gentle parallax.
  function runOrnamentAnimations() {
    const elements = $$("[data-anim]");
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      elements.forEach((el) => {
        const anim = el.dataset.anim || "fade-up";
        const duration = parseFloat(el.dataset.animDuration || "1800") / 1000;
        const delay = parseFloat(el.dataset.animDelay || "0") / 1000;
        if (anim === "lambai") {
          gsap.fromTo(el, { autoAlpha:0, rotate:-5 }, {
            autoAlpha:1, rotate:5, duration:Math.max(duration, 3), delay,
            ease:"sine.inOut", repeat:-1, yoyo:true,
            scrollTrigger:{ trigger:el, start:"top 92%", toggleActions:"play pause resume pause" }
          });
        } else {
          const from = anim === "fade-left" ? {x:55,autoAlpha:0} :
                       anim === "fade-right" ? {x:-55,autoAlpha:0} :
                       anim === "fade-down" ? {y:-45,autoAlpha:0} :
                       {y:45,autoAlpha:0};
          gsap.fromTo(el, from, {
            x:0,y:0,autoAlpha:1,duration:Math.min(Math.max(duration,.5),2.5),delay,ease:"power2.out",
            scrollTrigger:{trigger:el,start:"top 90%",once:true}
          });
        }
      });
      $$(".reveal").forEach(el => gsap.fromTo(el,{y:32,autoAlpha:0},{
        y:0,autoAlpha:1,duration:.9,ease:"power2.out",
        scrollTrigger:{trigger:el,start:"top 88%",once:true}
      }));
    } else {
      elements.forEach(el => el.classList.add("has-animate"));
      $$(".reveal").forEach(el => el.classList.add("is-visible"));
    }
  }
  function initParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    $$(".depth-layer").forEach(el => {
      const depth = Number(el.dataset.depth || .3);
      gsap.to(el,{y:100*depth,ease:"none",scrollTrigger:{trigger:el.closest("section") || el,start:"top top",end:"bottom top",scrub:1}});
    });
    gsap.to(".hero-landscape .mountain-1",{y:90,ease:"none",scrollTrigger:{trigger:"#header",start:"top top",end:"bottom top",scrub:1}});
    gsap.to(".hero-landscape .land",{y:180,ease:"none",scrollTrigger:{trigger:"#header",start:"top top",end:"bottom top",scrub:1}});
  }

  // Countdown
  const countdownTarget = date.getTime();
  function updateCountdown() {
    const diff = Math.max(0, countdownTarget - Date.now());
    const parts = {
      days: Math.floor(diff/86400000),
      hours: Math.floor(diff%86400000/3600000),
      minutes: Math.floor(diff%3600000/60000),
      seconds: Math.floor(diff%60000/1000)
    };
    Object.entries(parts).forEach(([id,val]) => text(`#${id}`,String(val).padStart(2,"0")));
  }
  updateCountdown(); setInterval(updateCountdown,1000);

  // RSVP -> WhatsApp (preview mode, no server/database).
  $("#rsvpForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#rsvpName").value.trim();
    const attendance = $("#rsvpAttendance").value;
    const count = $("#rsvpCount").value;
    const message = $("#rsvpMessage").value.trim();
    const body = `Assalamu'alaikum, saya ${name}. Konfirmasi: ${attendance}. Jumlah tamu: ${count}. ${message}`;
    const number = String(data.rsvpWhatsapp || "").replace(/\D/g,"");
    if (!number) return toast("Isi nomor WhatsApp di config.js terlebih dahulu.");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(body)}`,"_blank","noopener");
  });

  // Wishes preview saved in this browser only; production needs a database endpoint.
  const wishList = $("#wishList");
  let wishes = [];
  try { wishes = JSON.parse(localStorage.getItem("yama-v4-wishes") || "[]"); } catch {}
  function renderWishes() {
    if (!wishList) return;
    wishList.innerHTML = wishes.map(w => `<article class="wish"><span class="wish-badge">${safe((w.name||"?").slice(0,1).toUpperCase())}</span><div class="wish-description"><h4>${safe(w.name)}</h4><p>${safe(w.message)}</p></div></article>`).join("");
  }
  renderWishes();
  $("#wishForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#wishName").value.trim(), message = $("#wishText").value.trim();
    if (!name || !message) return;
    wishes.unshift({name,message});
    wishes = wishes.slice(0,40);
    localStorage.setItem("yama-v4-wishes",JSON.stringify(wishes));
    renderWishes(); e.target.reset(); toast("Ucapan ditambahkan pada preview lokal.");
  });

  // Gift tab with GSAP Flip if available.
  const tabs = $$(".tabs-gift .tab");
  tabs.forEach(tab => tab.addEventListener("click", () => {
    const glider = $(".tabs-gift .glider");
    const flipState = window.Flip && glider ? Flip.getState(glider) : null;
    tabs.forEach(t => t.classList.toggle("active",t===tab));
    $$(".gift-panel").forEach(panel => panel.classList.toggle("show",panel.id===tab.dataset.tab));
    if (glider && tab === tabs[1]) glider.style.transform = "translateX(calc(100% + 6px))";
    if (glider && tab === tabs[0]) glider.style.transform = "translateX(0)";
    if (flipState && window.Flip) Flip.from(flipState,{duration:.25,ease:"power1.inOut"});
  }));

  // Bank copy.
  document.addEventListener("click", async e => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    try { await navigator.clipboard.writeText(btn.dataset.copy); toast("Nomor rekening berhasil disalin."); }
    catch { toast("Browser tidak mengizinkan penyalinan otomatis."); }
  });
  const giftNumber = String(data.giftWhatsapp || data.rsvpWhatsapp || "").replace(/\D/g,"");
  link("#giftWhatsapp", giftNumber ? `https://wa.me/${giftNumber}` : "");

  // Build bank cards from config.
  if (data.gifts?.length) {
    $("#bankGrid").innerHTML = data.gifts.map(g => `<article class="bank-card"><b>${safe(g.bank)}</b><strong>${safe(g.number)}</strong><small>${safe(g.owner)}</small><button type="button" data-copy="${safe(g.number)}">Salin Nomor</button></article>`).join("");
  }

  // Gallery lightbox.
  const lightbox = $("#lightbox"), lightboxImage = $("#lightboxImage");
  $$(".gallery-item").forEach(item => item.addEventListener("click", () => {
    const bg = getComputedStyle(item).backgroundImage;
    const match = bg.match(/url\(["']?(.*?)["']?\)/);
    if (match) { lightboxImage.src = match[1]; lightbox.hidden = false; }
    else toast("Tambahkan foto galeri melalui config.js.");
  }));
  $("#lightboxClose")?.addEventListener("click",()=>lightbox.hidden=true);
  lightbox?.addEventListener("click",e=>{if(e.target===lightbox)lightbox.hidden=true;});

  function youtubeEmbed(url) {
    if (!url) return "";
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  }
  const yt = youtubeEmbed(data.youtubeUrl);
  if (yt) $("#videoFrame").innerHTML = `<iframe src="${yt}" title="Video prewedding" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  const live = youtubeEmbed(data.liveStreamUrl);
  if (live) $("#liveVideo").innerHTML = `<iframe src="${live}" title="Live streaming" allowfullscreen></iframe>`;

  // Scroll progress.
  const progress = $("#pageProgress");
  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max>0?scrollY/max:0})`;
  }
  addEventListener("scroll",updateProgress,{passive:true});
  updateProgress();

  let toastTimer;
  function toast(message) {
    const el = $("#toast"); if (!el) return;
    el.textContent = message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2400);
  }

  // Basic graceful fallback: make reveal sections visible if GSAP CDN is blocked.
  if (!window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add("no-gsap");
    $$(".reveal").forEach(el=>el.classList.add("is-visible"));
    $$("[data-anim]").forEach(el=>el.style.visibility="visible");
  }
})();
