const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'auth_token';

// Helper to convert snake_case to camelCase for frontend
const toCamelCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;
  
  const newObj: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    newObj[camelKey] = toCamelCase(obj[key]);
  }
  return newObj;
};

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string | null): void {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  }

  // Auth methods
  async register(email: string, password: string, fullName?: string) {
    const data = await this.request<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    this.setToken(data.token);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request<any>('/api/auth/me');
  }

  async updateProfile(data: { fullName?: string; avatarUrl?: string | null; bio?: string | null; jobTitle?: string | null }) {
    return this.request<any>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Projects
  async getProjects() {
    const data = await this.request<any[]>('/api/projects');
    return data.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      ownerId: p.owner_id,
      owner: p.owner_email ? {
        id: p.owner_id,
        email: p.owner_email,
        fullName: p.owner_name,
      } : null,
      memberCount: p.member_count,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));
  }

  async getProject(id: string) {
    const data = await this.request<any>(`/api/projects/${id}`);
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      ownerId: data.owner_id,
      owner: data.owner_email ? {
        id: data.owner_id,
        email: data.owner_email,
        fullName: data.owner_name,
      } : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async createProject(name: string, description?: string) {
    const data = await this.request<any>('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
    return toCamelCase(data);
  }

  async updateProject(id: string, data: { name?: string; description?: string }) {
    const result = await this.request<any>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return toCamelCase(result);
  }

  async deleteProject(id: string) {
    return this.request<{ message: string }>(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Boards
  async getBoards(projectId: string) {
    const data = await this.request<any[]>(`/api/boards/project/${projectId}`);
    return data.map(b => toCamelCase(b));
  }

  async createBoard(projectId: string, name: string) {
    const data = await this.request<any>('/api/boards', {
      method: 'POST',
      body: JSON.stringify({ name, projectId }),
    });
    return toCamelCase(data);
  }

  async deleteBoard(id: string) {
    return this.request<{ message: string }>(`/api/boards/${id}`, {
      method: 'DELETE',
    });
  }

  // Tasks
  async getTasks(projectId: string) {
    const data = await this.request<any[]>(`/api/tasks/project/${projectId}`);
    return data.map(t => ({
      id: t.id,
      boardId: t.board_id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      assignedTo: t.assigned_to,
      assignedUser: t.assigned_to_name ? {
        id: t.assigned_to,
        fullName: t.assigned_to_name,
        avatarUrl: t.assigned_to_avatar,
      } : null,
      dueDate: t.due_date,
      position: t.position,
      createdBy: t.created_by,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));
  }

  async createTask(boardId: string, title: string, description?: string, priority?: string) {
    const data = await this.request<any>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ boardId, title, description, priority }),
    });
    return toCamelCase(data);
  }

  async updateTask(id: string, data: any) {
    const result = await this.request<any>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return toCamelCase(result);
  }

  async deleteTask(id: string) {
    return this.request<{ message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Team Management
  async getProjectMembers(projectId: string) {
    const data = await this.request<any[]>(`/api/team/projects/${projectId}/members`);
    return data.map(m => ({
      id: m.membership_id || m.id,
      userId: m.id,
      role: m.role,
      projectRoleId: m.project_role_id,
      user: {
        id: m.id,
        email: m.email,
        fullName: m.full_name,
        avatarUrl: m.avatar_url,
        jobTitle: m.job_title,
      },
      projectRole: m.project_role_id ? {
        id: m.project_role_id,
        name: m.project_role_name,
        description: m.project_role_description,
      } : null,
      joinedAt: m.joined_at,
    }));
  }

  async addProjectMember(projectId: string, email: string, role: string, projectRoleId?: string) {
    const data = await this.request<any>(`/api/team/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ email, role, projectRoleId }),
    });
    return toCamelCase(data);
  }

  async updateProjectMember(projectId: string, memberId: string, data: { role?: string; projectRoleId?: string | null }) {
    const result = await this.request<any>(`/api/team/projects/${projectId}/members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return toCamelCase(result);
  }

  async removeProjectMember(projectId: string, memberId: string) {
    return this.request<{ message: string }>(`/api/team/projects/${projectId}/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  // Project Roles
  async getProjectRoles(projectId: string) {
    const data = await this.request<any[]>(`/api/team/projects/${projectId}/roles`);
    return data.map(r => toCamelCase(r));
  }

  async createProjectRole(projectId: string, data: any) {
    const result = await this.request<any>(`/api/team/projects/${projectId}/roles`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return toCamelCase(result);
  }

  async updateProjectRole(projectId: string, roleId: string, data: any) {
    const result = await this.request<any>(`/api/team/projects/${projectId}/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return toCamelCase(result);
  }

  async deleteProjectRole(projectId: string, roleId: string) {
    return this.request<{ message: string }>(`/api/team/projects/${projectId}/roles/${roleId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
