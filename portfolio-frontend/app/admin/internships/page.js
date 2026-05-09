'use client'

import { useState, useEffect } from 'react'
import { internshipsAPI } from '@/lib/api'
import InternshipForm from '@/components/admin/InternshipForm'

export default function AdminInternships() {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingInternship, setEditingInternship] = useState(null)

  useEffect(() => {
    loadInternships()
  }, [])

  const loadInternships = async () => {
    try {
      const response = await internshipsAPI.getAll()
      setInternships(response.data.data)
    } catch (error) {
      console.error('Failed to load internships:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this internship entry?')) return

    try {
      await internshipsAPI.delete(id)
      setInternships(internships.filter(i => i._id !== id))
    } catch (error) {
      alert('Failed to delete internship')
    }
  }

  const handleEdit = (internship) => {
    setEditingInternship(internship)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingInternship(null)
    loadInternships()
  }

  if (loading) {
    return <div className="admin-loading">Loading internships...</div>
  }

  return (
    <div className="admin-projects">
      <div className="page-header">
        <h1>Manage Internships & Experiences</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus"></i> Add New Internship
        </button>
      </div>

      {showForm && (
        <InternshipForm 
          internship={editingInternship} 
          onClose={handleFormClose} 
        />
      )}

      <div className="projects-list">
        {internships.map((internship) => (
          <div key={internship._id} className="project-item">
            <div className="project-details" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{internship.title}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 500 }}>{internship.duration}</span>
              </div>
              <h4 style={{ margin: '4px 0 12px 0', color: 'var(--text-secondary)', fontWeight: 600 }}>{internship.company}</h4>
              
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Desktop Version:</strong>
                <p style={{ margin: '4px 0 8px 0', fontSize: '0.9rem', lineHeight: '1.4' }}>{internship.descriptionDesktop}</p>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Mobile Version:</strong>
                <p style={{ margin: '4px 0 8px 0', fontSize: '0.9rem', lineHeight: '1.4' }}>{internship.descriptionMobile}</p>
              </div>

              <div className="tech-list" style={{ marginTop: '12px' }}>
                {internship.technologies.map((tech, idx) => (
                  <span key={idx}>{tech}</span>
                ))}
              </div>
            </div>
            <div className="project-actions" style={{ marginLeft: '24px' }}>
              <button onClick={() => handleEdit(internship)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button onClick={() => handleDelete(internship._id)}>
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {internships.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-briefcase"></i>
          <h3>No internships yet</h3>
          <p>Click the button above to add your first internship/experience</p>
        </div>
      )}
    </div>
  )
}
