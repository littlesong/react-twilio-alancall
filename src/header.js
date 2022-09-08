import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <nav
        style={{
          borderBottom: "solid 1px",
          padding: "1rem"
        }}
      >
      <Link to="/">Home</Link>
      <Link to="/data">Data</Link>
      <Link to="/voice">Voice</Link>
      </nav>
    </div>
  );
}

export default Header;
