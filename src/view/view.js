import onChange from 'on-change';

import {
  renderForm,
  render,
  renderFormErrors,
  renderFeedsAndPostsLists,
  renderModal,
  enableFormButton,
} from './render.js';

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
      render(state, elements, i18n);
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
