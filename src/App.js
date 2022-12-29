import './App.css';
import { Link, Outlet } from "react-router-dom";
import Stack from 'react-bootstrap/Stack';

const VERSION = "v0.2.2";

function App() {
  return (
    <div className="App">
      <Stack className='App-header' direction="horizontal" gap={2}><h2>ALLANCALL</h2>
        {VERSION}
        <div className="ms-auto">
        <nav
          style={{
            padding: "0px"
          }}
        >
          <Link to="/data">Data</Link>
          <Link to="/voice">Call</Link>
          <Link to="/import">Import</Link>
        </nav></div></Stack>
      <main>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
