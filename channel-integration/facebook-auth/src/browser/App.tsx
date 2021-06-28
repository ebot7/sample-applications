import "./App.css";

import React from "react";

import useConfig from "../components/useConfig";
import FacebookLogin from "react-facebook-login-typed";
import axios from "axios";
import { useQueryParam, StringParam } from "use-query-params";

import { putData } from "./helpers/dynamoClient";
import { installApplication } from "./helpers/ebot7Client";

const SEND_API = `https://graph.facebook.com/$PAGE_ID?fields=access_token&access_token=$ACCESS_TOKEN`;

export default function App() {
  const config = useConfig();
  const [accessToken] = useQueryParam("accessToken", StringParam);
  const [botId] = useQueryParam("botId", StringParam);

  const responseFacebook = async (res: any) => {
    const { accessToken: userAccessToken } = res;
    console.log('Facebook response ', res);
    const pageId = 'TODO';
    const { access_token: pageAccessToken } = (
      await axios.get(SEND_API.replace("$ACCESS_TOKEN", userAccessToken).replace("$PAGE_ID", pageId))
    ).data;

    console.log(`userToken: ${userAccessToken}, pageToken: ${pageAccessToken}`);

    const pageData = {
      botId,
      pageId,
      pageAccessToken,
    };

    await putData(config.awsTable, pageData);

    await installApplication(
      config.appKey,
      accessToken || "missing-access-token",
    );
    console.log("Successfully installed");
  };

  return (
    <FacebookLogin
      appId={config.fbAppId}
      returnScopes
      scope="public_profile,pages_show_list,pages_messaging,pages_read_engagement"
      callback={responseFacebook}
      render={(renderProps) => <button onClick={renderProps.onClick}>Custom FB Button</button>}
    />
  );
}
