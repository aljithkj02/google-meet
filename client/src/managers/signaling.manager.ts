import { MessageTypes } from "../types";

export class SignalingManager {
    static instance: SignalingManager;
    private ws: WebSocket;
    private bufferMessages: any[];
    private isInitialized: boolean = false;
    private callbacks: any = {};
    viewers: Record<number, RTCPeerConnection> = {};
    stream: MediaStream | null = null;

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

                case MessageTypes.RECEIVE_OFFER:
                    if (this.callbacks[MessageTypes.RECEIVE_OFFER]?.length) {
                        this.callbacks[MessageTypes.RECEIVE_OFFER].forEach((cb: (arg?: any) => void) => {
                            cb(message.data);
                        })
                    }
                    break;

                case MessageTypes.RECEIVE_ANSWER:
                    if (this.callbacks[MessageTypes.RECEIVE_ANSWER]?.length) {
                        this.callbacks[MessageTypes.RECEIVE_ANSWER].forEach((cb: (arg?: any) => void) => {
                            cb(message.data);
                        })
                    }
                    break;

                case MessageTypes.USER_ICE_CANDIDATE:
                    if (this.callbacks[MessageTypes.USER_ICE_CANDIDATE]?.length) {
                        this.callbacks[MessageTypes.USER_ICE_CANDIDATE].forEach((cb: (arg?: any) => void) => {
                            cb(message.data);
                        })
                    }
                    break;

                case MessageTypes.OWNER_ICE_CANDIDATE:
                    if (this.callbacks[MessageTypes.OWNER_ICE_CANDIDATE]?.length) {
                        this.callbacks[MessageTypes.OWNER_ICE_CANDIDATE].forEach((cb: (arg?: any) => void) => {
                            cb(message.data);
                        })
                    }
                    break;

                case MessageTypes.LEAVE_MEETING:
                    if (this.callbacks[MessageTypes.LEAVE_MEETING]?.length) {
                        this.callbacks[MessageTypes.LEAVE_MEETING].forEach((cb: (arg?: any) => void) => {
                            cb(message.data);
                        })
                    }
                    break;

                case MessageTypes.MEETING_CLOSED:
                    if (this.callbacks[MessageTypes.MEETING_CLOSED]?.length) {
                        this.callbacks[MessageTypes.MEETING_CLOSED].forEach((cb: (arg?: any) => void) => {
                            cb(message.message);
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

    giveOffer(roomId: string, userId: number, sdp: RTCSessionDescription) {
        this.ws.send(JSON.stringify({
            type: MessageTypes.GIVE_OFFER,
            data: {
              roomId,
              userId,
              sdp
            }
        }))
    }

    giveAnswer(roomId: string, userId: number, sdp: RTCSessionDescription) {
        this.ws.send(JSON.stringify({
            type: MessageTypes.GIVE_ANSWER,
            data: {
              roomId,
              userId,
              sdp
            }
        }))
    }

    sendIceCandidateToUser(userId: number, candidate: RTCIceCandidate, roomId: string) {
        this.ws.send(JSON.stringify({ 
            type: MessageTypes.ICE_CANDIDATE_TO_USER,
            data: {
                candidate,
                userId,
                roomId
            }
        }))
    }

    sendIceCandidateToOwner(userId: number, roomId: string, candidate: RTCIceCandidate) {
        this.ws.send(JSON.stringify({
            type: MessageTypes.ICE_CANDIDATE_TO_OWNER,
            data: {
                userId,
                roomId,
                candidate
            }
        }))
    }

    addNewViewer(userId: number, pc: RTCPeerConnection) {
        this.viewers[userId] = pc;
    }

    addStream(stream: MediaStream) {
        this.stream = stream;
    }

    leaveMeeting(roomId: string, userId: number) {
        this.ws.send(JSON.stringify({
            type: MessageTypes.LEAVE_MEETING,
            data: {
                userId,
                roomId
            }
        }))
    }

    closeMeeting(roomId: string) {
        this.ws.send(JSON.stringify({
            type: MessageTypes.CLOSE_MEETING,
            data: {
                roomId
            }
        }))
    }
}