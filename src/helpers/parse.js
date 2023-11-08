const parse = (data) => {
  const domParser = new DOMParser();
  const result = domParser.parseFromString(data, 'application/xml');
  return result;
};

export default parse;
