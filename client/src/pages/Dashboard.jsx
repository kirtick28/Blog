import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    postsCount: 0,
    likesReceived: 0,
    commentsReceived: 0
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchUserStats();
    fetchMyPosts();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/posts/my-posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ text: 'Post deleted successfully!', type: 'success' });
        // Refresh both stats and posts
        fetchUserStats();
        fetchMyPosts();
      } catch (error) {
        setMessage({ 
          text: error.response?.data?.message || 'Error deleting post', 
          type: 'error' 
        });
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="stats-container">
        <div className="stats-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Posts</h3>
            <p className="stat-number">{stats.postsCount}</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>Likes</h3>
            <p className="stat-number">{stats.likesReceived}</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>Comments</h3>
            <p className="stat-number">{stats.commentsReceived}</p>
          </div>
        </div>
      </div>

      <div className="posts-section">
        <div className="posts-header">
          <h2>My Posts</h2>
          <button 
            className="create-post-btn"
            onClick={() => navigate('/create-post')}
          >
            Create New Post
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <h3>You haven't created any posts yet</h3>
            <p>Share your thoughts with the world by creating your first post!</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                {post.image && (
                  <div className="post-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                )}
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p className="post-text">{post.content}</p>
                  <div className="post-meta">
                    <span className="post-date">{formatDate(post.createdAt)}</span>
                    <div className="post-stats">
                      <span title="Likes">❤ {post.likes.length}</span>
                      <span title="Comments">💬 {post.comments.length}</span>
                    </div>
                  </div>
                  <div className="post-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(post._id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
