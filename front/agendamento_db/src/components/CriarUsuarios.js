import './CriarUsuarios.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarUsuario } from '../services/usuarios_request';

export default function CriarUsuarios(){
    const [nome, setNome] = useState('');
    const [idCargo, setIdCargo] = useState('');
    const [idEquipe, setIdEquipe] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [ativo, setAtivo] = useState(false);

    const navigate = useNavigate();

    const Criar = async (e) => {
        e.preventDefault();
        const usuario = {
            nome,
            idCargo,
            idEquipe,
            telefone,
            email,
            senha,
            ativo
        };

        const response = await criarUsuario(usuario);

        if (response.error) {
            alert('Erro ao criar usuário: ' + response.error);
        } else {
            alert('Usuário criado com sucesso!');
            navigate('/usuarios');  // Redireciona para a lista de usuários ou outra página após o cadastro
        }
    };



    return(
        <div className="Criar-Usuarios">
              <navbar>
                <button className='botao-usuario'>
                    <a href='/usuarios'><span className="material-symbols-outlined">person</span> Voltar</a>
                </button>
           
             </navbar>
             
             <div className="forms">
                <h2 style={{
                    marginBottom:'10px'
                }}>Criar Novo Usuário</h2>
                <form onSubmit={Criar} className='form-usuario-Criacao'>
                    <label className='label1' htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        className='input-Cadastro'

                    />

                    <label className='label1' htmlFor="idCargo">ID do Cargo:</label>
                    <input
                        type="text"
                        id="idCargo"
                        name="idCargo"
                        value={idCargo}
                        onChange={(e) => setIdCargo(e.target.value)}
                        required
                        className='input-Cadastro'

                    />

                    <label className='label1' htmlFor="idEquipe">ID da Equipe:</label>
                    <input
                        type="text"
                        id="idEquipe"
                        name="idEquipe"
                        value={idEquipe}
                        onChange={(e) => setIdEquipe(e.target.value)}
                        required
                        className='input-Cadastro'

                    />

                    <label className='label1' htmlFor="telefone">Telefone:</label>
                    <input
                        type="text"
                        id="telefone"
                        name="telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className='input-Cadastro'

                    />

                    <label className='label1' htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='input-Cadastro'

                    />

                    <label className='label1' htmlFor="senha">Senha:</label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        className='input-Cadastro'
                    />

                    <div className="switch-container">
                        <label htmlFor="ativo" className='label1'>Ativo?:</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={ativo}
                                onChange={(e) => setAtivo(e.target.checked)}
                                className='input-Cadastro'
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                        <button type="submit" className='Botao-Criar'>Criar Usuario</button>
                </form>
            </div>
        </div>
    )
}