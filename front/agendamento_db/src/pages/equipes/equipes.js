import React, { useState, useEffect } from 'react';
import { getEquipes } from '../../services/equipe_requests.js';

function Equipes() {
  const [equipe, setEquipe] = useState([]);
  const [volta, setVolta] = useState(0)
  
  useEffect(() => {
    if (volta == 0) {
      getEquipes().then((equipes) => {
          if (equipes && Array.isArray(equipes)) {
            setEquipe(equipes);
            setVolta(1)
          } else {
            setEquipe('sem item');
            setVolta(1)
          }
      }).catch(() => {
          setEquipe('sem item');
          setVolta(1)
      });
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <navbar>
          <button className='botao-usuario'><a href='/usuarios'><span className="material-symbols-outlined"> person</span> Usuários</a></button>
          <button className='botao-eventos'><a href='/'><span class="material-symbols-outlined">calendar_today</span> Agenda</a></button>
        </navbar>
        <h2>Tabela de Equipes</h2>
        <table>
            { equipe.length > 0 &&
              <thead>
                  <tr>
                      <th>Editar</th>
                      <th>Nome da Equipe</th>
                      <th>Ativo</th>
                  </tr>
              </thead>
            }
            { equipe.length <= 0 &&
              <thead>
                <tr>
                    <th>Nenhuma equipe Cadastrada</th>
                </tr>
              </thead>
            }
            <tbody>
              {equipe.length > 0 ? equipe.map((equipes) => (
                <tr>
                  <td className='editar_equipe'><a href={`/CadastroEquipes/${equipes.idEquipe}`}><span class="material-symbols-outlined">edit_square</span></a></td>
                  <td>{equipes.nome}</td>
                  { equipes.ativo == 1 &&
                    <td>Ativo</td>
                  }
                  { equipes.ativo == 0 &&
                    <td>Inativo</td>
                  }
              </tr>
              )) : <></>}
            </tbody>
        </table>
      </header>
    </div>
  );
}

export default Equipes;
