export interface FreeSessionFlyer {
  id: string;
  flyerNumber: number;
  title: string;
  titleSinhala?: string;
  theme: string;
  speakerName: string;
  speakerTitle: string;
  speakerQualifications: string[];
  date: string;
  time: string;
  platform: string;
  contactNumber: string;
  topics: string[];
  description: string;
  accentColor: string;
  bgGradient: string;
  badgeText: string;
  posterSvgUrl: string;
}

// Generate high-resolution SVG data-URI posters for each of the 8 Free Session Flyers
export function generateSessionPosterSvg(session: {
  flyerNumber: number;
  title: string;
  titleSinhala?: string;
  subtitle?: string;
  speakerName: string;
  speakerTitle: string;
  speakerQualifications: string[];
  date: string;
  time: string;
  platform: string;
  contactNumber: string;
  highlights: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  themeQuote?: string;
}): string {
  const {
    title,
    titleSinhala,
    subtitle,
    speakerName,
    speakerTitle,
    speakerQualifications,
    date,
    time,
    platform,
    contactNumber,
    highlights,
    primaryColor,
    secondaryColor,
    accentColor,
    themeQuote
  } = session;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="60%" stop-color="${secondaryColor}"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="50%" stop-color="#fef08a"/>
        <stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.7"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.4"/>
      </filter>
    </defs>

    <!-- Background Canvas -->
    <rect width="800" height="1200" fill="url(#bgGrad)"/>
    
    <!-- Decorative Circular Ornaments -->
    <circle cx="700" cy="150" r="220" fill="${accentColor}" fill-opacity="0.08"/>
    <circle cx="100" cy="950" r="260" fill="${accentColor}" fill-opacity="0.05"/>
    <circle cx="400" cy="600" r="350" fill="#ffffff" fill-opacity="0.02"/>

    <!-- Decorative Top Wave Frame -->
    <path d="M 0 0 L 800 0 L 800 160 Q 400 220 0 160 Z" fill="#030712" fill-opacity="0.5"/>

    <!-- HELPING HEARTS LOGO EMBLEM -->
    <g transform="translate(400, 95)" text-anchor="middle">
      <circle cx="0" cy="0" r="45" fill="#ffffff" filter="url(#dropShadow)"/>
      <circle cx="0" cy="0" r="41" fill="#f8fafc" stroke="#059669" stroke-width="3"/>
      <!-- Heart and Hands Symbol in Center -->
      <path d="M -15 -5 C -15 -18 0 -18 0 -5 C 0 -18 15 -18 15 -5 C 15 10 0 20 0 20 C 0 20 -15 10 -15 -5 Z" fill="#ef4444"/>
      <path d="M -22 5 C -20 18 -5 26 0 26 C 5 26 20 18 22 5" fill="none" stroke="#059669" stroke-width="4" stroke-linecap="round"/>
      <text y="58" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="900" fill="#ffffff" letter-spacing="3">HELPING HEARTS</text>
      <text y="72" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" fill="#94a3b8" letter-spacing="2">COUNSELLING &amp; WELLNESS CENTRE</text>
    </g>

    <!-- FREE SESSION PROMO RIBBON -->
    <g transform="translate(400, 205)">
      <rect x="-170" y="-18" width="340" height="36" rx="18" fill="url(#goldGrad)" filter="url(#dropShadow)"/>
      <text text-anchor="middle" y="6" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="900" fill="#0f172a" letter-spacing="3">★ FREE COMMUNITY WORKSHOP ★</text>
    </g>

    <!-- THEME MOTTO / QUOTE -->
    ${themeQuote ? `
    <g transform="translate(400, 275)" text-anchor="middle">
      <text font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="800" fill="#38bdf8" font-style="italic" letter-spacing="1">“${themeQuote}”</text>
    </g>` : ''}

    <!-- MAIN TOPIC TITLE BOX -->
    <g transform="translate(400, ${themeQuote ? 340 : 310})" text-anchor="middle">
      ${titleSinhala ? `
      <text font-family="system-ui, 'Noto Sans Sinhala', sans-serif" font-size="28" font-weight="900" fill="#ffffff" filter="url(#glow)">${titleSinhala}</text>
      <text y="42" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="900" fill="url(#goldGrad)">${title}</text>
      ` : `
      <text font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" fill="url(#goldGrad)">${title}</text>
      `}
      ${subtitle ? `<text y="${titleSinhala ? 72 : 36}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#cbd5e1">${subtitle}</text>` : ''}
    </g>

    <!-- RESOURCE PERSON PROFILE CARD -->
    <g transform="translate(60, 440)">
      <rect width="680" height="360" rx="24" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" filter="url(#dropShadow)"/>

      <!-- Speaker Avatar Circle -->
      <g transform="translate(100, 100)">
        <circle cx="0" cy="0" r="65" fill="#0f172a" stroke="${accentColor}" stroke-width="4" filter="url(#glow)"/>
        <circle cx="0" cy="0" r="58" fill="#1e293b"/>
        <!-- Stylized Icon/Silhouette -->
        <path d="M 0 -22 A 18 18 0 1 0 0 14 A 18 18 0 1 0 0 -22 Z M -32 44 C -32 25 -18 20 0 20 C 18 20 32 25 32 44 Z" fill="${accentColor}" fill-opacity="0.85"/>
      </g>

      <!-- Speaker Info Header -->
      <g transform="translate(195, 55)">
        <text font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="#f59e0b" letter-spacing="2" text-transform="uppercase">RESOURCE PERSON / TRAINER</text>
        <text y="30" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="900" fill="#ffffff">${speakerName}</text>
        <text y="52" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="${accentColor}">${speakerTitle}</text>
      </g>

      <!-- Divider line -->
      <line x1="40" y1="180" x2="640" y2="180" stroke="rgba(255,255,255,0.15)" stroke-dasharray="4 4"/>

      <!-- Qualifications List -->
      <g transform="translate(40, 210)">
        <text font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="#94a3b8" letter-spacing="1">PROFESSIONAL CREDENTIALS &amp; QUALIFICATIONS:</text>
        ${speakerQualifications.slice(0, 4).map((q, idx) => `
          <g transform="translate(0, ${24 + idx * 24})">
            <circle cx="6" cy="-4" r="3.5" fill="${accentColor}"/>
            <text x="18" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0">${q.length > 70 ? q.slice(0, 68) + '...' : q}</text>
          </g>
        `).join('')}
      </g>
    </g>

    <!-- KEY WORKSHOP HIGHLIGHTS / PILL BADGES -->
    <g transform="translate(60, 825)">
      <rect width="680" height="135" rx="20" fill="#0f172a" fill-opacity="0.8" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <text x="24" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="900" fill="#fbbf24" letter-spacing="1">KEY FOCUS &amp; LEARNING HIGHLIGHTS:</text>
      
      <g transform="translate(24, 60)">
        ${highlights.map((hl, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const x = col * 320;
          const y = row * 32;
          return `
            <g transform="translate(${x}, ${y})">
              <rect width="305" height="26" rx="8" fill="#1e293b" stroke="rgba(255,255,255,0.08)"/>
              <text x="12" y="17" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1">✔ ${hl}</text>
            </g>
          `;
        }).join('')}
      </g>
    </g>

    <!-- EVENT METRICS FOOTER (DATE, TIME, PLATFORM, CONTACT) -->
    <g transform="translate(60, 985)">
      <!-- Date Box -->
      <g transform="translate(0, 0)">
        <rect width="155" height="105" rx="16" fill="#1e293b" stroke="${accentColor}" stroke-width="1.5"/>
        <text x="77" y="28" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="#94a3b8">📅 DATE</text>
        <text x="77" y="62" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="900" fill="#ffffff">${date}</text>
        <text x="77" y="85" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" fill="#38bdf8">FREE ENTRY</text>
      </g>

      <!-- Time Box -->
      <g transform="translate(170, 0)">
        <rect width="165" height="105" rx="16" fill="#1e293b" stroke="rgba(255,255,255,0.15)"/>
        <text x="82" y="28" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="#94a3b8">⏰ TIME</text>
        <text x="82" y="62" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="900" fill="#ffffff">${time}</text>
        <text x="82" y="85" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" fill="#a7f3d0">SRI LANKA TIME</text>
      </g>

      <!-- Platform Box -->
      <g transform="translate(350, 0)">
        <rect width="155" height="105" rx="16" fill="#1e293b" stroke="rgba(255,255,255,0.15)"/>
        <text x="77" y="28" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="#94a3b8">💻 PLATFORM</text>
        <text x="77" y="62" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="900" fill="#38bdf8">${platform}</text>
        <text x="77" y="85" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" fill="#94a3b8">Online Live</text>
      </g>

      <!-- Contact Box -->
      <g transform="translate(520, 0)">
        <rect width="160" height="105" rx="16" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
        <text x="80" y="28" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="#a7f3d0">📞 INQUIRIES</text>
        <text x="80" y="62" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="900" fill="#ffffff">${contactNumber}</text>
        <text x="80" y="85" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" fill="#6ee7b7">CALL / WHATSAPP</text>
      </g>
    </g>

    <!-- BOTTOM BANNER -->
    <g transform="translate(400, 1145)" text-anchor="middle">
      <rect x="-340" y="-20" width="680" height="40" rx="20" fill="url(#goldGrad)"/>
      <text y="7" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="#020617" letter-spacing="2">JOIN WITH US • EVERYONE IS WELCOME • TOTALLY FREE</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const freeSessionsData: FreeSessionFlyer[] = [
  {
    id: 'fs-flyer-1',
    flyerNumber: 1,
    title: 'Mind Strong Body Fit: Group Counselling & Sport Psychology Activities',
    titleSinhala: 'කාණ්ඩායම් උපදේශනයේ දී භාවිතා කළ හැකි ක්‍රියාකාරකම්',
    theme: 'Sport Psychology & Mental Fitness',
    speakerName: 'Chathurdika Thilakarathna',
    speakerTitle: 'Professional Counselor & Psychotherapist | Sport Psychology Counselor',
    speakerQualifications: [
      'MA, BA — University of Kelaniya',
      'Professional Counselor & Psychotherapist',
      'Sport Psychology Counselor & Physical Fitness Instructor',
      'National Athlete (Long Jump | Triple Jump) & Retired Member of Sri Lanka Air Force'
    ],
    date: 'April 29',
    time: '8:00 PM – 9:30 PM',
    platform: 'Zoom Online',
    contactNumber: '074 234 4251',
    topics: [
      'Mindset, Mental Strength & High Performance',
      'Interactive Group Counselling Activities',
      'Physical Fitness & Mental Wellness Synergy',
      'Athletic Stress Management & Goal Achievement'
    ],
    description: 'A transformative session exploring experiential group counselling activities, sports psychological conditioning, and cultivating peak mindset and bodily fitness.',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
    badgeText: 'Mind Strong & Body Fit',
    posterSvgUrl: generateSessionPosterSvg({
      flyerNumber: 1,
      title: 'Group Counselling & Sport Psychology Activities',
      titleSinhala: 'කාණ්ඩායම් උපදේශනයේ දී භාවිතා කළ හැකි ක්‍රියාකාරකම්',
      themeQuote: 'MIND STRONG • BODY FIT • PERFORMANCE AT ITS BEST',
      speakerName: 'Chathurdika Thilakarathna',
      speakerTitle: 'Professional Counselor & Sport Psychology Specialist',
      speakerQualifications: [
        'MA, BA - University of Kelaniya',
        'Professional Counselor & Psychotherapist',
        'Sport Psychology Counselor & Physical Fitness Instructor',
        'National Athlete & Retired Member of Sri Lanka Air Force'
      ],
      date: 'April 29',
      time: '8.00 PM - 9.30 PM',
      platform: 'Online Zoom',
      contactNumber: '074 234 4251',
      highlights: [
        'Mindset & Mental Toughness',
        'Group Counseling Techniques',
        'Athletic Conditioning',
        'Transform Your Life & Win'
      ],
      primaryColor: '#064e3b',
      secondaryColor: '#0f172a',
      accentColor: '#10b981'
    })
  },
  {
    id: 'fs-flyer-2',
    flyerNumber: 2,
    title: 'Sexually Transmitted Infections (STIs): Awareness, Medical & Psychological Care',
    titleSinhala: 'ලිංගිකව සම්ප්‍රේෂණය වන ආසාදන (STIs) හා මානසික සුවතාවය',
    theme: 'Clinical Health & Counseling',
    speakerName: 'J. Ruwan Pushpakumara',
    speakerTitle: 'Psychological Counselor & Clinical Emergency Healthcare Specialist',
    speakerQualifications: [
      'BSc in Psychology (NUTS) & HDip in Psychology',
      'Diploma in Nursing (KDU) & Diploma in Psy & Counseling',
      'Diploma in Sports & Exercise Science (UOP)',
      'Cert. in Emergency & Triage Management (NHSL) & BLS Trainer'
    ],
    date: 'July 20',
    time: '9:00 PM – 10:30 PM',
    platform: 'Zoom Online',
    contactNumber: '074 234 4251',
    topics: [
      'Understanding STI Transmission & Prevention',
      'Psychological Coping, Anxiety & Destigmatization',
      'Emergency Care & Clinical Support Pathways',
      'Art Therapy & Patient Empowerment'
    ],
    description: 'An evidence-based clinical awareness session addressing STI prevention, destigmatizing sexual health discussions, and offering supportive psychological counselling.',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-950 via-slate-900 to-slate-950',
    badgeText: 'Health & Clinical Care',
    posterSvgUrl: generateSessionPosterSvg({
      flyerNumber: 2,
      title: 'Sexually Transmitted Infections (STIs)',
      titleSinhala: 'ලිංගිකව සම්ප්‍රේෂණය වන ආසාදන (STIs) හා සෞඛ්‍ය දැනුවත්භාවය',
      themeQuote: 'CLINICAL CARE • AWARENESS • COMPASSIONATE PSYCHOLOGICAL SUPPORT',
      speakerName: 'J. Ruwan Pushpakumara',
      speakerTitle: 'BSc in Psychology | Dip in Nursing (KDU) | BLS Trainer',
      speakerQualifications: [
        'BSc in Psychology (NUTS) & HDip in Psychology',
        'Dip in Nursing (KDU) & Dip in Sports Science (UOP)',
        'Cert. in Emergency & Triage Management (NHSL)',
        'Cert. in Art Therapy & Advance Life Support'
      ],
      date: 'July 20',
      time: '9.00 PM - 10.30 PM',
      platform: 'Zoom Online',
      contactNumber: '074 234 4251',
      highlights: [
        'STI Facts & Prevention',
        'Psychological Resilience',
        'Emergency Medical Guidance',
        'Overcoming Health Anxiety'
      ],
      primaryColor: '#0c4a6e',
      secondaryColor: '#0f172a',
      accentColor: '#38bdf8'
    })
  },
  {
    id: 'fs-flyer-3',
    flyerNumber: 3,
    title: 'Building Unshakeable Resilience: Overcoming Daily Life Challenges',
    titleSinhala: 'අභියෝග හමුවේ නොසැලෙන ජීවිතයක්: එදිනෙදා ගැටලු ජයගනිමින් සාර්ථක වන මාවත',
    theme: 'Resilience & Buddhist Philosophy',
    speakerName: 'පූජ්‍ය බණ්ඩාරවෙල රතනසාර හිමි (Ven. Bandarawela Rathanasara Thero)',
    speakerTitle: 'ලේකම් - ශ්‍රී ලංකා ප්‍රාවීන භාෂෝපකාර සමාගම | සහකාර අධ්‍යාපන අධ්‍යක්ෂ',
    speakerQualifications: [
      'ලේකම් — ශ්‍රී ලංකා ප්‍රාවීන භාෂෝපකාර සමාගම',
      'සහකාර අධ්‍යාපන අධ්‍යක්ෂ — අධ්‍යාපන, උසස් අධ්‍යාපන සහ වෘත්තීය අධ්‍යාපන අමාත්‍යාංශය (ඉසුරුපාය, බත්තරමුල්ල)',
      'ජ්‍යෙෂ්ඨ දේශක හා මානසික සංවර්ධන උපදේශක'
    ],
    date: 'July 16',
    time: '9:00 PM – 10:30 PM',
    platform: 'Zoom Online',
    contactNumber: '074 234 4251',
    topics: [
      'Navigating Modern Daily Crises & Mental Stress',
      'Building Mental Fortitude Through Wisdom',
      'Educational & Professional Mindset Growth',
      'Practical Buddhist Psychological Insights'
    ],
    description: 'An uplifting workshop on cultivating inner stability and unshakeable resilience against life stresses, led by respected educational director Ven. Bandarawela Rathanasara Thero.',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
    badgeText: 'Inner Resilience & Wisdom',
    posterSvgUrl: generateSessionPosterSvg({
      flyerNumber: 3,
      title: 'Building Unshakeable Life Resilience',
      titleSinhala: 'අභියෝග හමුවේ නොසැලෙන ජීවිතයක්',
      subtitle: 'එදිනෙදා ගැටලු ජයගනිමින් සාර්ථක වන මාවත',
      themeQuote: 'STRENGTH THROUGH CHALLENGES • MINDFUL PATHWAYS TO SUCCESS',
      speakerName: 'පූජ්‍ය බණ්ඩාරවෙල රතනසාර හිමි',
      speakerTitle: 'සහකාර අධ්‍යාපන අධ්‍යක්ෂ | ලේකම් - ප්‍රාවීන භාෂෝපකාර සමාගම',
      speakerQualifications: [
        'සහකාර අධ්‍යාපන අධ්‍යක්ෂ (අධ්‍යාපන අමාත්‍යාංශය, ඉසුරුපාය)',
        'ලේකම් - ශ්‍රී ලංකා ප්‍රාවීන භාෂෝපකාර සමාගම',
        'ප්‍රවීණ දේශක හා මනෝවිද්‍යාත්මක මඟපෙන්වන්නා'
      ],
      date: 'July 16',
      time: '9.00 PM - 10.30 PM',
      platform: 'Zoom Online',
      contactNumber: '074 234 4251',
      highlights: [
        'Overcoming Hardships',
        'Mental Balance & Clarity',
        'Academic & Career Growth',
        'Buddhist Life Guidance'
      ],
      primaryColor: '#78350f',
      secondaryColor: '#0f172a',
      accentColor: '#fbbf24'
    })
  },
  {
    id: 'fs-flyer-4',
    flyerNumber: 4,
    title: '5 Mindfulness Steps to Freedom from Distressing Thoughts',
    titleSinhala: 'පීඩාකාරී සිතුවිලිවලින් නිදහස් වීමට අවශ්‍ය සතිමත් බවට පියවර 5ක්',
    theme: 'Mindfulness & Cognitive Liberation',
    speakerName: 'පූජ්‍ය පැපිලියානේ ආර්යදේව රතන හිමි (Ven. Pepiliyane Aryadeva Rathana Thero)',
    speakerTitle: 'ගාල්ල ගිණිමැල්ලගහ ආර්ය විහාරය බෞද්ධ මධ්‍යස්ථානාධිපති | ත්‍රිපිටකාචාර්ය',
    speakerQualifications: [
      'ගාල්ල ගිණිමැල්ලගහ ආර්ය විහාරය බෞද්ධ මධ්‍යස්ථානාධිපති',
      'ත්‍රිපිටකාචාර්ය සද්ධර්ම විශාරද ශාස්ත්‍රපති',
      'Diploma in Psychology and Counselling'
    ],
    date: 'June 10',
    time: '9:00 PM',
    platform: 'Zoom Online',
    contactNumber: '074 234 4251',
    topics: [
      'Identifying Intrusive & Anxious Thought Loops',
      '5 Core Steps of Sati (Mindfulness) Grounding',
      'Releasing Emotional Agitation & Overthinking',
      'Compassionate Self-Care & Inner Peace'
    ],
    description: 'Learn 5 practical mindfulness steps to dissolve chronic overthinking, anxiety, and obsessive worry into deep mental stillness and serenity.',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
    badgeText: '5-Step Mindfulness',
    posterSvgUrl: generateSessionPosterSvg({
      flyerNumber: 4,
      title: '5 Mindfulness Steps to Freedom from Distressing Thoughts',
      titleSinhala: 'පීඩාකාරී සිතුවිලිවලින් නිදහස් වීමට සතිමත් බවට පියවර 5ක්',
      themeQuote: 'CALM THE MIND • RELEASE AGITATION • DISCOVER INNER FREEDOM',
      speakerName: 'පූජ්‍ය පැපිලියානේ ආර්යදේව රතන හිමි',
      speakerTitle: 'ගාල්ල ගිණිමැල්ලගහ ආර්ය විහාරාධිපති | Dip in Psychology & Counselling',
      speakerQualifications: [
        'ගාල්ල ගිණිමැල්ලගහ ආර්ය විහාරය බෞද්ධ මධ්‍යස්ථානාධිපති',
        'ත්‍රිපිටකාචාර්ය සද්ධර්ම විශාරද ශාස්ත්‍රපති',
        'Diploma in Psychology & Counselling'
      ],
      date: 'June 10',
      time: '9.00 PM Onwards',
      platform: 'Zoom Online',
      contactNumber: '074 234 4251',
      highlights: [
        '5 Steps of Mindful Awareness',
        'Overcoming Overthinking',
        'Anxiety & Stress Dissolution',
        'Meditation for Emotional Balance'
      ],
      primaryColor: '#064e3b',
      secondaryColor: '#0f172a',
      accentColor: '#34d399'
    })
  },
  {
    id: 'fs-flyer-5',
    flyerNumber: 5,
    title: 'Nada Yoga: Mental Wellness Through Sound Alchemy',
    titleSinhala: 'නාද යෝග: නාද චිකිත්සාව තුළින් මානසික සුවතාවය',
    theme: 'Sound Healing & Acoustic Therapy',
    speakerName: 'Prashani Abeydeera',
    speakerTitle: 'Certified Sound Healing Practitioner (India) | NLP Master Practitioner',
    speakerQualifications: [
      'Sound Healing Practitioner (India) & Sound Acoustic Facilitator',
      'NLP Master Practitioner & NLP Master Timeline Practitioner',
      'Master Hypnosis Practitioner & Certified Transformation Coach',
      'Lifetime Member of NLP Association of Excellence'
    ],
    date: '25th Thursday',
    time: '9:00 PM – 10:30 PM',
    platform: 'Zoom Online',
    contactNumber: '074 234 4251',
    topics: [
      'Vibrational Frequency & Brainwave Modulation',
      'Sound Alchemy for Deep Trauma & Anxiety Relief',
      'Somatic Relaxation with Tibetan Singing Bowls',
      'NLP Timeline Integration for Emotional Wellness'
    ],
    description: 'An experiential voyage into acoustic sound therapy, exploring Nada Yoga frequencies, therapeutic vibrations, and nervous system recalibration.',
    accentColor: '#f472b6',
    bgGradient: 'from-pink-950 via-slate-900 to-slate-950',
    badgeText: 'Sound Alchemy & Nada Yoga',
    posterSvgUrl: generateSessionPosterSvg({
      flyerNumber: 5,
      title: 'Nada Yoga: Mental Wellness Through Sound Alchemy',
      titleSinhala: 'නාද යෝග හා නාද චිකිත්සාව තුළින් මානසික සුවය',
      themeQuote: 'HARMONIZE FREQUENCIES • CALM NERVOUS TENSION • SOUND ALCHEMY',
      speakerName: 'Prashani Abeydeera',
      speakerTitle: 'Sound Healing Practitioner (India) | NLP Master Practitioner',
      speakerQualifications: [
        'Sound Healing Practitioner (India) & Acoustic Facilitator',
        'NLP Master Practitioner & Master Timeline Practitioner',
        'Master Hypnosis Practitioner & Transformation Coach',
        'Lifetime Member of NLP Association of Excellence'
      ],
      date: 'Thursday 25th',
      time: '9.00 PM - 10.30 PM',
      platform: 'Zoom Online',
      contactNumber: '074 234 4251',
      highlights: [
        'Vibrational Acoustic Healing',
        'Nada Yoga Sound Principles',
        'Deep Nervous System Reset',
        'Hypnotic Emotional Wellness'
      ],
      primaryColor: '#831843',
      secondaryColor: '#0f172a',
      accentColor: '#f472b6'
    })
  },
  {
    id: 'fs-flyer-6',
    flyerNumber: 6,
    title: 'Family Planning: සතුට උදෙසා ක්‍රමවත් පවුල් සැලසුම්කරණය (Family Planning for Happiness)',
    titleSinhala: 'සතුට උදෙසා ක්‍රමවත් පවුල් සැලසුම්කරණය',
    theme: 'Family Dynamics & Maternal Health',
    speakerName: 'K.M. Eeshani Saranaga Chandrathilaka',
    speakerTitle: 'Public Health Midwife & Psychotherapist | MA in Buddhist Counselling',
    speakerQualifications: [
      'Public Health Midwife / Counsellor',
      'MA in Buddhist Counselling (University of Kelaniya)',
      'BSc in Psychology and Counselling & Higher Diploma in Child Psychology',
      'Diploma in Midwifery (Ministry of Health) & Diploma in Sociology'
    ],
    date: '2026 May 25',
    time: '9:00 PM – 10:30 PM',
    platform: 'Zoom Online',
    contactNumber: '077 692 9915',
    topics: [
      'Comprehensive Modern Family Planning Methods',
      'Marital Intimacy & Emotional Harmony',
      'Maternal Mental Health & Postpartum Wellbeing',
      'Parental Preparation & Child Developmental Support'
    ],
    description: 'Essential guidance on family planning methodologies, fostering matrimonial happiness, maternal wellness, and nurturing child emotional stability.',
    accentColor: '#38bdf8',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950',
    badgeText: 'Family Planning & Marital Harmony',
    posterSvgUrl: generateSessionPosterSvg({
      flyerNumber: 6,
      title: 'Family Planning: Structured Planning for Happiness',
      titleSinhala: 'සතුට උදෙසා ක්‍රමවත් පවුල් සැලසුම්කරණය',
      themeQuote: 'HEALTHY FAMILIES • MARITAL JOY • SOUND PARENTAL PREPARATION',
      speakerName: 'K.M. Eeshani Saranaga Chandrathilaka',
      speakerTitle: 'Public Health Midwife / Counsellor | MA in Buddhist Counselling',
      speakerQualifications: [
        'MA in Buddhist Counselling (Univ of Kelaniya)',
        'BSc in Psychology & Counselling',
        'Higher Diploma in Child Psychology',
        'Diploma in Midwifery (Ministry of Health) & Sociology'
      ],
      date: 'May 25, 2026',
      time: '9.00 PM - 10.30 PM',
      platform: 'Zoom Online',
      contactNumber: '077 692 9915',
      highlights: [
        'Modern Family Planning',
        'Marital Intimacy & Joy',
        'Maternal Psychological Health',
        'Child Psychological Care'
      ],
      primaryColor: '#1e3a8a',
      secondaryColor: '#0f172a',
      accentColor: '#60a5fa'
    })
  },
  {
    id: 'fs-flyer-7',
    flyerNumber: 7,
    title: 'Unlock Your Potential: A Free Transformation & Personality Development Session',
    titleSinhala: 'ඔබේ මනස, පෞරුෂය සහ ජීවන දිශානතිය සම්පූර්ණයෙන්ම වෙනස් කරන වැඩසටහනක්',
    theme: 'Personal Transformation & Coaching',
    speakerName: 'Deepthi Perera',
    speakerTitle: 'Personal Trainer & Transformation Coach | Certified NLP Practitioner',
    speakerQualifications: [
      'M.A. Buddhist Counselling & M.A. Buddhist Studies (UOK)',
      'Buddhist Counselling PGD (UOK) & Certified NLP Practitioner',
      'Sex Counselling & Therapy & Criminal Psychology (HIC)',
      'HND in Psychotherapy & Diploma in Counselling (SLFI)'
    ],
    date: 'June 1st',
    time: '9:00 PM – 10:30 PM',
    platform: 'Zoom Online',
    contactNumber: '074 234 4251',
    topics: [
      'Self-Awareness, Mindset & Cognitive Growth',
      'Personality & Professional Grooming',
      'Communication & Social Influence Skills',
      'Life Planning, Goal Setting & Financial Discipline'
    ],
    description: 'An all-inclusive personal mastery seminar designed to revamp self-awareness, communication charisma, leadership teamwork, and life action planning.',
    accentColor: '#f97316',
    bgGradient: 'from-orange-950 via-slate-900 to-slate-950',
    badgeText: 'Unlock Your Potential',
    posterSvgUrl: generateSessionPosterSvg({
      flyerNumber: 7,
      title: 'Unlock Your Potential: A Free Transformation Session',
      titleSinhala: 'ඔබේ මනස, පෞරුෂය හා ජීවන දිශානතිය වෙනස් කරන වැඩසටහන',
      themeQuote: 'SELF AWARENESS • PERSONAL GROOMING • LIFE & FINANCIAL DISCIPLINE',
      speakerName: 'Deepthi Perera',
      speakerTitle: 'Personal Trainer & Transformation Coach | NLP Practitioner',
      speakerQualifications: [
        'MA Buddhist Counselling & MA Buddhist Studies (UOK)',
        'Buddhist Counselling PGD (UOK) & NLP Practitioner',
        'Sex Counselling & Criminal Psychology (HIC)',
        'HND in Psychotherapy & Dip in Counselling (SLFI)'
      ],
      date: 'June 1st',
      time: '9.00 PM - 10.30 PM',
      platform: 'Zoom Platform',
      contactNumber: '074 234 4251',
      highlights: [
        'Self-Awareness & Mindset',
        'Personality & Grooming',
        'Leadership & Teamwork',
        'Life Balance & Action Plan'
      ],
      primaryColor: '#7c2d12',
      secondaryColor: '#0f172a',
      accentColor: '#fb923c'
    })
  },
  {
    id: 'fs-flyer-8',
    flyerNumber: 8,
    title: 'Overcoming Exam Anxiety & Academic Fear (විභාග භීතියෙන් මිදෙමු)',
    titleSinhala: 'විභාග භීතියෙන් මිදෙමු - විභාග ජයගැනීමේ මනෝවිද්‍යාත්මක මඟ',
    theme: 'Student Mental Health & Exam Stress',
    speakerName: 'Nethmi Kaveesha Ganegoda',
    speakerTitle: 'Motivational Speaker & Psychological Counselor',
    speakerQualifications: [
      'BSc (Hons) in Psychology',
      'Higher Diploma in Psychology & Counseling',
      'Diploma in Psychology & Counselling',
      'Certificate Course in Conversational Hypnosis'
    ],
    date: '7th of June',
    time: '7:00 PM Onwards',
    platform: 'Zoom Online',
    contactNumber: '074 234 4251',
    topics: [
      'Deconstructing Exam Panic & Performance Anxiety',
      'Memory Retention, Focus & Active Recall Tactics',
      'Conversational Hypnosis Techniques for Relaxation',
      'Confidence Building & Exam Day Psychological Readiness'
    ],
    description: 'Empowering students and parents with proven psychological techniques to eliminate exam phobia, stay calm under testing pressure, and perform at peak potential.',
    accentColor: '#2dd4bf',
    bgGradient: 'from-teal-950 via-slate-900 to-slate-950',
    badgeText: 'Overcoming Exam Fear',
    posterSvgUrl: generateSessionPosterSvg({
      flyerNumber: 8,
      title: 'Overcoming Exam Anxiety & Academic Fear',
      titleSinhala: 'විභාග භීතියෙන් මිදෙමු',
      themeQuote: 'CONQUER FEAR • BOOST MEMORY & FOCUS • SUCCEED WITH CONFIDENCE',
      speakerName: 'Nethmi Kaveesha Ganegoda',
      speakerTitle: 'Motivational Speaker & Counselor | BSc (Hons) Psychology',
      speakerQualifications: [
        'BSc (Hons) in Psychology',
        'Higher Diploma in Psychology & Counseling',
        'Diploma in Psychology & Counselling',
        'Certificate Course in Conversational Hypnosis'
      ],
      date: '7th of June',
      time: '7.00 PM Onwards',
      platform: 'Zoom Online',
      contactNumber: '074 234 4251',
      highlights: [
        'Exam Panic Elimination',
        'Memory & Focus Boosters',
        'Conversational Hypnosis',
        'Peak Exam Readiness'
      ],
      primaryColor: '#134e4a',
      secondaryColor: '#0f172a',
      accentColor: '#2dd4bf'
    })
  }
];
