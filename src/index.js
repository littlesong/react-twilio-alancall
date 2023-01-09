import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import DataPage from './routes/data';
import VoicePage from './routes/voice';
import ImportCsv from './routes/import';
import AboutPage from './routes/about';
import PollPage from './routes/poll';
import PollListPage from './routes/polls';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route path="about" element={<AboutPage />} />
          <Route path="data" element={<DataPage />} />
          <Route path="import" element={<ImportCsv />} />
          <Route path="poll" element={<PollListPage />} />
          <Route path="poll/:id" element={<PollPage />} />
          <Route path="*" element={<VoicePage />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
