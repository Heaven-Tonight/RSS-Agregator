const parseXML = (data) => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(data.contents, 'application/xml');
  return dom;
};

export default parseXML;
