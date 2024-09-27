from flask import Flask
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from routes.Users import User, Users
from routes.Cargo import Cargo, Cargos
from routes.Equipe import Equipe, Equipes
from flask_restful import Api
import os

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['uri']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

banco = SQLAlchemy(app)
api = Api(app)

api.add_resource(User, "/user", "/user/<int:id>")
api.add_resource(Users, "/users")
api.add_resource(Cargo, "/cargo", "/cargo/<int:id>")
api.add_resource(Cargos, "/cargos")
api.add_resource(Equipe, "/equipe", "/equipe/<int:id>")
api.add_resource(Equipes, "/equipes")

if __name__ == '__main__':
    from sql_alchemy import banco
    banco.init_app(app)
    app.run(debug=True)