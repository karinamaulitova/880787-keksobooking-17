'use strict';


(function () {

  var keksobookingActive = false;

  window.activateKeksobooking = function () {
    if (!keksobookingActive) {
      window.activateMap();
      window.activateAdForm();
      keksobookingActive = true;
      window.load('https://js.dump.academy/keksobooking/data', function (ads) {
        window.drawSimilarAds(ads);
      }, function (message) {
        var errorTemplate = document.querySelector('#error').content.querySelector('.error');
        var errorElement = errorTemplate.cloneNode(true);
        var messageElement = errorElement.querySelector('.error__message');
        messageElement.innerHTML = message;

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
