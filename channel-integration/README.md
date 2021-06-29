# Channel Integration Guide
This guide provides a small overview over how to use this channel integration.

## Overview
The serverless stack contains 3 functions:
- outbound -> Responsible for handling ebot7 event handling. When a message is sent on ebot7 side, it'll catch the event and send a message on facebook.
- inbound -> Responsible for handling facebook events. When a message is sent on facebook side, it'll catch the event and send a message on ebot7.
- application-install -> Responsible for installing the application to a bot when the redirect-flow is done. It also stores the facebook tokens to DDB.


## Setup
- Create a facebook page. Take note of the facebook page id (:= *fbPageId*).
- Deploy the serverless stack. Take note of the endpoint for outbound's function (:= *EndOutbound*) and application-install's function (:= *EndApplicationInstall*).
- To generate the facebook page access tokens, you can use `facebook-auth`. Before deploying it, make sure to replace the `application_install_url` with *EndApplicationInstall*. Take note of the endpoint for the serve function (:= *EndServe*).
- Create an application on ebot7 and insert the *EndOutbound* as 'Events Endpoint'. Insert *EndServe* as 'Install Redirect Endpoint'.
- Let an admin install the application to a bot.