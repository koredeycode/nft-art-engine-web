import { WebSocketServer } from "ws";
import type { Server } from "node:http";

let wss: WebSocketServer;

export function initWebSocket(server: Server): WebSocketServer {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "subscribe" && msg.jobId) {
          (ws as { jobId?: string }).jobId = msg.jobId;
        }
      } catch {
        // ignore invalid messages
      }
    });
  });

  return wss;
}

export function broadcastJobProgress(
  jobId: string,
  status: string,
  progress: number,
  currentEdition?: number,
  totalEditions?: number,
): void {
  if (!wss) return;
  const message = JSON.stringify({ jobId, status, progress, currentEdition, totalEditions });
  wss.clients.forEach((client) => {
    if (
      client.readyState === 1 &&
      (client as { jobId?: string }).jobId === jobId
    ) {
      client.send(message);
    }
  });
}
