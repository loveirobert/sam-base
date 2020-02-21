exports.lambdaHandler = async ({ Records: [message] }) => {
  console.log('Received message', JSON.stringify(message, null, 2));
  console.log('Message body: ', message.body);
};