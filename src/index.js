import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import * as yup from 'yup';
import watch from './view.js';

const state = {
  form: {
    valid: false,
    error: '',
    process: 'filling',
    data: '',
  },
  feedsList: [],
};

const elements = {
  input: document.querySelector('input'),
  form: document.querySelector('.rss-form'),
  div: document.querySelector('.col-md-10'),
};

const errorMessages = {
  validationErrors: {
    url: 'Ссылка должна быть валидным URL',
    notOneOf: 'RSS уже существует',
  },

};

const watchedState = watch(state, elements);
watchedState.form.process = 'filling';

const onSubmitHandler = async (e) => {
  e.preventDefault();

  const schema = yup.object({
    url: yup
      .string()
      .url(errorMessages.validationErrors.url)
      .notOneOf(watchedState.feedsList, errorMessages.validationErrors.notOneOf),
  });

  watchedState.form.process = 'submitting';

  const formData = new FormData(e.target);
  const rss = formData.get('url');

  schema.validate({ url: rss }, { abortEarly: false })
    .then(({ url }) => {
      watchedState.form.process = 'submitted';
      watchedState.form.valid = true;
      watchedState.form.error = '';
      watchedState.feedsList.push(url);
    })
    .catch((error) => {
      watchedState.form.valid = false;
      watchedState.form.error = error.message;
    });
};

elements.form.addEventListener('submit', onSubmitHandler);
