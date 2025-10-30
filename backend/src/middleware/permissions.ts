import { Response, NextFunction, Request } from 'express';
import { pool } from '../db/index.js';
import { AuthRequest } from './auth.js';

export interface ProjectPermissions {
  isOwner: boolean;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  projectRole?: {
    id: string;
    name: string;
    permissionLevel: 'full' | 'edit' | 'comment' | 'view';
    canManageMembers: boolean;
    canManageRoles: boolean;
    canAssignTasks: boolean;
    canDeleteTasks: boolean;
    canManageProject: boolean;
  };
}

export interface PermissionRequest extends AuthRequest {
  params: any;
  body: any;
  projectId?: string;
  permissions?: ProjectPermissions;
}

export const checkProjectAccess = async (
  req: PermissionRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId || req.params.id || req.body.projectId;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID required' });
    }

    const result = await pool.query(
      `SELECT 
        p.id,
        p.owner_id,
        pm.role,
        pm.project_role_id,
        pr.name as role_name,
        pr.permission_level,
        pr.can_manage_members,
        pr.can_manage_roles,
        pr.can_assign_tasks,
        pr.can_delete_tasks,
        pr.can_manage_project
      FROM projects p
      LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = $2
      LEFT JOIN project_roles pr ON pm.project_role_id = pr.id
      WHERE p.id = $1`,
      [projectId, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = result.rows[0];
    const isOwner = project.owner_id === req.userId;
    const isMember = project.role !== null;

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'Access denied to this project' });
    }

    req.projectId = projectId;
    req.permissions = {
      isOwner,
      role: isOwner ? 'owner' : project.role,
      projectRole: project.project_role_id ? {
        id: project.project_role_id,
        name: project.role_name,
        permissionLevel: project.permission_level,
        canManageMembers: project.can_manage_members,
        canManageRoles: project.can_manage_roles,
        canAssignTasks: project.can_assign_tasks,
        canDeleteTasks: project.can_delete_tasks,
        canManageProject: project.can_manage_project,
      } : undefined,
    };

    next();
  } catch (error) {
    console.error('Permission check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

type PermissionType = 'canManageMembers' | 'canManageRoles' | 'canAssignTasks' | 'canDeleteTasks' | 'canManageProject' | 'isOwner' | 'canEdit';

export const requirePermission = (permission: PermissionType) => {
  return (req: PermissionRequest, res: Response, next: NextFunction) => {
    if (!req.permissions) {
      return res.status(403).json({ error: 'Permissions not loaded' });
    }

    const { isOwner, role, projectRole } = req.permissions;

    // Owner always has all permissions
    if (isOwner) {
      return next();
    }

    // Admin has most permissions
    if (role === 'admin' && permission !== 'isOwner') {
      return next();
    }

    // Check specific permissions
    if (permission === 'isOwner') {
      return res.status(403).json({ error: 'Only project owner can perform this action' });
    }

    if (permission === 'canEdit') {
      if (role === 'viewer') {
        return res.status(403).json({ error: 'Viewers cannot edit' });
      }
      return next();
    }

    // Check project role permissions
    if (projectRole && permission in projectRole) {
      if (projectRole[permission as keyof typeof projectRole]) {
        return next();
      }
    }

    return res.status(403).json({ error: 'Insufficient permissions' });
  };
};
