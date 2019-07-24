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

    var moreInfoAd = ads[0];
    var cardElement = document.querySelector('#card')
      .content
      .querySelector('.map__card');

    var moreInfoAdElement = cardElement.cloneNode(true);
    moreInfoAdElement.querySelector('.popup__title').textContent = moreInfoAd.offer.title;
    moreInfoAdElement.querySelector('.popup__text--address').textContent = moreInfoAd.offer.address;
    moreInfoAdElement.querySelector('.popup__text--price').textContent = '{{offer.price}}₽/ночь'.replace('{{offer.price}}', moreInfoAd.offer.price.toString());

    var offerTypeName = '';

    switch (moreInfoAd.offer.type) {
      case 'bungalo':
        offerTypeName = 'Бунгало';
        break;
      case 'flat':
        offerTypeName = 'Квартира';
        break;
      case 'house':
        offerTypeName = 'Дом';
        break;
      case 'palace':
        offerTypeName = 'Дворец';
        break;
    }

    moreInfoAdElement.querySelector('.popup__type').textContent = offerTypeName;
    moreInfoAdElement.querySelector('.popup__text--capacity').textContent = '{{offer.rooms}} комнаты для {{offer.guests}} гостей'
      .replace('{{offer.rooms}}', moreInfoAd.offer.rooms.toString())
      .replace('{{offer.guests}}', moreInfoAd.offer.guests.toString());
    moreInfoAdElement.querySelector('.popup__text--time').textContent = 'Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}'
      .replace('{{offer.checkin}}', moreInfoAd.offer.checkin.toString())
      .replace('{{offer.checkout}}', moreInfoAd.offer.checkout.toString());

    var featuresContainer = moreInfoAdElement.querySelector('.popup__features');

    while (featuresContainer.firstChild) {
      featuresContainer.removeChild(featuresContainer.firstChild);
    }

    moreInfoAd.offer.features.forEach(function (featureItem) {
      var elm = document.createElement('li');
      elm.classList.add('popup__feature', 'popup__feature--{{featureName}}'.replace('{{featureName}}', featureItem));
      featuresContainer.appendChild(elm);
    });
    moreInfoAdElement.querySelector('.popup__description').textContent = moreInfoAd.offer.description;

    var photosContainer = moreInfoAdElement.querySelector('.popup__photos');

    while (photosContainer.firstChild) {
      photosContainer.removeChild(photosContainer.firstChild);
    }
    moreInfoAd.offer.photos.forEach(function (photoItem) {
      var item = document.createElement('img');
      item.setAttribute('src', photoItem);
      item.setAttribute('class', 'popup__photo');
      item.setAttribute('width', '45');
      item.setAttribute('height', '40');
      item.setAttribute('alt', 'Фотография жилья');
      photosContainer.appendChild(item);
    });

    moreInfoAdElement.querySelector('.popup__avatar').src = moreInfoAd.author.avatar;

    var mapBlock = document.querySelector('.map');
    var mapFiltersContainer = document.querySelector('.map__filters-container');
    mapBlock.insertBefore(moreInfoAdElement, mapFiltersContainer);
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
