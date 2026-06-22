import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { chatService, jobService } from '../../services/services'
import useAuthStore from '../../store/authStore'

export default function Chat() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [job, setJob] = useState(null)
  const stompRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    // Load history
    jobService.getJobById(jobId).then(r => setJob(r.data))
    chatService.getMessages(jobId).then(r => setMessages(r.data))

    // WebSocket connection
    const token = localStorage.getItem('homzy_token')
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        client.subscribe(`/topic/job/${jobId}`, msg => {
          const m = JSON.parse(msg.body)
          setMessages(prev => [...prev, m])
        })
      },
    })
    client.activate()
    stompRef.current = client
    return () => client.deactivate()
  }, [jobId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !stompRef.current?.connected) return
    stompRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ jobId: Number(jobId), content: input.trim() }),
    })
    setInput('')
  }

  return (
    <div className="container py-4" style={{maxWidth:'640px'}}>
      <div className="d-flex align-items-center gap-2 mb-3">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div>
          <div className="fw-semibold">{job?.workerName || 'Job Chat'}</div>
          <div className="text-muted small">{job?.title}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="card border-0 shadow-sm p-3 mb-3"
        style={{borderRadius:'16px', minHeight:'400px', maxHeight:'500px', overflowY:'auto'}}>
        {messages.length === 0 && (
          <p className="text-center text-muted small my-auto pt-4">No messages yet. Start the conversation!</p>
        )}
        <div className="d-flex flex-column gap-2">
          {messages.map((m, i) => {
            const isMe = m.sender === user?.name
            return (
              <div key={i} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                <div>
                  {!isMe && <div className="text-muted small mb-1">{m.sender}</div>}
                  <div className={`p-2 px-3 ${isMe ? 'bubble-client' : 'bubble-worker'}`}
                    style={{maxWidth:'300px', display:'inline-block'}}>
                    {m.content}
                  </div>
                  <div className={`text-muted small mt-1 ${isMe?'text-end':''}`}>
                    {m.sentAt ? new Date(m.sentAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : ''}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef}></div>
        </div>
      </div>

      {/* Input */}
      <div className="d-flex gap-2">
        <input className="form-control" placeholder="Type a message..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()} />
        <button className="btn btn-homzy px-4" onClick={sendMessage}>
          <i className="bi bi-send"></i>
        </button>
      </div>
    </div>
  )
}
