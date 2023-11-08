import onChange from 'on-change';

import {
  renderFormElements,
  renderFormErrors,
  renderFeedsAndPostsLists,
  renderSuccessFeedbackElement,
  deleteFeedbackElement,
} from './renders/render.js';

const renderForm = (state, elements, i18n) => {
  const { process } = state.form;
  switch (process) {
    case 'filling':
      renderFormElements(elements, i18n);
      break;
    case 'submitting':
      document.querySelector('form button').setAttribute('disabled', true);
      break;
    case 'submitted':
      document.querySelector('form button').removeAttribute('disabled');
      document.querySelector('form').reset();
      break;
    case 'failed':
      document.querySelector('form button').removeAttribute('disabled');
      break;
    default: break;
  }
};

const renderFeeds = (state, elements, i18n) => {
  const { process } = state.feeds;
  switch (process) {
    case 'loading':
      deleteFeedbackElement();
      break;
    case 'loaded':
      renderFeedsAndPostsLists(state, elements, i18n);
      renderSuccessFeedbackElement(elements, i18n);
      break;
    case 'updated':
      renderFeedsAndPostsLists(state, elements, i18n);
      break;
    default: break;
  }
};

const watch = (state, elements, i18n) => onChange(state, (path) => {
  switch (path) {
    case 'form.error':
      renderFormErrors(state, elements, i18n);
      break;
    case 'form.process':
      renderForm(state, elements, i18n);
      break;
    case 'feeds.process':
      renderFeeds(state, elements, i18n);
      break;
    default: break;
  }
});

export default watch;
