export enum MessageTypes {
    CREATE_ROOM = "CREATE_ROOM",
    JOIN_ROOM = "JOIN_ROOM",
    JOIN_SUCCESSFUL = "JOIN_SUCCESSFUL",
    JOIN_ID = "JOIN_ID",
    ERROR = "ERROR",
    GIVE_OFFER = "GIVE_OFFER",
    RECEIVE_OFFER = "RECEIVE_OFFER",
    GIVE_ANSWER = "GIVE_ANSWER",
    RECEIVE_ANSWER = "RECEIVE_ANSWER",
    NEW_USER = "NEW_USER",
    USER_ICE_CANDIDATE = "USER_ICE_CANDIDATE",
    OWNER_ICE_CANDIDATE = "OWNER_ICE_CANDIDATE",
    ICE_CANDIDATE_TO_OWNER = "ICE_CANDIDATE_TO_OWNER",
    ICE_CANDIDATE_TO_USER = "ICE_CANDIDATE_TO_USER",
    LEAVE_MEETING = "LEAVE_MEETING",
    CLOSE_MEETING = "CLOSE_MEETING",
}

export interface ReceiveAnswerPayload {
    userId: number;
    sdp: RTCSessionDescription
}

export interface IceCandidateToOwnerPayload {
    userId: number;
    candidate: RTCIceCandidate;
}