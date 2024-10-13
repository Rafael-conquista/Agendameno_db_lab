import { Route, Routes, BrowserRouter } from "react-router-dom";
import React, { useRef } from 'react';
import Agenda from "./pages/agenda/agenda";
import Entrar from "./pages/login/entrar/entrar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Entrar />}></Route>
        <Route path="/" element={<Agenda />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
