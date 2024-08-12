import { createSlice } from "@reduxjs/toolkit";

export interface IGlobalInitialState {
    joinId: string | null;
    isJoined: boolean;
    stream: MediaStream | null;
    userId: number | null;
    viewers: Record<string, RTCPeerConnection>;
}

const initialState: IGlobalInitialState = {
    joinId: null,
    isJoined: false,
    stream: null,
    userId: null,
    viewers: {}
}

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setJoinId: (state, action) => {
            state.joinId = action.payload;
        },
        setIsJoined: (state, action) => {
            state.isJoined = action.payload;
        },
        setStream: (state, action) => {
            state.stream = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setViewers: (state, action) => {
            const id = action.payload.id;
            const rtcObj = action.payload.rtc

            state.viewers[id.toString()] = rtcObj;
        }
    }
})

export default globalSlice.reducer;
export const { setJoinId, setIsJoined, setStream, setUserId, setViewers } = globalSlice.actions;