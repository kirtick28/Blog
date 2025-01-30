import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState({
    title: '',
    content: '',
    image: ''
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPost(response.data);
      setPreview(response.data.image);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage({ 
        text: error.response?.data?.message || 'Error fetching post', 
        type: 'error' 
      });
      console.error('Error fetching post:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage({ 
        text: 'Image size should be less than 5MB', 
        type: 'error' 
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPost(prev => ({ ...prev, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (!post.title.trim() || !post.content.trim()) {
        throw new Error('Title and content are required');
      }

      const token = localStorage.getItem('token');
      let response;

      if (id) {
        // Update existing post
        response = await axios.put(
          `http://localhost:5000/api/posts/${id}`, 
          post,
          { headers: { Authorization: `Bearer ${token}` }}
        );
      } else {
        response = await axios.post(
          'http://localhost:5000/api/posts',
          post,
          { headers: { Authorization: `Bearer ${token}` }}
        );
      }

      setMessage({ 
        text: id ? 'Post updated successfully!' : 'Post created successfully!', 
        type: 'success' 
      });

      // Wait for 1.5 seconds to show the success message before navigating
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      setLoading(false);
      setMessage({ 
        text: error.response?.data?.message || error.message || 'Error saving post', 
        type: 'error' 
      });
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading && id) {
    return (
      <div className="create-post-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h1>{id ? 'Edit Post' : 'Create New Post'}</h1>
        <p>{id ? 'Update your post' : 'Share your thoughts with the world'}</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="create-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            placeholder="Enter a captivating title..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            placeholder="Write your story..."
            required
          />
        </div>

        <div className="form-group">
          <label className="image-upload-label">
            <div className="upload-placeholder">
              {preview ? (
                <img src={preview} alt="Preview" className="image-preview" />
              ) : (
                <>
                  <span className="upload-icon">📸</span>
                  <span>Click to add a cover image</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              id ? 'Update Post' : 'Publish Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
