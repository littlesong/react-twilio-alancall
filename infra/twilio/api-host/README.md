
# Service configuration JSON

    See service-template.json for an example. Do NOT directly use this file for creating/deploying service. Instead, make a copy of this file and update it for the new service.

# Create/Deploy service and functions

    node deploy.js <service-config>         : service-config is the config json file without .js extension

# Undeploy (delete) service 


    node undeploy.js <service-config>         : service-config is the config json file without .js extension

    or

    twilio api:serverless:v1:services:remove --sid ZSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    