import loadAndBuildFeedsData from './loadAndBuildFeedsData.js';
import startPostsUpdatingTimer from './startPostsUpdatingTimer.js';

export default (watchedState, url, feedId) => {
  loadAndBuildFeedsData(url, feedId)
    .then(({ feed, posts }) => {
      watchedState.feeds.channelList = [feed, ...watchedState.feeds.channelList];
      watchedState.feeds.postsList.push(...posts);
      watchedState.feeds.process = 'loaded';
      watchedState.feeds.urlList.push(url);
      if (!watchedState.feeds.timer) {
        startPostsUpdatingTimer(watchedState, 5000);
      }
    })
    .catch((err) => {
      watchedState.feeds.process = 'failed';
      if (err.message === 'invalid RSS') {
        watchedState.form.error = { key: 'errors.rssError' };
      } else {
        watchedState.form.error = { key: 'errors.networkError' };
      }
    });
};
