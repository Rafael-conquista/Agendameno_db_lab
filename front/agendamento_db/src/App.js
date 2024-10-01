import { Route, Routes, BrowserRouter } from "react-router-dom";
import React from 'react';
import Agenda from "./pages/agenda/agenda.js"; 
import Usuarios from "./pages/usuarios/usuarios.js"; 
import Equipes from "./pages/equipes/equipes.js"; 
import EquipesEditar from "./components/equipesEditar.js"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Agenda />}></Route>
        <Route path="/usuarios" element={<Usuarios />}></Route>
        <Route path="/CadastroEquipes" element={<Equipes />}></Route>
        <Route path="/CadastroEquipes/:id" element={<EquipesEditar />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
