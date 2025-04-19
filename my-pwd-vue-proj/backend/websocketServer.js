// websocketServer.js
import { WebSocketServer } from 'ws';

let wss;

export function startWebSocketServer(server, pool) {
  wss = new WebSocketServer({ server });

  wss.on('connection', async (ws) => {
    console.log('🟢 New WebSocket client connected');

    try {
      // Initial data sent to client (optional: could include an event wrapper here too)
      const [results] = await pool.promise().query(`
        SELECT num_users AS user_number, full_name, sex, pwd_id, status_ AS status, date_issued 
        FROM users WHERE is_archived = 0
        ORDER BY num_users ASC
      `);

      // Wrap it with an event label
      ws.send(JSON.stringify({
        event: "update-active",
        data: results
      }));
    } catch (error) {
      console.error('❌ Error sending data to WebSocket client:', error.message);
    }

    ws.on('message', (message) => {
      console.log('📩 Received message:', message.toString());
    });

    ws.on('close', () => {
      console.log('🔴 Client disconnected');
    });
  });

  console.log('📡 WebSocket server is ready');
}

// ✅ New: Use event-wrapped broadcasting
export function broadcastToClients(message) {
  if (!wss) return;

  const payload = JSON.stringify(message);
  console.log("📢 Broadcasting WebSocket event:", message.event);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

//Old WebSocket
// import { WebSocketServer } from 'ws';

// let wss;

// export function startWebSocketServer(server, pool) {
//   wss = new WebSocketServer({ server });

//   wss.on('connection', async (ws) => {
//     console.log('🟢 New WebSocket client connected');

//     try {
//       const [results] = await pool.promise().query(`
//         SELECT num_users AS user_number, full_name, sex, pwd_id, status_ AS status, date_issued 
//         FROM users ORDER BY num_users ASC
//       `);
//       ws.send(JSON.stringify(results));
//     } catch (error) {
//       console.error('❌ Error sending data to WebSocket client:', error.message);
//     }

//     ws.on('message', (message) => {
//       console.log('📩 Received message:', message.toString());
//     });

//     ws.on('close', () => {
//       console.log('🔴 Client disconnected');
//     });
//   });

//   console.log('📡 WebSocket server is ready');
// }

// export function broadcastToClients(data) {
//   if (!wss) return;

//   wss.clients.forEach((client) => {
//     if (client.readyState === 1) {
//       client.send(JSON.stringify(data));
//     }
//   });
// }
