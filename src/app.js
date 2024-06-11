import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import { uniqueId, differenceWith } from 'lodash';

import watch from './view.js';
import resources from './locales/index.js';
import parseXML from './parseXML.js';

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

let timerID;

const loadFeedsData = (url, feedId) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then(({ data }) => {
    const { feed, posts } = parseXML(data);
    feed.id = feedId;

    const postsWithIds = posts.map((post) => ({
      ...post,
      id: uniqueId(),
      feedId,
    }));
    return { feed, posts: postsWithIds };
  })
  .catch((error) => {
    throw error;
  });

const updateFeedsState = (watchedState, url, feedId) => {
  watchedState.feeds.process = 'loading';
  watchedState.form.process = 'submitting';

  return loadFeedsData(url, feedId)
    .then(({ feed, posts }) => {
      // eslint-disable-next-line no-param-reassign
      feed.url = url;
      watchedState.feeds.channelList = [feed, ...watchedState.feeds.channelList];
      watchedState.feeds.postsList.push(...posts);
      watchedState.feeds.process = 'loaded';
      watchedState.form.process = 'submitted';
    })
    .catch((err) => {
      if (err.isAxiosError) {
        watchedState.form.error = { key: 'errors.networkError' };
        watchedState.form.process = 'failed';
        return;
      }

      if (err.message === 'invalid RSS') {
        watchedState.form.error = { key: 'errors.rssError' };
        watchedState.form.process = 'failed';
        return;
      }
      watchedState.form.error = { key: 'errors.unknownError' };
      watchedState.form.process = 'failed';
    });
};

const startPostsUpdatingTimer = (watchedState, interval = 5000) => {
  const updatePosts = () => {
    watchedState.feeds.process = 'updating';
    const { channelList, postsList } = watchedState.feeds;

    const promises = channelList.map(({ url, id }) => loadFeedsData(url, id)
      .then(({ posts, feed }) => {
        const compareTitles = (post, title) => post.title === title;

        const currentPostsTitles = postsList
          .filter((post) => post.feedId === feed.id)
          .map(({ title }) => title);

        const newPosts = differenceWith(posts, currentPostsTitles, compareTitles);

        watchedState.feeds.postsList.push(...newPosts);
        watchedState.feeds.process = 'updated';
      })
      .catch((error) => console.log(error)));

    Promise.all(promises).finally(() => {
      timerID = setTimeout(updatePosts, interval);
    });
  };

  if (timerID) {
    clearTimeout(timerID);
  }

  timerID = setTimeout(updatePosts, interval);
};

const onClickHandler = (watchedState) => (e) => {
  const { id, dataset } = e.target;
  const { bsToggle, id: postId } = dataset;

  const selectedPostId = bsToggle ? postId : id;

  if (!watchedState.uiState.viewedPostsIds.includes(selectedPostId)) {
    watchedState.uiState.viewedPostsIds.push(selectedPostId);
  }

  if (bsToggle) {
    watchedState.uiState.selectedPostId = selectedPostId;
  }
};

const onSubmitHandler = (watchedState) => (e) => {
  e.preventDefault();

  watchedState.form.process = 'submitting';
  watchedState.form.error = '';

  const schema = yup.object({
    url: yup.string().url().notOneOf(watchedState.feeds.channelList.map((feed) => feed.url)),
  });

  const url = new FormData(e.target).get('url');

  schema.validate({ url }, { abortEarly: false })
    // eslint-disable-next-line no-shadow
    .then(({ url }) => {
      const feedId = watchedState.feeds.channelList.length;

      updateFeedsState(watchedState, url, feedId).then(() => {
        if (watchedState.feeds.process !== 'loading' && watchedState.feeds.process !== 'updating') {
          startPostsUpdatingTimer(watchedState, 5000);
        }
      });
    })
    .catch((error) => {
      watchedState.form.error = error.message;
      watchedState.form.process = 'failed';
    });
};

export default async () => {
  const state = {
    form: {
      error: '',
      process: '',
    },
    feeds: {
      channelList: [],
      postsList: [],
      process: '',
    },
    uiState: {
      viewedPostsIds: [],
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
    watchedState.form.process = 'initial';

    const { postsDiv, form } = elements;

    form.addEventListener('submit', onSubmitHandler(watchedState));
    postsDiv.addEventListener('click', onClickHandler(watchedState));
  });
};
