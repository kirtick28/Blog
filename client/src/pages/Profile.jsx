import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
      instagram: ''
    },
    profilePicture: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData({
        username: response.data.username || '',
        email: response.data.email || '',
        bio: response.data.bio || '',
        location: response.data.location || '',
        socialLinks: {
          twitter: response.data.socialLinks?.twitter || '',
          linkedin: response.data.socialLinks?.linkedin || '',
          github: response.data.socialLinks?.github || '',
          instagram: response.data.socialLinks?.instagram || ''
        },
        profilePicture: response.data.profilePicture || ''
      });
      setLoading(false);
    } catch (error) {
      toast.error('Error loading profile');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social-')) {
      const platform = name.split('-')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setUser(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-picture">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.username} />
          ) : (
            <i className="fas fa-user"></i>
          )}
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="join-date">
            Joined {new Date(user.joinedDate).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
        <button 
          className="edit-profile-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <i className="fas fa-times"></i>
              Cancel
            </>
          ) : (
            <>
              <i className="fas fa-edit"></i>
              Edit Profile
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Your location"
            />
          </div>

          <div className="form-group">
            <label>Profile Picture URL</label>
            <input
              type="text"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleInputChange}
              placeholder="URL to your profile picture"
            />
          </div>

          <div className="social-links-form">
            <h3>Social Links</h3>
            <div className="form-group">
              <label><i className="fab fa-twitter"></i> Twitter</label>
              <input
                type="text"
                name="social-twitter"
                value={formData.socialLinks.twitter}
                onChange={handleInputChange}
                placeholder="Twitter profile URL"
              />
            </div>

            <div className="form-group">
              <label><i className="fab fa-linkedin"></i> LinkedIn</label>
              <input
                type="text"
                name="social-linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleInputChange}
                placeholder="LinkedIn profile URL"
              />
            </div>

            <div className="form-group">
              <label><i className="fab fa-github"></i> GitHub</label>
              <input
                type="text"
                name="social-github"
                value={formData.socialLinks.github}
                onChange={handleInputChange}
                placeholder="GitHub profile URL"
              />
            </div>

            <div className="form-group">
              <label><i className="fab fa-instagram"></i> Instagram</label>
              <input
                type="text"
                name="social-instagram"
                value={formData.socialLinks.instagram}
                onChange={handleInputChange}
                placeholder="Instagram profile URL"
              />
            </div>
          </div>

          <button type="submit" className="save-btn">
            <i className="fas fa-save"></i>
            Save Changes
          </button>
        </form>
      ) : (
        <div className="profile-details">
          <div className="detail-section">
            <h3><i className="fas fa-info-circle"></i> About</h3>
            <p>{user.bio || 'No bio added yet'}</p>
          </div>

          <div className="detail-section">
            <h3><i className="fas fa-map-marker-alt"></i> Location</h3>
            <p>{user.location || 'No location added'}</p>
          </div>

          <div className="detail-section">
            <h3><i className="fas fa-link"></i> Social Links</h3>
            <div className="social-links">
              {user.socialLinks?.twitter && (
                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
              )}
              {user.socialLinks?.linkedin && (
                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i>
                </a>
              )}
              {user.socialLinks?.github && (
                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i>
                </a>
              )}
              {user.socialLinks?.instagram && (
                <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {!Object.values(user.socialLinks || {}).some(link => link) && (
                <p className="no-links">No social links added</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
