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

var similarAdsElements = [];

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
    similarAdsElements.push(adsElement);
  });

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
  document.querySelector('.map').classList.add('map--faded');
  document.querySelectorAll('.map__filter').forEach(function (element) {
    element.disabled = true;
  });

  document.querySelector('.map__features').disabled = true;
};

var activateAdForm = function () {
  document.querySelectorAll('.ad-form fieldset').forEach(function (element) {
    element.disabled = false;
  });
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
};

var deactivateAdForm = function () {
  document.querySelectorAll('.ad-form fieldset').forEach(function (element) {
    element.disabled = true;
  });
  document.querySelector('.ad-form').classList.add('ad-form--disabled');
};


var keksobookingActive = false;

var activateKeksobooking = function () {
  activateMap();
  drawSimilarAds();
  activateAdForm();
  keksobookingActive = true;
};

var deActivateKeksobooking = function () {
  deactivateMap();
  removeSimilarAds();
  deactivateAdForm();
  keksobookingActive = false;
};

var setAddress = function (x, y) {
  var addressInput = document.querySelector('#address');
  addressInput.value = x + ',' + y;
};

var mapPinMain = document.querySelector('.map__pin--main');
var mapPinMainRect = mapPinMain.getBoundingClientRect();
var mapPinMainWidth = mapPinMainRect.width;
var mapPinMainHeight = mapPinMainRect.height + 20;
var defaultAddressX = mapPinMain.offsetLeft + mapPinMainWidth / 2;
var defaultAddressY = mapPinMain.offsetTop + mapPinMainHeight / 2;
setAddress(defaultAddressX, defaultAddressY);

mapPinMain.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  if (!keksobookingActive) {
    activateKeksobooking();
  }

  var onMouseMove = function (moveEvt) {
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var newTopCoordinate = mapPinMain.offsetTop - shift.y;
    var newLeftCoordinate = mapPinMain.offsetLeft - shift.x;

    var mapRect = document.querySelector('.map').getBoundingClientRect();


    var rightBorder = mapRect.width - mapPinMainWidth;
    var bottomBorder = mapRect.height - mapPinMainHeight;

    if (newTopCoordinate > bottomBorder) {
      newTopCoordinate = bottomBorder;
    } else if (newTopCoordinate < 0) {
      newTopCoordinate = 0;
    }

    if (newLeftCoordinate > rightBorder) {
      newLeftCoordinate = rightBorder;
    } else if (newLeftCoordinate < 0) {
      newLeftCoordinate = 0;
    }

    setAddress(newLeftCoordinate + mapPinMainWidth / 2, newTopCoordinate + mapPinMainHeight);

    mapPinMain.style.top = newTopCoordinate + 'px';
    mapPinMain.style.left = newLeftCoordinate + 'px';
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    setAddress(mapPinMain.offsetLeft + mapPinMainWidth / 2, mapPinMain.offsetTop + mapPinMainHeight);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});


var resetButton = document.querySelector('.ad-form__reset');
resetButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  if (keksobookingActive) {
    deActivateKeksobooking();
  }
});

var typeSelect = document.querySelector('#type');
var priceInput = document.querySelector('#price');

typeSelect.addEventListener('change', function (evt) {
  var selectValue = evt.target.value;
  switch (selectValue) {
    case 'bungalo':
      priceInput.setAttribute('placeholder', '0');
      priceInput.setAttribute('min', '0');
      break;
    case 'flat':
      priceInput.setAttribute('placeholder', '1000');
      priceInput.setAttribute('min', '1000');
      break;
    case 'house':
      priceInput.setAttribute('placeholder', '5000');
      priceInput.setAttribute('min', '5000');
      break;
    case 'palace':
      priceInput.setAttribute('placeholder', '10000');
      priceInput.setAttribute('min', '10000');
      break;
  }
});

var timeInSelect = document.querySelector('#timein');
var timeOutSelect = document.querySelector('#timeout');

timeInSelect.addEventListener('change', function () {
  timeOutSelect.value = timeInSelect.value;
});

timeOutSelect.addEventListener('change', function () {
  timeInSelect.value = timeOutSelect.value;
});
