from models.models import Equipe, Usuario
from flask import Flask, jsonify
from flask_cors import CORS
from sql_alchemy import banco

class EquipeController:
    def to_dict(cargo):
        return {
            "idEquipe": cargo.IdEquipe,
            "nome": cargo.Nome,
            "ativo": cargo.Ativo
        }


    def insert_equipe(self, payload):
        try:
            new_equipe = Equipe(
                Nome=payload.get('nome', None),
                Ativo=payload.get('ativo', None)
            )
            banco.session.add(new_equipe)
            banco.session.commit()
            for id in payload.get('ids', None):
                result = banco.session.query(Usuario).filter(Usuario.IdUsuario == id).first()
                if not result:
                    return {'message': 'usuário não encontrado'}
                IdEquipe = new_equipe.IdEquipe
                import ipdb; ipdb.set_trace()
                result.IdEquipe = payload.get('idEquipe', IdEquipe)
                banco.session.commit()
            return {'message': 'criado com sucesso'}, 200
        except Exception as e:
            banco.session.rollback()
            return {'message': 'dados incorretos'}, 500
        
    def get_equipe(self, id):
        result = banco.session.query(Equipe).filter(Equipe.IdEquipe == id).first()
        users = banco.session.query(Usuario).filter(Usuario.IdEquipe == id).all()
        users_id = []
        for user in users:
            users_id.append(user.IdUsuario)
        return {'id_equipe': result.IdEquipe, 'nome': result.Nome, 'ativo': result.Ativo, 'users': users_id}
    
    def get_equipes(self):
        results = banco.session.query(Equipe).all()
        cargos = []
        for result in results:
            cargos.append(EquipeController.to_dict(result))
        return cargos, 200
    
    def update_equipe(self, id, dados):
        result = banco.session.query(Equipe).filter(Equipe.IdEquipe == id).first()
        if not result:
            return {'message': 'não encontrado'}
        try:
            result.Nome = dados.get('nome', result.Nome)
            result.Ativo = dados.get('ativo', result.Ativo)
            banco.session.commit()
            return {'message': 'atualizado'}
        except Exception:
            banco.session.rollback()
            return {'message': 'erro durante atualização'}
        
    def delete_equipe(self, id):
        try:
            equipe = banco.session.query(Equipe).filter(Equipe.IdEquipe == id).first()
            
            if not equipe:
                return {'message': 'não encontrado'}, 404

            banco.session.delete(equipe)
            banco.session.commit()
            return {'message': 'Excluído com sucesso'}, 200
        except Exception as e:
            banco.session.rollback()
            return {'message': 'Erro ao excluir cargo', 'error': str(e)}, 500

        
