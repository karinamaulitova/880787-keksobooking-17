'use strict';
window.MAP_PIN_WIDTH = 50;
window.MAP_PIN_HEIGHT = 70;


(function (MAP_PIN_WIDTH, MAP_PIN_HEIGHT) {
  var similarAdsElements = [];
  var similarAdsFromServer = [];
  var currentlyOpenPopupElement = null;
  var ESC_KEYCODE = 27;

  var mapBlock = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  var showMoreInfoPopup = function (moreInfoAd) {
    closePopup();

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

    moreInfoAdElement.querySelector('.popup__close').addEventListener('click', closePopup);

    mapBlock.insertBefore(moreInfoAdElement, mapFiltersContainer);
    currentlyOpenPopupElement = moreInfoAdElement;
  };

  var closePopup = function () {
    if (currentlyOpenPopupElement) {
      mapBlock.removeChild(currentlyOpenPopupElement);
      currentlyOpenPopupElement = null;
    }
  };

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  });

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

      adsElement.addEventListener('click', function () {
        showMoreInfoPopup(ad);
      });

      mapPins.appendChild(adsElement);
      similarAdsElements.push(adsElement);
    });

    var moreInfoAd = ads[0];

    if (moreInfoAd) {
      showMoreInfoPopup(moreInfoAd);
    }

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
    closePopup();

    document.querySelector('.map').classList.add('map--faded');
    document.querySelectorAll('.map__filter').forEach(function (element) {
      element.disabled = true;
    });

    document.querySelector('.map__features').disabled = true;
  };

  var debounce = function (f, ms) {

    var isCooldown = false;

    return function () {
      if (isCooldown) {
        return;
      }

      f.apply(null, arguments);

      isCooldown = true;

      setTimeout(function () {
        isCooldown = false;
      }, ms);
    };

  };


  var mapFilterHousingType = document.querySelector('#housing-type');
  var mapFilterPrice = document.querySelector('#housing-price');
  var mapFilterHousingRooms = document.querySelector('#housing-rooms');
  var mapFilterHousingGuests = document.querySelector('#housing-guests');
  var mapFilterWifi = document.querySelector('#filter-wifi');
  var mapFilterDishwasher = document.querySelector('#filter-dishwasher');
  var mapFilterParking = document.querySelector('#filter-parking');
  var mapFilterWasher = document.querySelector('#filter-washer');
  var mapFilterElevator = document.querySelector('#filter-elevator');
  var mapFilterConditioner = document.querySelector('#filter-conditioner');

  var applyFilters = function () {
    window.removeSimilarAds();
    closePopup();
    var housingTypeValue = mapFilterHousingType.value;
    var priceValue = mapFilterPrice.value;
    var housingRoomsValue = mapFilterHousingRooms.value;
    var housingGuestsValue = mapFilterHousingGuests.value;
    var wifiValue = mapFilterWifi.checked;
    var dishwasherValue = mapFilterDishwasher.checked;
    var parkingValue = mapFilterParking.checked;
    var washerValue = mapFilterWasher.checked;
    var elevatorValue = mapFilterElevator.checked;
    var conditionerValue = mapFilterConditioner.checked;
    var filteredAds = similarAdsFromServer
      .filter(function (ad) {
        return ad.offer.type === housingTypeValue || housingTypeValue === 'any';
      }).filter(function (ad) {
        switch (priceValue) {
          case 'low':
            return ad.offer.price < 10000;
          case 'middle':
            return ad.offer.price >= 10000 && ad.offer.price < 50000;
          case 'high':
            return ad.offer.price >= 50000;
          case 'any':
          default:
            return true;
        }
      }).filter(function (ad) {
        return ad.offer.rooms === Number(housingRoomsValue) || housingRoomsValue === 'any';
      }).filter(function (ad) {
        return ad.offer.guests === Number(housingGuestsValue) || housingGuestsValue === 'any';
      }).filter(function (ad) {
        return ad.offer.features.includes('wifi') || !wifiValue;
      }).filter(function (ad) {
        return ad.offer.features.includes('dishwasher') || !dishwasherValue;
      }).filter(function (ad) {
        return ad.offer.features.includes('parking') || !parkingValue;
      }).filter(function (ad) {
        return ad.offer.features.includes('washer') || !washerValue;
      }).filter(function (ad) {
        return ad.offer.features.includes('elevator') || !elevatorValue;
      }).filter(function (ad) {
        return ad.offer.features.includes('conditioner') || !conditionerValue;
      })
      .slice(0, 5);
    window.drawSimilarAds(filteredAds);
  };

  var debouncedApplyFilters = debounce(applyFilters, 500);

  mapFilterHousingType.addEventListener('change', debouncedApplyFilters);
  mapFilterPrice.addEventListener('change', debouncedApplyFilters);
  mapFilterHousingRooms.addEventListener('change', debouncedApplyFilters);
  mapFilterHousingGuests.addEventListener('change', debouncedApplyFilters);
  mapFilterWifi.addEventListener('change', debouncedApplyFilters);
  mapFilterDishwasher.addEventListener('change', debouncedApplyFilters);
  mapFilterParking.addEventListener('change', debouncedApplyFilters);
  mapFilterWasher.addEventListener('change', debouncedApplyFilters);
  mapFilterElevator.addEventListener('change', debouncedApplyFilters);
  mapFilterConditioner.addEventListener('change', debouncedApplyFilters);


})(window.MAP_PIN_WIDTH, window.MAP_PIN_HEIGHT);
