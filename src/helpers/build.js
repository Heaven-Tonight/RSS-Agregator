import { uniqueId } from 'lodash';

const buildFeedsData = (html, feedId) => {
  const parserError = html.querySelector('parsererror');
  if (parserError) {
    throw new Error('invalid RSS');
  }
  const posts = [];
  const feed = {
    title: html.querySelector('title').textContent,
    description: html.querySelector('description').textContent,
    id: feedId,
  };

  const items = html.querySelectorAll('item');
  items.forEach((item) => {
    posts.push({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      id: uniqueId(),
      feedId: feed.id,
    });
  });

  return { feed, posts };
};

export default buildFeedsData;
