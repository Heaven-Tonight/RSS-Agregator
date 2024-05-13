import * as yup from 'yup';

import updateRssStream from '../helpers/updateRssStream.js';
import loadAndBuildFeedsData from '../helpers/loadAndBuildFeedsData.js';
import startPostsUpdatingTimer from '../helpers/startPostsUpdatingTimer.js';

export const toggleModal = (watchedState) => {
  const { modalVisibility } = watchedState.uiState.modal;
  watchedState.uiState.modal.modalVisibility = !modalVisibility;
};

export const onClickHandler = (watchedState) => (e) => {
  const { id, dataset } = e.target;
  const { bsToggle, id: postId } = dataset;

  const selectedPostId = bsToggle ? postId : id;

  if (!watchedState.uiState.selectedPostsIds.includes(selectedPostId)) {
    watchedState.uiState.selectedPostsIds.push(selectedPostId);
  }

  watchedState.uiState.selectedPostId = selectedPostId;

  if (bsToggle) {
    toggleModal(watchedState);
  }
};
export const onSubmitHandler = (watchedState) => async (e) => {
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

      loadAndBuildFeedsData(url, feedId)
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
      startPostsUpdatingTimer(watchedState);
    })
    .catch((error) => {
      watchedState.form.valid = false;
      watchedState.form.error = error.message;
      watchedState.form.process = 'failed';
    });
};
