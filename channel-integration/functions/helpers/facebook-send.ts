import axios from "axios";

const SEND_ENDPOINT = `https://graph.facebook.com/v11.0/me/messages`;

export const sendMessage = async (
  accessToken: string,
  recipientId: string,
  message: string
) => {
  try {
    await axios.post(
      `${SEND_ENDPOINT}?access_token=${accessToken}`,
      { recipient: { id: recipientId }, message: { text: message } }
    );
  } catch (e) {
    throw new Error(JSON.stringify(e.response.data || e.request || e.message));
  }
};
