import { configureStore } from "@reduxjs/toolkit";
import globalReducer, { IGlobalInitialState } from './slices/global.slice'

export const appStore = configureStore({
    reducer: {
        global: globalReducer
    }
})

export type AppStoreType = {
    global: IGlobalInitialState
}