from models.models import Evento, Agendamento, Convida, Usuario, Sala
from flask import Flask, jsonify
from sql_alchemy import banco
from datetime import datetime

class EventoController:

    def verify_users(self, payload):
        for user in payload.get('ids_convidados'):
            result = banco.session.query(Usuario).filter(Usuario.IdUsuario == user).first()
            if not result:
                return False
        result = banco.session.query(Usuario).filter(Usuario.IdUsuario == payload.get('id_usuario')).first()
        if not result:
            return False
        return True

    def insert_agendamento(self, payload):
        new_agendamento = Agendamento(
            IdUsuario = payload.get('id_usuario'),
            DataInicio = datetime.strptime(payload.get('data_inicio'), "%Y-%m-%dT%H:%M:%S"),
            DataFinal = datetime.strptime(payload.get('data_final'), "%Y-%m-%dT%H:%M:%S")

        )
        banco.session.add(new_agendamento)
        banco.session.commit()
        IdAgendamento = new_agendamento.IdAgendamento
        return IdAgendamento
    
    def insert_convites(self, payload, id_agendamento):
        for user in payload.get('ids_convidados'):
            new_convite = Convida(
                IdUsuario = user,
                IdAgendamento = id_agendamento,
                Importante = payload.get('importante')
            )
            banco.session.add(new_convite)
        new_convite = Convida(
                IdUsuario = payload.get('id_usuario'),
                IdAgendamento = id_agendamento,
                Importante = payload.get('importante')
            )
        banco.session.add(new_convite)
        banco.session.commit()

    def insert_event(self, payload):
        try:
            campos_obrigatorios = ['id_usuario', 'data_inicio', 'data_final', 'importante', 'id_sala', 'nome', 'ids_convidados']
            for campo in campos_obrigatorios:
                if not payload.get(campo):
                    return {'message': f'O campo {campo} é obrigatório e está faltando ou inválido.'}, 400
            
            if not EventoController.verify_users(self, payload):
                return {'message':'um dos usuários não foi encontrado'}, 400
            
            result = banco.session.query(Sala).filter(Sala.IdSala == payload.get('id_sala')).first()
            if not result:
                return {'message':'Sala não foi encontrada'}, 400

            data_inicio = datetime.fromisoformat(payload.get('data_inicio'))
            data_final = datetime.fromisoformat(payload.get('data_final'))
            # Verificação se a data_inicio é depois da data atual
            agora = datetime.now()
            if data_inicio <= agora:
                return {'message': 'A data de início deve ser posterior à data e hora atual'}, 400
            
            # Verificação se a data_final é maior que a data_inicio
            if data_final <= data_inicio:
                return {'message': 'A data final deve ser posterior à data de início'}, 400

            #cria o agendamento
            IdAgendamento = EventoController.insert_agendamento(self, payload)
            #convida todos os usuários listados em ids_convidados e o id que enviou a solicitação
            EventoController.insert_convites(self, payload, IdAgendamento)
            new_evento = Evento(
                IdSala = payload.get('id_sala'),
                idAgendamento=IdAgendamento,
                Nome = payload.get('nome'),
                Interno = payload.get('interno', None),
                Descricao = payload.get('descricao', None)
            )
            banco.session.add(new_evento)
            banco.session.commit()

            return {'message': 'criado com sucesso'}, 200
        except Exception as e:
            banco.session.rollback()
            return {'message': 'dados incorretos'}, 500