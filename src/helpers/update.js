import axios from 'axios';
import parse from './parse.js';
import buildFeedsData from './build.js';

const updateRssStream = (watchedState) => {
  watchedState.feeds.process = 'updating';
  const { urlList, postsList } = watchedState.feeds;
  urlList.forEach((url, feedId) => {
    axios
      .get(`https://allorigins.hexlet.app/raw?disableCache=true&url=${encodeURIComponent(url)}`)
      .then(({ data }) => parse(data))
      .then((parsed) => buildFeedsData(parsed, feedId))
      .then(({ posts, feed }) => {
        const { id } = feed;
        // eslint-disable-next-line
        const filteredLoadedPostsByFeedId = postsList.filter(({ feedId }) => feedId === id);
        const titles = filteredLoadedPostsByFeedId.map(({ title }) => title);
        const newPosts = posts
          .filter(({ title }) => !titles.includes(title));
        watchedState.feeds.postsList.push(...newPosts);
        watchedState.feeds.process = 'updated';
      })
      .catch((err) => {
        if (err) {
          urlList.filter((currentUrl) => currentUrl !== url);
        }
      });
  });
};

export default updateRssStream;
