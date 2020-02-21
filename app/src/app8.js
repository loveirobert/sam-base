const AWS = require('aws-sdk');
const moment = require('moment');

exports.lambdaHandler = async () => {
  let response;
  const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
  const [, , resource, region, iamUser, resourceName] = process.env.MyQARN.split(':'); // eslint-disable-line
  const queueUrl = `https://${resource}.${region}.amazonaws.com/${iamUser}/${resourceName}`;
  try {
    const params = {
      MessageBody: "Message flying like a bird ... from lambda to lambda...",
      QueueUrl: queueUrl,
    };

    await new Promise((res) => {
      sqs.sendMessage(params, function(msgError, data) {
        if (msgError) {
          console.log("Error", msgError);
        } else {
          console.log("Success", data.MessageId);
        }
        res();
      });
    });

    response = {
      'statusCode': 200,
      'body': JSON.stringify({
        message: `add some extra here ... ${moment()} 8 xyz`,
      })
    }
  } catch (err) {
    console.log(err);
    return err;
  }

  return response
};
