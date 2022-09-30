# INTRODUCTION

This is a demo web app that allows the user to calling US phone numbers. Currently (2022-09) this is only a basic demo version for proving the concept of making outbound phone calls from web. It only supports the following functions in this version.

- Dial any specified US phone number
- Import phone numbers from CSV file

## What's next

Next, we'll experiment the following requirements.

- Directly dial phone numbers from the imported lists
- Managing the call life cycle
    - start the call
    - monitor the call events to 
        - receives and stores the keypad response from the callee
        - track (store) the call status
- Export the result to CSV (?)
- Compose and apply TwiML call instructions
    - parameterize it

---------------
# SETUP

## Setup the dial function

- Login in to twilio console
- In **Functions and Assets** create a Service
- Create a function in the above service
- Deploy the function code from /functions/src/dialphone.js

## Deploy the website  

- Install Twilio CLI tool (see https://www.twilio.com/docs/twilio-cli/quickstart)
- run `deploy:twilio:react`


This will deploy the REACT website to twilio. See https://www.twilio.com/blog/deploy-react-application-twilio-serverless-toolkit


--------------
# Local Dev

    Run `npm run start`

    This will launch the website locally for development purposes.

-------------
# Ref

- [Host React app on twilio](https://www.twilio.com/blog/deploy-react-application-twilio-serverless-toolkit)
- [Twilio function context/event data structures](https://www.twilio.com/docs/serverless/functions-assets/functions/invocation)
- [Twilio voice API](https://www.twilio.com/docs/voice/make-calls)
