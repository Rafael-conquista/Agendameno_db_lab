from models.models import Evento, Agendamento, Convida, Usuario, Sala, EventoExcluido
from flask import Flask, jsonify
from sql_alchemy import banco
from datetime import datetime
from sqlalchemy import and_

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
            
            result = banco.session.query(Agendamento) \
                .join(Evento, Evento.idAgendamento == Agendamento.IdAgendamento) \
                .filter(
                    Evento.IdSala == payload.get('id_sala'),
                    and_(data_inicio >= Agendamento.DataInicio, data_inicio <= Agendamento.DataFinal),
                    and_(data_final >= Agendamento.DataInicio, data_final <= Agendamento.DataFinal)
                ) \
                .all()
            if result:
                return {'message': 'A sala já está reservada durante este horário'}, 400

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

    def cancel_event(self, id, payload):
        result = banco.session.query(Evento).filter(Evento.IdEvento == id).first()
        if not result:
            return {'message': 'Evento não encontrado'}, 400
        if result.IdEventoExcluido:
            return {'message': 'Evento já cancelado'}, 400
        try:
            evento_excluido = EventoExcluido(
                DescExcluido=payload.get('descricao', None),
                DataExcluido=datetime.now()
            )
            
            banco.session.add(evento_excluido)
            banco.session.commit()
            id_evento_excluido = evento_excluido.IdEventoExcluido
            result.IdEventoExcluido = id_evento_excluido
            banco.session.commit()
            
            return {'message': 'criado com sucesso'}, 200
        except Exception as e:
            banco.session.rollback()
            return {'message': 'dados incorretos'}, 500

    def get_evento(self, id):
        try:
            result = banco.session.query(Evento, Sala, Agendamento, EventoExcluido) \
                .join(Sala, Evento.IdSala == Sala.IdSala) \
                .join(Agendamento, Evento.idAgendamento == Agendamento.IdAgendamento) \
                .join(EventoExcluido, Evento.IdEventoExcluido == EventoExcluido.IdEventoExcluido) \
                .filter(Evento.IdEvento == id) \
                .first()
            
            response = []
            response.append({
                'evento': {
                    'id_evento': result[0].IdEvento,
                    'nome': result[0].Nome,
                    'descricao': result[0].Descricao,
                    'id_agendamento': result[0].idAgendamento,
                    'id_sala': result[0].IdSala,
                    'id_evento_excluido': result[0].IdEventoExcluido
                },
                'sala': {
                    'id_sala': result[1].IdSala,
                    'nome_sala': result[1].Nome,
                    'bloco': result[1].Bloco,
                    'andar': result[1].Andar,
                },
                'agendamento': {
                    'id_agendamento': result[2].IdAgendamento,
                    'data_inicio': result[2].DataInicio.strftime("%Y-%m-%dT%H:%M:%S"),
                    'data_final': result[2].DataFinal.strftime("%Y-%m-%dT%H:%M:%S")
                }
            })

            if result[0].IdEventoExcluido and len(result)>3:
                response.append({
                    'id_evento_excluido': result[3].IdEventoExcluido,
                    'descricao': result[3].DescExcluido,
                    'data_excluido': result[3].DataExcluido.strftime("%Y-%m-%dT%H:%M:%S")
                })

            return response,200
        except Exception:
            return {'message': 'dados incorretos'}, 500
    
    def order_eventos_by_user(self, id):
        results = banco.session.query(Evento, Sala, Agendamento, Convida) \
        .join(Sala, Evento.IdSala == Sala.IdSala) \
        .join(Agendamento, Evento.idAgendamento == Agendamento.IdAgendamento) \
        .join(Convida, Agendamento.IdAgendamento == Convida.IdAgendamento) \
        .filter(Convida.IdUsuario == id) \
        .order_by(Agendamento.DataInicio.desc()) \
        .all()

        response = []
        for result in results:
            event_dict = {}
            event_dict.update({
                'evento': {
                    'id_evento': result[0].IdEvento,
                    'nome': result[0].Nome,
                    'descricao': result[0].Descricao,
                    'id_agendamento': result[0].idAgendamento,
                    'id_sala': result[0].IdSala,
                    'id_evento_excluido': result[0].IdEventoExcluido
                },
                'sala': {
                    'id_sala': result[1].IdSala,
                    'nome_sala': result[1].Nome,
                    'bloco': result[1].Bloco,
                    'andar': result[1].Andar,
                },
                'agendamento': {
                    'id_agendamento': result[2].IdAgendamento,
                    'data_inicio': result[2].DataInicio.strftime("%Y-%m-%dT%H:%M:%S"),
                    'data_final': result[2].DataFinal.strftime("%Y-%m-%dT%H:%M:%S")
                },
                'convite': {
                    'id_convida': result[3].IdConvida,
                    'importante': result[3].Importante,
                    'aceito': result[3].Aceito
                }
            })
            response.append(event_dict)

        return response, 200 
    
    def order_usuarios_by_evento(self, id):
        results = banco.session.query(Agendamento, Convida) \
        .join(Convida, Agendamento.IdAgendamento == Convida.IdAgendamento) \
        .filter(Convida.IdAgendamento == id) \
        .all()

        response = []
        for result in results:
            event_dict = {}
            event_dict.update(
                {
                    'id_usuario': result[1].IdUsuario,
                    'id_convida': result[1].IdConvida,
                    'importante': result[1].Importante,
                    'aceito': result[1].Aceito
                }
            )
            response.append(event_dict)
        return response, 200
    
    def atualiza_convite(self, id, payload):
        result = banco.session.query(Convida).filter(Convida.IdConvida == id).first()
        if not result:
            return {'message': 'não encontrado'}
        try:
            result.Aceito = payload.get('aceito', result.Aceito)
            banco.session.commit()
            return {'message': 'atualizado'}
        except Exception:
            banco.session.rollback()
            return {'message': 'erro durante atualização'}
        
    def update_evento(self, id, payload):
        result = banco.session.query(Evento).filter(Evento.IdEvento == id).first()
        if not result:
            return {'message': 'não encontrado'}
        try:
            result.Nome = payload.get('nome', result.Nome)
            result.Descricao = payload.get('descricao', result.Descricao)
            banco.session.commit()
            return {'message': 'atualizado'}
        except Exception:
            banco.session.rollback()
            return {'message': 'erro durante atualização'}
