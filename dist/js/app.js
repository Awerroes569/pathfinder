import { select, classNames} from './settings.js';
import Table from './components/Table.js';

const app = {

  thisApp: this,

  activatePage: function (pageId) {
    for (let page of this.pages) {
      page.classList.toggle(
        classNames.pages.active,
        page.id == pageId
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

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const id = link.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        window.location.hash = '#/' + id;
      });
    }
  },

  initHome: function () {
    ////console.log('activatePage:');
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
    thisApp.initTable();
    console.log('*** App initTable ***');
    thisApp.initHome();
    console.log('*** App initHome ***');
  },
};

app.init();

