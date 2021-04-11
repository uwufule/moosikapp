import FileType from 'file-type';
import HttpErrors from 'http-errors';
import FetchHelper from '../infrastructure/internet/FetchHelper';
import ConfigProvider from './ConfigProvider';
import UploadTargetUriProvider from './UploadTargetUriProvider';

class CdnServerProvider {
  private readonly _uploadTargetUriProvider: UploadTargetUriProvider;

  constructor(configProvider: ConfigProvider) {
    this._uploadTargetUriProvider = new UploadTargetUriProvider(configProvider);
  }

  public uploadToCdn = async (buffer: Buffer, contentType: string) => {
    const fileType = await FileType.fromBuffer(buffer);
    if (fileType?.mime !== contentType) {
      throw new HttpErrors.BadRequest('Header `Content-Type` and file type does not match.');
    }

    return this.putAsync(buffer, contentType);
  };

  private putAsync = async (buffer: Buffer, contentType: string) => {
    const res = await FetchHelper.tryFetch(this._uploadTargetUriProvider.get(), {
      method: 'PUT',
      headers: {
        'content-type': contentType,
      },
      body: buffer,
    });

    if (!res) {
      throw new HttpErrors.ServiceUnavailable('Cdn server is unavailable.');
    }

    const fileLocation = res.headers.get('Location');
    if (!fileLocation) {
      throw new HttpErrors.BadGateway('Cdn server return no file location path.');
    }

    return fileLocation;
  };
}

export default CdnServerProvider;
