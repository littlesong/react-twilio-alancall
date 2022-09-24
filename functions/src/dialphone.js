
const version = "1.0.1";

exports.handler = (context, event, callback) => {
  console.log(version);
  console.log(context);
  console.log(event);

  const phone = event.phone;

  if (!phone) {
    if (event.meta) {
      return callback( { version } );
    } else {
      return callback( null, { error: "NO_PHONE" } );
    }
  }

  const client = context.getTwilioClient();

  let twiml = new Twilio.twiml.VoiceResponse();
  twiml.say('Hello World');
  twiml.say(version);

  console.log("Calling", phone, "...");

  client.calls
    .create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: `+${phone}`,
      from: context.DIAL_FROM
    })
    .then(call => {
      console.log(call.sid);
      return callback(null, 'Call ended!');
    }).catch((error) => {
      console.log(error);
      return callback(error);
    });
};

function getResp(message, error, version ) {
  return {
    error,
    message,
    version
  }
}
