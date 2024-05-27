import i18next from 'i18next';

import * as yup from 'yup';

import watch from './view/view.js';
import resources from './locales/index.js';
import updateFeedsState from './helpers/updateFeedsState.js';
import { renderFormElements } from './view/render.js';

const elements = {
  formDiv: document.querySelector('.form-wrapper'),
  form: document.querySelector('.rss-form'),
  postsDiv: document.querySelector('.posts'),
  feedsDiv: document.querySelector('.feeds'),
  modal: document.querySelector('.modal'),
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body'),
  modalFooterLink: document.querySelector('.modal-footer a'),
  modalCloseButton: document.querySelector('.modal-footer button'),
};

const defaultLanguage = 'ru';

const onClickHandler = (watchedState) => (e) => {
  const { id, dataset } = e.target;
  const { bsToggle, id: postId } = dataset;

  const selectedPostId = bsToggle ? postId : id;

  if (!watchedState.uiState.selectedPostsIds.includes(selectedPostId)) {
    watchedState.uiState.selectedPostsIds.push(selectedPostId);
  }

  if (bsToggle) {
    watchedState.uiState.selectedPostId = selectedPostId;
  }
};
const onSubmitHandler = (watchedState) => (e) => {
  e.preventDefault();

  const schema = yup.object({
    url: yup.string().url().notOneOf(watchedState.feeds.urlList),
  });

  const rss = new FormData(e.target).get('url');

  schema.validate({ url: rss }, { abortEarly: false })
    .then(({ url }) => {
      const feedId = watchedState.feeds.urlList.length;
      watchedState.feeds.process = 'loading';

      updateFeedsState(watchedState, url, feedId);

      watchedState.form.valid = true;
      watchedState.form.error = '';
    })
    .catch((error) => {
      console.log(error);
      watchedState.form.valid = false;
      watchedState.form.error = error.message;
    });
};

export default async () => {
  const state = {
    form: {
      valid: false,
      error: '',
    },
    feeds: {
      urlList: [],
      channelList: [],
      postsList: [],
      process: '',
      timer: '',
    },
    uiState: {
      selectedPostsIds: [],
      selectedPostId: null,
    },
  };

  yup.setLocale({
    string: {
      url: () => ({ key: 'errors.validation.url' }),
    },
    mixed: {
      notOneOf: () => ({ key: 'errors.validation.notOneOf' }),
    },
  });

  const i18n = i18next.createInstance();

  i18n.init({
    lng: defaultLanguage,
    resources,
  }).then(() => {
    const watchedState = watch(state, elements, i18n);

    const { postsDiv, form } = elements;

    form.addEventListener('submit', onSubmitHandler(watchedState));
    postsDiv.addEventListener('click', onClickHandler(watchedState));
  });
  renderFormElements(elements, i18n);
};
