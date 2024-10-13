import { useState } from 'react';
import './entrar.css'
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../../../services/loginService';

export default function Login() {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate()

    const Entrar = async (evento) =>{
        evento.preventDefault()
        const login = {email, senha}

        try{
            const response = await loginUsuario(login)
            if(response.error){
                alert(response.error)
            }else if(response.login){
                console.log('UsuarioID', response.idUsuario)
                alert('Logado com sucesso!')
                localStorage.setItem('idUsuario',response.idUsuario)
                navigate('/')
            }else{
                alert('Usuário ou senha inválidos!')
            }
        }catch(error){
            console.error(error)
        }
    }

    return (
        <div className="LoginPage">
            <h1 style={{
                fontSize:'70px',
                margin:'40px',  
                color:'white'
            }}>Bem-vindo!</h1>
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={Entrar}>
                    <div className="input-group">
                        <label for="username">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label for="password">Senha</label>
                        <input type="password" id="password" name="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                    </div>
                    <button type="submit" className="login-button">Entrar</button> 
                </form>
            </div>
        </div>
    );
}