import onChange from 'on-change';

import {
  renderFormElements,
  renderFormErrors,
  renderFeedsAndPostsLists,
  renderSuccessFeedbackElement,
  deleteFeedbackElement,
  renderModal,
  disableFormButton,
  enableFormButton,
} from './renders/render.js';

const renderForm = (state, elements, i18n) => {
  const { process } = state.form;
  switch (process) {
    case 'filling':
      renderFormElements(elements, i18n);
      break;
    case 'submitting':
      disableFormButton();
      break;
    case 'submitted':
      enableFormButton();
      document.querySelector('form').reset();
      break;
    case 'failed':
      enableFormButton();
      break;
    default: break;
  }
};

const renderFeeds = (state, elements, i18n) => {
  const { process } = state.feeds;
  switch (process) {
    case 'loading':
      disableFormButton();
      deleteFeedbackElement();
      break;
    case 'loaded':
      document.querySelector('form').reset();
      enableFormButton();
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
      enableFormButton();
      break;
    case 'form.process':
      renderForm(state, elements, i18n);
      break;
    case 'feeds.process':
      renderFeeds(state, elements, i18n);
      break;
    case 'uiState.selectedPostsIds':
      renderFeedsAndPostsLists(state, elements, i18n);
      break;
    case 'uiState.modal.modalVisibility':
      renderModal(state, elements);
      break;
    default: break;
  }
});

export default watch;
