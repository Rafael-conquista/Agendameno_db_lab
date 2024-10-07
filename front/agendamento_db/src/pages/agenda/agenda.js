import React, { useState } from 'react';
import '../../App.css';

function Agenda() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState({});

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = 32 - new Date(currentYear, currentMonth, 32).getDate();

    let rows = [];
    let cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const dayKey = `${currentYear}-${currentMonth + 1}-${date}`;
      cells.push(
        <div
          key={dayKey}
          className="day"
          onClick={() => handleDayClick(dayKey)}
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
    const event = prompt("Adicione um evento:");
    if (event) {
      setEvents(prevEvents => ({
        ...prevEvents,
        [dayKey]: prevEvents[dayKey] ? [...prevEvents[dayKey], event] : [event]
      }));
    }
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

  return (
    <div className="App">
      <header className="App-header">
        <navbar>
          <button className='botao-usuario'><a href='/usuarios'><span className="material-symbols-outlined"> person</span> Usuários</a></button>
          <button className='botao-eventos'><a href='/CadastroEquipes'><span class="material-symbols-outlined">group_add</span> Equipes</a></button>
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
          </div>
        </section>
      </header>
    </div>
  );
}

export default Agenda;
