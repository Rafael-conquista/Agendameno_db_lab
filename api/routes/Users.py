from flask_restful import Resource
from flask import request
from controllers.Users_controller import UserController

class User(Resource):

    def post(self):
        dados = request.get_json()
        message = UserController.insert_user(self, payload=dados)
        return message
    
    def get(self, id):
        message = UserController.get_usuario(self, id)
        return message
    
    def put(self, id):
        dados = request.get_json()
        message = UserController.update_usuario(self, id, dados)
        return message
    
    def delete(self, id):
        message = UserController.delete_usuario(self, id)
        return message

class Users(Resource):

    def get(self):
        message = UserController.get_usuarios(self)
        return message