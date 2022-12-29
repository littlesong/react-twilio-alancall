
const version = "1.0.3";
const fromNumber = '+16173977775';

exports.handler = (context, event, callback) => {
  console.log(version);
  console.log(context);
  console.log(event);

  const phone = event.phone;

  if (!phone) {
    if (event.meta) {
      return callback({ version });
    } else {
      return callback(null, { error: "NO_PHONE" });
    }
  }

  const client = context.getTwilioClient();

  // Create a custom Twilio Response
  const response = new Twilio.Response();
  // Set the CORS headers
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log("Calling", phone);
  console.log("context: ", context);

  client.calls
    .create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: `+${phone}`,
      from: fromNumber
    })
    .then(call => {
      response.appendHeader('Content-Type', 'application/json');
      response.setBody({
        from: call.from,
        to: call.to,
        status: call.status
      });      
      console.log(call.sid);
      return callback(null, response);
    }).catch((error) => {
      console.log(error);
      return callback(error);
    });
};
