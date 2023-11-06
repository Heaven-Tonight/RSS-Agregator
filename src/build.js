export default (html, feedId) => {
  const parserError = html.querySelector('parsererror');
  if (parserError) {
    throw new Error('failing');
  }
  const posts = [];
  const feed = {
    title: html.querySelector('title').textContent,
    description: html.querySelector('description').textContent,
    id: feedId,
  };

  const items = html.querySelectorAll('item');
  items.forEach((item, index) => {
    posts.push({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      id: index,
      feedId: feed.id,
    });
  });

  return { feed, posts };
};
