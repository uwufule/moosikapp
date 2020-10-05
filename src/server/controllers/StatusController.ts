import { Request, Response } from 'express';
import ConfigProvider from '../core/services/ConfigProvider';
import StatusProvider from '../core/services/StatusProvider';

class StatusController {
  private readonly _statusProvider: StatusProvider;

  constructor(configProvider: ConfigProvider) {
    this._statusProvider = new StatusProvider(configProvider);
  }

  public get = async (req: Request, res: Response) => {
    const status = await this._statusProvider.get();

    res.status(200).json({
      message: 'Successfully retrieved status.',
      result: status,
    });
  };
}

export default StatusController;
