import { supabase } from '@/integrations/supabase/client';

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

class SupabaseApiClient {
  // Auth - Note: Auth is now handled by AuthContext using supabase.auth directly
  // These methods are kept for backward compatibility but delegate to supabase.auth

  async register(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    
    if (error) throw new Error(error.message);
    
    return {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        fullName: fullName,
      } : null,
      token: data.session?.access_token
    };
  }

  async login(email: string, password: string) {
    console.log('[API] login called');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('[API] signInWithPassword result:', { data, error });
    if (error) throw new Error(error.message);
    
    // Get profile data
    console.log('[API] Fetching profile for user:', data.user.id);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    console.log('[API] Profile result:', { profile, profileError });
    
    const result = {
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: profile?.full_name,
        avatarUrl: profile?.avatar_url,
        bio: profile?.bio,
        jobTitle: profile?.job_title,
      },
      token: data.session?.access_token
    };
    console.log('[API] Returning:', result);
    return result;
  }

  async getMe() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw new Error(error.message);
    
    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      bio: profile.bio,
      jobTitle: profile.job_title,
      createdAt: profile.created_at,
    };
  }

  async updateProfile(data: { fullName?: string; avatarUrl?: string | null; bio?: string | null; jobTitle?: string | null }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const updateData: any = {};
    if (data.fullName !== undefined) updateData.full_name = data.fullName;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.jobTitle !== undefined) updateData.job_title = data.jobTitle;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    return toCamelCase(profile);
  }

  async logout() {
    await supabase.auth.signOut();
  }

  // Projects
  async getProjects() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Get projects where user is owner or member
    const { data: ownedProjects, error: ownedError } = await supabase
      .from('projects')
      .select('*, owner:profiles!projects_owner_id_fkey(id, email, full_name, avatar_url)')
      .eq('owner_id', user.id);
    
    if (ownedError) throw new Error(ownedError.message);
    
    const { data: memberProjects, error: memberError } = await supabase
      .from('project_members')
      .select('project:projects(*, owner:profiles!projects_owner_id_fkey(id, email, full_name, avatar_url))')
      .eq('user_id', user.id);
    
    if (memberError) throw new Error(memberError.message);
    
    const memberProjectsList = memberProjects?.map(m => m.project).filter(Boolean) || [];
    const allProjects = [...(ownedProjects || []), ...memberProjectsList];
    
    // Remove duplicates
    const uniqueProjects = allProjects.filter((project, index, self) =>
      index === self.findIndex(p => p.id === project.id)
    );
    
    return uniqueProjects.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      ownerId: p.owner_id,
      owner: p.owner ? {
        id: p.owner.id,
        email: p.owner.email,
        fullName: p.owner.full_name,
        avatarUrl: p.owner.avatar_url,
      } : null,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));
  }

  async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, owner:profiles!projects_owner_id_fkey(id, email, full_name, avatar_url)')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      ownerId: data.owner_id,
      owner: data.owner ? {
        id: data.owner.id,
        email: data.owner.email,
        fullName: data.owner.full_name,
        avatarUrl: data.owner.avatar_url,
      } : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async createProject(name: string, description?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('projects')
      .insert({ name, description, owner_id: user.id })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Create default boards
    const defaultBoards = ['To Do', 'In Progress', 'Done'];
    for (let i = 0; i < defaultBoards.length; i++) {
      await supabase.from('boards').insert({
        project_id: data.id,
        name: defaultBoards[i],
        position: i
      });
    }
    
    return toCamelCase(data);
  }

  async updateProject(id: string, data: { name?: string; description?: string }) {
    const { data: project, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return toCamelCase(project);
  }

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { message: 'Project deleted' };
  }

  // Boards
  async getBoards(projectId: string) {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('project_id', projectId)
      .order('position');
    
    if (error) throw new Error(error.message);
    return data.map(b => toCamelCase(b));
  }

  async createBoard(projectId: string, name: string) {
    // Get max position
    const { data: boards } = await supabase
      .from('boards')
      .select('position')
      .eq('project_id', projectId)
      .order('position', { ascending: false })
      .limit(1);
    
    const position = boards && boards.length > 0 ? boards[0].position + 1 : 0;
    
    const { data, error } = await supabase
      .from('boards')
      .insert({ project_id: projectId, name, position })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  }

  async deleteBoard(id: string) {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { message: 'Board deleted' };
  }

  // Tasks
  async getTasks(projectId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        board:boards!inner(project_id),
        assigned_user:profiles!tasks_assigned_to_fkey(id, email, full_name, avatar_url),
        created_by_user:profiles!tasks_created_by_fkey(id, email, full_name, avatar_url)
      `)
      .eq('board.project_id', projectId)
      .order('position');
    
    if (error) throw new Error(error.message);
    
    return data.map(t => ({
      id: t.id,
      boardId: t.board_id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      assignedTo: t.assigned_to,
      assignedUser: t.assigned_user ? {
        id: t.assigned_user.id,
        email: t.assigned_user.email,
        fullName: t.assigned_user.full_name,
        avatarUrl: t.assigned_user.avatar_url,
      } : null,
      dueDate: t.due_date,
      position: t.position,
      createdBy: t.created_by,
      createdByUser: t.created_by_user ? {
        id: t.created_by_user.id,
        email: t.created_by_user.email,
        fullName: t.created_by_user.full_name,
        avatarUrl: t.created_by_user.avatar_url,
      } : null,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));
  }

  async createTask(boardId: string, title: string, description?: string, priority?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Get max position
    const { data: tasks } = await supabase
      .from('tasks')
      .select('position')
      .eq('board_id', boardId)
      .order('position', { ascending: false })
      .limit(1);
    
    const position = tasks && tasks.length > 0 ? tasks[0].position + 1 : 0;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        board_id: boardId,
        title,
        description,
        priority: priority || 'medium',
        position,
        created_by: user.id
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  }

  async updateTask(id: string, data: any) {
    const updateData: any = {};
    if (data.boardId !== undefined) updateData.board_id = data.boardId;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.assignedTo !== undefined) updateData.assigned_to = data.assignedTo;
    if (data.dueDate !== undefined) updateData.due_date = data.dueDate;
    if (data.position !== undefined) updateData.position = data.position;
    
    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return toCamelCase(task);
  }

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { message: 'Task deleted' };
  }

  // Team Management
  async getProjectMembers(projectId: string) {
    const { data, error } = await supabase
      .from('project_members')
      .select(`
        *,
        user:profiles(id, email, full_name, avatar_url),
        project_role:project_roles(id, name, permission_level)
      `)
      .eq('project_id', projectId);
    
    if (error) throw new Error(error.message);
    
    return data.map(m => ({
      id: m.id,
      projectId: m.project_id,
      userId: m.user_id,
      role: m.role,
      projectRoleId: m.project_role_id,
      user: m.user ? {
        id: m.user.id,
        email: m.user.email,
        fullName: m.user.full_name,
        avatarUrl: m.user.avatar_url,
      } : null,
      projectRole: m.project_role ? toCamelCase(m.project_role) : null,
      createdAt: m.created_at,
    }));
  }

  async addProjectMember(projectId: string, email: string, role: string, projectRoleId?: string) {
    // Find user by email
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);
    
    if (profileError) throw new Error(profileError.message);
    if (!profiles || profiles.length === 0) throw new Error('User not found');
    
    const userId = profiles[0].id;
    
    const { data, error } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: userId,
        role: role as any,
        project_role_id: projectRoleId || null
      })
      .select(`
        *,
        user:profiles(id, email, full_name, avatar_url)
      `)
      .single();
    
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  }

  async updateProjectMember(projectId: string, memberId: string, data: { role?: string; projectRoleId?: string | null }) {
    const updateData: any = {};
    if (data.role !== undefined) updateData.role = data.role;
    if (data.projectRoleId !== undefined) updateData.project_role_id = data.projectRoleId;
    
    const { data: member, error } = await supabase
      .from('project_members')
      .update(updateData)
      .eq('id', memberId)
      .eq('project_id', projectId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return toCamelCase(member);
  }

  async removeProjectMember(projectId: string, memberId: string) {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', memberId)
      .eq('project_id', projectId);
    
    if (error) throw new Error(error.message);
    return { message: 'Member removed' };
  }

  // Project Roles
  async getProjectRoles(projectId: string) {
    const { data, error } = await supabase
      .from('project_roles')
      .select('*')
      .eq('project_id', projectId);
    
    if (error) throw new Error(error.message);
    return data.map(r => toCamelCase(r));
  }

  async createProjectRole(projectId: string, data: any) {
    const insertData = {
      project_id: projectId,
      name: data.name,
      description: data.description,
      permission_level: data.permissionLevel || 'edit',
      can_manage_members: data.canManageMembers || false,
      can_manage_roles: data.canManageRoles || false,
      can_assign_tasks: data.canAssignTasks || false,
      can_delete_tasks: data.canDeleteTasks || false,
      can_manage_project: data.canManageProject || false,
    };
    
    const { data: role, error } = await supabase
      .from('project_roles')
      .insert(insertData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return toCamelCase(role);
  }

  async updateProjectRole(projectId: string, roleId: string, data: any) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.permissionLevel !== undefined) updateData.permission_level = data.permissionLevel;
    if (data.canManageMembers !== undefined) updateData.can_manage_members = data.canManageMembers;
    if (data.canManageRoles !== undefined) updateData.can_manage_roles = data.canManageRoles;
    if (data.canAssignTasks !== undefined) updateData.can_assign_tasks = data.canAssignTasks;
    if (data.canDeleteTasks !== undefined) updateData.can_delete_tasks = data.canDeleteTasks;
    if (data.canManageProject !== undefined) updateData.can_manage_project = data.canManageProject;
    
    const { data: role, error } = await supabase
      .from('project_roles')
      .update(updateData)
      .eq('id', roleId)
      .eq('project_id', projectId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return toCamelCase(role);
  }

  async deleteProjectRole(projectId: string, roleId: string) {
    const { error } = await supabase
      .from('project_roles')
      .delete()
      .eq('id', roleId)
      .eq('project_id', projectId);
    
    if (error) throw new Error(error.message);
    return { message: 'Role deleted' };
  }

  // Legacy compatibility methods
  getToken() {
    return null; // Supabase handles tokens internally
  }

  setToken(_token: string | null) {
    // No-op - Supabase handles tokens internally
  }
}

export const api = new SupabaseApiClient();
