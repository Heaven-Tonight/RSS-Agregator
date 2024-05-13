import { uniqueId } from 'lodash';

const getTextContent = (element, selector) => element.querySelector(selector).textContent;

const buildFeedsData = (dom, feedId) => {
  const parserError = dom.querySelector('parsererror');
  if (parserError) {
    throw new Error('invalid RSS');
  }

  const feed = {
    title: getTextContent(dom, 'title'),
    description: getTextContent(dom, 'description'),
    id: feedId,
  };

  const posts = Array.from(dom.querySelectorAll('item')).map((item) => ({
    title: getTextContent(item, 'title'),
    description: getTextContent(item, 'description'),
    link: getTextContent(item, 'link'),
    id: uniqueId(),
    feedId,
  }));

  return { feed, posts };
};

export default buildFeedsData;
