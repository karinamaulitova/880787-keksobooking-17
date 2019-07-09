'use strict';
(function (SIMILAR_PINS_NEARBY, AVATAR_LINK_TEMPLATE, OFFER_TYPES) {


  var formatNumber = function (num) {
    return num < 10 ? '0' + num.toString() : num.toString();
  };


  window.getSimilarAds = function (blockWidth) {

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

  window.setAddress = function (x, y) {
    var addressInput = document.querySelector('#address');
    addressInput.value = x + ',' + y;
  };
})(window.SIMILAR_PINS_NEARBY, window.AVATAR_LINK_TEMPLATE, window.OFFER_TYPES);
