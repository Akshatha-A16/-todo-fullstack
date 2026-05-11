import { useState, useEffect } from 'react'
import axios from 'axios'
import './Todos.css'

const Todos = () => {
  const [text, setText] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchTodos()
  }, [])
// 
  const fetchTodos = async () => {
    try {
      const res = await axios.get('https://todo-fullstack-production-209e.up.railway.app/api/todos')
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!text.trim()) return
    setAdding(true)
    await axios.post('https://todo-fullstack-production-209e.up.railway.app/api/todos', {
      title: text,
      user_id: 1
    })
    setText('')
    setAdding(false)
    fetchTodos()
  }

  const deleteTodo = async (id) => {
    await axios.delete(`https://todo-fullstack-production-209e.up.railway.app/api/todos/${id}`)
    fetchTodos()
  }

  const toggleTodo = async (id) => {
    await axios.put(`https://todo-fullstack-production-209e.up.railway.app/api/todos/${id}`)
    fetchTodos()
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') addTodo()
  }

  const completed = data.filter(t => t.completed).length
  const total = data.length

  return (
    <div className="app">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="card">
        {/* Header */}
        <div className="header">
          <div className="header-top">
            <div className="logo">✦</div>
            <span className="tagline">stay focused</span>
          </div>
          <h1 className="title">My Tasks</h1>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{ width: total ? `${(completed / total) * 100}%` : '0%' }}
            />
          </div>
          <p className="progress-text">{completed} of {total} completed</p>
        </div>

        {/* Input */}
        <div className="input-row">
          <input
            className="todo-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="What needs to be done?"
          />
          <button className="add-btn" onClick={addTodo} disabled={adding}>
            {adding ? '...' : '+'}
          </button>
        </div>

        {/* List */}
        <div className="todo-list">
          {loading ? (
            <div className="empty">Loading...</div>
          ) : data.length === 0 ? (
            <div className="empty">
              <span>✦</span>
              <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            data.map((itm, i) => (
              <div
                className={`todo-item ${itm.completed ? 'done' : ''}`}
                key={itm.id}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <button
                  className="check-btn"
                  onClick={() => toggleTodo(itm.id)}
                >
                  {itm.completed ? '✓' : ''}
                </button>
                <span className="todo-title">{itm.title}</span>
                <button
                  className="del-btn"
                  onClick={() => deleteTodo(itm.id)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {data.length > 0 && (
          <div className="footer">
            <span>{data.filter(t => !t.completed).length} remaining</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Todos