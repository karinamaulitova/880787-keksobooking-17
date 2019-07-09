'use strict';


(function () {

  var keksobookingActive = false;

  window.activateKeksobooking = function () {
    if (!keksobookingActive) {
      window.activateMap();
      window.drawSimilarAds();
      window.activateAdForm();
      keksobookingActive = true;
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
