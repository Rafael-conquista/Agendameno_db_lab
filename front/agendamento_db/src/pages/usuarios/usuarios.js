import React, { useEffect, useState } from 'react';
import { getUsuarios } from '../../services/usuarios_request';
import './usuarios.css';

function Usuarios() {

  const [User, setUsers] = useState([]);

  useEffect(() => {
    getUsuarios().then((users) => {
        if (users && Array.isArray(users)) {
          setUsers(users);
        } else {
          setUsers([]);
        }
      })
      .catch(() => {
        setUsers([]);
      });
  }, []);

  return (
    <div className="pag-Usuarios">
      <navbar>
        <button className='botao-usuario'>
          <a href='/'><span className="material-symbols-outlined">person</span> Agenda</a>
        </button>
        <button className='botao-eventos'>
          <span className="material-symbols-outlined">calendar_add_on</span> Criar Evento
        </button>
      </navbar>

      <div className="Tabela-Usuarios">
        <h1 style={{ textAlign: 'center' }}>Tabela de usuários</h1>

        <table>
          <thead>
            <tr>
              <th>ID do Usuário</th>
              <th>ID do Cargo</th>
              <th>ID da Equipe</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Cargo</th>
            </tr>
          </thead>
          <tbody>
            {User.length > 0 ? (
              User.map((users) => (
                <tr key={users.idUsuario} className={users.ativo ===1 ? 'ativo':'inativo'}>
                  <td>{users.idUsuario}</td>
                  <td>{users.idCargo}</td>
                  <td>{users.idEquipe}</td>
                  <td>{users.nome}</td>
                  <td>{users.telefone}</td>
                  <td>{users.email}</td>
                  <td>{users.ativo === 1 ? 'Ativo' : 'Inativo'}</td>
                  <span className='editar_usuario'>
                    <a href={`/EditarUsuarios/${users.idUsuario}`}>
                      <span className="material-symbols-outlined">edit_square</span>
                    </a>
                  </span>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="100%" style={{ textAlign: 'center' }}>Nenhum usuário encontrado...</td>
              </tr>
            )}
          </tbody>
        </table>
        <button className='botao-add'>
          <a href='/CriarUsuarios'>
            <span className="material-symbols-outlined">
              add
            </span>
            Criar Usuarios
          </a>
        </button>
      </div>
    </div>
  );
}

export default Usuarios;
