import Roles from '../enums/Roles';

interface AuthData {
  userId: string;
  scope: Roles;
}

export default AuthData;
