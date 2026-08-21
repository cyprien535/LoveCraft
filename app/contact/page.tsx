'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, ArrowLeft, Mail, Send, MessageSquare, Check, Sparkles } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 800)
  }

  return (
    <main className="story-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="story-nav">
        <Link href="/" className="brand">
          <span className="brand-mark"><Heart size={15} fill="currentColor" /></span>
          <span>LoveCraft</span>
        </Link>
        <div className="story-links">
          <Link href="/">Accueil</Link>
          <Link href="/story">Notre histoire</Link>
          <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact</Link>
        </div>
        <Link href="/" className="story-nav-cta">
          Créer une surprise
        </Link>
      </nav>

      <div style={{ maxWidth: 860, margin: '40px auto 80px', padding: '0 24px', flex: 1, width: '100%' }}>
        <div style={{ marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 20 }}>
            <ArrowLeft size={14} /> Retour à l'accueil
          </Link>
          <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageSquare size={14} /> Échange & Support
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--foreground)', marginTop: 8, marginBottom: 12 }}>
            Contactez-nous
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 15, maxWidth: 600 }}>
            Une question, une idée ou un retour sur votre expérience LoveCraft ? Notre équipe est à votre écoute pour vous accompagner.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {/* Form Card */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 24, padding: 'clamp(24px, 4vw, 36px)', boxShadow: 'var(--shadow-sm)' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#edf6f0', color: '#2e7d52', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Check size={32} />
                </div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--foreground)' }}>
                  Message envoyé avec succès !
                </h2>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 14, lineHeight: 1.6 }}>
                  Merci {name} pour votre message. Nous vous répondrons dans les plus brefs délais à l'adresse <strong>{email}</strong>.
                </p>
                <button
                  className="secondary-btn"
                  style={{ marginTop: 16 }}
                  onClick={() => { setSent(false); setMessage(''); setSubject(''); }}
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="field-label" htmlFor="contact-name">Votre nom ou prénom</label>
                  <input
                    id="contact-name"
                    required
                    className="text-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Camille"
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="contact-email">Votre adresse email</label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    className="text-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="vous@email.com"
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="contact-subject">Sujet</label>
                  <input
                    id="contact-subject"
                    className="text-input"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Ex: Question sur la création de surprise"
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="contact-message">Votre message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    className="text-input text-area"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Écrivez-nous vos questions, suggestions ou retours..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="primary-btn"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', marginTop: 8 }}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer mon message'} <Send size={15} />
                </button>
              </form>
            )}
          </div>

          {/* Info Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--primary)' }}>
                <Mail size={22} />
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, margin: 0, color: 'var(--foreground)' }}>
                  Support & Contact
                </h3>
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Pour toute demande d'assistance technique, partenariat ou information générale :
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
                <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>Email officiel :</span>
                <a href="mailto:support@lovecraft-app.com" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                  contact@lovecraft-app.com
                </a>
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={13} /> À propos de l'auteur
              </span>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, margin: 0, color: 'var(--foreground)' }}>
                Créé avec passion
              </h3>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                LoveCraft est conçu et développé par <strong>MEVI Cyprien</strong> avec l'ambition de réenchanter les déclarations d'amour numériques à travers le monde.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark"><Heart size={15} fill="currentColor" /></span>
              <span>LoveCraft</span>
            </div>
            <span>Des souvenirs, en mieux.</span>
          </div>
          <small>© 2026 LoveCraft · Site créé et développé par <a href="https://www.facebook.com/profile.php?id=61588131732811" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>MEVI Cyprien</a></small>
        </div>
      </footer>
    </main>
  )
}
