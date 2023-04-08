'use strict';

///////////////////////////////////////
///////////////Selectors///////////////

//General
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');

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

///////////////////////////////////////
////////Page Content///////////////////
// Modal window
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

///////////////////////////////
//Cookie Message
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

//////////////////////////
///////Page behavior//////
//Navigation bar scmooth scrolling
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

//Operations Tab content
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

//Menu fade animation
//handler
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

//sticky nav bar
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

const headerObserver = new IntersectionObserver(obsCallback, headerObsOptions);
headerObserver.observe(header);
