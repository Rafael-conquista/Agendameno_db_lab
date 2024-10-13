import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionamento
import '../../App.css';

function Equipe() {
  const [nomeEquipe, setNomeEquipe] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([]);
  const [mensagemErro, setMensagemErro] = useState(''); // Estado para mensagens de erro
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    // Fazendo a requisição GET para o endpoint
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/users');
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data); // Armazena a lista de usuários
        } else {
          console.error('Erro ao buscar os usuários');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };

    fetchUsuarios();
  }, []);

  // Função para lidar com a seleção/deseleção de usuários
  const handleCheckboxChange = (usuarioId) => {
    setUsuariosSelecionados((prevSelecionados) => {
      if (prevSelecionados.includes(usuarioId)) {
        // Remove o usuário se ele já está na lista
        return prevSelecionados.filter((id) => id !== usuarioId);
      } else {
        // Adiciona o usuário à lista
        return [...prevSelecionados, usuarioId];
      }
    });
  };

  // Função para enviar o payload
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nome: nomeEquipe,
      ativo: true, // Assumindo que a equipe estará ativa
      ids: usuariosSelecionados
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/equipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json(); // Lendo a resposta da API

      if (response.ok && result.message === "criado com sucesso") {
        // Se o retorno for "criado com sucesso", redireciona para a rota inicial
        navigate('/');
      } else {
        // Caso contrário, exibe a mensagem de erro
        setMensagemErro('Erro ao criar equipe.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMensagemErro('Erro na requisição.'); // Exibe mensagem de erro se a requisição falhar
    }
  };

  return (
    <div className="form-container App-header">
      <h2>Formulário de Equipe</h2>
      {mensagemErro && <p className="erro">{mensagemErro}</p>} {/* Exibe mensagem de erro, se houver */}
      <form onSubmit={handleSubmit} className='calendar-container'>
        <div className="form-group ">
          <label htmlFor="nomeEquipe">Nome da Equipe:</label>
          <input
            type="text"
            id="nomeEquipe"
            value={nomeEquipe}
            onChange={(e) => setNomeEquipe(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Selecionar Usuários:</label>
          {usuarios.map((usuario) => (
            <div key={usuario.idUsuario}>
              <input
                type="checkbox"
                id={`usuario-${usuario.idUsuario}`}
                value={usuario.idUsuario}
                onChange={() => handleCheckboxChange(usuario.idUsuario)}
              />
              <label htmlFor={`usuario-${usuario.idUsuario}`}>{usuario.nome}</label>
            </div>
          ))}
        </div>

        <button type="submit">Salvar</button>
      </form>

      <div className="usuarios-selecionados">
        <h3>Usuários Selecionados:</h3>
        <ul>
          {usuariosSelecionados.map((id) => {
            const usuario = usuarios.find((u) => u.idUsuario === id);
            return <li key={id}>{usuario?.nome}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default Equipe;
