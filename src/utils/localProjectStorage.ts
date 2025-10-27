// Local storage utility for projects when database is not accessible
// This is a temporary workaround for RLS issues

export interface LocalProject {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  isLocal?: boolean; // Flag to identify local projects
}

const STORAGE_KEY = 'local_projects';

export const getLocalProjects = (): LocalProject[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading local projects:', error);
    return [];
  }
};

export const saveLocalProject = (project: LocalProject): void => {
  try {
    const projects = getLocalProjects();
    projects.push(project);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving local project:', error);
  }
};

export const deleteLocalProject = (projectId: string): void => {
  try {
    const projects = getLocalProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting local project:', error);
  }
};

export const createLocalProject = (name: string, description: string, ownerId: string): LocalProject => {
  const now = new Date().toISOString();
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    owner_id: ownerId,
    created_at: now,
    updated_at: now,
    isLocal: true
  };
};
