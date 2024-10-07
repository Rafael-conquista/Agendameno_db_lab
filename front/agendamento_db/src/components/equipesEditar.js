import React, { useState, useEffect } from 'react';
import { getEquipeById } from '../services/equipe_requests.js';
import { updateEquipeById } from '../services/equipe_requests.js';
import { useParams } from 'react-router-dom';
import './Style/equipe.css';

function EquipesEditar() {
  const [message, setMessage] = useState('');
  const [nomeEquipeNovo, setNomeEquipeNovo] = useState('');
  const [volta, setVolta] = useState(0)
  const [ativo, setAtivo] = useState(0)
  const { id } = useParams();
  
  useEffect(() => {
    if (volta == 0) {
      getEquipeById(id).then((equipes) => {
        setAtivo(equipes.ativo)
        console.log(equipes)
        setNomeEquipeNovo(equipes.nome)
        setVolta(1)
      }).catch(() => {
          setVolta(1)
      });
    }
  });

  const nomeEquipeNovoChange = (e) => {
    setNomeEquipeNovo(e.target.value)
  }

  const salvarInfos = (e) => {
    user_update()
  }

  const apagarInfos = (e) => {
    user_update_apagar()
  }

  async function user_update() {
    const response = await updateEquipeById(id, nomeEquipeNovo, ativo)
    setMessage(response.message)
  }

  async function user_update_apagar() {
    if (ativo == 1) {
      const response = await updateEquipeById(id, nomeEquipeNovo, 0)
      setMessage(response.message)
    }
    else if (ativo == 0) {
      const response = await updateEquipeById(id, nomeEquipeNovo, 1)
      setMessage(response.message)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <navbar>
          <button className='botao-usuario'><a href='/usuarios'><span className="material-symbols-outlined"> person</span> Usuários</a></button>
          <button className='botao-eventos'><a href='/CadastroEquipes'><span class="material-symbols-outlined">group_add</span> Equipes</a></button>
        </navbar>
        <section className='editarEquipeComponent'>
          <h2>Editar Equipe</h2>
          <div className='editarEquipe'>
            <form>
              <div>
                <p>Nome Equipe</p>
                <input className='nomeEquipe' placeholder='Nome da Equipe' onChange={nomeEquipeNovoChange}  value={nomeEquipeNovo}></input>
                <div className='botoes'>
                  <button className='editar_equipe button_trash' onClick={salvarInfos}>Salvar <span class="material-symbols-outlined">save</span></button>
                  { ativo == 1 &&
                    <div className='editar_equipe'>
                      <button className='button_trash' onClick={apagarInfos}>Desativar <span class="material-symbols-outlined">delete</span></button>
                    </div>
                  }
                  { ativo == 0 &&
                    <div className='editar_equipe'>
                      <button className='button_trash reativeButton' onClick={apagarInfos}>Reativar <span class="material-symbols-outlined">restore_from_trash</span></button>
                    </div>
                  }
                </div>
              </div>
            </form>
          </div>
        </section>
      </header>
    </div>
  );
}

export default EquipesEditar;
