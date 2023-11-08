import updateRssStream from './update.js';

const startPostsUpdatingTimer = (watchedState) => {
  // eslint-disable-next-line
  let timerID = setTimeout(function request() {
    if (watchedState.feeds.process === 'updated') {
      updateRssStream(watchedState);
    }
    timerID = setTimeout(request, 5000);
  }, 5000);
};

export default startPostsUpdatingTimer;
