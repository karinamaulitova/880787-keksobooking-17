'use strict';
(function () {
  var form = document.querySelector('.ad-form');
  var SEND_URL = 'https://js.dump.academy/keksobooking';
  var ESC_KEYCODE = 27;

  window.activateAdForm = function () {
    document.querySelectorAll('.ad-form fieldset').forEach(function (element) {
      element.disabled = false;
    });
    form.classList.remove('ad-form--disabled');
  };

  window.deactivateAdForm = function () {
    form.reset();
    document.querySelectorAll('.ad-form fieldset').forEach(function (element) {
      element.disabled = true;
    });
    form.classList.add('ad-form--disabled');
  };


  var resetButton = document.querySelector('.ad-form__reset');
  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.deActivateKeksobooking();
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

  var capacitySelect = document.querySelector('#capacity');
  var numberOfRoomsSelect = document.querySelector('#room_number');

  var validateNumberOfRooms = function () {
    if (numberOfRoomsSelect.value < capacitySelect.value) {
      numberOfRoomsSelect.setCustomValidity('Слишком мало комнат');
    } else {
      numberOfRoomsSelect.setCustomValidity('');
    }
  };

  numberOfRoomsSelect.addEventListener('change', validateNumberOfRooms);

  capacitySelect.addEventListener('change', validateNumberOfRooms);

  validateNumberOfRooms();


  var handelFormSubmitSuccess = function () {
    window.deActivateKeksobooking();
    var successSubmitTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
    var successSubmitElement = successSubmitTemplate.cloneNode(true);

    document.body.appendChild(successSubmitElement);

    var closeSuccessPopup = function () {
      successSubmitElement.remove();
      document.removeEventListener('keydown', handleDocumentKeydown);
      document.removeEventListener('click', handleDocumentClick);
    };

    var handleDocumentKeydown = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closeSuccessPopup();
      }
    };

    var handleDocumentClick = function (evt) {
      evt.preventDefault();
      closeSuccessPopup();
    };

    document.addEventListener('keydown', handleDocumentKeydown);
    document.addEventListener('click', handleDocumentClick);
  };

  var handleFormSubmitError = function () {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    var errorButton = errorElement.querySelector('.error__button');
    errorButton.textContent = 'Закрыть';


    var closeErrorPopup = function () {
      errorElement.remove();
      document.removeEventListener('keydown', handleDocumentKeydown);
      document.removeEventListener('click', handleDocumentClick);
    };

    var handleDocumentKeydown = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closeErrorPopup();
      }
    };

    var handleDocumentClick = function (evt) {
      evt.preventDefault();
      closeErrorPopup();
    };

    errorButton.addEventListener('click', function () {
      closeErrorPopup();
    });

    document.addEventListener('keydown', handleDocumentKeydown);
    document.addEventListener('click', handleDocumentClick);

    document.querySelector('main').appendChild(errorElement);
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(form);
    window.sendFormData(SEND_URL, formData, handelFormSubmitSuccess, handleFormSubmitError);
  });

})();
