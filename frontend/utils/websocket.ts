export class WebSocketClient {
    private socket: WebSocket | null = null;

    constructor(private url: string) {}


    // Connect to WebSocket
    connect(onMessage: (message: string) => void) {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        this.socket.onmessage = (event) => {
            onMessage(event.data);
        };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        this.socket.onerror = (error) => {
            console.log("WebSocket error:", error);
        };
    }

    // Send message to WebSocket server
    sendMessage(message: string) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error("WebSocket is not open. Unabel to send message.");
        }
    }

    // Disconnect WebSocket
    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}