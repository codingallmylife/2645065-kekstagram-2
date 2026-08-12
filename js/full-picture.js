import {isEscapeKey} from './utils.js';

const bigPictureContent = document.querySelector('.big-picture'); // всё содержимое окна с картинкой
const bigPictureCloseElement = bigPictureContent.querySelector('.big-picture__cancel'); // кнопка закрытия окна
const bigPicture = bigPictureContent.querySelector('img'); // сама полноразмерная картинка
const bigPictureLikes = bigPictureContent.querySelector('.likes-count');
const bigPictureCommentCount = bigPictureContent.querySelector('.social__comment-total-count');
const bigPictureCommentShown = bigPictureContent.querySelector('.social__comment-shown-count');
const bigPictureComments = bigPictureContent.querySelector('.social__comments'); // список комментариев
const commentsCount = bigPictureContent.querySelector('.social__comment-count'); // текст "Х из Y комментариев"
const commentsLoader = bigPictureContent.querySelector('.comments-loader'); // текст "Загрузить ещё"
const bigPictureDescription = bigPictureContent.querySelector('.social__caption');

const renderPhotoComments = (photo) => {
  photo.comments.forEach((comment) => {
    const list = document.createElement('li');
    list.classList.add('social__comment');
    const image = document.createElement('img');
    image.classList.add('social__picture');
    image.src = comment.avatar;
    image.alt = comment.name;
    image.width = 35;
    image.height = 35;
    list.appendChild(image);
    const paragraph = document.createElement('p');
    paragraph.classList.add('social__text');
    paragraph.textContent = comment.message;
    list.appendChild(paragraph);
    bigPictureComments.appendChild(list);
  });
};

const renderBigPicture = (photo) => {
  bigPicture.src = photo.url;
  bigPictureLikes.textContent = photo.likes;
  bigPictureCommentCount.textContent = photo.comments.length;
  bigPictureCommentShown.textContent = photo.comments.length;
  bigPictureDescription.textContent = photo.description;
  renderPhotoComments(photo);
};

const openBigPicture = (photo) => {
  document.body.classList.add('modal-open');
  bigPictureContent.classList.remove('hidden');
  document.addEventListener('keydown', onDocumentKeydown);
  commentsCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
  bigPictureComments.innerHTML = '';
  renderBigPicture(photo);
};

const closeBigPicture = () => {
  bigPictureContent.classList.add('hidden');
  document.removeEventListener('keydown', onDocumentKeydown);
  document.body.classList.remove('modal-open');
};

bigPictureCloseElement.addEventListener('click', () => {
  closeBigPicture();
});

function onDocumentKeydown (evt) { // Объявлена декларативно, иначе возникала бы ошибка "функция вызвана до её объявления"
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

export {openBigPicture};
