import './App.css';
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1>ALLANCALL</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          padding: "5px"
        }}
      >
      <Link to="/data">Data</Link>
      <Link to="/voice">Voice</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
