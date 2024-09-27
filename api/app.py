from flask import Flask
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from routes.Users import User, Users, UserLogin
from routes.Cargo import Cargo, Cargos
from routes.Equipe import Equipe, Equipes
from routes.Sala import Sala, Salas
from routes.Evento import Evento, DeleteEvento
from flask_restful import Api
import os

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['uri']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

api = Api(app)

api.add_resource(User, "/user", "/user/<int:id>")
api.add_resource(Users, "/users")
api.add_resource(UserLogin, "/login")
api.add_resource(Cargo, "/cargo", "/cargo/<int:id>")
api.add_resource(Cargos, "/cargos")
api.add_resource(Equipe, "/equipe", "/equipe/<int:id>")
api.add_resource(Equipes, "/equipes")
api.add_resource(Sala, "/sala", "/sala/<int:id>")
api.add_resource(Salas, "/salas")
api.add_resource(Evento, "/evento", "/evento/<int:id>")
api.add_resource(DeleteEvento, "/cancelar_evento/<int:id>")

if __name__ == '__main__':
    from sql_alchemy import banco
    banco.init_app(app)
    app.run(debug=True)