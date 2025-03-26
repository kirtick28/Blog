import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
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
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost(response.data);
    } catch (error) {
      toast.error('Error loading post');
      if (error.response?.status === 404) {
        navigate('/home');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/posts/comment/${id}`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setPost({ ...post, comments: response.data });
      setComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/posts/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setPost({ ...post, likes: response.data });
    } catch (error) {
      toast.error('Error liking post');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="blog-post-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-post-container">
        <div className="error-message">
          Post not found
          <button onClick={() => navigate('/home')} className="back-btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isAuthor = post.author._id === currentUserId;

  return (
    <div className="blog-post-container">
      <button onClick={() => navigate('/home')} className="back-btn">
        ← Back to Feed
      </button>

      {post.image && (
        <div className="blog-post-image">
          <img src={post.image} alt={post.title} />
        </div>
      )}

      <div className="blog-post-content">
        <h1 className="blog-post-title">{post.title}</h1>
        
        <div className="blog-post-meta">
          <div className="author-info">
            <span className="author-name">By {post.author.username}</span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
          
          <div className="post-interactions">
            <button 
              className={`like-btn ${post.likes.includes(currentUserId) ? 'liked' : ''} ${isAuthor ? 'disabled' : ''}`}
              onClick={handleLike}
              disabled={isAuthor}
              title={isAuthor ? "You can't like your own post" : ''}
            >
              ❤ {post.likes.length}
            </button>
            <span className="comment-count">
              💬 {post.comments.length}
            </span>
          </div>
        </div>

        <div className="blog-post-body">
          {post.content}
        </div>

        {post.learnMoreUrl && (
          <a 
            href={post.learnMoreUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="learn-more-btn"
          >
            Learn More
          </a>
        )}

        <div className="comments-section">
          <h2>Comments ({post.comments.length})</h2>
          
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
            />
            <button type="submit" disabled={!comment.trim()}>
              Post Comment
            </button>
          </form>

          <div className="comments-list">
            {post.comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              post.comments.map((comment, index) => (
                <div key={comment._id || index} className="comment">
                  <div className="comment-header">
                    <strong>{comment.author.username}</strong>
                    <span className="comment-date">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p>{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
