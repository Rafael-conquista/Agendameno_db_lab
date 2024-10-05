import { Route, Routes, BrowserRouter } from "react-router-dom";
import Agenda from "./pages/agenda/agenda";
import Usuarios from "./pages/usuarios/usuarios";
import EditUsuarios from "./components/EditUsuarios.js";
import CriarUsuarios from "./components/CriarUsuarios.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Agenda />}></Route>
        <Route path="/usuarios" element={<Usuarios />}></Route>
        <Route path="/EditarUsuarios/:id" element={<EditUsuarios />}></Route>
        <Route path="/CriarUsuarios" element={<CriarUsuarios />}></Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
