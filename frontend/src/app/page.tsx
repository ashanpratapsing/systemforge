"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderGit2, Plus } from "lucide-react";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call to the project-service
    // Mocking for MVP UI setup
    setProjects([
      { id: 1, name: "E-Commerce Architecture", updatedAt: "2h ago" },
      { id: 2, name: "FinTech Microservices", updatedAt: "1d ago" }
    ]);
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">SystemForge</h1>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors">
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-neutral-300">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link href={`/project/${project.id}`} key={project.id}>
              <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-xl hover:border-blue-500 transition-colors cursor-pointer group">
                <div className="bg-neutral-700/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                  <FolderGit2 size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                <p className="text-sm text-neutral-400">Updated {project.updatedAt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
