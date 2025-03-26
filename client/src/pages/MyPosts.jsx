import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MyPosts.css';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/posts/my-posts`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
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
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/posts/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        fetchMyPosts(); // Refresh the posts list
      } catch (error) {
        console.error('Error deleting post:', error);
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

  if (loading) {
    return (
      <div className="my-posts-container">
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-posts-container">
      <div className="my-posts-header">
        <h1>My Posts</h1>
        <button
          className="create-post-btn"
          onClick={() => navigate('/create-post')}
        >
          Create New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">
          <h2>You haven't created any posts yet</h2>
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
                <h2>{post.title}</h2>
                <p className="post-text">{post.content}</p>
                <div className="post-meta">
                  <span className="post-date">
                    {formatDate(post.createdAt)}
                  </span>
                  <div className="post-stats">
                    <span>❤ {post.likes.length}</span>
                    <span>💬 {post.comments.length}</span>
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
  );
};

export default MyPosts;
