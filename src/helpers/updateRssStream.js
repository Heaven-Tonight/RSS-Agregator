import loadAndBuildFeedsData from './loadAndBuildFeedsData.js';

const updateRssStream = (watchedState) => {
  watchedState.feeds.process = 'updating';
  const { urlList, postsList } = watchedState.feeds;
  urlList.forEach((url, feedId) => {
    loadAndBuildFeedsData(url, feedId)
      .then(({ posts, feed }) => {
        const currentTitles = postsList
          .filter((post) => post.feedId === feed.id)
          .map(({ title }) => title);
        const newPosts = posts
          .filter(({ title }) => !currentTitles.includes(title));
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
