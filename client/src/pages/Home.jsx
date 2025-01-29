import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentingPost, setCommentingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error fetching posts. Please try again later.');
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/posts/like/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts(); // Refresh posts to show updated likes
    } catch (err) {
      console.error('Error liking post:', err);
      setError('Error liking post. Please try again.');
    }
  };

  const handleComment = async (postId) => {
    try {
      if (!newComment.trim()) return;

      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/posts/comment/${postId}`, 
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setNewComment('');
      setCommentingPost(null);
      fetchPosts(); // Refresh posts to show new comment
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Error adding comment. Please try again.');
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
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={fetchPosts} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="posts-feed">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>No posts yet</h3>
            <p>Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              {post.image && (
                <div className="post-image">
                  <img src={post.image} alt={post.title} />
                </div>
              )}
              <div className="post-content">
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <span className="post-author">
                    by {post.author?.username || 'Unknown User'}
                  </span>
                </div>
                <p className="post-text">{post.content}</p>
                <div className="post-meta">
                  <span className="post-date">{formatDate(post.createdAt)}</span>
                  <div className="post-actions">
                    <button 
                      className="like-btn"
                      onClick={() => handleLike(post._id)}
                    >
                      ❤️ {post.likes?.length || 0}
                    </button>
                    <button 
                      className="comment-btn"
                      onClick={() => setCommentingPost(post._id)}
                    >
                      💬 {post.comments?.length || 0}
                    </button>
                  </div>
                </div>
                
                {/* Comments Section */}
                <div className="comments-section">
                  {commentingPost === post._id && (
                    <div className="comment-form">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                      />
                      <div className="comment-actions">
                        <button 
                          className="cancel-btn"
                          onClick={() => {
                            setCommentingPost(null);
                            setNewComment('');
                          }}
                        >
                          Cancel
                        </button>
                        <button 
                          className="submit-btn"
                          onClick={() => handleComment(post._id)}
                          disabled={!newComment.trim()}
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {post.comments && post.comments.length > 0 && (
                    <div className="comments-list">
                      {post.comments.map((comment, index) => (
                        <div key={comment._id || index} className="comment">
                          <span className="comment-author">
                            {comment.author?.username || 'Unknown User'}
                          </span>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
