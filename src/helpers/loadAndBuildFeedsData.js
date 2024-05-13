import axios from 'axios';
import parseXML from './parseXML.js';
import buildFeedsData from './buildFeedsData.js';

const loadAndBuildFeedsData = (url, feedId) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then(({ data }) => parseXML(data))
  .then((dom) => buildFeedsData(dom, feedId))
  .catch((error) => {
    throw error;
  });

export default loadAndBuildFeedsData;
