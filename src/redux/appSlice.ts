import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface AppState {
    view: number;
}

const initialState: AppState = {
    view: 0
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setView: (state, action: PayloadAction<number>) => {
            state.view = action.payload;
        }
    }
});

export const { setView } = appSlice.actions;

export const _view = (state: RootState) => state.app.view;

export default appSlice.reducer;
