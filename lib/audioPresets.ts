export type Track = {
  id: string
  title: string
  url: string
}

export const AUDIO_PRESETS: Record<string, Track[]> = {
  Romantique: [
    { id: 'rom-1', title: '💖 Gymnopédie N°1 — Piano Doux & Romantique (Satie)', url: '/audio/romantique-1.mp3' },
    { id: 'rom-2', title: '🌹 Heartwarming — Mélodie Tendresse & Amour', url: '/audio/romantique-2.mp3' },
    { id: 'rom-3', title: '✨ Parting of the Ways — Cordes & Passion', url: '/audio/romantique-3.mp3' },
  ],
  Humoristique: [
    { id: 'hum-1', title: '🎪 Carefree — Joie, Rires & Bonne Humeur', url: '/audio/humoristique-1.mp3' },
    { id: 'hum-2', title: '😄 Scheming Weasel — Vif, Enjoué & Malicieux', url: '/audio/humoristique-2.mp3' },
    { id: 'hum-3', title: '😸 Fluffing a Duck — Comique & Drôle', url: '/audio/humoristique-3.mp3' },
  ],
  Poétique: [
    { id: 'poe-1', title: '🌙 Almost in F — Douceur & Nocturne Poétique', url: '/audio/poetique-1.mp3' },
    { id: 'poe-2', title: '🌸 Touching Moments — Rêverie Féerique', url: '/audio/poetique-2.mp3' },
    { id: 'poe-3', title: '🍃 Water Lily — Harmonie & Sérénité', url: '/audio/poetique-3.mp3' },
  ],
  Nostalgique: [
    { id: 'nos-1', title: '📷 Sad Trio — Souvenirs & Émotions d’Antan', url: '/audio/nostalgique-1.mp3' },
    { id: 'nos-2', title: '📜 Long Road Ahead — Voyage dans le Passé', url: '/audio/nostalgique-2.mp3' },
    { id: 'nos-3', title: '🍂 Autumn Day — Boîte à Musique & Mélancolie Douce', url: '/audio/nostalgique-3.mp3' },
  ],
  Émouvant: [
    { id: 'emo-1', title: '🥺 Heavy Heart — Piano Profond & Frissons', url: '/audio/emouvant-1.mp3' },
    { id: 'emo-2', title: '💧 Impromptu — Grandeur & Larmes d’Émotion', url: '/audio/emouvant-2.mp3' },
    { id: 'emo-3', title: '🌟 Loss & Reflection — Ballade Touchante', url: '/audio/emouvant-3.mp3' },
  ],
}

export function getRandomTrackForTone(tone: string): Track {
  const tracks = AUDIO_PRESETS[tone] || AUDIO_PRESETS['Romantique']
  const randomIndex = Math.floor(Math.random() * tracks.length)
  return tracks[randomIndex]
}
