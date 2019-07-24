'use strict';

var SERVER_URL = 'https://js.dump.academy/keksobooking/data';


(function () {

  var keksobookingActive = false;

  window.activateKeksobooking = function () {
    if (!keksobookingActive) {
      window.load(SERVER_URL, function (ads) {
        window.activateMap();
        window.activateAdForm();
        window.setSimilarAdsFromServer(ads);
        window.drawSimilarAds(ads.slice(0, 5));
        keksobookingActive = true;
      }, function (message) {
        var errorTemplate = document.querySelector('#error').content.querySelector('.error');
        var errorElement = errorTemplate.cloneNode(true);
        var messageElement = errorElement.querySelector('.error__message');
        messageElement.textContent = message;
        var errorButton = errorElement.querySelector('.error__button');
        errorButton.addEventListener('click', function () {
          errorElement.remove();
          window.activateKeksobooking();
        });

        document.querySelector('main').appendChild(errorElement);
      });
    }
  };

  window.deActivateKeksobooking = function () {
    if (keksobookingActive) {
      window.deactivateMap();
      window.removeSimilarAds();
      window.deactivateAdForm();
      keksobookingActive = false;
    }
  };

})();
