import onChange from 'on-change';

import {
  renderFormState,
  renderFeeds,
  renderModal,
} from './domUtils.js';

const watch = (state, elements, i18n) => onChange(state, (path) => {
  const { process } = state.feeds;
  switch (path) {
    case 'form.process':
      renderFormState(state, elements, i18n);
      break;
    case 'feeds.process':
      if (process === 'loaded' || process === 'updated') {
        renderFeeds(state, elements, i18n);
      }
      break;
    case 'uiState.viewedPostsIds':
      renderFeeds(state, elements, i18n);
      break;
    case 'uiState.selectedPostId':
      renderModal(state, elements, i18n);
      break;
    default: break;
  }
});

export default watch;
