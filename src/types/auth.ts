export type PortalRole = 
  | 'esg-admin'
  | 'data-contributor'
  | 'reviewer-approver'
  | 'management'
  | 'auditor-assurer';

export interface PortalRoleConfig {
  id: PortalRole;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  allowsSelfRegistration: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface DemoSession {
  authenticated: boolean;
  role: 'esg_admin' | 'reviewer' | 'contributor' | 'management' | 'auditor';
  mode: 'demo';
  loginTime?: string;
  user?: {
    name: string;
    email: string;
  };
}
