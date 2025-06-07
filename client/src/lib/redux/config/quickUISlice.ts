// store/quickUISlice.ts
import { CrudType } from "@components/common/AppCRUDOperation";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuickUIState {
    data: any[];
    editingRecord: any | null;
    viewingRecord: any | null;
    selectedRowKeys: any[];
    selectedRows: any[];
    isFormVisible: boolean;
    isViewVisible: boolean;
    currentPage: "list" | "form" | "view";
    filters: Record<string, any>;
    loading: boolean;
    activeCrudType: CrudType;
    error: string | null;
}

const initialState: QuickUIState = {
    data: [],
    editingRecord: null,
    viewingRecord: null,
    selectedRowKeys: [],
    selectedRows: [],
    isFormVisible: false,
    isViewVisible: false,
    currentPage: "list",
    filters: {},
    loading: false,
    activeCrudType: "modal",
    error: null,
};

// Async thunks
export const createRecord = createAsyncThunk(
    "quickUI/createRecord",
    async ({ record, onRecordCreate }: { record: any; onRecordCreate?: (record: any) => Promise<any> | void }) => {
        if (onRecordCreate) {
            return await onRecordCreate(record);
        }
        return { ...record, id: Date.now().toString() };
    },
);

export const updateRecord = createAsyncThunk(
    "quickUI/updateRecord",
    async ({ record, onRecordUpdate }: { record: any; onRecordUpdate?: (record: any) => Promise<any> | void }) => {
        if (onRecordUpdate) {
            return await onRecordUpdate(record);
        }
        return record;
    },
);

export const deleteRecord = createAsyncThunk(
    "quickUI/deleteRecord",
    async ({ record, onRecordDelete }: { record: any; onRecordDelete?: (record: any) => Promise<any> | void }) => {
        if (onRecordDelete) {
            await onRecordDelete(record);
        }
        return record;
    },
);

export const applyFilters = createAsyncThunk(
    "quickUI/applyFilters",
    async ({
        filters,
        initialData,
        onFilter,
    }: {
        filters: Record<string, any>;
        initialData: any[];
        onFilter?: (data: any[], filter: Record<string, any>) => Promise<any[]> | void;
    }) => {
        if (onFilter) {
            const result = await onFilter(initialData, filters);
            // If onFilter returns undefined (void), return the initialData
            return result !== undefined ? result : initialData;
        }

        // Client-side filtering
        let filteredData = [...initialData];
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                filteredData = filteredData.filter(record => record[key] === value);
            }
        });

        return filteredData;
    },
);

const quickUISlice = createSlice({
    name: "quickUI",
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<any[]>) => {
            state.data = action.payload;
        },
        setEditingRecord: (state, action: PayloadAction<any | null>) => {
            state.editingRecord = action.payload;
        },
        setViewingRecord: (state, action: PayloadAction<any | null>) => {
            state.viewingRecord = action.payload;
        },
        setSelectedRows: (state, action: PayloadAction<{ keys: any[]; rows: any[] }>) => {
            state.selectedRowKeys = action.payload.keys;
            state.selectedRows = action.payload.rows;
        },
        setFormVisible: (state, action: PayloadAction<boolean>) => {
            state.isFormVisible = action.payload;
        },
        setViewVisible: (state, action: PayloadAction<boolean>) => {
            state.isViewVisible = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<"list" | "form" | "view">) => {
            state.currentPage = action.payload;
        },
        setFilters: (state, action: PayloadAction<Record<string, any>>) => {
            state.filters = action.payload;
        },
        clearFilters: state => {
            state.filters = {};
        },
        setActiveCrudType: (state, action: PayloadAction<CrudType>) => {
            state.activeCrudType = action.payload;
        },
        resetState: state => {
            return { ...initialState, activeCrudType: state.activeCrudType };
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            // Create record
            .addCase(createRecord.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRecord.fulfilled, (state, action) => {
                state.loading = false;
                state.data.push(action.payload);
                state.isFormVisible = false;
                state.editingRecord = null;
                state.currentPage = "list";
            })
            .addCase(createRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to create record";
            })

            // Update record
            .addCase(updateRecord.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRecord.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.data.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
                state.isFormVisible = false;
                state.editingRecord = null;
                state.currentPage = "list";
            })
            .addCase(updateRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update record";
            })

            // Delete record
            .addCase(deleteRecord.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRecord.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter(item => item.id !== action.payload.id);
            })
            .addCase(deleteRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to delete record";
            })

            // Apply filters
            .addCase(applyFilters.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(applyFilters.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(applyFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to apply filters";
            });
    },
});

export const {
    setData,
    setEditingRecord,
    setViewingRecord,
    setSelectedRows,
    setFormVisible,
    setViewVisible,
    setCurrentPage,
    setFilters,
    clearFilters,
    setActiveCrudType,
    resetState,
    setError,
    setLoading,
} = quickUISlice.actions;

export default quickUISlice.reducer;
