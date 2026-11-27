(() => {
  "use strict";
  const data = window.WEDDING || {};
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const setText = (selector, value, root=document) => { const el=$(selector,root); if(el && value != null) el.textContent=String(value); return el; };
  const setImage = (img, src, alt) => {
    if (!img || !src) return;
    img.src = src; img.setAttribute("data-src", src); img.removeAttribute("data-original");
    if (alt) img.alt = alt;
    img.classList.remove("lazyload");
  };
  const firstName = name => String(name || "").trim().split(/\s+/)[0] || "";
  const secondName = name => String(name || "").trim().split(/\s+/)[1] || firstName(name);
  // const fullNames = `${secondName(data.groom?.name)} & ${firstName(data.bride?.name)}`;
  const fullNames = `${firstName(data.bride?.name)} & ${secondName(data.groom?.name)}`;


  // Page title and invitation cover.
  document.title = data.pageTitle || `The Wedding of ${fullNames}`;
  const coverTitle = $("#coverNames");
  if (coverTitle) coverTitle.textContent = fullNames;
  const heroTitle = $("#heroNames");
  // if (heroTitle) heroTitle.innerHTML = `${safe(secondName(data.groom?.name))} <span>&</span> ${safe(firstName(data.bride?.name))}`;
  if (heroTitle) heroTitle.innerHTML = `${safe(firstName(data.bride?.name))} <span>&</span> ${safe(secondName(data.groom?.name))}`;

  const guest = new URLSearchParams(location.search).get("to") || data.guestDefault || "Nama Tamu";
  setText("#guestName", guest);

  // Header date row — preserve the exact reference table layout.
  const headerTable = $(".header-section .header-title-content table");
  if (headerTable) {
    const cells = $$('tr td', headerTable);
    const spans = cells.map(td => td.querySelector("span") || td);
    const d = data.dateHeader || {};
    if (spans[0]) spans[0].textContent = d.month || "DESEMBER";
    if (spans[1]) spans[1].textContent = d.weekday || "SABTU";
    if (spans[2]) spans[2].textContent = d.day || "12";
    if (spans[3]) spans[3].textContent = d.time || "JAM 08:00";
    if (spans[4]) spans[4].textContent = d.year || "2026";
  }

  // Intro and couple profiles. Theme 77 places the bride on the left and groom on the right.
  const intro = $(".couple-section[data-id='1'] .couple-content .position-relative");
  if (intro) intro.innerHTML = `<p>Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.</p><p>Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami :</p>`;
  const profiles = $$(".couple-section[data-id='1'] .couple-body .couple");
  const ordered = [data.bride || {}, data.groom || {}];
  profiles.forEach((profile, index) => {
    const person = ordered[index] || {};
    const photo = $(".couple-image", profile);
    setImage(photo, person.photo, person.name || "Foto pasangan");
    setText(".couple-description h3", person.name || "Nama Mempelai", profile);
    setText(".couple-parent-description p", person.parents || "Putra/Putri dari keluarga", profile);
    const social = $(".sosmed", profile);
    if (social) {
      if (person.instagram) { social.href = person.instagram; social.style.display = "inline-flex"; }
      else { social.removeAttribute("href"); social.style.display = "none"; }
    }
  });

  // Countdown and calendar link.
  const countdown = $(".couple-section[data-id='2'] .countdown");
  if (countdown && data.dateISO) countdown.setAttribute("date", data.dateISO);
  const saveDate = $(".couple-section[data-id='2'] .btn-reminder");
  if (saveDate) {
    const start = new Date(data.dateISO || "2026-12-13T08:00:00+07:00");
    const end = new Date(start.getTime() + 3*60*60*1000);
    const fmt = d => {
      const parts = new Intl.DateTimeFormat("en-GB", {timeZone:"Asia/Jakarta", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit", hourCycle:"h23"}).formatToParts(d);
      const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
      return `${p.year}${p.month}${p.day}T${p.hour}${p.minute}${p.second}`;
    };
    const title = `Pernikahan ${fullNames}`;
    const details = `Acara pernikahan ${fullNames}`;
    const place = data.address || data.venue || "";
    saveDate.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&ctz=Asia%2FJakarta&text=${encodeURIComponent(title)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(place)}`;
  }

  // Love story timeline and its background.
  const storySection = $(".story-section");
  const storyBg = $(".story-background", storySection || document);
  setImage(storyBg, data.storyBackground, "Story background");
  const storyIntro = $(".story-section .story-description .text-center");
  if (storyIntro) storyIntro.textContent = data.storyIntro || "Dua jiwa namun satu pikiran, dua hati namun satu perasaan";
  const storyItems = $$(".story-section .timeline-container");
  (data.story || []).forEach((story, i) => {
    const item = storyItems[i]; if (!item) return;
    setImage($("img", item), story.photo, `Cerita ${i+1}`);
    setText("h2", story.date || "", item);
    setText("h6", story.title || "", item);
    setText("p", story.text || "", item);
  });

  // Gallery masonry — the original theme's masonry.js and Magnific Popup remain active.
  const galleryAnchors = $$("#zoom-gallery-default a");
  (data.gallery || []).forEach((src, i) => {
    const a = galleryAnchors[i]; if (!a || !src) return;
    a.href = src; setImage($("img", a), src, `Foto galeri ${i+1}`);
  });

  // Embedded wedding film and live stream. If the URL is blank, leave the original frame empty.
  function youtubeId(url) {
    if (!url) return "";
    const m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    return m ? m[1] : "";
  }
  function embed(target, url, title) {
    const el = $(target); const id = youtubeId(url);
    if (!el || !id) return;
    el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${safe(title)}" loading="lazy" style="display:block;width:100%;height:100%;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    }
  embed("#gallery_player", data.youtubeUrl, "Wedding film");
  embed("#livestream_player", data.liveStreamUrl, "Live streaming");
  const joinLive = $(".stream-section a.btn-custom");
  if (joinLive && data.liveStreamUrl) joinLive.href = data.liveStreamUrl;

  // Venue information and both event cards.
  const venueSection = $(".venue-section");
  const venueDate = $(".venue-section .venue-description h5 strong");
  if (venueDate) venueDate.textContent = data.dateLabel || "";
  const eventCards = $$(".venue-section .venue-content .card");
  const events = [data.akad || {}, data.resepsi || {}];
  eventCards.forEach((card, i) => {
    const ev = events[i] || {};
    const title = $(".event-name h4", card);
    if (title) title.textContent = i === 0 ? "Akad Nikah" : "Resepsi";
    const eventPs = $$(".event-name > p", card);
    if (eventPs[0]) eventPs[0].textContent = ev.weekday || "Sabtu";
    if (eventPs[1]) eventPs[1].textContent = ev.time || "";
    setText(".event-name .date h5", ev.date || data.dateLabel || "", card);
    setText(".event-place .position-relative h4", data.venue || "Lokasi acara", card);
    const address = $(".event-place .position-relative span", card);
    if (address) address.textContent = data.address || "";
    const map = $(".widget-elements a", card);
    if (map) map.href = data.mapUrl || "https://maps.google.com";
  });

  // RSVP form: save the wish locally for preview and optionally open WhatsApp when configured.
  const form = $("#formUcapan");
  setImage($(".rsvp-section .image-wrapper img"), data.rsvpPhoto, "Foto pasangan");
  const rsvpName = $("#nama");
  if (rsvpName) rsvpName.value = guest;
  const wishesRoot = $("#localWishes");
  const storageKey = "yama-v5-wishes";
  let wishes = [];
  try { wishes = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch { wishes = []; }
  if (!Array.isArray(wishes)) wishes = [];
  // Contoh ucapan preview. Ini data demo, bukan komentar asli dari undangan referensi.
  // Jumlah contoh dibuat cukup agar scrollbar internal terlihat seperti Theme 77.
  const defaultWishes = [
    {name:"Keluarga dan Sahabat", message:"Semoga seluruh rangkaian acara berjalan lancar dan menjadi awal kehidupan yang penuh kebahagiaan."},
    {name:"Teman Terdekat", message:"Selamat menempuh hidup baru. Semoga selalu saling menyayangi, melengkapi, dan menguatkan."},
    {name:"Sahabat", message:"Semoga hari bahagia ini menjadi awal perjalanan yang penuh berkah dan kebahagiaan."},
    {name:"Keluarga Besar", message:"Selamat atas hari bahagianya. Semoga rumah tangga yang dibangun selalu dipenuhi ketenangan, kesehatan, rezeki yang baik, dan kasih sayang."},
    {name:"Sahabat Sekolah", message:"Ikut senang melihat kalian sampai di tahap ini. Semoga selalu kompak, saling memahami, dan tetap menjadi tempat pulang terbaik satu sama lain."},
    {name:"Rekan Kerja", message:"Selamat menjalani babak baru. Semoga semua persiapan hingga hari pernikahan berjalan lancar dan kehidupan bersama selalu diberi keberkahan."},
    {name:"Teman Kuliah", message:"Doa terbaik untuk kalian berdua. Semoga cinta dan persahabatan terus tumbuh, baik dalam hari-hari yang mudah maupun saat menghadapi tantangan."},
    {name:"Saudara", message:"Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Saling menjaga, menghargai, dan menguatkan sepanjang perjalanan."},
    {name:"Tetangga", message:"Selamat berbahagia. Semoga acara berlangsung lancar, semua keluarga diberi kesehatan, dan kalian selalu hidup rukun serta bahagia."},
    {name:"Sahabat Lama", message:"Akhirnya hari yang dinanti tiba. Semoga setiap langkah setelah ini membawa cerita indah, kesabaran, dan kebahagiaan yang terus bertambah."}
  ];
  const showDemoWishes = data.previewDemoWishes !== false;
  function renderWishes() {
    if (!wishesRoot) return;
    // Contoh ucapan tetap ditampilkan pada mode preview, termasuk setelah tamu mengirim ucapan.
    // Dengan begitu area komentar tetap menunjukkan perilaku scroll saat diuji.
    const list = showDemoWishes ? [...wishes, ...defaultWishes] : wishes;
    if (!list.length) {
      wishesRoot.innerHTML = '<p class="mb-4">Belum ada ucapan. Jadilah yang pertama mengirimkan doa.</p>';
      return;
    }
    wishesRoot.innerHTML = list.map(w => `<div class="wish"><div class="wish-badge"><h6>${safe((w.name || "T").trim().charAt(0).toUpperCase())}</h6></div><div class="wish-description"><div class="clearfix"><div class="float-start"><h6 style="font-size:1.17rem;">${safe(w.name || "Tamu")}</h6></div></div><p style="white-space:pre-line;">${safe(w.message || "")}</p><small class="text-muted">${safe(w.time || "Ucapan dari keluarga dan sahabat")}</small></div></div>`).join("");
  }
  renderWishes();
  function toast(message) {
    if (window.iziToast) { iziToast.success({message, position:"topRight", timeout:2200}); return; }
    const el = document.createElement("div");
    el.textContent = message; el.style.cssText = "position:fixed;z-index:99999;bottom:24px;left:50%;transform:translateX(-50%);background:#3e4546;color:white;padding:12px 18px;border-radius:30px;box-shadow:0 8px 24px #0002";
    document.body.appendChild(el); setTimeout(()=>el.remove(),2200);
  }
  if (form) form.addEventListener("submit", e => e.preventDefault());
  const sendButton = $("#btnUcapan");
  if (sendButton && form) {
    sendButton.addEventListener("click", () => {
      if (!form.reportValidity()) return;
      const name = (rsvpName?.value || guest).trim();
      const message = ($("#komentar")?.value || "").trim();
      const attendance = $("input[name='rsvp']:checked", form)?.value || "Belum memilih kehadiran";
      const count = $("select[name='jumlah']", form)?.value || "1";
      wishes.unshift({name, message: `${attendance} · ${count} orang\n${message}`, time:"Baru saja"});
      wishes = wishes.slice(0,30);
      try { localStorage.setItem(storageKey, JSON.stringify(wishes)); } catch {}
      renderWishes();
      if (wishesRoot) wishesRoot.scrollTop = 0;
      const number = String(data.rsvpWhatsapp || "").replace(/\D/g, "");
      if (number) {
        const body = `Assalamu'alaikum, saya ${name}. Konfirmasi: ${attendance}. Jumlah tamu: ${count}. ${message}`;
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(body)}`, "_blank", "noopener");
      }
      form.reset(); if (rsvpName) rsvpName.value = guest;
      toast(number ? "Ucapan disimpan dan WhatsApp dibuka." : "Ucapan tersimpan di preview lokal.");
    });
  }
  // RSVP attendance toggles the guest count in the same way as the reference.
  $$("input[name='rsvp']").forEach(radio => radio.addEventListener("change", () => {
    const count = $(".jumlah_orang");
    if (count) count.style.display = radio.value === "Hadir" && radio.checked ? "block" : ( $("#hadir")?.checked ? "block" : "none");
  }));

  // E-Gift account cards — keep the reference card layout and colors.
  const giftSection = $("#giftSection");
  const bankCards = giftSection ? $$(".angpao .card-donasi", giftSection) : [];
  (data.gifts || []).forEach((gift, i) => {
    let card = bankCards[i];
    if (!card && giftSection) {
      const row = $(".angpao .row", giftSection);
      if (!row) return;
      const col = document.createElement("div"); col.className = "col-md-4";
      col.innerHTML = `<div class="card-donasi text-white card-dark"><div class="card-body bubble-shadow"><img height="30" alt=""><h5 class="pt-4 mb-0"></h5><button type="button" class="badge badge-rekening mb-4 copyButton">Copy</button><h6></h6></div></div>`;
      row.appendChild(col); card = $(".card-donasi", col);
    }
    if (!card) return;
    card.style.background = gift.color || "#0060b1";
    const logo = $("img", card); if (logo) { logo.src=gift.logo || ""; logo.alt=gift.bank || "Bank"; }
    const number = $("h5", card); if (number) number.textContent=gift.number || "";
    const copy = $(".copyButton", card); if (copy) { copy.dataset.copy=gift.number || ""; copy.removeAttribute("data-clipboard-target"); copy.textContent="Copy"; }
    setText("h6", gift.owner || "", card);
  });
  bankCards.forEach((card, i) => { if (i >= (data.gifts || []).length) card.closest(".col-md-4")?.remove(); });
  const giftInfo = $(".egift-section .gift");
  if (giftInfo) {
    const hs = $$('h5', giftInfo);
    if (hs[0]) hs[0].textContent = data.giftRecipient || "Nama Pemilik";
    if (hs[1]) hs[1].textContent = data.giftPhone || "";
    if (hs[2]) hs[2].textContent = data.giftAddress || data.address || "";
  }
  document.addEventListener("click", async e => {
    const button = e.target.closest("[data-copy]");
    if (!button) return;
    const value = button.dataset.copy || "";
    try { await navigator.clipboard.writeText(value); toast("Nomor rekening berhasil disalin."); }
    catch { const t=document.createElement("textarea"); t.value=value; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); toast("Nomor rekening berhasil disalin."); }
  });

  // Gift delivery and thank-you imagery/text.
  const giftPhone = String(data.giftWhatsapp || "").replace(/\D/g, "");
  const deliveryLink = $(".egift-section .gift a");
  if (deliveryLink && giftPhone) { deliveryLink.href=`https://wa.me/${giftPhone}`; deliveryLink.textContent="Hubungi Keluarga"; }
  setImage($(".thank-background"), data.thankPhoto, "Foto penutup pasangan");
  const thankMessage = $(".thank-section .thank-body .position-relative");
  if (thankMessage) thankMessage.textContent = "Terima kasih atas doa dan kehadiran Anda dalam acara pernikahan kami.";
  setText(".footer-text", `Copyright ©${new Date().getFullYear()} All Rights Reserved`);

  // Optional background music; no copyrighted reference soundtrack is bundled.
  const musicControl = $("#musicControl");
  const audio = $("#audio_file");
  if (data.musicUrl && audio) {
    const source = document.createElement("source"); source.src=data.musicUrl; source.type="audio/mpeg"; audio.appendChild(source); audio.load();
    if (musicControl) musicControl.hidden=false;
  } else if (musicControl) {
    musicControl.hidden=true;
  }

  // Initialize the original theme cover animations (the source page called this from its loader script).
  if (typeof runAnimationOrnamentCover === "function") runAnimationOrnamentCover();

  // Remove the loading veil only after the local page assets have had a chance to render.
  window.addEventListener("load", () => {
    const loader = $(".loader-wrapper");
    if (loader) { loader.style.opacity="0"; setTimeout(()=>loader.remove(),450); }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }, {once:true});
})();
