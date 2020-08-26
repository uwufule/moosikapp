import roles from '../../../config/roles.json';
import scopes from '../../../config/scopes.json';

const canEdit = (scope?: number) => (userId: string, userRole: number, uploadedBy: string) =>
  scope && scope & scopes.edit ? uploadedBy === userId || userRole >= roles.moderator : undefined;

export default canEdit;
