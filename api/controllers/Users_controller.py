from models.models import Usuario, Equipe, Cargo
from sql_alchemy import banco

class UserController:

    def to_dict(cargo):
        return {
            "idUsuario": cargo.IdUsuario,
            "idCargo": cargo.IdCargo,
            "idEquipe": cargo.IdEquipe,
            "nome": cargo.Nome,
            "telefone": cargo.Telefone,
            "email": cargo.Email,
            "ativo": cargo.Ativo
        }
    
    def insert_user(self, payload):
        try:
            new_user = Usuario(
                Nome=payload.get('nome', None),
                IdCargo=payload.get('idCargo', None),
                IdEquipe=payload.get('idEquipe', None),
                Telefone=payload.get('telefone', None),
                Email=payload.get('email', None),
                Senha=payload.get('senha', None),
                Ativo=payload.get('Ativo', None),
            )
            equipe = banco.session.query(Equipe).filter(Equipe.IdEquipe == payload.get('idEquipe')).first()
            if not equipe:
                return {'message': 'Equipe não encontrada'}, 404
            cargo = banco.session.query(Cargo).filter(Cargo.IdCargo == payload.get('idCargo')).first()
            if not cargo:
                return {'message': 'cargo não encontrada'}, 404
            banco.session.add(new_user)
            banco.session.commit()
            return {'message': 'criado com sucesso'}, 200
        except Exception as e:
            banco.session.rollback()
            return {'message': 'dados incorretos'}, 500

    def get_usuario(self, id):
        result = banco.session.query(Usuario).filter(Usuario.IdUsuario == id).first()
        if result:
            return {
                'idUsuario': result.IdUsuario, 
                'idCargo': result.IdCargo, 
                'idEquipe': result.IdEquipe,
                'nome': result.Nome, 
                'telefone': result.Telefone,
                'email': result.Email,
                'senha': result.Senha,
                'ativo': result.Ativo
            }, 200
        return {"message": "não encontrado"}, 404
    
    def update_usuario(self, id, dados):
        result = banco.session.query(Usuario).filter(Usuario.IdUsuario == id).first()
        if not result:
            return {'message': 'não encontrado'}
        try:
            equipe = banco.session.query(Equipe).filter(Equipe.IdEquipe == dados.get('idEquipe')).first()
            if not equipe:
                return {'message': 'Equipe não encontrada'}, 404
            cargo = banco.session.query(Cargo).filter(Cargo.IdCargo == dados.get('idCargo')).first()
            if not cargo:
                return {'message': 'cargo não encontrada'}, 404
            #import ipdb; ipdb.set_trace()
            result.IdCargo = dados.get('idCargo', result.IdCargo)
            result.IdEquipe = dados.get('idEquipe', result.IdEquipe)
            result.Nome = dados.get('nome', result.Nome)
            result.Ativo = dados.get('ativo', result.Ativo)
            result.Telefone = dados.get('telefone', result.Telefone)
            result.Email = dados.get('email', result.Email)
            result.Senha = dados.get('senha', result.Senha)

            banco.session.commit()
            return {'message': 'atualizado'}
        except Exception as e:
            banco.session.rollback()
            return {'message': str(e)}
        
    def delete_usuario(self, id):
        try:
            usuario = banco.session.query(Usuario).filter(Usuario.IdUsuario == id).first()
            
            if not usuario:
                return {'message': 'não encontrado'}, 404

            banco.session.delete(usuario)
            banco.session.commit()
            return {'message': 'Excluído com sucesso'}, 200
        except Exception as e:
            banco.session.rollback()
            return {'message': 'Erro ao excluir cargo', 'error': str(e)}, 500
        
    def get_usuarios(self):
        results = banco.session.query(Usuario).all()
        usuarios = []
        for result in results:
            usuarios.append(UserController.to_dict(result))
        return usuarios, 200
    
    def login(self, dados):
        usuario = banco.session.query(Usuario).filter(Usuario.Email == dados.get('email')).first()
        if not usuario:
            return {"message": 'nenhum usuário encontrado'}, 404
        if usuario.Senha == dados.get('senha'):
            return {"login": True}
        return {"login": False}
        