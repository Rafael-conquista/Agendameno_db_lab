import React, { useState, useEffect } from 'react';
import '../../App.css';
import '../../components/Style/agendamento.css';
import { getUsuarios } from '../../services/usuarios_requests.js';
import { getEventosUsuario } from '../../services/agendamento_usuario_requests.js';
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
  const [agendamento, setAgendamento] = useState([]);
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
      getEventosUsuario(4).then((agendamentos) => {
          if (agendamentos && Array.isArray(agendamentos)) {
            setAgendamento(agendamentos.agendamento);
            setVolta(1)
            console.log(agendamento)
          } else {
            setAgendamento('Sem usuários');
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

  const removerSala = () => {
    setSalaEscolhida('')
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
    setMessage(false)
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
          <button className='botao-usuario'><span class="material-symbols-outlined"> person</span> Usuários</button>
          <button className='botao-eventos'><span class="material-symbols-outlined"> calendar_add_on</span> Criar Evento</button>
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
                  <div className='camposAgendamentos'>
                    <div className='componentDatas'>
                      <div className='datasCriarEvento'>
                        <div class="container_input">
                          <input 
                            required="" 
                            type="datetime-local" 
                            name="text" 
                            value={dataInicio} 
                            class="input_text"
                            onChange={(e) => setDataInicio(e.target.value)}
                            />
                          <label class="label">Data Início</label>
                        </div>
                      </div>
                      <div className='datasCriarEvento'>
                        <div class="container_input">
                          <input 
                            required="" 
                            type="datetime-local" 
                            name="text" 
                            value={dataFim} 
                            class="input_text"
                            onChange={(e) => setDataFim(e.target.value)}
                            />
                          <label class="label">Data Fim</label>
                        </div>
                      </div>
                    </div>
                    <div className='ComponentNomes'>
                      <div className='datasCriarEvento'>
                        <div class="container_input">
                          <input 
                            required="" 
                            type="text" 
                            name="text" 
                            value={nomeEvento} 
                            class="input_text"
                            onChange={(e) => setNomeEvento(e.target.value)}
                            />
                          <label class="label">Nome do Evento</label>
                        </div>
                      </div>
                      <div className='datasCriarEvento'>
                        <div class="container_input">
                          <input 
                            required="" 
                            type="text" 
                            name="text" 
                            value={descricao} 
                            class="input_text"
                            onChange={(e) => setDescricao(e.target.value)}
                            />
                          <label class="label">Descrição</label>
                        </div>
                      </div>
                    </div>
                    <div className='ComponentCheckBox'>
                      <div className='datasCriarEvento'>
                        <label htmlFor='importante'>Importante</label>
                        <input 
                          value={importante} 
                          onChange={(e) => importante ? setImportante(false) : setImportante(true)}
                          class="check"
                          type="checkbox"/>
                      </div>
                      <div className='datasCriarEvento'>
                        <label htmlFor='interno'>Interno</label>
                        <input 
                          value={interno} 
                          onChange={(e) => interno ? setInterno(false) : setInterno(true)} 
                          class="check"
                          type="checkbox"/>
                      </div>
                    </div>
                    <button onClick={() => {salvarEvento()}} class="button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" class="svg-icon"><g stroke-width="2" stroke-linecap="round" stroke="#fff"><rect y="5" x="4" width="16" rx="2" height="16"></rect><path d="m8 3v4"></path><path d="m16 3v4"></path><path d="m4 11h16"></path></g></svg>
                      <span class="lable">Salvar</span>
                    </button>
                    {message &&
                      <p>{message}</p>
                    }
                  </div>
                  <div className='camposSalaConvidados'>
                    {usuarios.length > 0 ? usuarios
                      .filter((usuario) => !usuariosConvidados.includes(usuario.idUsuario))
                      .map((usuario) => (
                        <div class="usuariosAgendamentos card">
                          <span>{usuario.nome}</span>
                          <button onClick={() => { convidarUsuario(usuario.idUsuario) }} class="button">
                           <span class="span"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 21" height="21" width="23" class="svg-icon">
                                                  <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="black" d="M1.97742 19.7776C4.45061 17.1544 7.80838 15.5423 11.5068 15.5423C15.2053 15.5423 18.5631 17.1544 21.0362 19.7776M16.2715 6.54229C16.2715 9.17377 14.1383 11.307 11.5068 11.307C8.87535 11.307 6.74212 9.17377 6.74212 6.54229C6.74212 3.91082 8.87535 1.77759 11.5068 1.77759C14.1383 1.77759 16.2715 3.91082 16.2715 6.54229Z"></path>
                                              </svg></span>
                            <span class="lable">Convidar</span>
                          </button>
                        </div>
                    )) : <></>}
                  </div>
                  <div className='camposSalaConvidados'>
                    {!salaEscolhida && salas.length > 0 ? salas.map((sala) => (
                        <div class="usuariosAgendamentos card">
                          <span>{sala.nome}, {sala.bloco}, {sala.andar}</span>
                          <button onClick={() => {escolherSala(sala.idSala)}} class="button">
                           <span class="span">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" class="svg-icon">
                              <g stroke-width="2" stroke-linecap="round" stroke="#fff">
                                <rect y="5" x="4" width="16" rx="2" height="16">
                                </rect>
                                <path d="m8 3v4"></path>
                                <path d="m16 3v4"></path>
                                <path d="m4 11h16"></path>
                              </g>
                            </svg>
                           </span>
                            <span class="lable">Reservar</span>
                          </button>
                        </div>
                    )) : <></>}
                  </div>
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
