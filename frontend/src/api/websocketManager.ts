import { Client } from '@stomp/stompjs';

export type PatchType = 
  | 'NODE_MOVED'
  | 'NODE_ADDED'
  | 'NODE_STATUS_CHANGED'
  | 'EDGE_ADDED'
  | 'NODE_DELETED'
  | 'EDGE_DELETED';

export interface GraphPatch {
  projectId: string;
  senderId: string;
  type: PatchType;
  payload: Record<string, any>;
}

class WebSocketManager {
  private client: Client | null = null;
  private currentProjectId: string | null = null;
  private clientId: string;

  constructor() {
    // Generate a pseudo-random ID for this client session to ignore self-echoed patches
    this.clientId = Math.random().toString(36).substring(2, 15);
  }

  public getClientId() {
    return this.clientId;
  }

  public connect(projectId: string, onPatchReceived: (patch: GraphPatch) => void, onConnectStatusChange: (connected: boolean) => void) {
    if (this.client && this.currentProjectId === projectId) {
      return; // Already connected to this project
    }

    if (this.client) {
      this.disconnect();
    }

    this.currentProjectId = projectId;

    // Use ws:// mapping to the Next.js proxy -> Spring Boot
    // Notice: Next.js rewrite for /api might not handle WS upgrades automatically depending on Next version.
    // For MVP, we will connect directly to the Spring Boot port (8081) if needed, or assume proxy supports WS.
    // Assuming 8081 for direct WS connection to avoid Next.js websocket proxy complexity.
    const wsUrl = `ws://localhost:8081/ws/collaboration`;

    this.client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        onConnectStatusChange(true);
        this.client?.subscribe(`/topic/project/${projectId}`, (message) => {
          if (message.body) {
            const patch: GraphPatch = JSON.parse(message.body);
            // Ignore messages sent by ourselves
            if (patch.senderId !== this.clientId) {
              onPatchReceived(patch);
            }
          }
        });
      },
      onWebSocketClose: () => {
        onConnectStatusChange(false);
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    this.client.activate();
  }

  public disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }

  public broadcastPatch(type: PatchType, payload: Record<string, any>) {
    if (this.client && this.client.connected && this.currentProjectId) {
      const patch: GraphPatch = {
        projectId: this.currentProjectId,
        senderId: this.clientId,
        type,
        payload,
      };

      this.client.publish({
        destination: `/app/project/${this.currentProjectId}/patch`,
        body: JSON.stringify(patch),
      });
    }
  }
}

// Singleton instance
export const wsManager = new WebSocketManager();
