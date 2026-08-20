'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Heart, Lock, Sparkles, Music, Image as ImageIcon, Calendar, Volume2, Play, Pause, Gift, Smile, User, PartyPopper, Cake, Star, Download, Share2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function Reveal({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = createClient()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [slug, setSlug] = useState('')
  const [item, setItem] = useState<any>(null)
  const [answer, setAnswer] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)
  const [isLockedByDate, setIsLockedByDate] = useState(false)

  useEffect(() => {
    params.then(p => {
      setSlug(p.slug)
      supabase.rpc('get_public_surprise', { surprise_slug: p.slug }).single().then(({ data }) => {
        setItem(data)
        setLoading(false)
        if (data?.unlock_date) {
          checkCountdown(data.unlock_date)
        }
      })
    })
  }, [])

  // Countdown timer effect
  useEffect(() => {
    if (!item?.unlock_date) return
    const interval = setInterval(() => {
      checkCountdown(item.unlock_date)
    }, 1000)
    return () => clearInterval(interval)
  }, [item?.unlock_date])

  function checkCountdown(targetIsoDate: string) {
    const diff = new Date(targetIsoDate).getTime() - new Date().getTime()
    if (diff <= 0) {
      setIsLockedByDate(false)
      setTimeLeft(null)
    } else {
      setIsLockedByDate(true)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      setTimeLeft({ days, hours, minutes, seconds })
    }
  }

  const startAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true)
      }).catch(err => {
        console.log('Autoplay restriction:', err)
        setIsPlayingMusic(false)
      })
    }
  }

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (isPlayingMusic) {
      audioRef.current.pause()
      setIsPlayingMusic(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true)
      }).catch(err => console.log('Audio play error:', err))
    }
  }

  async function unlock() {
    if (!answer.trim()) return setError('Veuillez entrer une réponse.')
    setError('')
    const { data: correct, error: verifyError } = await supabase.rpc('verify_surprise_answer', {
      surprise_slug: slug,
      provided_answer: answer.trim()
    })

    if (verifyError || !correct) {
      return setError('Ce n’est pas la bonne réponse. Réessayez doucement.')
    }

    // Déclencher la musique ICI directement dans le gestionnaire de clic (geste utilisateur direct)
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true)
      }).catch(() => {
        setIsPlayingMusic(false)
      })
    }

    setUnlocked(true)
    await supabase.rpc('record_surprise_view', { surprise_slug: slug })
  }

  // Générateur d'Image Carte Souvenir HTML5 Canvas — Taille dynamique
  function downloadSouvenirCardImage() {
    if (!item) return

    const W = 1080
    const pad = 100
    const cardPad = 80
    const maxTextW = 760

    // Pré-calcul : découper le message en lignes pour déterminer la taille de police adaptée
    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = W
    tmpCanvas.height = 100
    const tmpCtx = tmpCanvas.getContext('2d')!

    // Adapter la taille du texte : plus le message est long, plus la police diminue
    const msgLen = item.message.length
    let fontSize = msgLen < 100 ? 42 : msgLen < 250 ? 36 : msgLen < 500 ? 30 : 26
    let lineHeight = Math.round(fontSize * 1.55)

    tmpCtx.font = `italic ${fontSize}px serif`
    const words = item.message.split(' ')
    const lines: string[] = []
    let currentLine = ''
    for (const w of words) {
      const testLine = currentLine ? currentLine + ' ' + w : w
      if (tmpCtx.measureText(testLine).width > maxTextW) {
        lines.push(currentLine)
        currentLine = w
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) lines.push(currentLine)

    // Hauteurs dynamiques
    const headerH = 280          // Pour, Titre, Sender
    const msgBoxPad = 60         // Padding intérieur du cadre message
    const msgContentH = lines.length * lineHeight + msgBoxPad * 2
    const footerH = 90           // Filigrane uniquement
    const cardH = headerH + msgContentH + footerH
    const H = cardH + pad * 2 + 20

    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    // 1. Fond Dégradé
    const grad = ctx.createLinearGradient(0, 0, W, H)
    if (item.theme === 'lavender') {
      grad.addColorStop(0, '#f2f0f9'); grad.addColorStop(0.5, '#6b6b9d'); grad.addColorStop(1, '#2d1929')
    } else if (item.theme === 'peach') {
      grad.addColorStop(0, '#fdf4ee'); grad.addColorStop(0.5, '#b8705f'); grad.addColorStop(1, '#2d1929')
    } else {
      grad.addColorStop(0, '#fdf0f3'); grad.addColorStop(0.5, '#8f3b5a'); grad.addColorStop(1, '#2d1929')
    }
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // 2. Carte Blanche
    ctx.save()
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0,0,0,0.25)'
    ctx.shadowBlur = 40
    ctx.shadowOffsetY = 20
    ctx.beginPath()
    ctx.roundRect(cardPad, pad, W - cardPad * 2, cardH, 36)
    ctx.fill()
    ctx.restore()

    // 3. En-tête
    const cX = W / 2
    let y = pad + 60

    ctx.fillStyle = '#8a7078'
    ctx.font = 'bold 28px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`POUR ${item.recipient.toUpperCase()}`, cX, y)
    y += 70

    ctx.fillStyle = '#2d1929'
    ctx.font = 'bold 56px serif'
    ctx.fillText(item.title.length > 30 ? item.title.slice(0, 30) + '…' : item.title, cX, y)
    y += 60

    ctx.fillStyle = '#9c3d5a'
    ctx.font = 'bold 30px sans-serif'
    ctx.fillText(`De la part de ${item.sender} ♥`, cX, y)
    y += 60

    // 4. Encadré Message Secret
    const msgBoxY = y
    const msgBoxW = W - cardPad * 2 - 80
    ctx.fillStyle = '#f7eff2'
    ctx.beginPath()
    ctx.roundRect((W - msgBoxW) / 2, msgBoxY, msgBoxW, msgContentH, 24)
    ctx.fill()

    // 5. Texte du message — CENTRÉ
    ctx.fillStyle = '#2d1929'
    ctx.font = `italic ${fontSize}px serif`
    ctx.textAlign = 'center'
    const textStartY = msgBoxY + msgBoxPad + fontSize

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], cX, textStartY + i * lineHeight)
    }

    // 6. Filigrane LoveCraft
    const footerY = msgBoxY + msgContentH + 50
    ctx.fillStyle = '#8a7078'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Créé avec ❤ sur LoveCraft', cX, footerY)

    // Téléchargement
    const link = document.createElement('a')
    link.download = `souvenir-lovecraft-${item.recipient}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // Dynamic particle symbols based on Occasion & Tone
  const getParticleSymbols = (occ?: string, tone?: string) => {
    const syms: string[] = []
    if (occ === 'Anniversaire') syms.push('🎂', '🎈', '🎉', '🎁', '✨')
    else if (occ === 'Saint-Valentin' || occ === 'Demande en mariage' || occ === 'Déclaration') syms.push('♥', '💖', '🌹', '💍', '✨')
    else if (occ === 'Réconciliation') syms.push('🕊️', '🤝', '🤍', '✨')
    else syms.push('✨', '💫', '♥')

    if (tone === 'Humoristique') syms.push('😂', '🥳', '😜', '🚀')
    else if (tone === 'Poétique') syms.push('🌸', '⭐', '🌙', '🍃')
    else if (tone === 'Émouvant') syms.push('🥺', '💓', '🌟', '💌')
    else if (tone === 'Nostalgique') syms.push('📷', '⏳', '📜', '🍂')
    else syms.push('♥', '💖', '✨')

    return syms
  }

  if (loading) {
    return (
      <main className="reveal-page">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, color: 'var(--muted-foreground)' }}>
          <Sparkles size={28} className="animate-spin" style={{ animationDuration: '3s' }} />
          <p>Chargement de votre surprise...</p>
        </div>
      </main>
    )
  }

  if (!item) {
    return (
      <main className="reveal-page">
        <div className="reveal-card" style={{ maxWidth: 440 }}>
          <div className="reveal-icon">
            <Sparkles size={28} />
          </div>
          <h1>Oups...</h1>
          <p>Cette surprise n’est pas disponible ou le lien est inexistant.</p>
        </div>
      </main>
    )
  }

  const particles = getParticleSymbols(item.occasion, item.tone)
  const photosList = item.photos ? item.photos.split(',').map((p: string) => p.trim()).filter(Boolean) : []
  const isBirthday = item.occasion === 'Anniversaire'
  const isHumorous = item.tone === 'Humoristique'

  return (
    <main className={`reveal-page ${item.theme || 'rose'}`}>
      {/* Préchargement Audio universel */}
      {item.music_url && (
        <audio ref={audioRef} loop src={item.music_url} preload="auto" />
      )}

      {/* Bandeau Promo LoveCraft — Haut */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          maxWidth: '92%',
          padding: '7px 16px',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          borderRadius: 99,
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--foreground)',
          textDecoration: 'none',
          marginBottom: 16,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          transition: 'transform 0.2s'
        }}
      >
        <Heart size={13} fill="var(--primary)" color="var(--primary)" />
        <span>Créez votre surprise sur <strong style={{ color: 'var(--primary)' }}>LoveCraft</strong></span>
        <ArrowRight size={13} style={{ color: 'var(--primary)' }} />
      </Link>

      {/* Dynamic Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          className="reveal-particle"
          style={{
            left: `${5 + i * 8}%`,
            animationDelay: `${(i % 5) * 1.1}s`,
            animationDuration: `${6 + (i % 4) * 2}s`,
            fontSize: `${18 + (i % 3) * 6}px`
          }}
        >
          {particles[i % particles.length]}
        </span>
      ))}

      <div className={`reveal-card ${isHumorous ? 'animate-bounce-slow' : ''}`}>
        {/* Badges Occasion & Ton */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
          {item.occasion && (
            <span className="badge-pill">
              {isBirthday ? <Cake size={12} /> : <Gift size={12} />} {item.occasion}
            </span>
          )}
          {item.tone && (
            <span className="badge-pill" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
              <Smile size={12} /> {item.tone}
            </span>
          )}
        </div>

        <span className="eyebrow">Une surprise pour {item.recipient}</span>

        {/* CONDITION 1: Locked by Countdown Date */}
        {isLockedByDate && timeLeft ? (
          <div style={{ margin: '24px 0' }}>
            <div className="reveal-icon">
              <Calendar size={28} />
            </div>
            <h1>Surprise en préparation...</h1>
            <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>
              Cette surprise sera déverrouillée le{' '}
              <strong>{new Date(item.unlock_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>.
            </p>

            <div className="countdown-box">
              <div className="countdown-unit">
                <div className="countdown-num">{timeLeft.days}</div>
                <div className="countdown-lbl">Jours</div>
              </div>
              <div className="countdown-unit">
                <div className="countdown-num">{timeLeft.hours}</div>
                <div className="countdown-lbl">Heures</div>
              </div>
              <div className="countdown-unit">
                <div className="countdown-num">{timeLeft.minutes}</div>
                <div className="countdown-lbl">Minutes</div>
              </div>
              <div className="countdown-unit">
                <div className="countdown-num">{timeLeft.seconds}</div>
                <div className="countdown-lbl">Sec</div>
              </div>
            </div>
          </div>
        ) : !envelopeOpen ? (
          /* CONDITION 2: Interactive 3D Envelope */
          <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', textAlign: 'center' }}>
            <h1>Un courrier spécial<br /><em>pour vous.</em></h1>
            <p>Cliquez sur l'enveloppe ci-dessous pour ouvrir votre surprise.</p>

            <div className="envelope-container" onClick={() => setEnvelopeOpen(true)}>
              <div className={`envelope ${envelopeOpen ? 'open' : ''}`}>
                <div className="envelope-flap" />
                <div className="envelope-seal">
                  {isBirthday ? <Cake size={20} /> : <Heart size={20} fill="currentColor" />}
                </div>
                <div className="envelope-text">
                  Pour <strong>{item.recipient}</strong>
                </div>
              </div>
            </div>
          </div>
        ) : !unlocked ? (
          /* CONDITION 3: Secret Question */
          <>
            <div className="reveal-icon">
              <Lock size={26} />
            </div>
            <h1>Une histoire a été créée<br /><em>juste pour vous.</em></h1>
            <p>Répondez à cette question secrète pour découvrir le message qui vous attend.</p>

            <div style={{ margin: '20px 0 6px', textAlign: 'left' }}>
              <label className="field-label" style={{ fontSize: 13, color: 'var(--foreground)' }}>
                {item.question}
              </label>
              <input
                id="answer-input"
                className="text-input"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && unlock()}
                placeholder="Votre réponse..."
                autoFocus
              />
            </div>

            {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

            <button id="unlock-btn" className="primary-btn" onClick={unlock}>
              Découvrir ma surprise {isBirthday ? <PartyPopper size={16} /> : <Heart size={16} fill="currentColor" />}
            </button>
          </>
        ) : (
          /* CONDITION 4: Unlocked Secret Message + Author + Audio Player + Export Image */
          <>
            <div className="reveal-icon" style={{ background: 'var(--primary)', color: 'white' }}>
              {isBirthday ? <Cake size={30} /> : <Heart size={30} fill="currentColor" />}
            </div>

            <h1>{item.title}</h1>

            {/* Author attribution banner */}
            <div style={{
              margin: '16px 0 24px',
              padding: '12px 18px',
              background: 'var(--secondary)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              fontSize: 13,
              color: 'var(--foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}>
              <User size={16} style={{ color: 'var(--primary)' }} />
              <span>Cette surprise vous est offerte par <strong>{item.sender}</strong> ♥</span>
            </div>

            {/* Bouton musique discret flottant */}
            {item.music_url && (
              <button
                onClick={toggleAudio}
                title={isPlayingMusic ? 'Couper la musique' : 'Activer la musique'}
                style={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  zIndex: 999,
                  opacity: isPlayingMusic ? 1 : 0.7,
                  transition: 'opacity 0.3s, transform 0.2s',
                }}
              >
                {isPlayingMusic ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
              </button>
            )}

            {/* Secret Message Card */}
            <div className="message-card">
              <p>{item.message}</p>
            </div>

            {/* Photo Gallery */}
            {photosList.length > 0 && (
              <div style={{ margin: '24px 0', textAlign: 'left' }}>
                <span className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ImageIcon size={14} /> Galerie de souvenirs ({photosList.length})
                </span>
                <div className="photo-gallery-grid">
                  {photosList.map((url: string, idx: number) => (
                    <div key={idx} className="photo-item">
                      <img src={url} alt={`Souvenir ${idx + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton de téléchargement de la Carte Souvenir en Image (PNG) */}
            <div style={{ margin: '24px 0 16px' }}>
              <button
                className="secondary-btn"
                style={{ width: '100%', justifyContent: 'center', padding: '14px 20px' }}
                onClick={downloadSouvenirCardImage}
              >
                <Download size={16} /> Télécharger ma carte souvenir (Image PNG) 📸
              </button>
            </div>

            <span className="reveal-signature">Avec tout l'amour de <strong>{item.sender}</strong> ♥</span>
          </>
        )}
      </div>

    </main>
  )
}
