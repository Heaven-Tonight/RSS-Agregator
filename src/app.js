import i18next from 'i18next';

import watch from './view/view.js';
import resources from './locales/index.js';

import { toggleModal, onClickHandler, onSubmitHandler } from './handlers/index.js';

const elements = {
  formDiv: document.querySelector('.form-wrapper'),
  postsDiv: document.querySelector('.posts'),
  feedsDiv: document.querySelector('.feeds'),
  modal: document.querySelector('.modal'),
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body'),
  modalHeaderBtnClose: document.querySelector('.modal-header button'),
  modalFooterLink: document.querySelector('.modal-footer a'),
  modalFooterBtnClose: document.querySelector('.modal-footer button'),
};

const defaultLanguage = 'ru';

export default async () => {
  const state = {
    form: {
      valid: false,
      error: '',
      process: '',
    },
    feeds: {
      urlList: [],
      channelList: [],
      postsList: [],
      process: '',
    },
    uiState: {
      selectedPostsIds: [],
      selectedPostId: null,
      modal: {
        modalVisibility: false,
      },
    },
  };

  const i18n = i18next.createInstance();

  i18n.init({
    lng: defaultLanguage,
    resources,
  }).then(() => {
    const watchedState = watch(state, elements, i18n);
    watchedState.form.process = 'filling';

    const form = document.querySelector('.rss-form');
    const { modalFooterBtnClose, modalHeaderBtnClose, postsDiv } = elements;

    form.addEventListener('submit', onSubmitHandler(watchedState));
    postsDiv.addEventListener('click', onClickHandler(watchedState));
    [modalFooterBtnClose, modalHeaderBtnClose].forEach((btn) => {
      btn.addEventListener('click', () => toggleModal(watchedState));
    });
  });
};
