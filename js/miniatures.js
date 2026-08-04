import {createPhotosGallery} from './data.js';

const userPicture = document.querySelector('.pictures');
const userPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const photoGallery = createPhotosGallery();
const userPictureFragment = document.createDocumentFragment();

photoGallery.forEach(({url, description, likes, comments}) => {
  const pictureElement = userPictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__img').alt = description;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;
  userPictureFragment.appendChild(pictureElement);
});
userPicture.appendChild(userPictureFragment);
