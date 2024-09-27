from flask_restful import Resource
from flask import request
from controllers.Cargo_controller import CargoController

class Cargo(Resource):

    def post(self):
        dados = request.get_json()
        message = CargoController.insert_cargo(self, payload=dados)
        return message
    
    def get(self, id):
        message = CargoController.get_cargo(self, id)
        return message

class Cargos(Resource):
    def get(self):
        message = CargoController.get_cargos(self)
        return message