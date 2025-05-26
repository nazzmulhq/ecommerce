import { combineReducers } from "@reduxjs/toolkit";
import projectConfigSliceReducer from "../config/projectConfig";
import counterSliceReducer from "../test/testSlice";
// ...add more reducers as needed

const rootReducer = combineReducers({
    counter: counterSliceReducer,
    projectConfig: projectConfigSliceReducer,
    // ... add more reducers here
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
