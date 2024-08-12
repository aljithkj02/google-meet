import { MessageTypes } from "../types";

export class SignalingManager {
    static instance: SignalingManager;
    private ws: WebSocket;
    private bufferMessages: any[];
    private isInitialized: boolean = false;
    private callbacks: any = {};

    private constructor() {
        this.ws = new WebSocket("ws://localhost:8000");
        this.bufferMessages = [];
        this.init();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SignalingManager();
        }
        return this.instance;
    }

    private init() {
        this.ws.onopen = () => {
            this.isInitialized = true;
            this.bufferMessages.forEach(msg => {
                this.ws.send(JSON.stringify(msg));
            })
            
            this.bufferMessages = [];
        }

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const type: MessageTypes = message.type;

            switch (type) {
                case MessageTypes.JOIN_ID:
                    if (this.callbacks[MessageTypes.JOIN_ID]?.length) {
                        this.callbacks[MessageTypes.JOIN_ID].forEach((cb: (arg?: any) => void) => {
                            cb(message.data);
                        })
                    }
                    break;

                case MessageTypes.JOIN_SUCCESSFUL:
                    if (this.callbacks[MessageTypes.JOIN_SUCCESSFUL]?.length) {
                        this.callbacks[MessageTypes.JOIN_SUCCESSFUL].forEach((cb: (arg?: any) => void) => {
                            cb(message.data);
                        })
                    }
                    break;
                
                case MessageTypes.ERROR:
                    if (this.callbacks[MessageTypes.ERROR]?.length) {
                        this.callbacks[MessageTypes.ERROR].forEach((cb: (arg?: any) => void) => {
                            cb(message.message);
                        })
                    }
                    break;

                case MessageTypes.NEW_USER:
                    if (this.callbacks[MessageTypes.NEW_USER]?.length) {
                        this.callbacks[MessageTypes.NEW_USER].forEach((cb: (arg?: any) => void) => {
                            cb(message.data);
                        })
                    }
                    break;
            
                default:
                    break;
            }
        }
    }

    createRoom() {
        const payload = {
            type: MessageTypes.CREATE_ROOM
        }

        if (!this.isInitialized) {
            this.bufferMessages.push(payload);
            return;
        }

        this.ws.send(JSON.stringify(payload));
    }

    joinRoom(id: string) {
        const payload = {
            type: MessageTypes.JOIN_ROOM,
            data: id
        }

        if (!this.isInitialized) {
            this.bufferMessages.push(payload);
            return;
        }

        this.ws.send(JSON.stringify(payload))
    }

    setCallbacks(key: MessageTypes, fn: (arg?: any) => void) {
        if (this.callbacks[key]) {
            this.callbacks[key].push(fn);
        } else {
            this.callbacks[key] = [fn];
        }
    }
}