import { Request } from 'express';
import AuthData from '../models/AuthData';

interface AuthRequest extends Request {
  auth: AuthData;
}

export default AuthRequest;
