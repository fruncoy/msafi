import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { Project } from '../types/project';
import { User } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { userStorage } from '../utils/userStorage';

export function ProjectSelectionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;

    const allProjects = storage.getProjects();
    const allUsers = userStorage.getUsers();
    setUsers(allUsers);

    if (user.role === 'admin') {
      setProjects(allProjects);
    } else {
      setProjects(allProjects.filter(p => user.assignedProjects.includes(p.id)));
    }
  }, [user]);

  if (user?.status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Awaiting Access</h1>
          <p className="text-gray-600">Your account is pending admin approval. Please check back later.</p>
        </div>
      </div>
    );
  }

  const handleEditProject = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProject(project);
  };

  const handleUpdateProject = (project: Project, name: string, description: string) => {
    const updatedProject = { ...project, name, description };
    storage.updateProject(updatedProject);
    setProjects(projects.map(p => p.id === project.id ? updatedProject : p));
    setEditingProject(null);
  };

  const toggleProjectUsers = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
              <p className="mt-1 text-sm text-gray-500">Select a project to continue</p>
            </div>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/projects/new')}
                className="flex items-center px-4 py-2 bg-[#FF8001] text-white rounded-lg hover:bg-[#FF8001]/90"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Project
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative group"
              >
                {editingProject?.id === project.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      defaultValue={project.name}
                      className="w-full border rounded-lg px-3 py-2"
                      id={`project-name-${project.id}`}
                    />
                    <textarea
                      defaultValue={project.description}
                      className="w-full border rounded-lg px-3 py-2"
                      rows={3}
                      id={`project-desc-${project.id}`}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingProject(null)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateProject(
                          project,
                          (document.getElementById(`project-name-${project.id}`) as HTMLInputElement).value,
                          (document.getElementById(`project-desc-${project.id}`) as HTMLTextAreaElement).value
                        )}
                        className="px-3 py-1 text-sm bg-[#FF8001] text-white rounded-lg hover:bg-[#FF8001]/90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div 
                      onClick={() => navigate(`/project/${project.id}/dashboard`)}
                      className="cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={(e) => toggleProjectUsers(e, project.id)}
                        className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                      >
                        Users {expandedProject === project.id ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                      </button>
                      {user?.role === 'admin' && (
                        <button
                          onClick={(e) => handleEditProject(e, project)}
                          className="p-1 text-gray-500 hover:text-[#FF8001]"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {expandedProject === project.id && (
                      <div className="mt-3 border-t pt-3 space-y-2">
                        {users.map(user => (
                          <div key={user.id} className="text-sm">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-gray-500 text-xs">{user.email}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}