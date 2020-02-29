import Link from 'next/link';

const Login = () => (
  <div>
    <h1>Login</h1>
    <form>
      <label htmlFor="id-0">
        <input id="id-0" type="text" required placeholder="Username" />
      </label>
      <label htmlFor="id-1">
        <input id="id-1" type="password" required placeholder="Password" />
      </label>
      <input type="submit" value="Login" />
      <Link href="/forgot">
        <a>Forgot your password?</a>
      </Link>
      <Link href="/register">
        <a>Need an account?</a>
      </Link>
    </form>
  </div>
);

export default Login;
