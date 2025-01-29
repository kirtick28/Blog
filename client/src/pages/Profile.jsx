import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    profilePic: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedProfile(prev => ({
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
        editedProfile,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          'http://localhost:5000/api/users/profile-picture',
          { profilePic: reader.result },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProfile(prev => ({ ...prev, profilePic: response.data.profilePic }));
        setEditedProfile(prev => ({ ...prev, profilePic: response.data.profilePic }));
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic-container">
          <img 
            src={profile.profilePic || 'https://via.placeholder.com/150'} 
            alt={profile.username}
            className="profile-pic"
          />
          {isEditing && (
            <div className="profile-pic-overlay">
              <label htmlFor="profile-pic-upload" className="upload-btn">
                Change Photo
              </label>
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p>{profile.bio || 'No bio yet'}</p>
        </div>
        {!isEditing && (
          <button className="edit-btn" onClick={handleEdit}>
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={editedProfile.username || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={editedProfile.email || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={editedProfile.bio || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={editedProfile.location || ''}
              onChange={handleChange}
            />
          </div>
          <div className="social-links">
            <h3>Social Links</h3>
            <div className="form-group">
              <label>Twitter</label>
              <input
                type="url"
                name="socialLinks.twitter"
                value={editedProfile.socialLinks?.twitter || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="url"
                name="socialLinks.linkedin"
                value={editedProfile.socialLinks?.linkedin || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>GitHub</label>
              <input
                type="url"
                name="socialLinks.github"
                value={editedProfile.socialLinks?.github || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="detail-section">
            <h3>About</h3>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Location:</strong> {profile.location || 'Not specified'}</p>
          </div>
          {profile.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
            <div className="detail-section">
              <h3>Social Links</h3>
              {profile.socialLinks.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {profile.socialLinks.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
