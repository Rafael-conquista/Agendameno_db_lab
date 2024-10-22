from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from routes.Users import User, Users, UserLogin
from routes.Cargo import Cargo, Cargos
from routes.Equipe import Equipe, Equipes
from routes.Sala import Sala, Salas
from routes.Evento import Evento, DeleteEvento, Ordena_eventos_usuario, Ordena_usuarios_evento, Aceita_convite, ConvidaUsuarios
from flask_restful import Api
from flask_cors import CORS
import os

load_dotenv()

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['uri']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

api = Api(app)

api.add_resource(User, "/user", "/user/<int:id>")
api.add_resource(Users, "/users")
api.add_resource(UserLogin, "/login")
api.add_resource(Cargo, "/cargo", "/cargo/<int:id>")
api.add_resource(Cargos, "/cargos")
api.add_resource(Equipe, "/equipe", "/equipe/<int:id>")
api.add_resource(Equipes, "/equipes")
api.add_resource(Sala, "/sala", "/sala/<int:id>")#id da sala
api.add_resource(Salas, "/salas")
api.add_resource(Evento, "/evento", "/evento/<int:id>")
api.add_resource(DeleteEvento, "/cancelar_evento/<int:id>")
api.add_resource(Ordena_eventos_usuario, "/ordenar_eventos_usuario/<int:id>")#id do usuario
api.add_resource(Ordena_usuarios_evento, "/ordenar_usuario_evento/<int:id>") #id é do agendamento
api.add_resource(Aceita_convite, "/aceita_convite/<int:id>") #id é do convida
api.add_resource(ConvidaUsuarios, "/convida") #id é do convida

if __name__ == '__main__':
    from sql_alchemy import banco
    banco.init_app(app)
    app.run(debug=True)