import { Route, Routes, BrowserRouter } from "react-router-dom";
import Entrar from "./pages/login/entrar/entrar";
import React from 'react';
import Agenda from "./pages/agenda/agenda.js"; 
import Usuarios from "./pages/usuarios/usuarios.js"; 
import CriarUsuarios from "./components/CriarUsuarios.js";
import EditUsuarios from "./components/EditUsuarios.js";
import Equipes from "./pages/equipes/equipes.js"; 
import EquipesEditar from "./components/equipesEditar.js"; 
import EquipesCadastro from "./components/equipesCadastro.js"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Entrar />}></Route>
        <Route path="/" element={<Agenda />}></Route>
        <Route path="/usuarios" element={<Usuarios />}></Route>
        <Route path="/EditarUsuarios/:id" element={<EditUsuarios />}></Route>
        <Route path="/CriarUsuarios" element={<CriarUsuarios />}></Route>
        <Route path="/CadastroEquipes" element={<Equipes />}></Route>
        <Route path="/CadastroEquipes/:id" element={<EquipesEditar />}></Route>
        <Route path="/CadastroEquipesCadastro" element={<EquipesCadastro />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
