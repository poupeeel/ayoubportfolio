import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Hero3D from './components/Hero3D'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import SERVER_HOST from './config'
import './App.css'

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    subject: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState('idle') // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('')

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch(`${SERVER_HOST}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus('success')
        setFormData({ name: '', email: '', telephone: '', subject: '', message: '' })
      } else {
        setFormStatus('error')
        setErrorMessage(data.error || 'Failed to submit form')
      }
    } catch (error) {
      setFormStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const services = [
    {
      icon: '💡',
      title: 'Consulting & Technical Advice',
      description: 'Expert technical consultation to help you make informed decisions about your projects. I provide guidance on technology stacks, architecture design, best practices, and digital transformation strategies tailored to your business needs.'
    },
    {
      icon: '📱',
      title: 'Mobile App Development',
      description: 'Professional mobile app development for iOS and Android platforms. I create native and cross-platform applications that deliver exceptional user experiences, with focus on performance, security, and scalability.'
    },
    {
      icon: '💻',
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies like React, Node.js, and more. From landing pages to complex web platforms, I deliver responsive, performant, and user-friendly solutions.'
    },
    {
      icon: '🎨',
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive user interfaces designed with your users in mind. I create engaging user experiences through careful research, wireframing, prototyping, and visual design that converts visitors into customers.'
    },
    {
      icon: '📱',
      title: 'Social Media Management',
      description: 'Complete management of your social media presence. I create engaging content, manage posting schedules, grow your audience, and build meaningful relationships with your followers across all major platforms.'
    },
    {
      icon: '📊',
      title: 'Ads & Advertising',
      description: 'Strategic advertising campaigns to boost your brand visibility and drive results. I manage Google Ads, social media advertising, and pay-per-click campaigns optimized for maximum ROI and conversions.'
    }
  ]

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            {/* Navigation */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
              <div className="nav-container">
                <a href="#" className="logo">
                  <span className="logo-text">Ayoub</span>
                  <span className="logo-gold">Portfolio</span>
                </a>
                <ul className="nav-links">
                  <li><a href="#home">Home</a></li>
                  <li><a href="#projects">Projects</a></li>
                  <li><a href="#services">Services</a></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
                <a href="#contact" className="cta-button">Let's Talk</a>
              </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="hero">
              <Hero3D />
              <div className="hero-content">
                <div className="hero-badge">Meet Ayoub Boubalgha</div>
                <h1 className="hero-title">
                  Expert <span className="gold-text">Developer</span> & <span className="gold-text">Entrepreneur</span>
                </h1>
                <p className="hero-subtitle">
                  With 5+ years of experience, I specialize in building high-performance, secure, 
                  and AI-powered digital solutions. From complex booking systems to sensitive data platforms, 
                  I deliver excellence that transforms businesses.
                </p>
                <div className="hero-buttons">
                  <a href="#services" className="btn btn-primary">View My Services</a>
                  <a href="#contact" className="btn btn-outline">Get In Touch</a>
                </div>
                <div className="hero-stats">
                  <div className="stat">
                    <span className="stat-number">5+</span>
                    <span className="stat-label">Years Experience</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Projects Completed</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">30+</span>
                    <span className="stat-label">Happy Clients</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Services Section */}
            <section id="services" className="services">
              <div className="container">
                <div className="section-header">
                  <span className="section-tag">My Services</span>
                  <h2 className="section-title">What I <span className="gold-text">Offer</span></h2>
                  <p className="section-subtitle">
                    Comprehensive development solutions tailored to bring your vision to life
                  </p>
                </div>
                <div className="services-grid">
                  {services.map((service, index) => (
                    <div 
                      key={index} 
                      className="service-card"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="service-icon">{service.icon}</div>
                      <h3 className="service-title">{service.title}</h3>
                      <p className="service-description">{service.description}</p>
                      <a href="#contact" className="service-link">
                        Learn More 
                        <span className="arrow">→</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="projects">
              <div className="container">
                <div className="section-header">
                  <span className="section-tag">Featured Work</span>
                  <h2 className="section-title">Recent <span className="gold-text">Projects</span></h2>
                  <p className="section-subtitle">
                    Explore some of my latest work and successful implementations
                  </p>
                </div>
                <div className="projects-grid">
                  <a href="https://www.masterfut.com/" target="_blank" rel="noopener noreferrer" className="project-card">
                    <div className="project-image">
                      <img src="https://placehold.co/600x400/1a1a1a/D4AF37?text=MasterFut" alt="MasterFut" />
                    </div>
                    <div className="project-overlay">
                      <div className="project-content">
                        <h3>MasterFut</h3>
                        <p>Plateforme de vente et achat de EA FC 26</p>
                      </div>
                    </div>
                  </a>
                  <a href="https://ka3ba.com/" target="_blank" rel="noopener noreferrer" className="project-card">
                    <div className="project-image">
                      <img src="https://placehold.co/600x400/1a1a1a/D4AF37?text=Ka3ba" alt="Ka3ba" />
                    </div>
                    <div className="project-overlay">
                      <div className="project-content">
                        <h3>Ka3ba</h3>
                        <p>Plateforme pour agences de voyages</p>
                      </div>
                    </div>
                  </a>
                  <a href="https://aligarage.site/" target="_blank" rel="noopener noreferrer" className="project-card">
                    <div className="project-image">
                      <img src="https://placehold.co/600x400/1a1a1a/D4AF37?text=AliGarage" alt="AliGarage" />
                    </div>
                    <div className="project-overlay">
                      <div className="project-content">
                        <h3>AliGarage</h3>
                        <p>Système de gestion interne garage</p>
                      </div>
                    </div>
                  </a>
                  <a href="https://new.almoulateimmobilier.com/" target="_blank" rel="noopener noreferrer" className="project-card">
                    <div className="project-image">
                      <img src="https://placehold.co/600x400/1a1a1a/D4AF37?text=AlMoulate" alt="AlMoulate" />
                    </div>
                    <div className="project-overlay">
                      <div className="project-content">
                        <h3>AlMoulate Immobilier</h3>
                        <p>Gestion interne entreprise immobilier</p>
                      </div>
                    </div>
                  </a>
                  <a href="https://martinacar.com/" target="_blank" rel="noopener noreferrer" className="project-card">
                    <div className="project-image">
                      <img src="https://placehold.co/600x400/1a1a1a/D4AF37?text=MartinaCar" alt="MartinaCar" />
                    </div>
                    <div className="project-overlay">
                      <div className="project-content">
                        <h3>MartinaCar</h3>
                        <p>Gestion agence de location de voiture</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="projects-more">
                  <p className="more-projects-text">And many more successful projects delivered...</p>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="about">
              <div className="container">
                <div className="about-content">
                  <div className="about-text">
                    <span className="section-tag">About Me</span>
                    <h2 className="section-title">
                      Expert Developer & <span className="gold-text">Entrepreneur</span>
                    </h2>
                    <p className="about-description">
                      I'm <strong>Ayoub Boubalgha</strong>, an expert developer and entrepreneur with 5+ years 
                      of experience crafting cutting-edge digital solutions. I specialize in building 
                      high-performance, secure applications using the latest technologies and integrating 
                      powerful AI solutions to drive business transformation.
                    </p>
                    <p className="about-description">
                      I've successfully delivered <strong>critical projects</strong> including:
                    </p>
                    <ul className="about-projects">
                      <li>🏛️ <strong>Saudi Palace of Tangier</strong> - Comprehensive management system</li>
                      <li>🧠 <strong>Psycho-Neurology Data Systems</strong> - Sensitive healthcare data platforms</li>
                      <li>🛒 <strong>E-Commerce Platforms</strong> - Advanced booking, reservation & payment gateway integrations</li>
                    </ul>
                    <p className="about-description">
                      My commitment to excellence, security, and performance has earned me the trust of 
                      numerous satisfied clients. I don't just build websites – I create powerful digital 
                      experiences that help businesses grow and succeed.
                    </p>
                    <div className="about-skills">
                      <div className="skill-tag">React</div>
                      <div className="skill-tag">Node.js</div>
                      <div className="skill-tag">TypeScript</div>
                      <div className="skill-tag">Python</div>
                      <div className="skill-tag">AI/ML</div>
                      <div className="skill-tag">AWS</div>
                      <div className="skill-tag">Security</div>
                      <div className="skill-tag">Payment Gateways</div>
                    </div>
                    <a href="#contact" className="btn btn-primary">Let's Work Together</a>
                  </div>
                  <div className="about-visual">
                    <div className="visual-box">
                      <div className="visual-inner">
                        <span className="visual-icon">💼</span>
                        <span className="visual-text">Ayoub Boubalgha</span>
                        <span className="visual-subtext">Expert Developer & Entrepreneur</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact">
              <div className="container">
                <div className="section-header">
                  <span className="section-tag">Get In Touch</span>
                  <h2 className="section-title">
                    Let's <span className="gold-text">Connect</span>
                  </h2>
                  <p className="section-subtitle">
                    Have a project in mind? Let's discuss how I can help bring your vision to life.
                  </p>
                </div>
                {formStatus === 'success' ? (
                  <div className="form-success">
                    <div className="success-icon">✓</div>
                    <h3>Thank You!</h3>
                    <p>Your message has been sent successfully. I'll get back to you soon!</p>
                    <button 
                      className="btn btn-outline" 
                      onClick={() => setFormStatus('idle')}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form className="contact-form" onSubmit={handleSubmit}>
                    {formStatus === 'error' && (
                      <div className="form-error">
                        <span className="error-icon">⚠</span>
                        {errorMessage}
                      </div>
                    )}
                    <div className="form-row">
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name" 
                        className="form-input" 
                        required 
                      />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email" 
                        className="form-input" 
                        required 
                      />
                    </div>
                    <input 
                      type="tel" 
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Your Phone Number" 
                      className="form-input" 
                    />
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject" 
                      className="form-input" 
                      required 
                    />
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message" 
                      rows="5" 
                      className="form-input"
                      required
                    ></textarea>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={formStatus === 'submitting'}
                    >
                      {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* Footer */}
            <footer className="footer">
              <div className="container">
                <div className="footer-content">
                  <div className="footer-brand">
                    <a href="#" className="logo">
                      <span className="logo-text">Ayoub</span>
                      <span className="logo-gold">Portfolio</span>
                    </a>
                    <p>Creating digital experiences that matter.</p>
                  </div>
                  <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                      <li><a href="#home">Home</a></li>
                      <li><a href="#services">Services</a></li>
                      <li><a href="#about">About</a></li>
                      <li><a href="#contact">Contact</a></li>
                    </ul>
                  </div>
                  <div className="footer-social">
                    <h4>Follow Me</h4>
                    <div className="social-icons">
                      {/* <a href="#" className="social-icon">GH</a> */}
                      <a href="https://www.linkedin.com/in/ayoub-boubalgha-b55434244" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="linkedin-icon">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                      {/* <a href="#" className="social-icon">TW</a> */}
                    </div>
                  </div>
                </div>
                <div className="footer-bottom">
                  <p>© 2026 AyoubPortfolio. All rights reserved.</p>
                </div>
              </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <a 
              href="https://wa.me/212682726527?text=i%20m%20visitor%20coming%20from%20your%20portfolio%20website%20and%20i%20want%20to%20get%20in%20touch%20with%20you" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="whatsapp-float"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="whatsapp-icon">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        } />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
