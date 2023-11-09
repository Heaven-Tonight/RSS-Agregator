import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import watch from './view.js';
import resources from './locales/index.js';
import helpers from './helpers/index.js';

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
      selectedPosts: [],
      selectedPostId: null,
      modal: {
        modalVisibility: false,
        // а нужен ли этот стейт?
        linkClicked: false,
      },
    },
  };

  const defaultLanguage = 'ru';
  const {
    parse,
    buildFeedsData,
    updateRssStream,
    startPostsUpdatingTimer,
  } = helpers;

  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    resources,
  }).then(() => {
    const elements = {
      div: document.querySelector('.col-md-10'),
      postsDiv: document.querySelector('.posts'),
      feedsDiv: document.querySelector('.feeds'),
      rootDiv: document.querySelector('.flex-grow-1'),
      modal: document.querySelector('.modal'),
      modalHeader: document.querySelector('.modal-header'),
      modalBody: document.querySelector('.modal-body'),
      modalHeaderBtnClose: document.querySelector('.modal-header button'),
      modalFooterLink: document.querySelector('.modal-footer a'),
      modalFooterBtnClose: document.querySelector('.modal-footer button'),
    };

    const watchedState = watch(state, elements, i18n);
    watchedState.form.process = 'filling';

    const toggle = () => {
      const { modalVisibility } = watchedState.uiState.modal;
      watchedState.uiState.modal.modalVisibility = !modalVisibility;
    };

    const addPostId = (postId) => {
      if (!watchedState.uiState.selectedPostsIds.includes(postId)) {
        watchedState.uiState.selectedPostsIds.push(postId);
      }
    };

    const onPostClickHandler = (e) => {
      const { bsToggle } = e.target.dataset;
      if (bsToggle) {
        const { id } = e.target.dataset;
        watchedState.uiState.selectedPostId = id;
        toggle();
        addPostId(id);
      } else {
        const { id } = e.target;
        addPostId(id);
      }
    };

    const onCloseBtnClickHandler = () => {
      toggle();
    };

    const onSubmitHandler = async (e) => {
      e.preventDefault();

      yup.setLocale({
        string: {
          url: () => ({ key: 'errors.validation.url' }),
        },
        mixed: {
          notOneOf: () => ({ key: 'errors.validation.notOneOf' }),
        },
      });

      const schema = yup.object({
        url: yup.string().url().notOneOf(watchedState.feeds.urlList),
      });

      watchedState.form.process = 'submitting';
      const formData = new FormData(e.target);
      const rss = formData.get('url');

      schema.validate({ url: rss }, { abortEarly: false })
        .then(({ url }) => {
          watchedState.form.process = 'submitted';
          watchedState.form.valid = true;
          watchedState.form.error = '';
          watchedState.feeds.urlList.push(url);

          const feedId = watchedState.feeds.urlList.length - 1;
          watchedState.feeds.process = 'loading';

          axios
            .get(`https://allorigins.hexlet.app/raw?url=${encodeURIComponent(url)}`)
            .then(({ data }) => parse(data))
            .then((parsed) => buildFeedsData(parsed, feedId))
            .then(({ feed, posts }) => {
              watchedState.feeds.channelList = [feed, ...watchedState.feeds.channelList];
              watchedState.feeds.postsList.push(...posts);
              watchedState.feeds.process = 'loaded';
              updateRssStream(watchedState);
            })
            .catch((err) => {
              watchedState.feeds.urlList.pop();
              if (err.message === 'invalid RSS') {
                watchedState.form.error = { key: 'errors.rssError' };
              } else {
                watchedState.form.error = { key: 'errors.networkError' };
              }
            });
        })
        .catch((error) => {
          watchedState.form.valid = false;
          watchedState.form.error = error.message;
          watchedState.form.process = 'failed';
        });
    };

    startPostsUpdatingTimer(watchedState);

    const form = document.querySelector('.rss-form');
    const { modalFooterBtnClose, modalHeaderBtnClose, postsDiv } = elements;

    form.addEventListener('submit', onSubmitHandler);
    postsDiv.addEventListener('click', onPostClickHandler);
    [modalFooterBtnClose, modalHeaderBtnClose].forEach((btn) => {
      btn.addEventListener('click', onCloseBtnClickHandler);
    });
  });
};
