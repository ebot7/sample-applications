import { StringParam, useQueryParam } from "use-query-params";
import "./App.css";
/**
        TODO: 
        1. Parse botId, orgId, accessToken from query
        2. initiate oauth on facebook
        3. get and store token from facebook
        4. install app using appToken (Authorization) and accessToken (x-delegated-authorization)
        5. Ask to close window
        */
export const App = () => {
  const [botId, setBotId] = useQueryParam("botId", StringParam);
  const [orgId, setOrgId] = useQueryParam("orgId", StringParam);
  const [accessToken, setAccessToken] = useQueryParam(
    "accessToken",
    StringParam
  );

  return <div>{botId} {orgId} {accessToken}</div>;
};

export default App;
