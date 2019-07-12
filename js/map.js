'use strict';
window.MAP_PIN_WIDTH = 50;
window.MAP_PIN_HEIGHT = 70;

(function (MAP_PIN_WIDTH, MAP_PIN_HEIGHT) {
  var similarAdsElements = [];
  var similarAdsFromServer = [];

  window.setSimilarAdsFromServer = function (ads) {
    similarAdsFromServer = ads;
  };


  window.drawSimilarAds = function (ads) {

    var mapPins = document.querySelector('.map__pins');
    var mapPin = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');


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

  var mapFilterHousingType = document.querySelector('#housing-type');
  mapFilterHousingType.addEventListener('change', function (evt) {
    window.removeSimilarAds();
    var filterValue = evt.target.value;
    var filteredAds = similarAdsFromServer.filter(function (ad) {
      return ad.offer.type === filterValue || filterValue === 'any';
    }).slice(0, 5);
    window.drawSimilarAds(filteredAds);
  });

})(window.MAP_PIN_WIDTH, window.MAP_PIN_HEIGHT);
