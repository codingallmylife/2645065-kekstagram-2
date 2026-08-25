import {isEscapeKey, stopEscapePropagation} from './utils.js';

const HASHTAG_REGEX = /^#[a-zA-Zа-яё0-9]{1,19}$/i;

const RULES = [
  {
    check: (tags) => !tags.every((tag) => HASHTAG_REGEX.test(tag)), // каждый хэштег проверяется на то, соответствует ли он регулярному выражению
    message: '•  Неверный хэштег: хэштег должен начинаться с #, быть длиной 2 - 20 символов, включая #, и может содержать только буквы и цифры'
  },
  {
    check: (tags) => {
      const lowerCaseTags = tags.map((tag) => tag.toLowerCase()); // На случай, если один и тот же хэштег встречается в разных регистрах
      const newLowerCaseTags = new Set(lowerCaseTags); // Убираем повторяющиеся хэштеги (если они есть)
      return lowerCaseTags.length !== newLowerCaseTags.size;
    },
    message: '•  Хэштеги не должны повторяться'
  },
  {
    check: (tags) => tags.length > 5,
    message: '•  Должно быть не более 5 хэштегов'
  },
];

const imageUploadForm = document.querySelector('.img-upload__form'); // форма для загрузки и редактирования изображения
const file = document.querySelector('.img-upload__input');
const imageEditOverlay = document.querySelector('.img-upload__overlay'); // окно редактирования изображения, появляется после выбора файла
const fileCloseElement = imageUploadForm.querySelector('.img-upload__cancel'); // кнопка закрытия формы редактирования изображения
const hashtags = document.querySelector('.text__hashtags');
const description = document.querySelector('.text__description');

const pristine = new Pristine(imageUploadForm, {
  classTo: 'img-upload__field-wrapper', // Элемент, на который будут добавляться классы
  errorClass: 'img-upload__field-wrapper--error', // Класс, обозначающий невалидное поле
  errorTextParent: 'img-upload__field-wrapper', // Элемент, куда будет выводиться текст с ошибкой
  errorTextTag: 'div', // Тег для текста ошибки
  errorTextClass: 'pristine-error' // Класс для элемента с текстом ошибки
});

const openFileToEdit = () => {
  if (file.value) {
    document.body.classList.add('modal-open');
    imageEditOverlay.classList.remove('hidden');
  }
  document.addEventListener('keydown', onFormKeydown);
};

const closeFileToEdit = () => {
  imageEditOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onFormKeydown);
  document.body.classList.remove('modal-open');
  file.value = '';
  hashtags.value = '';
  description.value = '';
};

function onFormKeydown (evt) { // Объявлена декларативно, иначе возникала бы ошибка "функция вызвана до её объявления"
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeFileToEdit();
  }
}

// Функция возвращает массив ошибок для хэштегов
const getHashtagsErrors = (value) => {
  const trimmedValue = value.trim();
  if (trimmedValue === '') {
    return []; // если массив пуст, ошибок нет
  }
  const tags = trimmedValue.split(/\s+/); // Получаем из строки с хэштегами массив
  const errors = [];
  RULES.forEach((rule) => {
    if (rule.check(tags)) { // Если ошибка нашлась, то добавляем сообщение об ошибке в массив errors
      errors.push(rule.message);
    }
  });
  return errors;
};

const validateHashtags = (value) => getHashtagsErrors(value).length === 0; // Проверяем, равна ли длина массива ошибок нулю (т.е. нет ошибок)

const validateDescription = (value) => value.length <= 140;

const validateFileType = () => {
  const fileToUpload = file.files[0]; // загруженный файл
  if (!fileToUpload) {
    return true; // если файл не выбран — поле валидно
  }
  return fileToUpload.type.startsWith('image/'); // проверяем, является ли файл изображением
};

file.addEventListener('change', openFileToEdit);

fileCloseElement.addEventListener('click', closeFileToEdit);

hashtags.addEventListener('keydown', stopEscapePropagation);

description.addEventListener('keydown', stopEscapePropagation);

pristine.addValidator(hashtags, validateHashtags, (value) => {
  const errorsFound = getHashtagsErrors(value);
  return errorsFound.join('; ');
});
pristine.addValidator(description, validateDescription, 'Длина описания - не более 140 символов.');
pristine.addValidator(file, validateFileType, 'Файл не является изображением.');

imageUploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    imageUploadForm.submit();
  }
});
