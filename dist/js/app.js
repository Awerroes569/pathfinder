import { select, classNames} from './settings.js';
import Table from './components/Table.js';
//import Cart from './components/Cart.js';
//import Booking from './components/Booking.js';
//import Home from './components/Home.js';


const app = {

  thisApp: this,

  activatePage: function (pageId) {
    //const thisApp = this;
    for (let page of this.pages) {
      page.classList.toggle(
        classNames.pages.active,
        page.id == pageId,
        console.log('page.id:XXXXXXXXXXXX', page.id)
      );
    }
    for (let link of this.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }

  },

  initPages: function () {
    const thisApp = this;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    const idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingHash = thisApp.pages[0].id;
    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = idFromHash;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);//thisApp.pages[0].id);
    console.log('thisApp.links:', thisApp.navLinks);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const id = link.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        console.log('ACTIVATED  id:', id);
        window.location.hash = '#/' + id;
      });
    }
  },

  initMenu: function () {
    console.log('activatePage:');
  },

  initCart: function () {
    console.log('activatePage:');
  },

  initData: function () {
    console.log('activatePage:');
  },

  initBooking: function () {
    console.log('activatePage:');
  },

  initHome: function () {
    console.log('activatePage:');
  },
  
  initTable: function () {
    const table = new Table();
    console.log('table:', table);
  },

  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    thisApp.initPages();
    console.log('*** App initPages ***');
    thisApp.initData();
    console.log('*** App initData ***'); 
    thisApp.initTable();
    console.log('*** App initCart ***');
    thisApp.initBooking();
    console.log('*** App initBooking ***');
    thisApp.initHome();
    console.log('*** App initHome ***');
  },
};

app.init();

//export default app;
