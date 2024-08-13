import { createSlice } from "@reduxjs/toolkit";

export interface IGlobalInitialState {
    joinId: string | null;
    userId: number | null;
}

const initialState: IGlobalInitialState = {
    joinId: null,
    userId: null
}

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setJoinId: (state, action) => {
            state.joinId = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        }
    }
})

export default globalSlice.reducer;
export const { setJoinId, setUserId } = globalSlice.actions;