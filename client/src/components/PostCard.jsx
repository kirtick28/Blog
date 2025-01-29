import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/PostCard.css';

const PostCard = ({ post, currentUserId, onLike }) => {
  const navigate = useNavigate();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;

    try {
      setIsLiking(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/posts/like/${post._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      onLike(post._id, response.data);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.warning(error.response.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          icon: "🚫"
        });
      } else {
        toast.error('Error liking post');
      }
    } finally {
      setIsLiking(false);
    }
  };

  const navigateToBlog = () => {
    navigate(`/blog/${post._id}`);
  };

  const isAuthor = post.author._id === currentUserId;

  return (
    <div className="post-card" onClick={navigateToBlog}>
      {post.image && (
        <div className="post-image">
          <img src={post.image} alt={post.title} />
        </div>
      )}
      
      <div className="post-content">
        <h2 className="post-title">{post.title}</h2>
        
        <div className="post-meta">
          <span className="post-author">By {post.author.username}</span>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        <div className="post-preview">
          {post.content.length > 150 
            ? `${post.content.substring(0, 150)}...` 
            : post.content}
        </div>

        <div className="post-actions" onClick={e => e.stopPropagation()}>
          <button 
            className={`like-button ${post.likes.includes(currentUserId) ? 'liked' : ''}`}
            onClick={handleLike}
            title={isAuthor ? "You can't like your own post" : ''}
          >
            <span className="like-icon">❤</span>
            <span className="like-count">{post.likes.length}</span>
          </button>

          <div className="comment-info">
            <span className="comment-icon">💬</span>
            <span className="comment-count">{post.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
