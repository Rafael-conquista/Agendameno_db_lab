import { Route, Routes, BrowserRouter } from "react-router-dom";
import React, { useRef } from 'react';
import Agenda from "./pages/agenda/agenda";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Agenda />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
