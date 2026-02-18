
import React from 'react';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-[10000] bg-white text-[#1e3040] overflow-y-auto">
      <button 
        onClick={onClose}
        className="fixed top-8 right-8 z-[10001] w-12 h-12 bg-[#1e3040] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="max-w-6xl mx-auto py-24 px-8">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-sm border-b-2 border-[#1e3040] pb-1">{project.id}</span>
            <span className="font-mono text-sm text-slate-400 uppercase tracking-widest">{project.category}</span>
          </div>
          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-8 leading-tight">{project.title}</h1>
          <p className="font-serif text-2xl text-slate-600 max-w-2xl leading-relaxed italic">{project.description}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="md:col-span-2 aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-2xl">
            <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center space-y-12">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-tighter text-slate-400 mb-4">Core Competencies</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-slate-100 rounded-full font-mono text-xs">{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-tighter text-slate-400 mb-4">Project Year</h4>
              <p className="font-serif text-2xl">2024</p>
            </div>
          </div>
        </div>

        <section className="prose prose-slate max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="font-serif text-3xl mb-4">Problem Statement</h3>
              <p className="text-lg leading-relaxed text-slate-600">
                Urban environments face unprecedented challenges in sustainability and efficiency. This project focuses on the intersection of human-centric design and scalable environmental monitoring. By leveraging real-time data nodes, we created an interface that speaks both to city planners and citizens.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-3xl mb-4">The Solution</h3>
              <p className="text-lg leading-relaxed text-slate-600">
                The final iteration resulted in a 40% increase in data accessibility across municipal departments. The design language utilizes high-contrast visual cues and intuitive spatial mapping to reduce cognitive load during critical decision-making phases.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-32 pt-16 border-t border-slate-200 text-center">
          <p className="font-mono text-xs uppercase tracking-widest mb-4">Next Journey Stop</p>
          <button onClick={onClose} className="font-serif text-4xl italic hover:text-slate-400 transition-colors underline decoration-slate-300">Continue Flight</button>
        </footer>
      </div>
    </div>
  );
};

export default ProjectDetail;
