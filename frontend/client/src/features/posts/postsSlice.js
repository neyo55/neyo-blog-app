// src/features/posts/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/posts`);
  return res.data;
});

export const createPost = createAsyncThunk('posts/createPost', async ({ title, content }) => {
  const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/posts`, { title, content });
  return res.data;
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, title, content }) => {
  const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}`, { title, content });
  return res.data;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
  await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}`);
  return id;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: { posts: [], status: 'idle', error: null },
  reducers: {
    setEditPost(state, action) {
      state.editId = action.payload._id;
      state.editTitle = action.payload.title;
      state.editContent = action.payload.content;
    },
    clearEditPost(state) {
      state.editId = null;
      state.editTitle = '';
      state.editContent = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.status = 'succeeded';
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      const index = state.posts.findIndex((post) => post._id === action.payload._id);
      state.posts[index] = action.payload;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    });
  },
});

export const { setEditPost, clearEditPost } = postsSlice.actions;
export default postsSlice.reducer;