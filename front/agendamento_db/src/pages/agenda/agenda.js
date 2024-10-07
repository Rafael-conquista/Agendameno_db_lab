import React, { useState, useEffect } from 'react';
import '../../App.css';
import '../../components/Style/agendamento.css';
import { getUsuarios } from '../../services/usuarios_requests.js';
import { getSalas } from '../../services/salas_requests.js';
import { postEventos } from '../../services/eventos_requests.js';

function Agenda() {
  const [volta, setVolta] = useState(0)
  const [message, setMessage] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState({});
  const [criarEvento, setCriarEvento] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [nomeEvento, setNomeEvento] = useState('');
  const [interno, setInterno] = useState(false);
  const [importante, setImportante] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosConvidados, setUsuariosConvidados] = useState([]);
  const [salas, setSalas] = useState([]);
  const [salaEscolhida, setSalaEscolhida] = useState(false);

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  
  useEffect(() => {
    if (volta == 0) {
      getUsuarios().then((usuarios) => {
          if (usuarios && Array.isArray(usuarios)) {
            setUsuarios(usuarios);
            setVolta(1)
          } else {
            setUsuarios('Sem usuários');
            setVolta(1)
          }
      })
    }
  });

  useEffect(() => {
    if (volta == 0) {
      getSalas().then((salas) => {
          if (salas && Array.isArray(salas)) {
            setSalas(salas);
            setVolta(1)
          } else {
            setSalas('Sem usuários');
            setVolta(1)
          }
      })
    }
  });
  
  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = 32 - new Date(currentYear, currentMonth, 32).getDate();

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    let rows = [];
    let cells = [];

    for (let i = 0; i < firstDay; i++) {
      
      <div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const dayKey = `${currentYear}-${currentMonth + 1}-${date}`;
      const dayDate = new Date(currentYear, currentMonth, date);
      const isToday = dayKey === todayKey;
      const isPast = dayDate < today;
      cells.push(
        <div
          key={dayKey}
          className={`day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
          onClick={() => {
            if (!isPast || isToday) {
                handleDayClick(dayKey);
            }}}
        >
          <div className="day-header">{date}</div>
          <div className="events">
            {events[dayKey] && events[dayKey].map((event, idx) => (
              <div key={idx} className="event">{event}</div>
            ))}
          </div>
        </div>
      );

      if ((date + firstDay) % 7 === 0 || date === daysInMonth) {
        rows.push(<div key={date} className="week">{cells}</div>);
        cells = [];
      }
    }

    return rows;
  };

  const handleDayClick = (dayKey) => {
    const date = new Date(dayKey);
    const htmlFormattedDate = date.toISOString().slice(0, 16);

    setCriarEvento(true);
    setDataInicio(htmlFormattedDate);
  };

  const escolherSala = (idSala) => {
    setSalaEscolhida(idSala)
  };

  const convidarUsuario = (idUsuario) => {
    setUsuariosConvidados(prevUsuariosConvidados => [
        ...prevUsuariosConvidados,
        idUsuario
    ]);
  };

  const fecharPage = () => {
    setCriarEvento(false);
    setSalaEscolhida(false)
    setUsuariosConvidados([])
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  async function salvarEvento() {
    if (dataInicio >= dataFim) {
      setMessage('Data Início precisa ser maior que data Fim')
    }
    else if(nomeEvento == '') {
      setMessage('O evento precisa de um nome')
    }
    else if(descricao == '') {
      setMessage('O evento precisa de uma descrição')
    }
    else if(salaEscolhida == false) {
      setMessage('O evento precisa de uma sala')
    }
    else if(usuariosConvidados.length <= 0) {
      setMessage('O evento precisa de convidados')
    }
    else if (dataInicio > dataFim && nomeEvento != '', descricao != '' && salaEscolhida != '' && usuariosConvidados.length > 0) {
      const response = await postEventos(4,dataInicio,dataFim,importante,nomeEvento,descricao,interno,salaEscolhida,usuariosConvidados)
      setMessage(response.message)
    }
    else {
      setMessage('Erro mortal, contacte o suporte')
    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <navbar>
          <button className='botao-usuario'><a href='/usuarios'><span className="material-symbols-outlined"> person</span> Usuários</a></button>
          <button className='botao-eventos'><a href='/Cadastrousuarios'><span class="material-symbols-outlined">group_add</span> usuarios</a></button>

        </navbar>
        <section>
          <div className="calendar-container">
            <div className="calendar-header">

              <button className="nav-button" onClick={prevMonth}><span className="material-symbols-outlined">arrow_left</span></button>
              <div className="month-year">{`${months[currentMonth]} ${currentYear}`}</div>
              <button className="nav-button" onClick={nextMonth}><span className="material-symbols-outlined">arrow_right</span></button>

            </div>
            <div className="weekdays">
              <div>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sáb</div>
            </div>
            <div className="days">
              {renderCalendar()}
            </div>
            {criarEvento && (
              <section className='criarEvento'>
                <div className='fecharAgendamento' onClick={() => fecharPage()}></div>
                <div className='criarEventoComponent'>
                  <div className='componentDatas'>
                    <div className='datasCriarEvento'>
                      <label htmlFor='dataInicio'>Data Início</label>
                      <input 
                        type='datetime-local' 
                        value={dataInicio} 
                        onChange={(e) => setDataInicio(e.target.value)}
                        id='dataInicio'
                      />
                    </div>
                    <div className='datasCriarEvento'>
                      <label htmlFor='dataFim'>Data Fim</label>
                      <input 
                        type='datetime-local' 
                        value={dataFim} 
                        onChange={(e) => setDataFim(e.target.value)}
                        id='dataFim'
                      />
                    </div>
                  </div>
                  <div className='ComponentCheckBox'>
                    <div className='ComponentCheckBox'>
                      <div className='datasCriarEvento'>
                        <label htmlFor='nomeEvento'>Nome Evento</label>
                        <input
                          type='text' 
                          value={nomeEvento} 
                          onChange={(e) => setNomeEvento(e.target.value)}
                          id='nomeEvento'/>
                      </div>
                      <div className='datasCriarEvento'>
                        <label htmlFor='descricao'>Descricao</label>
                        <input
                          value={descricao} 
                          onChange={(e) => setDescricao(e.target.value)}
                          id='descricao'/>
                      </div>
                    </div>
                    <div className='ComponentCheckBox'>
                      <div className='datasCriarEvento'>
                        <label htmlFor='importante'>Importante</label>
                        <input
                          type='checkbox' 
                          value={importante} 
                          onChange={(e) => importante ? setImportante(false) : setImportante(true)}
                          id='importante'/>
                      </div>
                      <div className='datasCriarEvento'>
                        <label htmlFor='interno'>Interno</label>
                        <input
                          type='checkbox' 
                          value={interno} 
                          onChange={(e) => interno ? setInterno(false) : setInterno(true)}
                          id='interno'/>
                      </div>
                    </div>
                  </div>
                  {usuarios.length > 0 ? usuarios
                  .filter((usuario) => !usuariosConvidados.includes(usuario.idUsuario))
                  .map((usuario) => (
                    <div key={usuario.idUsuario}>
                      <div>{usuario.nome}</div>
                      <div>{usuario.email}</div>
                      <button onClick={() => { convidarUsuario(usuario.idUsuario) }}>Convidar</button>
                    </div>
                  )) : <></>}
                  {!salaEscolhida && salas.length > 0 ? salas.map((sala) => (
                    <div>
                      <div>{sala.nome}</div>
                      <div>{sala.bloco}</div>
                      <div>{sala.andar}</div>
                      <button onClick={() => {escolherSala(sala.idSala)}}>Marcar nesta sala</button>
                    </div>
                  )) : <></>}
                  <button onClick={() => {salvarEvento()}}>Salvar</button>
                  {message &&
                    <p>{message}</p>
                  }
                </div>
              </section>
            )}
          </div>
        </section>
      </header>
    </div>
  );
}

export default Agenda;
