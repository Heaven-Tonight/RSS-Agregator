import axios from 'axios';
import parse from './parse.js';
import buildFeedsData from './build.js';

const updateRssStream = (watchedState) => {
  console.log('START UPDATING');
  watchedState.process = 'updating';
  const { feedsUrlList, feedsPostsList } = watchedState;
  feedsUrlList.forEach((url, feedId) => {
    axios
      .get(`https://allorigins.hexlet.app/raw?disableCache=true&url=${encodeURIComponent(url)}`)
      .then(({ data }) => parse(data))
      .then((parsed) => buildFeedsData(parsed, feedId))
      .then(({ posts, feed }) => {
        const { id } = feed;
        // eslint-disable-next-line
        const filteredLoadedPosts = feedsPostsList.filter(({ feedId }) => feedId === id);
        const titles = filteredLoadedPosts.map(({ title }) => title);
        const newPosts = posts
          .filter(({ title }) => !titles.includes(title));
        watchedState.feedsPostsList.push(...newPosts);
        watchedState.process = 'updated';
      })
      .catch((err) => {
        if (err) {
          feedsUrlList.filter((currentUrl) => currentUrl !== url);
        }
      });
  });
};

export default updateRssStream;
