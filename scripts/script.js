// Inspired by Mothership.live && bkpk.dev
const appendAside = () => {
  const links = document.querySelector('nav').querySelectorAll('a');
  const aside = document.querySelector('aside');
  while (aside.firstChild) aside.removeChild(aside.lastChild);
  let media = document.createElement('span');
  const firstLink = links[0].cloneNode(true);
  firstLink.text = 'Home';
  firstLink.setAttribute('href', '#header');
  aside.appendChild(firstLink);
  for (let i = 1; i < links.length; i++) {
    const node = links[i].cloneNode(true);
    node.classList.remove(...node.classList);
    if (links[i].children[0] && links[i].children[0].tagName === 'IMG') {
      media.appendChild(node);
    } else {
      aside.appendChild(node);
    }
  }
  aside.appendChild(document.createElement('br'));
  aside.appendChild(media);
  return aside;
};

const handleAside = ({
  aside,
  home,
  scrollY
}) => {
  const {
    offsetTop,
    offsetHeight
  } = home;
  const showAside = scrollY > offsetTop;

  if (showAside) {
    aside.classList.remove("invisible");
    // full opacity 60% of the way through the home section
    const opacity = Math.min((scrollY - offsetTop) / (offsetHeight * 0.6), 1);
    aside.style.opacity = opacity;
  } else {
    aside.classList.add("invisible");
    aside.style.opacity = 0;
  }
};

const getPositionFromTop = (el) => {
  let pos = 0;
  el = el.offsetParent;
  while (el) {
    pos += el.offsetTop;
    el = el.offsetParent;
  }
  return pos;
};

const getSubHeaders = () => {
  return [...document.querySelectorAll('.sub-header')].reverse().map(s => {
    const start = getPositionFromTop(s);
    const end = start + s.offsetParent.offsetHeight - s.offsetHeight;
    return [s, start, end];
  });
}

const scroller = () => {
  let scrollY = 0;
  let tick = false;
  const aside = appendAside();
  const home = document.getElementById('home');

  const handleScroll = () => {
    if (!tick) {
      const subHeaders = getSubHeaders();
      scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      setTimeout(() => {
        tick = false;
        handleAside({
          aside,
          home,
          scrollY,
        });

        subHeaders.forEach(([el, start, end]) => {
          if (scrollY > start && scrollY < end) {
            el.classList.add('fixed-header');
          } else {
            el.classList.remove('fixed-header');
          }
        });
      }, 15);
      tick = true;
    }
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, {
    passive: true
  });
};

const click = () => {
  const navs = document.querySelectorAll('.internal-nav>a');
  navs.forEach(nav => {
    const section = nav.getAttribute('href').replace(/[^a-z]/gi, '');
    nav.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(section).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
};

const sweYearsExp = () => {
  const num = (new Date(Date.now())).getFullYear() - (new Date(2019, 4, 1)).getFullYear();
  const text = num === 1 ? 'a year' : `${num} years`;
  document.querySelector("span.exp-years").textContent = text;
};

const bindEvents = () => {
  scroller();
  click();
  sweYearsExp();
};

document.addEventListener('DOMContentLoaded', bindEvents);
globalThis.addEventListener('resize', scroller);