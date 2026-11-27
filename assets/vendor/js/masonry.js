
/* =========================================
   SPLIDE GALLERY
========================================= */

if (document.querySelector("#gallery-default")) {
    const gallery = new Splide("#gallery-default", {
        pagination: false,
    });

    const thumbnails = new Splide("#thumbnail-gallery", {
        pagination: false,
        arrows: false,
        focus: "center",
        gap: 2.5,
        perPage: 6,
        isNavigation: true,
        breakpoints: {
            576: {
                perPage: 4
            }
        }
    });

    gallery.sync(thumbnails);
    gallery.mount();
    thumbnails.mount();
}


/* =========================================
   MAGNIFIC POPUP GALLERY
========================================= */

if (document.querySelector("#zoom-gallery-default")) {
    $("#zoom-gallery-default").magnificPopup({
        delegate: "a",
        type: "image",
        mainClass: "mfp-with-zoom mfp-img-mobile",
        gallery: {
            enabled: true,
        },
        zoom: {
            enabled: true,
            easing: "ease-in-out",
        },
    });
}


/*
   CATATAN:
   Pengaturan grid gallery dipindahkan
   sepenuhnya ke masonry.css.

   Tidak lagi menggunakan:
   - switchGridMobile()
   - switchGridTablet()
   - switchGridDesktop()
   - updateGridLayout()
   - ScrollTrigger untuk layout gallery
   - wait() untuk mengatur tinggi gambar
*/
