'use strict';
(function () {
  var form = document.querySelector('.ad-form');
  var SEND_URL = 'https://js.dump.academy/keksobooking';
  var AVATAR_PLACEHOLDER_URL = 'img/muffin-grey.svg';
  var OFFER_IMG_ALT = 'Фотография жилья для объявления';
  var ESC_KEYCODE = 27;

  var activateAdForm = function () {
    document.querySelectorAll('.ad-form fieldset').forEach(function (element) {
      element.disabled = false;
    });
    form.classList.remove('ad-form--disabled');
  };

  var deactivateAdForm = function () {
    form.reset();
    document.querySelectorAll('.ad-form fieldset').forEach(function (element) {
      element.disabled = true;
    });
    form.classList.add('ad-form--disabled');
  };


  var resetButton = document.querySelector('.ad-form__reset');
  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.main.deActivateKeksobooking();
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

  var onNumberOfRoomsSelectValidate = function () {
    if (numberOfRoomsSelect.value < capacitySelect.value) {
      numberOfRoomsSelect.setCustomValidity('Слишком мало комнат');
    } else {
      numberOfRoomsSelect.setCustomValidity('');
    }
  };

  numberOfRoomsSelect.addEventListener('change', onNumberOfRoomsSelectValidate);

  capacitySelect.addEventListener('change', onNumberOfRoomsSelectValidate);

  onNumberOfRoomsSelectValidate();


  var handelFormSubmitSuccess = function () {
    window.main.deActivateKeksobooking();
    var successSubmitTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
    var successSubmitElement = successSubmitTemplate.cloneNode(true);

    document.body.appendChild(successSubmitElement);

    var closeSuccessPopup = function () {
      successSubmitElement.remove();
      document.removeEventListener('keydown', onDocumentKeydown);
      document.removeEventListener('click', onDocumentClick);
    };

    var onDocumentKeydown = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closeSuccessPopup();
      }
    };

    var onDocumentClick = function (evt) {
      evt.preventDefault();
      closeSuccessPopup();
    };

    document.addEventListener('keydown', onDocumentKeydown);
    document.addEventListener('click', onDocumentClick);
  };

  var handleFormSubmitError = function () {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    var errorButton = errorElement.querySelector('.error__button');
    errorButton.textContent = 'Закрыть';


    var closeErrorPopup = function () {
      errorElement.remove();
      document.removeEventListener('keydown', onDocumentKeydown);
      document.removeEventListener('click', onDocumentCLick);
    };

    var onDocumentKeydown = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closeErrorPopup();
      }
    };

    var onDocumentCLick = function (evt) {
      evt.preventDefault();
      closeErrorPopup();
    };

    errorButton.addEventListener('click', function () {
      closeErrorPopup();
    });

    document.addEventListener('keydown', onDocumentKeydown);
    document.addEventListener('click', onDocumentCLick);

    document.querySelector('main').appendChild(errorElement);
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(form);
    window.load.sendFormData(SEND_URL, formData, handelFormSubmitSuccess, handleFormSubmitError);
  });

  var avatarElement = document.querySelector('.ad-form-header__preview img');
  var avatarInput = document.querySelector('#avatar');
  avatarInput.multiple = false;
  avatarInput.accept = 'image/*';
  var onAvatarInputChange = function (evt) {
    var imageFile = evt.target.files[0];

    if (imageFile) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarElement.src = reader.result;
      });

      reader.readAsDataURL(imageFile);
    } else {
      avatarElement.src = AVATAR_PLACEHOLDER_URL;
    }
  };

  avatarInput.addEventListener('change', onAvatarInputChange);

  var offerPhotoInput = document.querySelector('#images');
  var offerPhotosContainerElement = document.querySelector('.ad-form__photo-container');
  offerPhotoInput.accept = 'image/*';
  offerPhotoInput.multiple = true;

  var cleanOfferPhotosContainer = function () {
    var offerPhotos = offerPhotosContainerElement.querySelectorAll('.ad-form__photo');
    offerPhotos.forEach(function (photoElement) {
      photoElement.remove();
    });
  };

  var onOfferPhotoInputChange = function (evt) {
    var imageFiles = evt.target.files;
    cleanOfferPhotosContainer();
    Array.from(imageFiles).forEach(function (imageFile) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var imagePreviewContainerElement = document.createElement('div');
        var imagePreviewElement = document.createElement('img');
        imagePreviewElement.classList.add('ad-form__photo');
        imagePreviewElement.src = reader.result;
        imagePreviewElement.alt = OFFER_IMG_ALT;
        imagePreviewContainerElement.appendChild(imagePreviewElement);
        offerPhotosContainerElement.appendChild(imagePreviewContainerElement);
      });

      reader.readAsDataURL(imageFile);
    });
  };

  offerPhotoInput.addEventListener('change', onOfferPhotoInputChange);

  window.form = {
    activateAdForm: activateAdForm,
    deactivateAdForm: deactivateAdForm
  };

})();
