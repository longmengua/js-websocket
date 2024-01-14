import axios from 'axios';

const url = 'http://localhost:8888/api/websocket/mock';
const headers = {
  'Content-Type': 'application/json',
};

const data = {
  uuid: 1,
  data: {
    name: 'mike',
    message: 'hello world',
  },
};

export const mockWebsoketDataFromServer = async () => {
  try {
    await axios.post(url, data, { headers })
  } catch (error) {
    console.log(error)
  }
}