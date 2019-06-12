'use strict';

var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];

var getSimilarAds = function (blockWidth) {

  var similarAds = [];

  for (var i = 0; i < 8; i++) {
    var ad = {
      'author': {
        'avatar': 'img/avatars/user{{xx}}.png'.replace('{{xx}}', '0' + (i + 1).toString())
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

document.querySelector('.map').classList.remove('map--faded');

var mapPins = document.querySelector('.map__pins');
var mapPin = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var ads = getSimilarAds(1200);

for (var i = 0; i < ads.length; i++) {
  var adsElement = mapPin.cloneNode(true);

  adsElement.style.left = ads[i].location.x - 20 + 'px';
  adsElement.style.top = ads[i].location.y - 40 + 'px';

  adsElement.querySelector('img').src = ads[i].author.avatar;
  adsElement.querySelector('img').alt = 'Заголовок объявления';

  mapPins.appendChild(adsElement);
}
