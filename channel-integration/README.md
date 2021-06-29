# Channel Integration Guide
This guide provides a small overview over how to use this channel integration.

## Overview
There are two serverless stacks. One specified in the top-level `serverless.yml`, the other one is in `facebook-auth/serverless.yml`.
The first one will be named A), the second B).

A) contains 3 functions:
- outbound -> Responsible for handling ebot7 event handling. When a message is sent on ebot7 side, it'll catch the event and send a message on facebook.
- inbound -> Responsible for handling facebook events. When a message is sent on facebook side, it'll catch the event and send a message on ebot7.
- application-install -> Responsible for installing the application to a bot when the redirect-flow is done. It also stores the facebook tokens to DDB.

B) contains 1 function:
- serve -> Responsible for serving a static frontend which will be used to generate the facebook `pageAccessToken`

## Setup
- Create a facebook page. Take note of the facebook page id (:= fbPageId).
- Deploy the serverless stack A). Take note of the endpoint for outbound's function (:= EndOutbound) and application-install's function (:= EndApplicationInstall)
- Before deploying stack B), replace the variables marked as 'TODO' in the `serverless.yml`. EndApplicationInstall should be inserted for `application_install_url`
and fbPageId should be inserted for `fbPageId`. Take note of the endpoint for the serve function (:= EndServe).
- Create an application on ebot7 and insert the EndOutbound as 'Events Endpoint'. Insert EndServe as 'Install Redirect Endpoint'.
- Let an admin install the application to a bot.