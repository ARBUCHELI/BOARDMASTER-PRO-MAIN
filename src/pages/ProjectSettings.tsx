import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Loader2, Users, Shield, Trash2, UserPlus, Mail } from "lucide-react";

interface Member {
  id: string;
  membership_id?: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  job_title?: string;
  role: string;
  project_role_id?: string;
  project_role_name?: string;
  joined_at: string;
}

interface ProjectRole {
  id: string;
  name: string;
  description?: string;
  permission_level: string;
  can_manage_members: boolean;
  can_manage_roles: boolean;
  can_assign_tasks: boolean;
  can_delete_tasks: boolean;
  can_manage_project: boolean;
}

const ProjectSettings = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<ProjectRole[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("member");
  const [newMemberProjectRole, setNewMemberProjectRole] = useState("");
  const [saving, setSaving] = useState(false);

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissionLevel: "edit" as "full" | "edit" | "comment" | "view",
    canManageMembers: false,
    canManageRoles: false,
    canAssignTasks: false,
    canDeleteTasks: false,
    canManageProject: false,
  });

  useEffect(() => {
    if (user && id) {
      fetchData();
    }
  }, [user, id]);

  const fetchData = async () => {
    try {
      const [projectData, membersData, rolesData] = await Promise.all([
        api.getProject(id!),
        api.getProjectMembers(id!),
        api.getProjectRoles(id!),
      ]);

      setProject(projectData);
      setMembers(membersData);
      setRoles(rolesData);
    } catch (error: any) {
      toast({
        title: "Error loading project",
        description: error.message,
        variant: "destructive",
      });
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return;

    setSaving(true);
    try {
      await api.addProjectMember(id!, newMemberEmail, newMemberRole, newMemberProjectRole || undefined);
      
      toast({
        title: "Member added",
        description: `${newMemberEmail} has been added to the project.`,
      });

      setMemberDialogOpen(false);
      setNewMemberEmail("");
      setNewMemberRole("member");
      setNewMemberProjectRole("");
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error adding member",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      await api.removeProjectMember(id!, memberId);
      
      toast({
        title: "Member removed",
        description: "The member has been removed from the project.",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error removing member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name) return;

    setSaving(true);
    try {
      await api.createProjectRole(id!, newRole);
      
      toast({
        title: "Role created",
        description: `${newRole.name} role has been created.`,
      });

      setRoleDialogOpen(false);
      setNewRole({
        name: "",
        description: "",
        permissionLevel: "edit",
        canManageMembers: false,
        canManageRoles: false,
        canAssignTasks: false,
        canDeleteTasks: false,
        canManageProject: false,
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error creating role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role? Members with this role will lose their custom permissions.")) return;

    try {
      await api.deleteProjectRole(id!, roleId);
      
      toast({
        title: "Role deleted",
        description: "The role has been deleted.",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error deleting role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-500";
      case "admin":
        return "bg-blue-500";
      case "member":
        return "bg-green-500";
      case "viewer":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/project/${id}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Project Settings</h1>
          <p className="text-muted-foreground mt-1">{project?.name}</p>
        </div>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="mr-2 h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage who has access to this project
                  </CardDescription>
                </div>
                <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                      <DialogDescription>
                        Invite a user to this project by their email address
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="user@example.com"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Access Level</Label>
                        <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectRole">Project Role (Optional)</Label>
                        <Select value={newMemberProjectRole} onValueChange={setNewMemberProjectRole}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddMember} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Member
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback>{getInitials(member.full_name || member.email)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.full_name || "No name"}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                        {member.job_title && (
                          <div className="text-sm text-muted-foreground">
                            {member.job_title}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.role}
                      </Badge>
                      {member.project_role_name && (
                        <Badge variant="outline">{member.project_role_name}</Badge>
                      )}
                      {member.role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.membership_id!)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Custom Roles</CardTitle>
                  <CardDescription>
                    Create custom roles with specific permissions (e.g., Scrum Master, Frontend Developer)
                  </CardDescription>
                </div>
                <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Custom Role</DialogTitle>
                      <DialogDescription>
                        Define a new role with specific permissions for your team
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input
                          id="roleName"
                          placeholder="e.g., Scrum Master, Frontend Developer"
                          value={newRole.name}
                          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roleDescription">Description</Label>
                        <Textarea
                          id="roleDescription"
                          placeholder="Describe this role's responsibilities"
                          value={newRole.description}
                          onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="permissionLevel">Permission Level</Label>
                        <Select
                          value={newRole.permissionLevel}
                          onValueChange={(value: any) => setNewRole({ ...newRole, permissionLevel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full Access</SelectItem>
                            <SelectItem value="edit">Edit</SelectItem>
                            <SelectItem value="comment">Comment Only</SelectItem>
                            <SelectItem value="view">View Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3 pt-2">
                        <Label>Specific Permissions</Label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Manage Team Members</div>
                              <div className="text-sm text-muted-foreground">
                                Add, remove, and edit team members
                              </div>
                            </div>
                            <Switch
                              checked={newRole.canManageMembers}
                              onCheckedChange={(checked) =>
                                setNewRole({ ...newRole, canManageMembers: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Manage Roles</div>
                              <div className="text-sm text-muted-foreground">
                                Create, edit, and delete custom roles
                              </div>
                            </div>
                            <Switch
                              checked={newRole.canManageRoles}
                              onCheckedChange={(checked) =>
                                setNewRole({ ...newRole, canManageRoles: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Assign Tasks</div>
                              <div className="text-sm text-muted-foreground">
                                Assign tasks to team members
                              </div>
                            </div>
                            <Switch
                              checked={newRole.canAssignTasks}
                              onCheckedChange={(checked) =>
                                setNewRole({ ...newRole, canAssignTasks: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Delete Tasks</div>
                              <div className="text-sm text-muted-foreground">
                                Remove tasks from the project
                              </div>
                            </div>
                            <Switch
                              checked={newRole.canDeleteTasks}
                              onCheckedChange={(checked) =>
                                setNewRole({ ...newRole, canDeleteTasks: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Manage Project</div>
                              <div className="text-sm text-muted-foreground">
                                Edit project details and settings
                              </div>
                            </div>
                            <Switch
                              checked={newRole.canManageProject}
                              onCheckedChange={(checked) =>
                                setNewRole({ ...newRole, canManageProject: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateRole} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Role
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No custom roles yet</p>
                    <p className="text-sm">Create roles like "Scrum Master" or "Frontend Developer"</p>
                  </div>
                ) : (
                  roles.map((role) => (
                    <div
                      key={role.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg">{role.name}</div>
                          {role.description && (
                            <div className="text-sm text-muted-foreground">{role.description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{role.permission_level}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {role.can_manage_members && (
                          <Badge variant="secondary">Manage Members</Badge>
                        )}
                        {role.can_manage_roles && (
                          <Badge variant="secondary">Manage Roles</Badge>
                        )}
                        {role.can_assign_tasks && (
                          <Badge variant="secondary">Assign Tasks</Badge>
                        )}
                        {role.can_delete_tasks && (
                          <Badge variant="secondary">Delete Tasks</Badge>
                        )}
                        {role.can_manage_project && (
                          <Badge variant="secondary">Manage Project</Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectSettings;
