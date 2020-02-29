import Link from 'next/link';

const Register = () => (
  <div>
    <h1>Register</h1>
    <form>
      <label htmlFor="id-0">
        <input id="id-0" type="text" required placeholder="Username" />
      </label>
      <label htmlFor="id-1">
        <input id="id-1" type="email" required placeholder="E-mail" />
      </label>
      <label htmlFor="id-2">
        <input id="id-2" type="password" placeholder="Password" />
      </label>
      <label htmlFor="id-3">
        <input id="id-3" type="password" placeholder="Re-type password" />
      </label>
      <input type="submit" value="Register" />
      <Link href="/login">
        <a>Already have account?</a>
      </Link>
    </form>
  </div>
);

export default Register;
