const { getTracking, createTracking } = require("./tracking");

exports.createTrackingHandler = (event, _context, callback) => {
  createTracking(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(data),
      isBase64Encoded: false,
    });
  });
};

exports.getTrackingHandler = (event, _context, callback) => {
  getTracking(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false,
    });
  });
};
