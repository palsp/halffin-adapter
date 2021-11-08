"use strict";

const { Requester, Validator } = require("@chainlink/external-adapter");
const { customError } = require("../error");
const AWS = require("aws-sdk");
const { Tracking } = require("../models");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const customParams = {
  trackingNo: ["trackingNo"],
  endpoint: false,
};

module.exports = async (input, callback) => {
  const validator = new Validator(input, customParams);
  const url = "https://api.aftership.com/v4/trackings";
  const jobRunID = validator.validated.id;
  const trackingNo = validator.validated.data.trackingNo;
  const config = {
    url,
    method: "post",
    headers: {
      "aftership-api-key": process.env.API_KEY,
    },
    data: {
      tracking: {
        tracking_number: trackingNo,
      },
    },
  };
  try {
    const response = await Requester.request(config, customError);
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: new Tracking(response.data.data.tracking),
    };
    await dynamodb.put(params).promise();
    callback(response.status, Requester.success(jobRunID, response.data));
  } catch (error) {
    console.log(error);
    callback(500, Requester.errored(jobRunID, error));
  }
};
