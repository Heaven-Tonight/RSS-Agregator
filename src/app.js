import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import watch from './view.js';
import resources from './locales/index.js';
import parse from './parse.js';
import buildFeedsData from './build.js';
import updateRssStream from './update.js';

export default async () => {
  const state = {
    form: {
      valid: false,
      error: '',
      process: '',
    },
    feedsUrlList: [],
    feedsChannelList: [],
    feedsPostsList: [],
    process: '',
  };

  const defaultLanguage = 'ru';

  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    resources,
  }).then(() => {
    const elements = {
      div: document.querySelector('.col-md-10'),
      postsDiv: document.querySelector('.posts'),
      feedsDiv: document.querySelector('.feeds'),
    };

    const watchedState = watch(state, elements, i18n);
    watchedState.form.process = 'filling';

    const form = document.querySelector('.rss-form');

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
        url: yup.string().url().notOneOf(watchedState.feedsUrlList),
      });

      // стейт формы, пригодится для реализации блокировки поля и кнопки во время валидации запроса
      watchedState.form.process = 'submitting';
      const formData = new FormData(e.target);
      const rss = formData.get('url');

      schema.validate({ url: rss }, { abortEarly: false })
        .then(({ url }) => {
          watchedState.form.process = 'submitted';
          watchedState.form.valid = true;
          watchedState.form.error = '';
          watchedState.feedsUrlList.push(url);

          const feedId = watchedState.feedsUrlList.length - 1;
          watchedState.process = 'loading';

          axios
            .get(`https://allorigins.hexlet.app/raw?url=${encodeURIComponent(url)}`)
            .then(({ data }) => parse(data))
            .then((parsed) => buildFeedsData(parsed, feedId))
            .then(({ feed, posts }) => {
              watchedState.feedsChannelList = [feed, ...watchedState.feedsChannelList];
              watchedState.feedsPostsList.push(...posts);
              watchedState.process = 'loaded';
              updateRssStream(watchedState);
            })
            .catch((err) => {
              watchedState.feedsUrlList.pop();
              if (err.message === 'failing') {
                watchedState.form.error = { key: err.message };
              }
              watchedState.form.error = { key: 'errors.networkError' };
            });
        })
        .catch((error) => {
          watchedState.form.valid = false;
          watchedState.form.error = error.message;
          watchedState.form.process = 'failed';
        });
    };
    // eslint-disable-next-line
    let timerID = setTimeout(function request() {
      // console.log(watchedState.process)
      if (watchedState.process === 'updated') {
        updateRssStream(watchedState);
      }
      timerID = setTimeout(request, 5000);
    }, 5000);
    form.addEventListener('submit', onSubmitHandler);
  });
};
