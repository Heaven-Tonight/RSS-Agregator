import loadAndBuildFeedsData from './loadAndBuildFeedsData.js';

const updateRssStream = (watchedState) => {
  watchedState.feeds.process = 'updating';
  const { urlList, postsList } = watchedState.feeds;

  const promises = urlList.map((url, feedId) => loadAndBuildFeedsData(url, feedId)
    .then(({ posts, feed }) => {
      const currentTitles = postsList
        .filter((post) => post.feedId === feed.id)
        .map(({ title }) => title);
      const newPosts = posts
        .filter(({ title }) => !currentTitles.includes(title));
      watchedState.feeds.postsList.push(...newPosts);
      watchedState.feeds.process = 'updated';
    })
    .catch((e) => {
      throw e;
    }));
  return Promise.all(promises);
};
export default updateRssStream;
