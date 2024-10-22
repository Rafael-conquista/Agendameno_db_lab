export async function getUsuarios() {
    try{
        let response = await fetch('http://127.0.0.1:5000/users')
        let resposta = await response.json()
        return resposta
    }catch(e){
        console.log(e)
        return []
    }
}

export async function getUsuarioById(id) {
    try{
        let response = await fetch(`http://127.0.0.1:5000/user/${id}`)
        let resposta = await response.json()
        return resposta
    }catch(e){
        console.log(e)
        return []
    }
    
}

export async function updateUsuariosById(id, nome, ativo, email, telefone, idCargo, idEquipe) {
    try {
        const Header = new Headers();
        Header.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "nome": nome,
            "ativo": ativo,
            "email": email,
            "telefone": telefone,
            "idCargo": idCargo, // ID do Cargo
            "idEquipe": idEquipe  // ID da Equipe
        });
        
        const reqOption = {
            method: 'PUT',
            headers: Header,
            body: raw
        };

        let response = await fetch(`http://127.0.0.1:5000/user/${id}`, reqOption);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Erro ao atualizar usuário: Status", response.status);
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}


export async function criarUsuario(usuario) {
    try {
        let response = await fetch('http://127.0.0.1:5000/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });
        return response;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return false;
    }
}