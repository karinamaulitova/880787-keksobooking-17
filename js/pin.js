'use strict';

(function (setAddress, activateKeksobooking) {
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

    activateKeksobooking();

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
      var Y_TOP_BORDER = 130;
      var Y_BOTTOM_BORDER = 630 - 7;

      if (newTopCoordinate > Y_BOTTOM_BORDER) {
        newTopCoordinate = Y_BOTTOM_BORDER;
      } else if (newTopCoordinate < Y_TOP_BORDER) {
        newTopCoordinate = Y_TOP_BORDER;
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
})(window.setAddress, window.activateKeksobooking);
