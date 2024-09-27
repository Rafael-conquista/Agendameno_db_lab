from flask_restful import Resource
from flask import request
from controllers.Evento_controller import EventoController

class Evento(Resource):    

    def post(self):
        dados = request.get_json()
        message = EventoController.insert_event(self, payload=dados)
        return message
    
    def get(self, id):
        message = EventoController.get_evento(self, id)
        return message
    
class DeleteEvento(Resource):
    def post(self, id):
        dados = request.get_json()
        message = EventoController.cancel_event(self, id, payload=dados)
        return message
    
class Ordena_eventos_usuario(Resource):
    def get(self, id):
        message = EventoController.order_eventos_by_user(self, id)
        return message

class Ordena_usuarios_evento(Resource):
    def get(self, id):
        message = EventoController.order_usuarios_by_evento(self, id)
        return message

    #adicionar um put para cada uma das tabelas para informações pontuais