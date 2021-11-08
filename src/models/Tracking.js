const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

class Tracking {
  constructor({ id, tracking_number, created_at, updated_at, slug }) {
    this.id = id;
    this.trackingNo = tracking_number;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.slug = slug;
  }
}

module.exports = Tracking;
