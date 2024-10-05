
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsuarioById, updateUsuariosById } from '../services/usuarios_request';  // Importa as funções de busca e update
import './EditUsuarios.css'

export default function EditarUsuarios() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');
    const [telefone, setTelefone] = useState('');
    const [equipe, setEquipe] = useState('');
    const [ativo, setAtivo] = useState(true);  // Novo campo para o status ativo

    const navegacao = useNavigate();
    const { id } = useParams();  // Pega o ID do usuário a partir dos parâmetros da URL

    // Função para carregar o usuário existente quando o componente é montado
    useEffect(() => {
        async function fetchUsuario() {
            try {
                const usuario = await getUsuarioById(id);
                if (usuario) {
                    setNome(usuario.nome);
                    setEmail(usuario.email);
                    setCargo(usuario.idCargo);
                    setTelefone(usuario.telefone);
                    setEquipe(usuario.idEquipe);
                    setAtivo(usuario.ativo);  // Se for relevante
                }
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
            }
        }

        fetchUsuario();  // Chama a função para buscar o usuário
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await updateUsuariosById(id, nome, ativo, email, telefone, cargo, equipe);  // Atualiza o usuário
            if (response) {
                alert('Usuário atualizado com sucesso!');
                navegacao('/usuarios');  // Redireciona após a atualização
            } else {
                alert('Falha ao atualizar o usuário');
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
        }
    };

    return (
        <div className='Editar-Usuarios'>
             <navbar>
                <button className='botao-usuario'>
                    <a href='/usuarios'><span className="material-symbols-outlined">person</span> Voltar</a>
                </button>
          
             </navbar>


            <div className='edit'>
                <h2>Atualizar Usuário</h2>
                <form onSubmit={handleSubmit} className='form-usuario'>
                    <div className="form-group">
                        <label htmlFor="nome">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            required
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cargo">Cargo:</label>
                            <input
                                type="text"
                                id="cargo"
                                name="cargo"
                                required
                                value={cargo}
                                onChange={(e) => setCargo(e.target.value)}  // Se for campo de texto, use value e onChange normalmente
                            />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefone">Telefone:</label>
                        <input
                            type="text"
                            id="telefone"
                            name="telefone"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="equipe">Equipe:</label>
                        <input
                            type="text"
                            id="equipe"
                            name="equipe"
                            required
                            value={equipe}
                            onChange={(e) => setEquipe(e.target.value)}
                        />
                    </div>
                    <div className="switch-container">
                        <label htmlFor="ativo">Ativo:</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={ativo}
                                onChange={(e) => setAtivo(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="form-group">
                        <button type="submit" className='BotaoSalvar'>Atualizar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
