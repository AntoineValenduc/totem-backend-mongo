import axios from 'axios';

export async function getLastEmail(to: string) {
  const response = await axios.get('http://localhost:8025/api/v2/messages');
  const messages = response.data?.items ?? [];

  return messages.find((msg: any) =>
    msg.Content.Headers.To?.includes(to)
  );
}
