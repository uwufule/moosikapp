import Roles from '../enums/Roles';
import ConfigProvider from '../services/ConfigProvider';

class SongUtils {
  private readonly _configProvider: ConfigProvider;

  constructor(configProvider: ConfigProvider) {
    this._configProvider = configProvider;
  }

  public inUserFavorites = (userId: string, likes: string[]) => {
    return likes.includes(userId);
  };

  public canModifiedByUser = (userId: string, userRole: Roles, uploadedBy: string) => {
    return userId === uploadedBy || userRole >= this._configProvider.roles.ADMIN;
  };
}

export default SongUtils;
