export class WebSocketClient {
    private socket: WebSocket | null = null;
    private url: string;
    private isConnected: boolean = false;

    constructor(baseUrl: string, token: string) {
        this.url = `${baseUrl}?token=${token}`
    }


    // Connect to WebSocket
    connect(onMessage: (message: string) => void) {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("WebSocket connection established");
            this.isConnected = true;
        };

        this.socket.onmessage = (event) => {
            onMessage(event.data);
        };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed");
            this.isConnected = false;
        };

        this.socket.onerror = (error) => {
            console.log("WebSocket error:", error);
            this.isConnected = false;
        };
    }

    // Send message to WebSocket server
    sendMessage(message: string) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error("WebSocket is not open. Unable to send message.");
        }
    }

    // Disconnect WebSocket
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}