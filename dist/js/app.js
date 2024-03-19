//import { settings, select, classNames } from './settings.js';
//import Product from './components/Product.js';
//import Cart from './components/Cart.js';
//import Booking from './components/Booking.js';
//import Home from './components/Home.js';


const app = {

  activatePage: function (pageId) {
    console.log('activatePage:', pageId);
  },

  initPages: function () {
    console.log('activatePage:');
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

  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    thisApp.initPages();
    console.log('*** App initPages ***');
    thisApp.initData();
    console.log('*** App initData ***'); 
    thisApp.initCart();
    console.log('*** App initCart ***');
    thisApp.initBooking();
    console.log('*** App initBooking ***');
    thisApp.initHome();
    console.log('*** App initHome ***');
  },
};

app.init();

export default app;
