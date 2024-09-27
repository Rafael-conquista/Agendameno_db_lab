from flask_restful import Resource
from flask import request
from controllers.Sala_controller import SalaController

class Sala(Resource):

    def post(self):
        dados = request.get_json()
        message = SalaController.insert_sala(self, payload=dados)
        return message
    
    def get(self, id):
        message = SalaController.get_sala(self, id)
        return message
    
    def put(self, id):
        dados = request.get_json()
        message = SalaController.update_sala(self, id, dados)
        return message

class Salas(Resource):
    
    def get(self):
        message = SalaController.get_cargos(self)
        return message