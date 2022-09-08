import logo from './logo.svg';
import './App.css';
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <nav
        style={{
          borderBottom: "solid 1px",
          padding: "1rem",
          margin: "1rem"
        }}
      >
      <Link to="/data">Data</Link>
      <Link to="/voice">Voice</Link>
      </nav>
    </div>
  );
}

export default App;
