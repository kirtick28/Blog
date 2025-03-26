import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const currentUser = localStorage.getItem('username');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/feed`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_BASE_URL}/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts(); // Refresh posts to update likes
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_BASE_URL}/posts/${postId}/comment`, 
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setComment('');
      setActiveCommentPost(null);
      fetchPosts(); // Refresh posts to show new comment
    } catch (error) {
      console.error('Error commenting:', error);
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
    <div className="feed-container">
      <h1>Latest Posts</h1>
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
                <div className="author-info">
                  {post.author.profilePic && (
                    <img 
                      src={post.author.profilePic} 
                      alt={post.author.username}
                      className="author-pic"
                    />
                  )}
                  <span>{post.author.username}</span>
                </div>
                <span className="post-date">{formatDate(post.createdAt)}</span>
              </div>
              
              <div className="post-actions">
                {post.author.username !== currentUser && (
                  <button 
                    className={`like-btn ${post.likes.includes(currentUser) ? 'liked' : ''}`}
                    onClick={() => handleLike(post._id)}
                  >
                    ❤ {post.likes.length}
                  </button>
                )}
                <button 
                  className="comment-btn"
                  onClick={() => setActiveCommentPost(post._id)}
                >
                  💬 {post.comments.length}
                </button>
              </div>

              {activeCommentPost === post._id && (
                <div className="comment-form">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                  />
                  <button onClick={() => handleComment(post._id)}>
                    Post Comment
                  </button>
                </div>
              )}

              {post.comments.length > 0 && (
                <div className="comments-section">
                  <h3>Comments</h3>
                  {post.comments.map((comment, index) => (
                    <div key={index} className="comment">
                      <div className="comment-author">
                        {comment.user.profilePic && (
                          <img 
                            src={comment.user.profilePic} 
                            alt={comment.user.username}
                            className="comment-author-pic"
                          />
                        )}
                        <span>{comment.user.username}</span>
                      </div>
                      <p>{comment.content}</p>
                      <span className="comment-date">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
