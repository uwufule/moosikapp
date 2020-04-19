interface NavProps {
  className?: string;
  children: JSX.Element | JSX.Element[] | string;
}

const Nav = ({ className, children }: NavProps) => (
  <nav className={className}>
    {children}
  </nav>
);

export default Nav;
