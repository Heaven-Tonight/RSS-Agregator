import axios from 'axios';
import parse from './parse.js';
import buildFeedsData from './build.js';

const updateRssStream = (watchedState) => {
  const { feedsUrlList, feedsPostsList } = watchedState;
  watchedState.form.process = 'updating';
  feedsUrlList.forEach((url, feedId) => {
    axios
      .get(`https://allorigins.hexlet.app/raw?disableCache=true&url=${encodeURIComponent(url)}`)
      .then(({ data }) => parse(data))
      .then((parsed) => buildFeedsData(parsed, feedId))
      .then(({ posts, feed }) => {
        const { id } = feed;
        // eslint-disable-next-line
        const filteredLoadedPosts = feedsPostsList.filter(({ feedId }) => feedId === id);
        const newPosts = posts
          .filter(({ title }, i) => filteredLoadedPosts[i].title !== title);
        if (newPosts.length === 0) {
          return;
        }
        watchedState.feedsPostsList.push(...newPosts);
        watchedState.form.process = 'loaded';
        setTimeout(() => updateRssStream(watchedState), 5000);
      });
  });
};

export default updateRssStream;
