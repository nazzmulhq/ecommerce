import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../reducers";

// Define a type for the slice state
interface CounterState {
    isMenuCollapsed?: boolean;
}

// Define the initial state using that type
const initialState: CounterState = {
    isMenuCollapsed: false, // Default value for menu collapse state
};

const slice = createSlice({
    name: "projectConfig",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Toggle the menu collapse state
        toggleMenuCollapse: state => {
            state.isMenuCollapsed = !state.isMenuCollapsed;
        },
    },
});

export const { toggleMenuCollapse } = slice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectIsMenuCollapsed = (state: RootState) => state.projectConfig.isMenuCollapsed;

const projectConfigSliceReducer = slice.reducer;
export default projectConfigSliceReducer;
