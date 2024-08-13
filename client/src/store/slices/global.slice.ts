import { createSlice } from "@reduxjs/toolkit";

export interface IGlobalInitialState {
    joinId: string | null;
    isJoined: boolean;
    userId: number | null;
}

const initialState: IGlobalInitialState = {
    joinId: null,
    isJoined: false,
    userId: null
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
        setUserId: (state, action) => {
            state.userId = action.payload;
        }
    }
})

export default globalSlice.reducer;
export const { setJoinId, setIsJoined, setUserId } = globalSlice.actions;