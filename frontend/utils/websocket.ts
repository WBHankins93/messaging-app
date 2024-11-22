export class WebSocketClient {
    private socket: WebSocket | null = null;
    private url: string;
    private isConnected: boolean = false;
    private reconnectInterval: number = 5000;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 10;
    private onMessageCallback: (message: string) => void = () => {};

    constructor(baseUrl: string, token: string) {
        this.url = `${baseUrl}?token=${token}`
    }


    // Connect to WebSocket
    connect(onMessage: (message: string) => void) {
        this.onMessageCallback = onMessage;

        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("WebSocket connection established");
            this.isConnected = true;
            this.reconnectAttempts = 0;
        };

        this.socket.onmessage = (event) => {
            onMessage(event.data);
        };

        this.socket.onclose = (event) => {
            console.warn("WebSocket connection closed:", event.reason);
            this.isConnected = false;

            // Attempt reconnection if not manually disconnected
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                console.log("Attempting to reconnect...");
                setTimeout(() => {
                    this.reconnectAttempts++;
                    this.connect(onMessage); // Reconnect
                }, this.reconnectInterval);
            } else {
                console.error("Max reconnect attempts reached. Giving up.");
            }
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