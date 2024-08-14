import { WebSocket } from "ws";

export type AppStoreType = Record<string, SingleRoom>;

interface SingleRoom {
    owner: WebSocket;
    viewers: Record<number, WebSocket>
}

export type GiveOfferPayload = {
    roomId: string;
    sdp: string;
    userId: number;
}

export type GiveAnswerPayload = {
    roomId: string;
    sdp: string;
    userId: number;
}

export type IceCandidateOwner = {
    candidate: string;
    roomId: string;
    userId: number;
}

export type IceCandidateUser = {
    candidate: string;
    userId: number;
    roomId: string;
}

export type TypeLeaveMeating = {
    roomId: string;
    userId: number;
}

export type TypeCloseMeeting = {
    roomId: string
}