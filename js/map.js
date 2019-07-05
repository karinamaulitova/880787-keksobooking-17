'use strict';
(function (MAP_PIN_WIDTH, MAP_PIN_HEIGHT) {
  var similarAdsElements = [];

  window.drawSimilarAds = function () {

    var mapPins = document.querySelector('.map__pins');
    var mapPin = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');

    var ads = window.getSimilarAds(1200);

    ads.forEach(function (ad) {
      var adsElement = mapPin.cloneNode(true);

      adsElement.style.left = ad.location.x - MAP_PIN_WIDTH / 2 + 'px';
      adsElement.style.top = ad.location.y - MAP_PIN_HEIGHT + 'px';

      adsElement.querySelector('img').src = ad.author.avatar;
      adsElement.querySelector('img').alt = 'Заголовок объявления';

      mapPins.appendChild(adsElement);
      similarAdsElements.push(adsElement);
    });

  };

  window.removeSimilarAds = function () {
    similarAdsElements.forEach(function (element) {
      element.remove();
    });
    similarAdsElements = [];
  };

  window.activateMap = function () {
    document.querySelector('.map').classList.remove('map--faded');

    document.querySelectorAll('.map__filter').forEach(function (element) {
      element.disabled = false;
    });

    document.querySelector('.map__features').disabled = false;
  };

  window.deactivateMap = function () {
    document.querySelector('.map').classList.add('map--faded');
    document.querySelectorAll('.map__filter').forEach(function (element) {
      element.disabled = true;
    });

    document.querySelector('.map__features').disabled = true;
  };
})(window.MAP_PIN_WIDTH, window.MAP_PIN_HEIGHT);
