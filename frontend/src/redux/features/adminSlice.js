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
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.admin = action.payload.admin;
            state.isAuthenticated = true;
            state.error = null;
            state.loading = false;
        },
        loginFail: (state, action) => {
            state.token = null;
            state.isAuthenticated = false;
            state.admin = null;
            state.error = action.payload;
            state.loading = false;
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
            state.loading = false;
            state.error = null;
            localStorage.removeItem('adminToken');
        }
    }
});

export const {
    setLoading,
    setError,
    loginSuccess,
    loginFail,
    loadAdminSuccess,
    loadAdminFail,
    logout
} = adminSlice.actions;

export default adminSlice.reducer;