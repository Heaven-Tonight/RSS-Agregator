const parseXML = (data) => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(data.contents, 'application/xml');

  const parserError = dom.querySelector('parsererror');

  if (parserError) {
    throw new Error('invalid RSS');
  }

  const getTextContent = (element, selector) => element.querySelector(selector).textContent;

  const feed = {
    title: getTextContent(dom, 'title'),
    description: getTextContent(dom, 'description'),
  };

  const posts = Array.from(dom.querySelectorAll('item')).map((item) => ({
    title: getTextContent(item, 'title'),
    description: getTextContent(item, 'description'),
    link: getTextContent(item, 'link'),
  }));

  return { feed, posts };
};

export default parseXML;
