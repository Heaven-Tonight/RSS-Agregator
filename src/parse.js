export default (data) => {
  const domParser = new DOMParser();
  const result = domParser.parseFromString(data, 'application/xml');
  return result;
};
