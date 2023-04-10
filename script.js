'use strict';

///////////////////////////////////////
///////////////Selectors///////////////

//General
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const allSections = document.querySelectorAll('.section');

//Modal Window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

//Learn More Button
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

//Operations Tabs
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//images
const imgTargets = document.querySelectorAll('img[data-src]');

//Slider
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const slideBtnLeft = document.querySelector('.slider__btn--left');
const slideBtnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////
////////Page Content///////////////////
// Modal window
const modalFunc = function () {
  const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
};
modalFunc();

///////////////////////////////
//Cookie Message
const cookieMsg = function () {
  const msg = document.createElement('div');
  msg.classList.add('cookie-message');

  msg.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;
  header.append(msg);
  //delete message when button is clicked
  document
    .querySelector('.btn--close-cookie')
    .addEventListener('click', function () {
      msg.remove();
    });
  msg.style.backgroundColor = '#37383d';
  msg.style.width = 'calc(100vw - 17px)';
  msg.style.height =
    Number.parseFloat(getComputedStyle(msg).height, 10) + 20 + 'px';
};
cookieMsg();

//////////////////////////
///////Page behavior//////
const smoothScroll = function () {
  //Navigation bar smooth scrolling
  document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('nav__link')) {
      let id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

  //Learn More Button Smooth Scrolling
  btnScrollTo.addEventListener('click', function (e) {
    // scroll to position
    section1.scrollIntoView({ behavior: 'smooth' });
  });
};
smoothScroll();

//Operations Tab content
const opTabs = function () {
  tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');

    //activate button
    if (!clicked) return;
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    //activate tab
    tabsContent.forEach(t => t.classList.remove('operations__content--active'));
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
};
opTabs();
//Menu fade animation
//handler
const navHover = function () {
  const handleHover = function (e) {
    const opacity = this; //using bind to set this keyword
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = nav.querySelectorAll('.nav__link');
      const logo = nav.querySelector('img');

      siblings.forEach(el => {
        if (el !== link) el.style.opacity = opacity;
      });

      logo.style.opacity = opacity;
    }
  };

  nav.addEventListener('mouseover', handleHover.bind(0.5));
  nav.addEventListener('mouseout', handleHover.bind(1));
};
navHover();

//sticky nav bar
const stickyNav = function () {
  const headerObsOptions = {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`,
  };
  const obsCallback = function (entries, observer) {
    const entry = entries[0];
    if (entry.isIntersecting) {
      nav.classList.remove('sticky');
    } else nav.classList.add('sticky');
  };

  const headerObserver = new IntersectionObserver(
    obsCallback,
    headerObsOptions
  );
  headerObserver.observe(header);
};
stickyNav();

//sections appearing on scroll
const sectionOnScroll = function () {
  const revealSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  const sectOptions = {
    root: null,
    threshold: 0.15,
  };

  const sectionObserver = new IntersectionObserver(revealSection, sectOptions);

  allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });
};
sectionOnScroll();

//lazy loading images
const imgLoad = function () {
  const revealImages = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    const element = entry.target;
    element.src = element.dataset.src;

    element.addEventListener('load', function () {
      element.classList.remove('lazy-img');
    });
    observer.unobserve(element);
  };

  const imgOptions = {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  };

  const imgObserver = new IntersectionObserver(revealImages, imgOptions);

  imgTargets.forEach(function (image) {
    imgObserver.observe(image);
  });
};
imgLoad();

//Slider
//putting slides next to each other
const sliderFunc = function () {
  let currSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot${
          i === currSlide ? ' dots__dot--active' : ''
        }" data-slide="${i}"></button></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(function (dot) {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    currSlide = slide;
    slides.forEach(function (s, i) {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
    activeDot(slide);
  };

  const initSlider = function () {
    createDots();
    goToSlide(currSlide);
  };
  initSlider();

  const previousSlide = function () {
    if (currSlide === 0) currSlide = maxSlide - 1;
    else currSlide--;
    goToSlide(currSlide);
  };

  const nextSlide = function () {
    if (currSlide === maxSlide - 1) currSlide = 0;
    else currSlide++;
    goToSlide(currSlide);
  };

  slideBtnLeft.addEventListener('click', previousSlide);
  slideBtnRight.addEventListener('click', nextSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    else if (e.key === 'ArrowLeft') previousSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    const slide = e.target.dataset.slide;
    goToSlide(slide);
  });
};
sliderFunc();
