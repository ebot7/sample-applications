import axios from 'axios';

const INSTALL_URL = `${process.env.ebot7_install_url}/v1/application/install`;

export const installApplication = async (appKey: string, installationAccessToken: string) => {
    const headers = {
        'Authorization': `Bearer ${appKey}`,
        'x-delegated-authorization': `Bearer ${installationAccessToken}`
    }
    const result = await axios.post(INSTALL_URL, {}, {headers});
    console.log(result);
}