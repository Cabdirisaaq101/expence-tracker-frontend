import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/Profile.css";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export default function Profile() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/profile-pic", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchProfile();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      {profile ? (
        <div className="profile-content">
          <div className="profile-info">
            <div className="profile-field">
              <span className="field-label">Name:</span>
              <span className="field-value">{profile.name}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Email:</span>
              <span className="field-value">{profile.email}</span>
            </div>

            {profile.profileImage && (
              <div className="profile-image-container">
                <img
                  src={`http://localhost:5000${profile.profileImage}`}
                  alt="Profile"
                  className="profile-img"
                />
              </div>
            )}

            <div className="upload-section">
              <label htmlFor="profile-upload" className="upload-label">
                Choose Profile Picture
                <input 
                  id="profile-upload"
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="file-input"
                />
              </label>
              <button 
                onClick={handleUpload} 
                disabled={loading || !file}
                className={`upload-btn ${loading ? 'loading' : ''}`}
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>
              {file && (
                <span className="file-name">{file.name}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading profile...</p>
      )}
    </div>
  );
}