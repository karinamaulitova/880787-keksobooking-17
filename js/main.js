'use strict';

(function () {
  var SERVER_URL = 'https://js.dump.academy/keksobooking/data';
  var keksobookingActive = false;

  var activateKeksobooking = function () {
    if (!keksobookingActive) {
      window.load.loadData(SERVER_URL, function (ads) {
        window.map.activateMap();
        window.form.activateAdForm();
        window.map.setSimilarAdsFromServer(ads);
        window.map.drawSimilarAds(ads.slice(0, window.map.MAX_NUMBER_OF_PINS_ON_MAP));
        keksobookingActive = true;
      }, function (message) {
        var errorTemplate = document.querySelector('#error').content.querySelector('.error');
        var errorElement = errorTemplate.cloneNode(true);
        var messageElement = errorElement.querySelector('.error__message');
        messageElement.textContent = message;
        var errorButton = errorElement.querySelector('.error__button');
        errorButton.addEventListener('click', function () {
          errorElement.remove();
          activateKeksobooking();
        });

        document.querySelector('main').appendChild(errorElement);
      });
    }
  };

  var deActivateKeksobooking = function () {
    if (keksobookingActive) {
      window.map.deactivateMap();
      window.map.removeSimilarAds();
      window.form.deactivateAdForm();
      window.pin.resetMapPin();
      keksobookingActive = false;
    }
  };

  window.main = {
    activateKeksobooking: activateKeksobooking,
    deActivateKeksobooking: deActivateKeksobooking
  };

})();
