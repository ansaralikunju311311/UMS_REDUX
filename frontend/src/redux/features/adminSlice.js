import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('adminToken') || null,
    isAuthenticated: !!localStorage.getItem('adminToken'),
    admin: null,
    loading: false,
    error: null
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },
        loginFail: (state, action) => {
            state.token = null;
            state.isAuthenticated = false;
            state.admin = null;
            state.error = action.payload;
        },
        loadAdminSuccess: (state, action) => {
            state.admin = action.payload;
            state.loading = false;
        },
        loadAdminFail: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.admin = null;
            state.loading = false;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.admin = null;
            localStorage.removeItem('adminToken');
        }
    }
});

export const {
    loginSuccess,
    loginFail,
    loadAdminSuccess,
    loadAdminFail,
    logout
} = adminSlice.actions;

export default adminSlice.reducer;