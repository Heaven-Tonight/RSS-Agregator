import updateRssStream from './updateRssStream.js';

const startPostsUpdatingTimer = (watchedState) => {
  // eslint-disable-next-line
  let timerID = setTimeout(function request() {
    updateRssStream(watchedState);
    timerID = setTimeout(request, 5000);
  }, 5000);
};

export default startPostsUpdatingTimer;
