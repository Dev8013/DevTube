import { UserProfile, ProjectItem, SecureDocument, AnimeDramaItem, CommentItem } from '../types';

export const initialProfile: UserProfile = {
  name: 'Dev Bhardwaj',
  handle: '@Onicha69',
  tagline: 'Senior Full-Stack Software Engineer & Distributed Systems Architect',
  subscribers: '142K subscribers',
  avatar: '/src/assets/images/yt_dev_avatar_1793508225400.jpg',
  banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  bio: 'Building resilient cloud infrastructure, reactive web platforms, and intelligent autonomous developer tools. 5+ years crafting production-grade web applications with React, TypeScript, Node.js, and distributed databases. Passionate about software craftsmanship, clean UI/UX, and cinematic storytelling.',
  email: 'bhardwajdev269@gmail.com',
  phone: '+91 98712 34567',
  location: 'New Delhi, India',
  github: 'https://github.com/Onicha69',
  linkedin: 'https://linkedin.com/in/dev-bhardwaj-swe',
  twitter: 'https://x.com/DevBhardwajDev',
  portfolioStatus: 'Open to Full-Stack & Senior Engineering Roles',
  skills: [
    'TypeScript', 'React 19', 'Node.js', 'Express', 'Next.js', 'Tailwind CSS',
    'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS',
    'GraphQL', 'REST APIs', 'WebSockets', 'Python', 'CI/CD Pipelines'
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Technology (B.Tech) in Computer Science & Engineering',
      institution: 'Delhi Technological University (DTU) / Affiliated Tech Institute',
      year: '2019 - 2023',
      score: '8.8 CGPA (First Class with Distinction)',
      highlights: 'Specialized in Distributed Computing, Data Structures & Algorithms, Database Systems, and Cloud Security.'
    },
    {
      id: 'edu-2',
      degree: 'Senior Secondary Education (Class XII - Science & Mathematics)',
      institution: 'Central Board of Secondary Education (CBSE)',
      year: '2017 - 2019',
      score: '94.2%',
      highlights: 'Merit holder in Physics, Computer Science, and Mathematics.'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Full-Stack Engineer',
      company: 'Apex Cloud Systems',
      period: '2023 - Present',
      description: 'Architected scalable microservices and high-throughput real-time streaming dashboards using React 19, TypeScript, Node.js, and Redis. Reduced p99 API latencies by 42% through optimized caching and query batching.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Redis', 'Tailwind CSS']
    },
    {
      id: 'exp-2',
      role: 'Full-Stack Software Developer',
      company: 'OmniVibe Digital',
      period: '2022 - 2023',
      description: 'Built high-concurrency e-commerce checkout flows and interactive web applications with Next.js and MongoDB. Designed responsive design systems reducing bundle payload by 35%.',
      tech: ['TypeScript', 'Next.js', 'MongoDB', 'Express', 'AWS S3']
    },
    {
      id: 'exp-3',
      role: 'Software Engineering Fellow',
      company: 'Open Source Labs',
      period: '2021 - 2022',
      description: 'Contributed to high-impact open-source developer tooling, React state management utilities, and automated end-to-end testing frameworks.',
      tech: ['TypeScript', 'Node.js', 'Jest', 'WebSockets']
    }
  ],
  resumeUrl: '#'
};

export const initialProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Cloud Infrastructure Command: Distributed Telemetry & Microservices Topology',
    shortName: 'Cloud Command Telemetry',
    description: `Deep-dive engineering walkthrough of an enterprise-grade cloud observability platform. Built from scratch with React, TypeScript, Node.js, and WebSocket streaming to monitor distributed kubernetes nodes, live CPU/Memory utilization, and instant API latency alerts.

Features:
• Real-time WebSocket telemetry engine handling 50k+ packets/sec
• Interactive node graph topology with zoomable dependency map
• Microservice health probes with automated failure recovery simulation
• Exportable diagnostic logs and prometheus-compatible metrics exporter`,
    thumbnail: '/src/assets/images/yt_thumb_cloud_platform_1793508227442.jpg',
    duration: '18:45',
    category: 'Cloud & DevOps',
    views: '184K views',
    numericViews: 184200,
    likes: 12400,
    isLiked: false,
    publishedAt: '2 weeks ago',
    tags: ['React', 'Node.js', 'WebSockets', 'Docker', 'Kubernetes', 'Redis'],
    githubUrl: 'https://github.com/Onicha69/cloud-infrastructure-command',
    liveDemoUrl: 'https://cloud-command.demo.dev',
    order: 1,
    featured: true,
    architectureHighlights: ['Event-driven streaming pipeline', 'Zero-layout-shift SVG topology graph', 'Sub-20ms packet ingest']
  },
  {
    id: 'proj-2',
    title: 'NeuroDev Studio: Autonomous Multi-Agent Full-Stack Code Generator',
    shortName: 'NeuroDev AI Studio',
    description: `An intelligent developer environment powered by collaborative agent networks. It parses natural language system prompts, plans comprehensive database schemas, writes full-stack Express & React code, and runs real-time linter tests autonomously.

Features:
• Graph-based prompt execution workflow with rollback points
• Live virtual file system emulator with instantaneous code diff viewer
• Syntax error auto-correction loop achieving 98.4% first-run compile rate
• Dark neon IDE interface designed for maximum developer ergonomics`,
    thumbnail: '/src/assets/images/yt_thumb_ai_agent_1793508227549.jpg',
    duration: '24:10',
    category: 'AI & ML',
    views: '245K views',
    numericViews: 245800,
    likes: 18900,
    isLiked: false,
    publishedAt: '1 month ago',
    tags: ['AI Agents', 'TypeScript', 'Node.js', 'AST Parser', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Onicha69/neuro-dev-agent-studio',
    liveDemoUrl: 'https://neurodev.demo.dev',
    order: 2,
    featured: true,
    architectureHighlights: ['Multi-agent orchestration loop', 'Sandboxed virtual execution runtime', 'Real-time AST transforms']
  },
  {
    id: 'proj-3',
    title: 'HyperSpeed Next.js 15 Luxury 3D E-Commerce Platform with Edge Checkout',
    shortName: 'HyperSpeed Luxury Store',
    description: `Ultra-high performance e-commerce platform built for luxury footwear & streetwear. Features interactive 3D WebGL product inspection, instant optimistic cart management, and sub-100ms global edge checkout processing.

Features:
• 99+ Google Lighthouse performance score with ISR and edge image rendering
• Interactive 3D product turntable with dynamic materials and reflections
• Instantaneous cart sync across multiple tabs with local storage reconciliation
• Automated tax and international currency rate calculation engine`,
    thumbnail: '/src/assets/images/yt_thumb_ecommerce_nextjs_1793508227601.jpg',
    duration: '14:20',
    category: 'Full Stack',
    views: '112K views',
    numericViews: 112400,
    likes: 8750,
    isLiked: false,
    publishedAt: '3 weeks ago',
    tags: ['Next.js 15', 'React', 'Tailwind CSS', 'Stripe', 'WebGL', 'Zustand'],
    githubUrl: 'https://github.com/Onicha69/hyperspeed-luxury-store',
    liveDemoUrl: 'https://hyperspeed-store.demo.dev',
    order: 3,
    featured: true,
    architectureHighlights: ['Server Components optimization', 'WebGL 3D product renderer', 'Edge caching at Cloudflare']
  },
  {
    id: 'proj-4',
    title: 'Real-Time Collaborative Distributed Canvas Engine with Operational Transforms',
    shortName: 'Distributed Canvas',
    description: `Multiplayer vector diagramming and whiteboarding engine supporting thousands of simultaneous cursors and live vector drawings. Implements conflict-free replicated data structures and binary WebSocket streaming.

Features:
• Zero-conflict real-time multi-cursor positioning with predictive interpolation
• Unlimited undo/redo tree using operational transformation journals
• Room-based peer clustering powered by Node.js and Redis Pub/Sub`,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    duration: '16:50',
    category: 'Systems',
    views: '89K views',
    numericViews: 89300,
    likes: 6420,
    isLiked: false,
    publishedAt: '2 months ago',
    tags: ['Distributed Systems', 'WebSockets', 'Canvas API', 'Redis', 'Node.js'],
    githubUrl: 'https://github.com/Onicha69/multiplayer-canvas-engine',
    liveDemoUrl: 'https://canvas.demo.dev',
    order: 4,
    featured: false,
    architectureHighlights: ['Binary WebSockets payload', 'Spatial indexing with QuadTrees', 'Zero-allocation vector math']
  },
  {
    id: 'proj-5',
    title: 'FinPulse: High-Frequency Crypto & Stock Market Terminal with Order Book Depth',
    shortName: 'FinPulse Terminal',
    description: `A Bloomberg-style dark terminal designed for professional traders. Streams live L2 order book data, candlestick charting with custom technical indicators (MACD, RSI, Bollinger Bands), and rapid keyboard shortcuts for simulated paper trading.`,
    thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
    duration: '21:15',
    category: 'Frontend',
    views: '158K views',
    numericViews: 158700,
    likes: 11300,
    isLiked: false,
    publishedAt: '3 months ago',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'D3.js', 'FinTech'],
    githubUrl: 'https://github.com/Onicha69/finpulse-terminal',
    liveDemoUrl: 'https://finpulse.demo.dev',
    order: 5,
    featured: false,
    architectureHighlights: ['60fps canvas chart engine', 'WebWorker data ingestion', 'Instant keyboard command palette']
  },
  {
    id: 'proj-6',
    title: 'PulseFit Pro: Cross-Platform Native Health & Biometric Workout Tracker',
    shortName: 'PulseFit Mobile App',
    description: `Full-featured mobile application built with React Native and Node.js for tracking workouts, heart rate zones, macro nutrition, and progressive overload graphs. Includes offline sync with SQLite and background GPS route tracking.`,
    thumbnail: 'https://images.unsplash.com/photo-1510519138161-58446c9d3304?auto=format&fit=crop&w=1200&q=80',
    duration: '11:30',
    category: 'Mobile',
    views: '73K views',
    numericViews: 73500,
    likes: 5200,
    isLiked: false,
    publishedAt: '4 months ago',
    tags: ['React Native', 'TypeScript', 'SQLite', 'Node.js', 'HealthKit'],
    githubUrl: 'https://github.com/Onicha69/pulsefit-pro-mobile',
    liveDemoUrl: 'https://pulsefit.demo.dev',
    order: 6,
    featured: false,
    architectureHighlights: ['Offline-first SQLite replication', 'Biometric auth integration', 'Smooth 120Hz gesture animations']
  }
];

export const initialDocuments: SecureDocument[] = [
  {
    id: 'doc-aadhaar-1',
    title: 'Aadhaar Card (National ID)',
    type: 'Aadhaar Card',
    identifierNumber: 'XXXX-XXXX-4921',
    uploadDate: '2025-08-14',
    fileSize: '1.42 MB',
    mimeType: 'application/pdf',
    encryptedHash: 'AES256:e837f81b1c67d98a287c89f5bc30d1e2e49c90a184f4e41b9d4791024f2b9a71',
    isEncrypted: true,
    decryptedData: 'Unique Identification Authority of India (UIDAI) - Verified Govt ID: Dev Bhardwaj | DOB: 02/09/2001 | Gender: Male | Address: New Delhi, India. Verified Biometric Credential on File.',
    notes: 'Primary national identity verification document with UIDAI digital seal.'
  },
  {
    id: 'doc-pan-1',
    title: 'Permanent Account Number (PAN Card)',
    type: 'PAN Card',
    identifierNumber: 'XXXXX4829K',
    uploadDate: '2025-08-14',
    fileSize: '890 KB',
    mimeType: 'image/jpeg',
    encryptedHash: 'AES256:a74bc9901f44e138a09f8721cbbd4219ef8910aa11bc6447d28399e2118ff89c',
    isEncrypted: true,
    decryptedData: 'Income Tax Department, Govt of India - PAN: XXXXX4829K | Name: DEV BHARDWAJ | Father: R.K. BHARDWAJ | Status: Active & Aadhaar Linked.',
    notes: 'Income Tax Permanent Account Number required for tax deduction and banking.'
  },
  {
    id: 'doc-cert-aws',
    title: 'AWS Certified Solutions Architect - Professional',
    type: 'Certification',
    identifierNumber: 'AWS-SAP-892140',
    uploadDate: '2026-02-10',
    fileSize: '2.1 MB',
    mimeType: 'application/pdf',
    encryptedHash: 'AES256:f12a99cd1032847a98bc01124efacbd99102abdc71900234acfe18823491bc11',
    isEncrypted: true,
    decryptedData: 'Amazon Web Services Training & Certification - Credential ID: AWS-SAP-892140 | Earner: Dev Bhardwaj | Issue Date: Feb 2026 | Expiration: Feb 2029 | Validation: https://aws.amazon.com/verification',
    notes: 'Validated cloud architectural competencies across multi-tier distributed architectures.'
  },
  {
    id: 'doc-degree-dtu',
    title: 'Bachelor of Technology Degree Certificate',
    type: 'Degree',
    identifierNumber: 'REG-2019-BTECH-CSE-884',
    uploadDate: '2025-07-20',
    fileSize: '3.4 MB',
    mimeType: 'application/pdf',
    encryptedHash: 'AES256:b89947aa10293847ffbe20194857201bbca82019485720193847582910293847',
    isEncrypted: true,
    decryptedData: 'Degree of Bachelor of Technology in Computer Science & Engineering conferred to Dev Bhardwaj with First Class with Distinction.',
    notes: 'Official University convocation degree certificate with registrar seal and QR validation.'
  }
];

export const initialAnimeDrama: AnimeDramaItem[] = [
  {
    id: 'ad-1',
    title: 'Solo Leveling: Arise',
    originalTitle: '나 혼자만 레벨업',
    category: 'Anime',
    status: 'Watching',
    totalEpisodes: 24,
    watchedEpisodes: 18,
    watchedList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    rating: 9.3,
    description: 'In a world where hunters must battle deadly monsters to protect mankind, Sung Jinwoo, the notorious weakest hunter of all mankind, finds himself in a mysterious double dungeon that unlocks a private game interface.',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    releaseYear: '2024 - 2025',
    updatedAt: 'Yesterday'
  },
  {
    id: 'ad-2',
    title: 'Hidden Love (偷偷藏不住)',
    originalTitle: '偷偷藏不住',
    category: 'Chinese Drama',
    status: 'Watching',
    totalEpisodes: 25,
    watchedEpisodes: 20,
    watchedList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    rating: 9.5,
    description: 'Sang Zhi falls in love with Duan Jiaxu, a boy who often comes to her house to play games with her older brother. After a few years apart, they reunite at her university and sweet romance gradually blossoms.',
    genres: ['Romance', 'Youth', 'Drama'],
    releaseYear: '2023',
    updatedAt: '3 days ago'
  },
  {
    id: 'ad-3',
    title: 'Vincenzo (빈센조)',
    originalTitle: '빈센조',
    category: 'Korean Drama',
    status: 'Watching',
    totalEpisodes: 20,
    watchedEpisodes: 15,
    watchedList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    rating: 9.2,
    description: 'At the age of eight, Park Joo-hyung went to Italy after being adopted by the Cassano mafia family. Now a mafia consigliere and lawyer, he flees to Seoul and gets involved with quirky tenants and a ruthless conglomerate.',
    genres: ['Crime', 'Legal', 'Dark Comedy', 'Action'],
    releaseYear: '2021',
    updatedAt: '5 days ago'
  },
  {
    id: 'ad-4',
    title: 'Frieren: Beyond Journey\'s End',
    originalTitle: '葬送のフリーレン',
    category: 'Anime',
    status: 'Completed',
    totalEpisodes: 28,
    watchedEpisodes: 28,
    watchedList: Array.from({ length: 28 }, (_, i) => i + 1),
    thumbnail: '/src/assets/images/yt_thumb_anime_tracker_1793508229451.jpg',
    rating: 9.7,
    description: 'An elven mage and her fellow adventurers have defeated the Demon King and brought peace to the land. But as an elf with centuries to live, she embarks on a nostalgic pilgrimage to understand humans and mortality.',
    genres: ['Adventure', 'Drama', 'Fantasy'],
    releaseYear: '2023 - 2024',
    updatedAt: '1 week ago'
  },
  {
    id: 'ad-5',
    title: 'Twinkling Watermelon (반짝이는 워터멜론)',
    originalTitle: '반짝이는 워터멜론',
    category: 'Korean Drama',
    status: 'Completed',
    totalEpisodes: 16,
    watchedEpisodes: 16,
    watchedList: Array.from({ length: 16 }, (_, i) => i + 1),
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    rating: 9.4,
    description: 'Eun Gyeol, a child of deaf adults (CODA), is transported back to 1995 through a mystical musical instrument shop where he meets his 18-year-old father and forms a youth band called Watermelon Sugar.',
    genres: ['Youth', 'Time Travel', 'Music', 'Family'],
    releaseYear: '2023',
    updatedAt: '2 weeks ago'
  },
  {
    id: 'ad-6',
    title: 'Demon Slayer: Infinity Castle Arc',
    originalTitle: '鬼滅の刃 無限城編',
    category: 'Anime',
    status: 'Upcoming',
    totalEpisodes: 12,
    watchedEpisodes: 0,
    watchedList: [],
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    rating: 9.8,
    description: 'The Hashira and Tanjiro plunge into Muzan Kibutsuji\'s shifting Infinity Castle for the climactic final war against the Upper Moons.',
    genres: ['Action', 'Supernatural', 'Historical'],
    releaseYear: '2026',
    updatedAt: 'Planned'
  },
  {
    id: 'ad-7',
    title: 'When I Fly Towards You (当我飞奔向你)',
    originalTitle: '当我飞奔向你',
    category: 'Chinese Drama',
    status: 'Completed',
    totalEpisodes: 24,
    watchedEpisodes: 24,
    watchedList: Array.from({ length: 24 }, (_, i) => i + 1),
    thumbnail: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
    rating: 9.3,
    description: 'A cheerful high school girl falls for a quiet, aloof top student in her class, bringing warmth, friendship, and unshakeable belief into his world throughout their youth.',
    genres: ['Youth', 'Romance', 'School', 'Life'],
    releaseYear: '2023',
    updatedAt: '3 weeks ago'
  },
  {
    id: 'ad-8',
    title: 'Arcane: League of Legends Season 2',
    originalTitle: 'Arcane Season 2',
    category: 'Other Series',
    status: 'Completed',
    totalEpisodes: 9,
    watchedEpisodes: 9,
    watchedList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    rating: 9.6,
    description: 'The escalating unrest between the utopian city of Piltover and the underground city of Zaun reaches a catastrophic crescendo as sisters Vi and Jinx find themselves on opposing sides.',
    genres: ['Sci-Fi', 'Action', 'Steampunk'],
    releaseYear: '2024',
    updatedAt: 'Last month'
  }
];

export const initialComments: CommentItem[] = [
  {
    id: 'comm-1',
    projectId: 'proj-1',
    author: 'Sarah Chen (Staff Infra Lead @ Stripe)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    text: 'Incredible architecture on the telemetry streaming pipeline! The live node topology render is buttery smooth even with thousands of simulated metrics. Great engineering work Dev!',
    timestamp: '2 days ago',
    likes: 42
  },
  {
    id: 'comm-2',
    projectId: 'proj-1',
    author: 'Dev Bhardwaj',
    avatar: '/src/assets/images/yt_dev_avatar_1793508225400.jpg',
    text: 'Thanks Sarah! The key was moving the packet batching into a dedicated WebWorker before pushing updates to the SVG canvas so the main render thread never hitches.',
    timestamp: '1 day ago',
    likes: 19,
    isOwner: true
  },
  {
    id: 'comm-3',
    projectId: 'proj-2',
    author: 'Alexandre Rostov (Principal AI Researcher)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    text: 'The autonomous AST repair loop in NeuroDev Studio is phenomenal. Tested the repo and it handles edge cases effortlessly. Would love to collaborate on agent verification!',
    timestamp: '5 days ago',
    likes: 31
  }
];
