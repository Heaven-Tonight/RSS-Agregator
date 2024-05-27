import updateRssStream from './updateRssStream.js';

const startPostsUpdatingTimer = (watchedState, interval = 5000) => {
  watchedState.feeds.timer = 'started';

  const startTimer = () => {
    updateRssStream(watchedState).finally(() => {
      setTimeout(startTimer, interval);
    });
  };

  setTimeout(startTimer, interval);
};
export default startPostsUpdatingTimer;
