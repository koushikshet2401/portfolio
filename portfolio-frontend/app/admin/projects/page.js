'use client'

import { useState, useEffect } from 'react'
import { projectsAPI } from '@/lib/api'
import ProjectForm from '@/components/admin/ProjectForm'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll()
      setProjects(response.data.data)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await projectsAPI.delete(id)
      setProjects(projects.filter(p => p._id !== id))
    } catch (error) {
      alert('Failed to delete project')
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

  if (loading) {
    return <div className="admin-loading">Loading projects...</div>
  }

  return (
    <div className="admin-projects">
      <div className="page-header">
        <h1>Manage Projects</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus"></i> Add New Project
        </button>
      </div>

      {showForm && (
        <ProjectForm 
          project={editingProject} 
          onClose={handleFormClose} 
        />
      )}

      <div className="projects-list">
        {projects.map((project) => (
          <div key={project._id} className="project-item">
            <img src={project.image} alt={project.title} />
            <div className="project-details">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-list">
                {project.technologies.map((tech, idx) => (
                  <span key={idx}>{tech}</span>
                ))}
              </div>
            </div>
            <div className="project-actions">
              <button onClick={() => handleEdit(project)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button onClick={() => handleDelete(project._id)}>
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-folder-open"></i>
          <h3>No projects yet</h3>
          <p>Click the button above to add your first project</p>
        </div>
      )}
    </div>
  )
}
