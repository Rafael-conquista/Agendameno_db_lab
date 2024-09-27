from flask_restful import Resource
from flask import request
from controllers.Evento_controller import EventoController

class Evento(Resource):    

    def post(self):
        dados = request.get_json()
        message = EventoController.insert_event(self, payload=dados)
        return message