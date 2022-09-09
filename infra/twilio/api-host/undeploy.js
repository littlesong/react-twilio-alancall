//ref: https://www.twilio.com/docs/serverless/api/quickstart#

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio');
const client = twilio(accountSid, authToken);
const fs = require('fs').promises;

async function undeploy(configFile) {
  const jsonstr = await fs.readFile(configFile, 'utf8');
  const config = JSON.parse(jsonstr);

  console.log("Undeploying", config.name);

  if (config.service.sid) {
    try {
      const r = await client.serverless.v1.services(config.service.sid).remove();
      console.log("Service undeployed:", r);
    } catch (e) {
      if (e.status === 404) {
        // ignore this error
        console.error(e);
      } else {
        throw e;
      }
    }
  } else {
    throw new Error("Service SID not found");
  }

  config.service.sid = undefined;

  // Create environments
  for (const element of config.environments) {
    element.sid = undefined;
    element.domainName = undefined;
  }

  for (const element of config.functions) {
    element.sid = undefined;
    element.versionSid = undefined;
  }

  await fs.writeFile(configFile, JSON.stringify(config, null, 3));
  console.log("Configuration updated in", configFile);
}


if (process.argv.length < 3) {
  console.log("Please specify the service configuration name");
  process.exit(1);
}

const configFile = `${process.argv[2]}.json`;

undeploy(configFile).then(() => {
  console.log("\nDone!\n");
}).catch((err) => {
  console.error("Failed", err);
});
