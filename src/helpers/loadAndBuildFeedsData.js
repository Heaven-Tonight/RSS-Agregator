import { uniqueId } from 'lodash';

import axios from 'axios';

const parseXML = (data) => {
  const domParser = new DOMParser();
  return domParser.parseFromString(data.contents, 'application/xml');
};

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

const loadAndBuildFeedsData = (url, feedId) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then(({ data }) => {
    const dom = parseXML(data);
    return buildFeedsData(dom, feedId);
  })
  .catch((error) => {
    throw error;
  });

export default loadAndBuildFeedsData;
