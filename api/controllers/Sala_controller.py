from models.models import Sala
from flask import Flask, jsonify
from sql_alchemy import banco

class SalaController:
    def to_dict(sala):
        return {
            "idSala": sala.IdSala,
            "nome": sala.Nome,
            "bloco": sala.Bloco,
            "andar": sala.Andar
        }
    
    def insert_sala(self, payload):
        try:
            new_sala = Sala(
                Nome=payload.get('nome', None),
                Bloco=payload.get('bloco', None),
                Andar=payload.get('andar', None),
            )
            
            banco.session.add(new_sala)
            banco.session.commit()
            return {'message': 'criado com sucesso'}, 200
        except Exception as e:
            banco.session.rollback()
            return {'message': 'dados incorretos'}, 500
        
    def get_sala(self, id):
        result = banco.session.query(Sala).filter(Sala.IdSala == id).first()
        return {'id_sala': result.IdSala, 'nome': result.Nome, 'bloco': result.Bloco, 'andar': result.Andar}
    
    def update_sala(self, id, dados):
        result = banco.session.query(Sala).filter(Sala.IdSala == id).first()
        if not result:
            return {'message': 'não encontrado'}
        try:
            result.Nome = dados.get('nome', result.Nome)
            result.Bloco = dados.get('bloco', result.Bloco)
            result.Andar = dados.get('andar', result.Andar)
            banco.session.commit()
            return {'message': 'atualizado'}
        except Exception:
            banco.session.rollback()
            return {'message': 'erro durante atualização'}
        
    def get_cargos(self):
        results = banco.session.query(Sala).all()
        salas = []
        for result in results:
            salas.append(SalaController.to_dict(result))
        return salas, 200
