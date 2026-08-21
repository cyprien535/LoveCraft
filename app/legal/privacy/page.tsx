import Link from 'next/link'
import { Heart, ArrowLeft, ShieldCheck, Lock } from 'lucide-react'

export const metadata = {
  title: "Politique de confidentialité",
  description: "Politique de protection des données et de confidentialité de LoveCraft."
}

export default function PrivacyPage() {
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
          <Link href="/contact">Contact</Link>
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
            <ShieldCheck size={14} /> Données & Vie Privée
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--foreground)', marginTop: 8, marginBottom: 12 }}>
            Politique de Confidentialité
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>
            Dernière mise à jour : 21 août 2026
          </p>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 24, padding: 'clamp(24px, 5vw, 48px)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 32, lineHeight: 1.7, fontSize: 15, color: 'var(--foreground)' }}>
          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              1. Notre engagement pour votre vie privée
            </h2>
            <p>
              Chez LoveCraft, nous savons que les messages, souvenirs et déclarations que vous partagez sont précieux et intimes. Nous nous engageons à protéger vos données personnelles avec le plus haut niveau de sécurité et de discrétion.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              2. Données collectées
            </h2>
            <p>Nous collectons uniquement les informations nécessaires au bon fonctionnement de la plateforme :</p>
            <ul style={{ paddingLeft: 24, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>Informations de compte :</strong> Votre adresse email et identifiant d'authentification (via Supabase Auth / Google OAuth).</li>
              <li><strong>Contenus des surprises :</strong> Noms/prénoms du destinataire et de l'expéditeur, messages secrets, questions secrètes, réponses de déverrouillage, photos et choix musicaux.</li>
              <li><strong>Statistiques techniques anonymisées :</strong> Nombre de vues de vos surprises et dates de création.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              3. Protection des messages & Row Level Security (RLS)
            </h2>
            <p>
              Vos données sont stockées de façon sécurisée sur notre infrastructure PostgreSQL avec politique de sécurité au niveau des lignes (<strong>Row Level Security</strong>). Seul le créateur connecté a accès à l'édition et à la gestion de ses surprises. Les surprises publiées ne sont accessibles publiquement que via leur lien chiffré unique (slug) et après résolution de la question secrète.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              4. Partage de données
            </h2>
            <p>
              Nous ne vendons, ne louons et ne cédons <strong>aucune donnée personnelle</strong> à des tiers à des fins publicitaires ou commerciales.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              5. Vos droits (RGPD)
            </h2>
            <p>
              Conformément à la réglementation sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification, de suppression de vos données ou de suppression complète de votre compte à tout moment. Vous pouvez supprimer vos surprises directement depuis votre tableau de bord.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--primary)', marginBottom: 12 }}>
              6. Nous contacter
            </h2>
            <p>
              Pour toute question relative à vos données, contactez notre délégué à la protection des données via notre <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>formulaire de contact</Link>.
            </p>
          </section>
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
