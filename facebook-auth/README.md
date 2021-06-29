# Facebook-Auth
This serverless react app handles facebook OAuth.

It requires `application_install_url` as environment variable. 
It will `POST` `installationAccessToken, botId, pageId, pageAccessToken` to this endpoint 
to finalize the installation. 

When `channel-integration` is deployed, the `application-install` endpoint can be used as environment variable for above.