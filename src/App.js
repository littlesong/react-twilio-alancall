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
        <Link to="/import">Import</Link>
      </nav>
      <main>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
