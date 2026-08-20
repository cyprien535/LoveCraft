'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Heart, Lightbulb, Menu, QrCode, Sparkles, UserRound, X } from 'lucide-react'

const chapters = [
  { number: '01', title: 'L’étincelle', text: 'Tout commence par une envie simple : offrir plus qu’un cadeau, créer un souvenir qui ressemble vraiment à votre histoire.', quote: 'Les fleurs fanent, les chocolats se mangent… Je voulais créer un souvenir durable.', icon: Lightbulb },
  { number: '02', title: 'La création', text: 'Sur LoveCraft, chaque détail devient une attention. Un prénom, quelques mots, une couleur, une question que vous seuls pouvez comprendre.', quote: 'Une surprise pensée pour elle, avec tout ce que notre histoire a de plus précieux.', icon: Heart },
  { number: '03', title: 'La révélation', text: 'Un lien ou un QR code suffit. La personne entre son prénom, répond à votre question secrète et découvre votre message, au rythme de l’émotion.', quote: 'Un moment intime, interactif et entièrement créé pour une seule personne.', icon: QrCode },
  { number: '04', title: 'L’émotion', text: 'C’est ce moment suspendu qui nous inspire : celui où un message devient une expérience et où quelques mots restent longtemps.', quote: 'Les plus beaux souvenirs ne sont pas seulement racontés. Ils se vivent.', icon: Sparkles },
]

export default function StoryPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.story-animate').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="story-page">
      {/* Navigation */}
      <nav id="story-nav" className="story-nav">
        <Link href="/" className="brand">
          <span className="brand-mark"><Heart size={15} fill="currentColor" /></span>
          <span>LoveCraft</span>
        </Link>
        <div className={`story-links${menuOpen ? ' open' : ''}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link href="/#fonctionnalites" onClick={() => setMenuOpen(false)}>Fonctionnalités</Link>
          <Link href="/#tarifs" onClick={() => setMenuOpen(false)}>Tarifs</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link id="story-create-nav-btn" href="/" className="story-nav-cta">
            Créer une surprise <ArrowRight size={14} />
          </Link>
          <button id="story-menu-btn" className="story-menu" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="story-hero story-animate">
        <span className="eyebrow">Notre raison d’être</span>
        <h1>L’histoire qui a inspiré<br /><em>LoveCraft.</em></h1>
        <p>Comment une simple idée est devenue une aventure d’amour et de transmission.</p>
        <div className="story-divider">
          <span />
          <Heart size={16} fill="currentColor" />
          <span />
        </div>
      </header>

      {/* Timeline Chapters */}
      <section className="story-timeline" aria-label="L’histoire de LoveCraft">
        {chapters.map((chapter, index) => {
          const Icon = chapter.icon
          return (
            <article className={`story-chapter ${index % 2 ? 'chapter-alt' : ''} story-animate`} key={chapter.number}>
              <div className="story-marker">{chapter.number}</div>
              <div className="story-chapter-card">
                <div className="chapter-top">
                  <span className="chapter-label">Chapitre {chapter.number}</span>
                  <Icon size={22} />
                </div>
                <h2>{chapter.title}</h2>
                <p className="chapter-text">{chapter.text}</p>
                <blockquote>“{chapter.quote}”</blockquote>
                <span className="chapter-signature">— L’équipe LoveCraft</span>
              </div>
            </article>
          )
        })}
      </section>

      {/* CTA Box */}
      <section className="story-create story-animate">
        <div className="story-create-content">
          <div className="story-create-icon">
            <UserRound size={26} />
          </div>
          <span className="eyebrow" style={{ color: 'rgba(240,200,208,0.7)' }}>À votre tour</span>
          <h2>Créez votre propre<br /><em>histoire d’amour.</em></h2>
          <p>Comme toutes les belles histoires, la vôtre mérite un écrin unique. Transformez vos mots en un moment qu’on n’oublie pas.</p>
          <div className="story-create-actions">
            <Link id="story-cta-start" href="/" className="primary-btn">
              Commencer maintenant <ArrowRight size={15} />
            </Link>
            <Link id="story-cta-back" href="/" className="story-back-link">
              <ArrowLeft size={14} /> Retour à l’accueil
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="story-footer">
        <Link href="/" className="brand">
          <span className="brand-mark"><Heart size={14} fill="currentColor" /></span>
          <span>LoveCraft</span>
        </Link>
        <p>Des émotions à offrir, des souvenirs à garder.</p>
        <small>© 2026 LoveCraft · Site créé et développé par <a href="https://www.facebook.com/profile.php?id=61588131732811" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>MEVI Cyprien</a></small>
      </footer>
    </main>
  )
}
