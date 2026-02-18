
import { Project, CityData, JourneyStop } from './types';

export const PROJECTS: Project[] = [
  // Virginia Projects
  {
    id: 'VA-01',
    title: 'Adaptive HUD Ecosystem',
    category: 'UX Simulation',
    description: 'Reducing Cognitive Load Through Context-Aware Engineering',
    thumbnail: 'https://picsum.photos/seed/va1/800/600',
    tags: ['Figma', 'Blender', 'Unity']
  },
  {
    id: 'VA-02',
    title: 'Hyper-Local Logistics',
    category: 'Service Design',
    description: 'Revolutionizing last-mile delivery in dense metropolitan environments.',
    thumbnail: 'https://picsum.photos/seed/va2/800/600',
    tags: ['UX Design', 'Systems', 'Mobile']
  },
  {
    id: 'VA-03',
    title: 'Neural Node Interface',
    category: 'Future Interface',
    description: 'Brain-computer interaction model for specialized creative workflows.',
    thumbnail: 'https://picsum.photos/seed/va3/800/600',
    tags: ['Ar/Vr', 'Interface', 'Concept']
  },
  {
    id: 'VA-04',
    title: 'Atmospheric Data Hub',
    category: 'Full Stack',
    description: 'Real-time environmental monitoring with predictive AI analysis.',
    thumbnail: 'https://picsum.photos/seed/va4/800/600',
    tags: ['D3.js', 'API', 'Gemini']
  },
  // Seoul Projects
  {
    id: 'KR-01',
    title: 'Neon Pulse Network',
    category: 'System Design',
    description: 'A high-concurrency monitoring system for smart-grid management in Seoul.',
    thumbnail: 'https://picsum.photos/seed/kr1/800/600',
    tags: ['Go', 'WebSockets', 'Dashboard']
  },
  {
    id: 'KR-02',
    title: 'K-Heritage VR',
    category: 'Immersive Tech',
    description: 'Preserving historical artifacts through interactive high-fidelity 3D scans.',
    thumbnail: 'https://picsum.photos/seed/kr2/800/600',
    tags: ['Unity', 'Lidar', 'UX']
  },
  // LA Projects
  {
    id: 'LA-01',
    title: 'Pacific Drift',
    category: 'Creative App',
    description: 'Generative ambient music platform inspired by the California coast.',
    thumbnail: 'https://picsum.photos/seed/la1/800/600',
    tags: ['Audio API', 'React', 'GLSL']
  },
  {
    id: 'LA-02',
    title: 'Solana Solar',
    category: 'Brand Identity',
    description: 'Renewable energy branding for the next generation of tech-first homeowners.',
    thumbnail: 'https://picsum.photos/seed/la2/800/600',
    tags: ['Identity', 'Motion', '3D']
  },
  {
    id: 'LA-03',
    title: 'The Studio Hub',
    category: 'SaaS',
    description: 'Collaborative pipeline management for independent VFX artists.',
    thumbnail: 'https://picsum.photos/seed/la3/800/600',
    tags: ['Cloud', 'Systems', 'Product']
  }
];

export const CITY_HUB: Record<JourneyStop, CityData> = {
  [JourneyStop.VIRGINIA]: {
    name: 'Glen Allen, VA',
    coords: '37.6660° N, 77.4605° W',
    altitude: 120,
    temperature: '22°C',
    accent: '#58aa5a'
  },
  [JourneyStop.SEOUL]: {
    name: 'Seoul, KR',
    coords: '37.5665° N, 126.9780° E',
    altitude: 480,
    temperature: '18°C',
    accent: '#4480ff'
  },
  [JourneyStop.LA]: {
    name: 'Los Angeles, CA',
    coords: '34.0522° N, 118.2437° W',
    altitude: 320,
    temperature: '28°C',
    accent: '#ff6020'
  }
};
