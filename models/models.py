from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

engine = create_engine(os.environ['uri'])

Base = automap_base()

DeclarativeBase = declarative_base()

Base.prepare(engine, reflect=True)

Usuario = Base.classes.Usuario
Sala = Base.classes.Sala
EventoExcluido = Base.classes.EventoExcluido
Evento = Base.classes.Evento
Equipe = Base.classes.Equipe
Convida = Base.classes.Convida
Cargo = Base.classes.Cargo
Agendamento = Base.classes.Agendamento

