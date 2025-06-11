import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface CounterState {
    isMenuCollapsed?: boolean;
    isOpenFilterOption: boolean;
}

// Define the initial state using that type
const initialState: CounterState = {
    isMenuCollapsed: false,
    isOpenFilterOption: false,
};

const slice = createSlice({
    name: "projectConfig",
    initialState,
    reducers: {
        toggleMenuCollapse: (state: CounterState) => {
            state.isMenuCollapsed = !state.isMenuCollapsed;
        },
        toggleFilterOption: (state: CounterState) => {
            state.isOpenFilterOption = !state.isOpenFilterOption;
        },
    },
});

export const { toggleMenuCollapse, toggleFilterOption } = slice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectIsMenuCollapsed = (state: RootState) => state.projectConfig.isMenuCollapsed;
export const selectIsOpenFilterOption = (state: RootState) => state.projectConfig.isOpenFilterOption;

const projectConfigSliceReducer = slice.reducer;
export default projectConfigSliceReducer;
