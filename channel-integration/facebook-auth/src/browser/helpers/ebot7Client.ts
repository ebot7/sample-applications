import axios from 'axios';

const INSTALL_URL = 'https://api.staging.e-bot7.de/v1/application/install';

export const installApplication = async (appKey: string, installationAccessToken: string) => {
    const headers = {
        'Authorization': `Bearer ${appKey}`,
        'x-delegated-authorization': `Bearer ${installationAccessToken}`
    }
    console.log(headers);
    const result = await axios.post(INSTALL_URL, {}, {headers});
    console.log(result);
}