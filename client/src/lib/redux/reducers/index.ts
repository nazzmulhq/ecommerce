import { combineReducers } from "@reduxjs/toolkit";
import projectConfigSliceReducer from "../config/projectConfig";
import quickUISliceReducer from "../config/quickUISlice";
import counterSliceReducer from "../test/testSlice";
// ...add more reducers as needed

const rootReducer = combineReducers({
    counter: counterSliceReducer,
    projectConfig: projectConfigSliceReducer,
    quickUI: quickUISliceReducer,
    // ... add more reducers here
});

export default rootReducer;
