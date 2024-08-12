import { IceCandidateToOwnerPayload, MessageTypes, ReceiveAnswerPayload } from "../types";

class WsManager {
    static instance: WsManager;
    private wss: WebSocket;
    private viewers: Record<number, RTCPeerConnection>;
    private receiver: RTCPeerConnection | null;

    private constructor() {
        this.wss = new WebSocket("ws://localhost:8000");
        this.viewers = {};
        this.receiver = null;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new WsManager();
        }
        return this.instance;
    }

    getSocket() {
        return this.wss;
    }

    createRoom() {
        this.wss.send(JSON.stringify({
            type: MessageTypes.CREATE_ROOM
        }))
    }

    joinRoom(id: string) {
        this.wss.send(JSON.stringify({
            type: MessageTypes.JOIN_ROOM,
            data: id
        }))
    }

    async addNewUser(userId: number, roomId: string, stream: MediaStream) {
        const pc = new RTCPeerConnection();
        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            this.wss.send(JSON.stringify({
              type: MessageTypes.GIVE_OFFER,
              data: {
                roomId,
                userId,
                sdp: pc.localDescription
              }
            }))
        }


        pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.wss.send(JSON.stringify({ 
                    type: MessageTypes.ICE_CANDIDATE_TO_USER,
                    data: {
                        candidate: event.candidate,
                        userId
                    }
                }))
            }
        }

        pc.addTrack(stream.getVideoTracks()[0], stream);

        this.viewers[userId] = pc;
    }

    async receiveOffer(offer: RTCSessionDescription, userId: number, roomId: string) {
        this.receiver = new RTCPeerConnection();
        await this.receiver.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await this.receiver.createAnswer();
        await this.receiver.setLocalDescription(answer);

        this.receiver.ontrack = (event) => {
            console.log({event})
        }

        this.receiver.onicecandidate = (event) => {
          if (event.candidate) {
            this.wss.send(JSON.stringify({ 
              type: MessageTypes.ICE_CANDIDATE_TO_OWNER,
              data: {
                roomId,
                candidate: event.candidate
              }
            }))
          }
        }
        
        this.wss.send(JSON.stringify({
            type: MessageTypes.GIVE_ANSWER,
            data: {
                sdp: this.receiver.localDescription,
                userId,
                roomId
            }
        }))
    }

    async receiveAnswer({ sdp, userId }: ReceiveAnswerPayload) {
        const pc = this.viewers[userId];
        pc.setRemoteDescription(new RTCSessionDescription(sdp));
    }

    giveIceCandidateToUser(candidate: RTCIceCandidate) {
        this.receiver?.addIceCandidate(new RTCIceCandidate(candidate));
    }

    giveIceCandidateToOwner({ candidate, userId }: IceCandidateToOwnerPayload) {
        const pc = this.viewers[userId];
        pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
}

export const wsManager = WsManager.getInstance(); 