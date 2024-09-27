from flask_restful import Resource
from flask import request
from controllers.Equipe_controller import EquipeController

class Equipe(Resource):

    def post(self):
        dados = request.get_json()
        message = EquipeController.insert_equipe(self, payload=dados)
        return message
    
    def get(self, id):
        message = EquipeController.get_equipe(self, id)
        return message
    
    def put(self, id):
        dados = request.get_json()
        message = EquipeController.update_equipe(self, id, dados)
        return message
    
    def delete(self, id):
        message = EquipeController.delete_equipe(self, id)
        return message

class Equipes(Resource):
    def get(self):
        message = EquipeController.get_equipes(self)
        return message