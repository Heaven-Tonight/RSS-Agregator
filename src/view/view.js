import onChange from 'on-change';

import {
  render,
  renderFormErrors,
  renderFeedsAndPostsLists,
  renderModal,
} from './render.js';

const watch = (state, elements, i18n) => onChange(state, (path) => {
  switch (path) {
    case 'form.error':
      renderFormErrors(state, elements, i18n);
      break;
    case 'feeds.process':
      render(state, elements, i18n);
      break;
    case 'uiState.selectedPostsIds':
      renderFeedsAndPostsLists(state, elements, i18n);
      break;
    case 'uiState.selectedPostId':
      renderModal(state, elements, i18n);
      break;
    default: break;
  }
});

export default watch;
