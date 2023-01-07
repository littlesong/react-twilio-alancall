import './App.css';
import { Link, Outlet, useRoutes } from "react-router-dom";
import Stack from 'react-bootstrap/Stack';
import { Navbar } from './components/navbar'

const VERSION = "v0.3.3";

function App() {
  return (
    <div className="App">
      <Stack className='App-header' direction="horizontal" gap={2}><h2>ALLANCALL</h2>
        {VERSION}
        <div className="ms-auto">
          <Navbar />
        </div></Stack>
      <main>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
