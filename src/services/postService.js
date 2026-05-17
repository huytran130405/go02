import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const postService = {
    getAllPosts: async () => {
        try {
            const response = await axios.get(`${API_URL}/posts`);
            const data = response.data.data || response.data.posts || response.data;
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
            return [];
        }
    },
    createPost: async (postData) => {
        try {
            const response = await axios.post(`${API_URL}/posts`, postData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error;
            throw new Error(message);
        }
    },
    findPostById: async (postId) => {
        try {
            const response = await axios.get(`${API_URL}/posts/${postId}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message;
            throw new Error(message);
        }
    }
};

export default postService;