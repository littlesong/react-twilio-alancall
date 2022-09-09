//ref: https://www.twilio.com/docs/serverless/api/quickstart#

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const fs = require('fs').promises;

async function deploy(configFile) {
  const jsonstr = await fs.readFile(configFile, 'utf8');
  const config = JSON.parse(jsonstr);

  console.log("Deploying", config.name);

  try {
    // Create service
    if (!config.service.sid) {
      const service = await client.serverless.v1.services.create(config.service);
      config.service.sid = service.sid;
      console.log("Service created:", service);
    } else {
      console.log("Service skiped:", config.service.sid);
    }

    let activeEnv;

    // Create environments
    for(const element of config.environments){
      if (element.uniqueName === config.env) {
        activeEnv = element;
        if (!element.sid) {
          const env = await client.serverless.v1.services(config.service.sid)
            .environments.create(element);
          element.sid = env.sid;
          element.domainName = env.domainName;
          console.log("Environment created:", env);
        } else {
          console.log("Environment skiped:", element.sid);
        }
      }
    }

    if (!activeEnv) {
      throw new Error("Active environment not found!");
    }

    const functionVersions = [];
    // Create functions
    for(const element of config.functions){
      if (!element.sid) {
        const env = await client.serverless.v1.services(config.service.sid)
          .functions
          .create({
            friendlyName: element.friendlyName
          });
        element.sid = env.sid;
        console.log("Function created:", env);
      } else {
        console.log("Function creation skiped:", element.sid);
      }

      //upload function code
      const f = await uploadFunctionCode(config.service.sid, element.sid, element);
      functionVersions.push(f.versionSid);
    }

    // create build
    const build = await client.serverless.v1.services(config.service.sid)
      .builds.create({
        functionVersions
      });
    console.log("Build created:", build);

    console.log("Building ...");
    //wait until build done
    const maxWaitTime = config.deployTimeOut;   // in seconds
    let built = false;
    for (let s = 0; s < maxWaitTime; s++) {
      await new Promise(r => setTimeout(r, 1000));
      const b = await client.serverless.v1.services(config.service.sid)
        .builds(build.sid)
        .fetch();
      if (b.status === "completed") {
        built = true;
        break;
      }
      console.log("...");
    }

    if (!built) {
      throw new Error("Building timeout!");
    }else{
      console.log("Build completed!");
    }

    console.log("Deploying to:", activeEnv.sid);
    // Create the deployment
    const d = await client.serverless.v1.services(config.service.sid)
      .environments(activeEnv.sid)
      .deployments
      .create();

    console.log("Deployed", d);
    const serviceUrl = `https://${activeEnv.domainName}.twil.io/<function-path>`;
    console.log("Service is available at", serviceUrl);
  } finally {
    await fs.writeFile(configFile, JSON.stringify(config, null, 3));
    console.log("Configuration updated in", configFile);
  }
}

async function uploadFunctionCode(serviceSid, functionSid, functionConfig) {
  const fs = require('fs');
  const FormData = require('form-data');
  const axios = require('axios');

  const serviceUrl = `https://serverless-upload.twilio.com/v1/Services/${serviceSid}`;
  const uploadUrl = `${serviceUrl}/Functions/${functionSid}/Versions`;

  const form = new FormData();
  form.append('Path', functionConfig.path);
  form.append('Visibility', 'public');
  form.append('Content', fs.createReadStream(functionConfig.codeFile), {
    contentType: 'application/javascript',
  });

  // Create a new Function Version
  const response = await axios
    .post(uploadUrl, form, {
      auth: {
        username: accountSid,
        password: authToken,
      },
      headers: form.getHeaders(),
    });

  functionConfig.versionSid = response.data.sid;

  console.log("Function code uploaded!", response.data);
  return functionConfig;
}

if (process.argv.length < 3) {
  console.log("Please specify the service configuration name");
  process.exit(1);
}

const configFile = `${process.argv[2]}.json`;

deploy(configFile).then(() => {
  console.log("\nDone!\n");
}).catch((err) => {
  console.error("Failed", err);
});
