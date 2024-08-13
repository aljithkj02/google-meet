import { createSlice } from "@reduxjs/toolkit";

export interface IGlobalInitialState {
    loading: boolean;
    joinId: string | null;
    userId: number | null;
}

const initialState: IGlobalInitialState = {
    loading: false,
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
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})

export default globalSlice.reducer;
export const { setJoinId, setUserId, setLoading } = globalSlice.actions;