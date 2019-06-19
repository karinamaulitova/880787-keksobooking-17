'use strict';

var SIMILAR_PINS_NEARBY = 8;
var AVATAR_LINK_TEMPLATE = 'img/avatars/user{{xx}}.png';
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;

var formatNumber = function (num) {
  return num < 10 ? '0' + num.toString() : num.toString();
};


var getSimilarAds = function (blockWidth) {

  var similarAds = [];

  for (var i = 0; i < SIMILAR_PINS_NEARBY; i++) {
    var ad = {
      'author': {
        'avatar': AVATAR_LINK_TEMPLATE.replace('{{xx}}', formatNumber(i + 1))
      },
      'offer': {
        'type': OFFER_TYPES[i % 4]
      },

      'location': {
        'x': Math.random() * (blockWidth - 40) + 20,
        'y': Math.random() * 500 + 130
      }
    };

    similarAds.push(ad);
  }

  return similarAds;
};

var activateMap = function () {
  document.querySelector('.map').classList.remove('map--faded');

  document.querySelectorAll('.map__filter').forEach(function (element) {
    element.disabled = false;
  });

  document.querySelector('.map__features').disabled = false;
};

var activateAdForm = function () {
  document.querySelectorAll('.ad-form fieldset').forEach(function (element) {
    element.disabled = false;
  });
};


/*
var drawSimilarAds = function () {

  var mapPins = document.querySelector('.map__pins');
  var mapPin = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  var ads = getSimilarAds(1200);

  ads.forEach(function (ad) {
    var adsElement = mapPin.cloneNode(true);

    adsElement.style.left = ad.location.x - MAP_PIN_WIDTH / 2 + 'px';
    adsElement.style.top = ad.location.y - MAP_PIN_HEIGHT + 'px';

    adsElement.querySelector('img').src = ad.author.avatar;
    adsElement.querySelector('img').alt = 'Заголовок объявления';

    mapPins.appendChild(adsElement);
  });

};
*/

var activateKeksobooking = function () {
  activateMap();
  activateAdForm();
};

var setAddress = function (x, y) {
  var addressInput = document.querySelector('#address');
  addressInput.value = x + ',' + y;
};

var mapPinMain = document.querySelector('.map__pin--main');
var mapPinMainWidth = mapPinMain.offsetWidth;
var mapPinMainHeight = mapPinMain.offsetHeight;
var defaultAddressX = mapPinMain.offsetLeft + mapPinMainWidth / 2;
var defaultAddressY = mapPinMain.offsetTop + mapPinMainHeight / 2;
setAddress(defaultAddressX, defaultAddressY);

mapPinMain.addEventListener('mouseup', function (evt) {
  activateKeksobooking();
  setAddress(evt.clientX, evt.clientY);
});
