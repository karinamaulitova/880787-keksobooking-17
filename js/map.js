'use strict';

(function () {

  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var MAX_NUMBER_OF_PINS_ON_MAP = 5;
  var WIDTH_OF_PHOTO = 45;
  var HEIGHT_OF_PHOTO = 40;
  var MAX_LOW_PRICE = 10000;
  var MIN_HIGH_PRICE = 50000;
  var similarAdsElements = [];
  var similarAdsFromServer = [];
  var currentlyOpenPopupElement = null;

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
      item.setAttribute('width', WIDTH_OF_PHOTO.toString());
      item.setAttribute('height', HEIGHT_OF_PHOTO.toString());
      item.setAttribute('alt', 'Фотография жилья');
      photosContainer.appendChild(item);
    });

    moreInfoAdElement.querySelector('.popup__avatar').src = moreInfoAd.author.avatar;

    var onPopupCloseClick = closePopup;

    moreInfoAdElement.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);

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

  var setSimilarAdsFromServer = function (ads) {
    similarAdsFromServer = ads;
  };


  var drawSimilarAds = function (ads) {

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

      adsElement.addEventListener('keydown', function (evt) {
        if (evt.keyCode === 13) {
          showMoreInfoPopup(ad);
        }
      });

      mapPins.appendChild(adsElement);
      similarAdsElements.push(adsElement);
    });

    var moreInfoAd = ads[0];

    if (moreInfoAd) {
      showMoreInfoPopup(moreInfoAd);
    }

  };

  var removeSimilarAds = function () {
    similarAdsElements.forEach(function (element) {
      element.remove();
    });
    similarAdsElements = [];
  };

  var activateMap = function () {
    document.querySelector('.map').classList.remove('map--faded');

    document.querySelectorAll('.map__filter').forEach(function (element) {
      element.disabled = false;
    });

    document.querySelector('.map__features').disabled = false;
  };

  var deactivateMap = function () {
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
    removeSimilarAds();
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
            return ad.offer.price < MAX_LOW_PRICE;
          case 'middle':
            return ad.offer.price >= MAX_LOW_PRICE && ad.offer.price < MIN_HIGH_PRICE;
          case 'high':
            return ad.offer.price >= MIN_HIGH_PRICE;
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
      .slice(0, MAX_NUMBER_OF_PINS_ON_MAP);
    drawSimilarAds(filteredAds);
  };

  var onFiltersUpdated = debounce(applyFilters, 500);

  mapFilterHousingType.addEventListener('change', onFiltersUpdated);
  mapFilterPrice.addEventListener('change', onFiltersUpdated);
  mapFilterHousingRooms.addEventListener('change', onFiltersUpdated);
  mapFilterHousingGuests.addEventListener('change', onFiltersUpdated);
  mapFilterWifi.addEventListener('change', onFiltersUpdated);
  mapFilterDishwasher.addEventListener('change', onFiltersUpdated);
  mapFilterParking.addEventListener('change', onFiltersUpdated);
  mapFilterWasher.addEventListener('change', onFiltersUpdated);
  mapFilterElevator.addEventListener('change', onFiltersUpdated);
  mapFilterConditioner.addEventListener('change', onFiltersUpdated);

  var onCheckboxKeyDown = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      var targetCheckbox = evt.target;

      targetCheckbox.checked = !targetCheckbox.checked;
      onFiltersUpdated();
    }
  };

  mapFilterWifi.addEventListener('keydown', onCheckboxKeyDown);
  mapFilterDishwasher.addEventListener('keydown', onCheckboxKeyDown);
  mapFilterParking.addEventListener('keydown', onCheckboxKeyDown);
  mapFilterWasher.addEventListener('keydown', onCheckboxKeyDown);
  mapFilterElevator.addEventListener('keydown', onCheckboxKeyDown);
  mapFilterConditioner.addEventListener('keydown', onCheckboxKeyDown);


  window.map = {
    MAX_NUMBER_OF_PINS_ON_MAP: MAX_NUMBER_OF_PINS_ON_MAP,
    drawSimilarAds: drawSimilarAds,
    removeSimilarAds: removeSimilarAds,
    setSimilarAdsFromServer: setSimilarAdsFromServer,
    activateMap: activateMap,
    deactivateMap: deactivateMap
  };
})();
