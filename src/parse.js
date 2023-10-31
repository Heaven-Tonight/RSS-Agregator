export default (rssXMLData) => {
  const domParser = new DOMParser();
  const html = domParser.parseFromString(rssXMLData, 'text/html');
  return html;
};
