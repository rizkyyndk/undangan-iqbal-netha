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

    gallery.sync(thumbnails)
    gallery.mount();
    thumbnails.mount()
}

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

const gallery = document.querySelector(".gallery-default");
if (gallery) {
	const gridLg = [3, 4, 11, 12, 19, 20, 27, 28];
	const gridSm = [2, 3, 8, 9, 14, 15, 20, 21, 26, 27];

	const mqm = window.matchMedia("screen and (max-width: 767px)");
	const mqt = window.matchMedia("screen and (min-width:768px) and (max-width: 991px)");
	const mqd = window.matchMedia("(min-width: 992px)");

	const galleryItems = gallery.querySelectorAll("a");

	const switchGridMobile = (mqh) => {
		let grid = gallery.querySelectorAll(".grid-lg-default");
		if (grid && mqh.matches) {
			grid.forEach((el, index) => {
				el.classList.remove("grid-lg-default");
				el.style.height = "";
			});
		}

		galleryItems.forEach((el, index) => {
			if (mqh.matches) {
				if (gridSm.includes(index)) {
					el.classList.add("grid-lg-default");
					wait().then(() => el.style.height = `${galleryItems[1].clientHeight}px`)
				} else {
					el.style.height = ""
				}
			}
		});
		ScrollTrigger.refresh()
	};
	const switchGridTablet = (mqt) => {
		let grid = gallery.querySelectorAll(".grid-lg-default");
		if (grid && mqt.matches) {
			grid.forEach((el, index) => {
				el.classList.remove("grid-lg-default");
				el.style.height = "";
			});
		}

		galleryItems.forEach((el, index) => {
			if (mqt.matches) {
				if (gridLg.includes(index)) {
					el.classList.add("grid-lg-default");
					wait().then(() => el.style.height = `${galleryItems[1].clientHeight}px`)
				} else {
					el.style.height = ""
				}
			}
		});
		ScrollTrigger.refresh()
	};
	const switchGridDesktop = (mqt) => {
		let grid = gallery.querySelectorAll(".grid-lg-default");
		if (grid && mqt.matches) {
			grid.forEach((el, index) => {
				el.classList.remove("grid-lg-default");
				el.style.height = "";
			});
		}

		galleryItems.forEach((el, index) => {
			if (mqt.matches) {
				if (gridLg.includes(index)) {
					el.classList.add("grid-lg-default");
					wait().then(() => el.style.height = `${galleryItems[1].clientHeight}px`)
				} else {
					el.style.height = ""
				}
			}
		});
		ScrollTrigger.refresh()
	};

	switchGridMobile(mqm)
	switchGridTablet(mqt)
	switchGridDesktop(mqd)

	ScrollTrigger.create({
		trigger: gallery,
		start: "-80% bottom",
		once: true,
		onEnter: self => {
			if (self.isActive) {
				switchGridMobile(mqm)
				switchGridTablet(mqt)
				switchGridDesktop(mqd)
			}
		}
	})

	mqm.addEventListener("change", switchGridMobile);
	mqt.addEventListener("change", switchGridTablet)
	mqd.addEventListener("change", switchGridDesktop)
}


function updateGridLayout() {
    const grid = document.querySelector('.gallery-section #zoom-gallery-default');
    const items = grid.children.length;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
        if (items > 4) {
            grid.style.gridTemplateColumns = "auto auto auto auto";
        } else {
            grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
        }
    } else {
        grid.style.gridTemplateColumns = "auto auto auto auto auto";
    }
}

updateGridLayout();

window.addEventListener("resize", updateGridLayout);