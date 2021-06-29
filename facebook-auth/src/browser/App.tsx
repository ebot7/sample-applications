import "./App.css";

import React, { SetStateAction, useState } from "react";

import useConfig from "../components/useConfig";
import FacebookLogin from "react-facebook-login-typed";
import axios from "axios";
import { useQueryParam, StringParam } from "use-query-params";

const SEND_API = `https://graph.facebook.com/$PAGE_ID?fields=access_token&access_token=$ACCESS_TOKEN`;

function useInput(initialState = '', valueKey = 'value'): [string, any, React.Dispatch<SetStateAction<string>>] {
  const [value, setValue] = useState(initialState);

  function setValueFromEvent(event: any) {
    setValue(event.target[valueKey]);
  }

  return [value, setValueFromEvent, setValue];
}

export default function App() {
  const config = useConfig();
  const [installationAccessToken] = useQueryParam("accessToken", StringParam);
  const [botId] = useQueryParam("botId", StringParam);
  const [finished, setFinished] = useState(false);
  const [pageId, setPageId] = useInput();

  const responseFacebook = async (res: any) => {
    console.log('Sending request with variables: ', botId, pageId, installationAccessToken);
    const { accessToken: userAccessToken } = res;
    console.log("Facebook response", res);
    const { access_token: pageAccessToken } = (
      await axios.get(SEND_API.replace("$ACCESS_TOKEN", userAccessToken).replace("$PAGE_ID", pageId))
    ).data;

    const ebot7Res = await axios.post(config.application_install_url, {
      installationAccessToken,
      botId,
      pageId,
      pageAccessToken,
    });
    console.log("From Ebot7: ", ebot7Res);

    setFinished(true);
  };

  return (
    <div style={{ padding: "48px" }}>
      {!finished && (
        <>
          <input value={pageId} onChange={setPageId} />
          <FacebookLogin
            appId={config.fbAppId}
            returnScopes
            scope="public_profile,pages_show_list,pages_messaging,pages_read_engagement"
            callback={responseFacebook}
          />
        </>
      )}
      {finished && <div>Finished. Feel free to close this window.</div>}
    </div>
  );
}
