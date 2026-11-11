'use client'

import { useState, useEffect } from 'react'
import { projectsAPI } from '@/lib/api'
import ProjectForm from '@/components/admin/ProjectForm'
import { NotchedProjectCard } from '@/components/ui/notched-project-card'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll()
      setProjects(response.data.data || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project from MongoDB?')) return

    try {
      await projectsAPI.delete(id)
      setProjects((prev) => prev.filter((p) => p._id !== id))
    } catch (error) {
      alert('Failed to delete project: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProject(null)
    loadProjects()
  }

  const filteredProjects = projects.filter((p) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.technologies?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-spinner"></div>
        <p>Loading projects from MongoDB...</p>
      </div>
    )
  }

  return (
    <div className="admin-projects">
      <div className="page-header" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
            Manage Projects
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            Total {projects.length} showcases in MongoDB · Click the notch arrow on any card to edit
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditingProject(null)
            setShowForm(true)
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 600
          }}
        >
          <i className="fas fa-plus"></i> Add New Project
        </button>
      </div>

      {/* Search / Filter Bar */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <i
            className="fas fa-search"
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}
          ></i>
          <input
            type="text"
            placeholder="Search projects or technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.6rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: 'white',
              fontSize: '0.9rem'
            }}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
          Showing {filteredProjects.length} of {projects.length}
        </span>
      </div>

      {showForm && (
        <ProjectForm 
          project={editingProject} 
          onClose={handleFormClose} 
        />
      )}

      {/* Beautiful Notched Project Cards Grid */}
      <div className="notched-projects-grid">
        {filteredProjects.map((project) => (
          <NotchedProjectCard
            key={project._id}
            title={project.title}
            description={project.description}
            image={project.image}
            badge={project.featured ? '⭐ Featured' : (project.technologies?.[0] || 'Project')}
            tags={project.technologies || []}
            surface="#ffffff"
            accent="#2563eb"
            accentForeground="#ffffff"
            onEdit={() => handleEdit(project)}
            onDelete={() => handleDelete(project._id)}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="empty-state" style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '1.5rem' }}>
          <i className="fas fa-folder-open" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }}></i>
          <h3 style={{ fontSize: '1.25rem', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
            {searchQuery ? 'No matching projects found' : 'No projects yet'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.25rem 0' }}>
            {searchQuery ? 'Try clearing your search term' : 'Click the button above to add your first project to MongoDB'}
          </p>
          {searchQuery && (
            <button
              className="btn"
              onClick={() => setSearchQuery('')}
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px' }}
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  )
}
