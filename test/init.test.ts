import App from '../src/server/App';
import Database from '../src/server/core/infrastructure/database/Database';
import ConfigProvider from '../src/server/core/services/ConfigProvider';
import initializeLoginTests from './login.test';
import initializeLogoutTests from './logout.test';
import initializeRefreshTests from './refresh.test';
import initializeSignupTests from './signup.test';

const configProvider = new ConfigProvider();

const database = new Database(configProvider);
const app = new App(configProvider, database);

before(async () => {
  await app.init();
});

initializeLoginTests(app, database);
initializeLogoutTests(app, database);
initializeRefreshTests(app, database);
initializeSignupTests(app, database);
