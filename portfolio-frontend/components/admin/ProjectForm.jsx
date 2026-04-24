'use client'

import { useState, useEffect } from 'react'
import { projectsAPI } from '@/lib/api'

export default function ProjectForm({ project, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    githubLink: '',
    liveLink: '',
    technologies: [],
    order: 0
  })
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData(project)
    }
  }, [project])

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const handleRemoveTech = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (project) {
        await projectsAPI.update(project._id, formData)
      } else {
        await projectsAPI.create(formData)
      }
      onClose()
    } catch (error) {
      alert('Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{project ? 'Edit Project' : 'Add New Project'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub Link</label>
              <input
                type="url"
                value={formData.githubLink}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                placeholder="https://github.com/username/repo"
                required
              />
            </div>
            <div className="form-group">
              <label>Live Link (Optional)</label>
              <input
                type="url"
                value={formData.liveLink}
                onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                placeholder="https://project.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Technologies</label>
            <div className="tech-input-group">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                placeholder="e.g., React, Node.js"
              />
              <button type="button" onClick={handleAddTech}>Add</button>
            </div>
            <div className="tech-list">
              {formData.technologies.map((tech, idx) => (
                <span key={idx} className="tech-tag">
                  {tech}
                  <button type="button" onClick={() => handleRemoveTech(tech)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
