'use client'

import { useState, useEffect } from 'react'
import { messagesAPI } from '@/lib/api'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, read

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const response = await messagesAPI.getAll()
      setMessages(response.data.data)
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await messagesAPI.markAsRead(id)
      setMessages(messages.map(m => 
        m._id === id ? { ...m, read: true } : m
      ))
    } catch (error) {
      alert('Failed to mark as read')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      await messagesAPI.delete(id)
      setMessages(messages.filter(m => m._id !== id))
    } catch (error) {
      alert('Failed to delete message')
    }
  }

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.read
    if (filter === 'read') return m.read
    return true
  })

  if (loading) {
    return <div className="admin-loading">Loading messages...</div>
  }

  return (
    <div className="admin-messages">
      <div className="page-header">
        <h1>Contact Messages</h1>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All ({messages.length})
          </button>
          <button 
            className={filter === 'unread' ? 'active' : ''} 
            onClick={() => setFilter('unread')}
          >
            Unread ({messages.filter(m => !m.read).length})
          </button>
          <button 
            className={filter === 'read' ? 'active' : ''} 
            onClick={() => setFilter('read')}
          >
            Read ({messages.filter(m => m.read).length})
          </button>
        </div>
      </div>

      <div className="messages-list">
        {filteredMessages.map((message) => (
          <div key={message._id} className={`message-item ${message.read ? 'read' : 'unread'}`}>
            <div className="message-header">
              <div className="message-from">
                <strong>{message.name}</strong>
                <span>{message.email}</span>
              </div>
              <div className="message-date">
                {new Date(message.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="message-subject">
              <strong>Subject:</strong> {message.subject}
            </div>
            
            <div className="message-body">
              {message.message}
            </div>
            
            <div className="message-actions">
              {!message.read && (
                <button 
                  className="btn-mark-read"
                  onClick={() => handleMarkAsRead(message._id)}
                >
                  <i className="fas fa-check"></i> Mark as Read
                </button>
              )}
              <a 
                href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                className="btn-reply"
              >
                <i className="fas fa-reply"></i> Reply
              </a>
              <button 
                className="btn-delete"
                onClick={() => handleDelete(message._id)}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <h3>No messages</h3>
          <p>You don't have any {filter !== 'all' ? filter : ''} messages yet</p>
        </div>
      )}
    </div>
  )
}
