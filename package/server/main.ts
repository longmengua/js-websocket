import express, { Application, Request, Response } from 'express';
import http, { Server as HTTPServer } from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';
import cors from 'cors'; // Import the cors middleware

function base64urlDecode(str: string): string {
  // Replace characters that are not allowed in base64url encoding
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' to make it a multiple of 4
  const padded = base64 + '==='.slice(0, (4 - (base64.length % 4)) % 4);
  // Decode the base64 string
  return decodeURIComponent(escape(atob(padded)));
}

function base64urlEncode(obj: object): string {
  // Convert the object to a JSON string
  const jsonString = JSON.stringify(obj);

  // Encode the JSON string to base64
  const base64 = btoa(unescape(encodeURIComponent(jsonString)));

  // Replace characters not allowed in base64url encoding
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeJwt(jwt: string): { [key: string]: any } | null {
  const [header, payload, signature] = jwt.split('.');

  if (!header || !payload || !signature) {
    console.error('Invalid JWT format');
    return null;
  }

  const decodedHeader = JSON.parse(base64urlDecode(header));
  const decodedPayload = JSON.parse(base64urlDecode(payload));

  return { header: decodedHeader, payload: decodedPayload, signature };
}

const app: Application = express();
const server: HTTPServer = http.createServer(app);
const wss: WebSocketServer = new WebSocket.Server({ server });

// Map to store WebSocket connections based on user_id
const userSockets: Map<number, WebSocket> = new Map<number, WebSocket>();

app.use(express.json());

// Use cors middleware to enable cross-origin requests
app.use(cors());

app.get('/',  (req: Request, res: Response) => {
  res.json({version: "0.0.1"})
})

// RESTful API Endpoint: Send a Message
app.post('/api/messages/send', (req: Request, res: Response) => {
  const { sender_id, receiver_id, content_type, content } = req.body as {
    sender_id: number;
    receiver_id: number;
    content_type: string;
    content: string;
  };

  // Handle the message (store in the database, etc.)

  // Broadcast the message to the receiver via WebSocket
  const receiverSocket = userSockets.get(receiver_id);
  if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
    receiverSocket.send(JSON.stringify({ sender_id, content_type, content }));
  }

  res.status(200).json({ message: 'Message sent successfully' });
});

// RESTful API Endpoint: Get Messages
app.get('/api/messages/get', (req: Request, res: Response) => {
  const { user_id } = req.query;

  // Retrieve messages from the database based on user_id

  res.status(200).json({ messages: [] }); // Placeholder response
});

// WebSocket Endpoint: Push Data
app.post('/api/websocket/mock', (req: Request, res: Response) => {
  const payload = req.body as {
    uuid: number;
    data: {
      name: string;
      message: string;
    }
  };

  // Find the WebSocket connection based on uuid
  const userSocket = userSockets.get(payload?.uuid);

  if (!payload?.uuid || !userSocket || userSocket.readyState !== WebSocket.OPEN) {
    res.status(404).json({ error: 'User not connected via WebSocket' });
    return
  }

  userSocket?.send(JSON.stringify(payload?.data));
    res.status(200).json({ message: 'Data pushed successfully' });
});

// WebSocket Connection
wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  // Extract user_id from the query parameters
  const params = new URLSearchParams(req.url!.split('?')[1]);
  const authToken: string | null = params.get('authToken');
  const info = decodeJwt(`eyJhcHAiOiJ3bWNoIn0.${authToken}.signature`)
  const uuid = 1

  try {
    // authToken is invalid
    if (!authToken || authToken?.trim()?.length == 0) {
      throw new Error("Missing auth token");    
    }
    userSockets.set(uuid, ws);
    console.log(`WebSocket connection established for UUID: ${uuid}`);

  } catch (error) {
    ws.on('close', () => {
      // Remove the WebSocket connection when the client disconnects
      userSockets.delete(uuid);
      console.log(`WebSocket connection closed for UUID: ${uuid}`);
    });
    // ws.close();
  }
});

// Start the server
const PORT: number = parseInt(process.env.PORT || '8888', 10);
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
