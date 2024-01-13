import express, { Application, Request, Response } from 'express';
import http, { Server as HTTPServer } from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';

const app: Application = express();
const server: HTTPServer = http.createServer(app);
const wss: WebSocketServer = new WebSocket.Server({ server });

// Map to store WebSocket connections based on user_id
const userSockets: Map<number, WebSocket> = new Map<number, WebSocket>();

app.use(express.json());

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

// WebSocket Connection
wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  // Extract user_id from the query parameters
  const userIdParam = new URLSearchParams(req.url!.split('?')[1]);
  const userId = parseInt(userIdParam.get('user_id') || '0', 10);

  if (userId !== 0) {
    // Store the WebSocket connection in the map
    userSockets.set(userId, ws);

    console.log(`WebSocket connection established for user ${userId}`);

    ws.on('close', () => {
      // Remove the WebSocket connection when the client disconnects
      userSockets.delete(userId);
      console.log(`WebSocket connection closed for user ${userId}`);
    });
  } else {
    // Close the connection if user_id is not provided or invalid
    ws.close();
  }
});

// Start the server
const PORT: number = parseInt(process.env.PORT || '3000', 10);
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
