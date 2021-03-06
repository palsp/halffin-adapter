const { Requester, Validator } = require("@chainlink/external-adapter");
const { customError } = require("../error");
const AWS = require("aws-sdk");
const { mockTracking } = require("../mock");

const dynamodb = new AWS.DynamoDB.DocumentClient();

const customParams = {
  trackingId: ["trackingId"],
  endpoint: false,
};

module.exports = async (input, callback) => {
  const validator = new Validator(input, customParams);
  const trackingId = validator.validated.data.trackingId;
  const jobRunID = validator.validated.id;
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: trackingId,
    },
  };
  // for demo purpose
  if (+trackingId < 3) {
    const key = Object.keys(mockTracking)[+trackingId];
    callback(
      200,
      Requester.success(jobRunID, {
        data: { tracking: { tag: mockTracking[key] } },
      })
    );
    return;
  }

  try {
    const {
      Item: { trackingNo, slug },
    } = await dynamodb.get(params).promise();

    const url = `https://api.aftership.com/v4/trackings/${slug}/${trackingNo}`;

    const config = {
      url,
      method: "get",
      headers: {
        "aftership-api-key": process.env.API_KEY,
      },
    };

    const response = await Requester.request(config, customError);
    callback(response.status, Requester.success(jobRunID, response.data));
    // mock exception
    // callback(
    //   response.status,
    //   Requester.success(jobRunID, { data: { tracking: { tag: "Exception" } } })
    // );
  } catch (error) {
    console.log(error);
    callback(500, Requester.errored(jobRunID, error));
  }
};
