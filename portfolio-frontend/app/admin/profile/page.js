'use client'

import { useState, useEffect } from 'react'
import { profileAPI } from '@/lib/api'

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    skills: {
      frontend: [],
      backend: [],
      tools: []
    },
    social: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await profileAPI.get()
      if (response.data.data) {
        setProfile(response.data.data)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      await profileAPI.update(profile)
      setMessage('Profile updated successfully!')
    } catch (error) {
      setMessage('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading profile...</div>
  }

  return (
    <div className="admin-profile">
      <div className="page-header">
        <h1>Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Title/Role</label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="Full Stack Developer"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Social Links</h2>
          <div className="form-row">
            <div className="form-group">
              <label><i className="fab fa-linkedin"></i> LinkedIn</label>
              <input
                type="url"
                value={profile.social.linkedin}
                onChange={(e) => setProfile({ 
                  ...profile, 
                  social: { ...profile.social, linkedin: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label><i className="fab fa-github"></i> GitHub</label>
              <input
                type="url"
                value={profile.social.github}
                onChange={(e) => setProfile({ 
                  ...profile, 
                  social: { ...profile.social, github: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><i className="fab fa-twitter"></i> Twitter</label>
              <input
                type="url"
                value={profile.social.twitter}
                onChange={(e) => setProfile({ 
                  ...profile, 
                  social: { ...profile.social, twitter: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label><i className="fab fa-instagram"></i> Instagram</label>
              <input
                type="url"
                value={profile.social.instagram}
                onChange={(e) => setProfile({ 
                  ...profile, 
                  social: { ...profile.social, instagram: e.target.value }
                })}
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={`form-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
