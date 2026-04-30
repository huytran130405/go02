import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

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
    }
};

export default postService;