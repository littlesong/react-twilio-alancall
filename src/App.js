import './App.css';
import { Link, Outlet, useRoutes } from "react-router-dom";
import Stack from 'react-bootstrap/Stack';
import { Navbar } from './components/navbar'
import { VERSION } from './constants'

function App() {
  return (
    <div className="App">
      <Stack className='App-header' direction="horizontal" gap={2}>
        <h2>ALLANCALL</h2>
        <div className="ms-auto">
          <Navbar />
        </div>
      </Stack>
      <main>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
