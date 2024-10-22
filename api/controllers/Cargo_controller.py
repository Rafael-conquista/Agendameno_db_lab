from models.models import Cargo
from flask import Flask, jsonify
from flask_cors import CORS
from sql_alchemy import banco

class CargoController:
    def to_dict(cargo):
        return {
            "idCargo": cargo.IdCargo,
            "nome": cargo.Nome,
            "enum_permissao": cargo.EnumPermissao
        }


    def insert_cargo(self, payload):
        try:
            new_cargo = Cargo(
                Nome=payload.get('nome', None),
                EnumPermissao=payload.get('enumPermissao', None)
            )
            
            banco.session.add(new_cargo)
            banco.session.commit()
            return {'message': 'criado com sucesso'}, 200
        except Exception as e:
            banco.session.rollback()
            return {'message': 'dados incorretos'}, 500
        
    def update_cargo(self, id, dados):
        result = banco.session.query(Cargo).filter(Cargo.IdCargo == id).first()
        if not result:
            return {'message': 'não encontrado'}
        try:
            result.Nome = dados.get('nome', result.Nome)
            result.EnumPermissao = dados.get('enumPermissao', result.EnumPermissao)
            banco.session.commit()
            return {'message': 'atualizado'}
        except Exception:
            banco.session.rollback()
            return {'message': 'erro durante atualização'}
        
    def get_cargo(self, id):
        result = banco.session.query(Cargo).filter(Cargo.IdCargo == id).first()
        return {'id_cargo': result.IdCargo, 'nome': result.Nome, 'enumPermissao': result.EnumPermissao}
    
    def get_cargos(self):
        results = banco.session.query(Cargo).all()
        cargos = []
        for result in results:
            cargos.append(CargoController.to_dict(result))
        return cargos, 200
        
