import React, { useState, useEffect } from 'react';
import { getEquipeById } from '../services/equipe_requests.js';
import { cadastrarEquipeById } from '../services/equipe_requests.js';
import { useParams } from 'react-router-dom';
import './Style/equipe.css';

function EquipesCadastro() {
  const [message, setMessage] = useState('');
  const [nomeEquipeNovo, setNomeEquipeNovo] = useState('');

  const nomeEquipeNovoChange = (e) => {
    setNomeEquipeNovo(e.target.value)
  }

  const salvarInfos = (e) => {
    user_update()
  }
  
  async function user_update() {
    if(nomeEquipeNovo == '') {
      setMessage('Equipe precisa de um nome')
    }
    else if(nomeEquipeNovo != '') {
      const response = await cadastrarEquipeById(nomeEquipeNovo)
      setMessage(response.message)
      setNomeEquipeNovo('')
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
          <h2>Criar Equipe</h2>
          <div className='editarEquipe'>
            <div className='form'>
              <p>Nome Equipe</p>
              <input className='nomeEquipe' placeholder='Nome da Equipe' onChange={nomeEquipeNovoChange}  value={nomeEquipeNovo}></input>
              {message != '' &&
                <p>{message}</p>
              }
              <div className='botoes criarEquipe'>
                <button className='editar_equipe button_trash' onClick={salvarInfos}>Criar <span class="material-symbols-outlined">save</span></button>
              </div>
            </div>
          </div>
        </section>
      </header>
    </div>
  );
}

export default EquipesCadastro;
