const { httpGet } = require("./mock-http-interface");

const getArnieQuotes = async (urls) => {
  // Requirements:
  // 1. Take a list of URLs
  // 2. Use the httpGet function to fetch data from each URL
  // 3. If the request is successful (status === 200), extract the quote.
  // 4. If the request fails, the body contains something like {'FAILURE': '...'}
  // 5. All URLs should be resolved at the same time:
  //     - mock-http-interface.js injects a 200ms delay per request
  //     - get-arnie-quotes.test.js expects a total execution time of less than 400ms
  // 6. Return a list of all objects [{'Arnie Quote': <quote> }, {'FAILURE': 'Your request has been terminated'}], in the same order as the URLs I got
  //     - No post processing ordering required
  //     - The order of the results for Promise.all is preserved in the order of the promises passed, regardless of completion order!
  //       - Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

  const promises = urls.map(async (url) => {
    const response = await httpGet(url);
    const { status, body } = response;

    let message;
    try {
      message = JSON.parse(body).message;
    } catch (error) {
      message = "";
    }

    if (status === 200) {
      return { "Arnie Quote": message };
    } else {
      return { FAILURE: message };
    }
  });

  return Promise.all(promises);
};

module.exports = {
  getArnieQuotes,
};
