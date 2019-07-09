'use strict';
(function (deActivateKeksobooking) {

  window.activateAdForm = function () {
    document.querySelectorAll('.ad-form fieldset').forEach(function (element) {
      element.disabled = false;
    });
    document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  };

  window.deactivateAdForm = function () {
    document.querySelectorAll('.ad-form fieldset').forEach(function (element) {
      element.disabled = true;
    });
    document.querySelector('.ad-form').classList.add('ad-form--disabled');
  };


  var resetButton = document.querySelector('.ad-form__reset');
  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    deActivateKeksobooking();
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
})(window.deActivateKeksobooking);
