import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import '../styles/Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        if (payload && payload.user && payload.user.id) {
          setCurrentUserId(payload.user.id);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/posts`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPosts(response.data);
    } catch (error) {
      toast.error('Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId, newLikes) => {
    setPosts(
      posts.map((post) =>
        post._id === postId ? { ...post, likes: newLikes } : post
      )
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Blog Feed</h1>

      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts yet. Be the first to create a post!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              onLike={handleLike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
