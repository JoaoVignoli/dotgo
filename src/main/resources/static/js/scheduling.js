document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const calendarWeekContainer = document.getElementById('calendar-week-container');
    const calendarMonthContainer = document.getElementById('calendar-month-container');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const toggleButton = document.getElementById('toggle-calendar-view');
    const scheduleButton = document.querySelector('.schedule-btn');

    // --- DADOS DE EXEMPLO ---
    const serviceDurationHours = 4;
    const breakTimeMinutes = 90;
    const unavailableDates = ['2025-07-13', '2025-07-14'];
    const bookedSlots = { '2025-07-17': ['10:00'] };

    // --- ESTADO DA APLICAÇÃO ---
    let viewDate = new Date();      // A data que o calendário está mostrando (inicia com hoje)
    let selectedDate = null;      // A data que o usuário CLICOU (inicia nula)
    let isMonthView = false;

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    // Lógica de renderização principal
    function renderAll() {
        // O calendário sempre mostra a data de visualização
        renderWeekCalendar(viewDate);
        renderMonthCalendar(viewDate);
        updateCalendarView();
        
        // Os horários também são mostrados para a data de visualização
        renderTimeSlots(viewDate);
    }

    function renderWeekCalendar(date) {
        calendarWeekContainer.innerHTML = '';
        const weekDays = getWeekDays(date);
        monthYearDisplay.textContent = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
        weekDays.forEach(day => {
            const dayElement = createDayElement(day);
            calendarWeekContainer.appendChild(dayElement);
        });
    }

    function renderMonthCalendar(date) {
        calendarMonthContainer.innerHTML = '';
        const monthDays = getMonthDays(date);
        const dayLetters = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        dayLetters.forEach(letter => {
            const letterEl = document.createElement('div');
            letterEl.className = 'month-day-letter';
            letterEl.textContent = letter;
            calendarMonthContainer.appendChild(letterEl);
        });
        monthDays.forEach(day => {
            if (!day) {
                calendarMonthContainer.appendChild(document.createElement('div'));
                return;
            }
            const dayElement = createDayElement(day, true);
            calendarMonthContainer.appendChild(dayElement);
        });
    }

    function renderTimeSlots(date) {
        timeSlotsContainer.innerHTML = '';
        const availableSlots = generateAvailableSlots(date);
        if (availableSlots.length === 0 || isDateUnavailable(date)) {
            timeSlotsContainer.innerHTML = '<p>Nenhum horário disponível para este dia.</p>';
            return;
        }
        availableSlots.forEach(slot => {
            const timeSlotButton = document.createElement('button');
            timeSlotButton.className = 'time-slot';
            timeSlotButton.textContent = slot;
            timeSlotButton.dataset.time = slot;
            timeSlotsContainer.appendChild(timeSlotButton);
        });
    }

    // --- FUNÇÕES DE GERAÇÃO DE DADOS ---
    function generateAvailableSlots(date) {
        const slots = [];
        const dateString = date.toISOString().split('T')[0];
        const alreadyBooked = bookedSlots[dateString] || [];
        let currentTime = new Date(date);
        currentTime.setHours(8, 0, 0, 0);
        const endTime = new Date(date);
        endTime.setHours(22, 0, 0, 0);
        while (currentTime < endTime) {
            const slotTime = currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            if (!alreadyBooked.includes(slotTime)) {
                slots.push(slotTime);
            }
            currentTime.setHours(currentTime.getHours() + serviceDurationHours);
            currentTime.setMinutes(currentTime.getMinutes() + breakTimeMinutes);
        }
        return slots;
    }

    // --- FUNÇÕES AUXILIARES ---
    function createDayElement(day, isMonthViewElement = false) {
        const dayContainer = document.createElement('div');
        dayContainer.className = 'day-container';
        if (!isMonthViewElement) {
            const dayLetter = document.createElement('span');
            dayLetter.className = 'day-letter';
            dayLetter.textContent = day.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase();
            dayContainer.appendChild(dayLetter);
        }
        const dayNumber = document.createElement('button');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day.getDate();
        dayNumber.dataset.date = day.toISOString().split('T')[0];
        
        // A classe 'selected' é baseada na `selectedDate` (a data clicada)
        if (selectedDate && isSameDay(day, selectedDate)) {
            dayNumber.classList.add('selected');
        }
        if (isDateUnavailable(day)) {
            dayNumber.classList.add('unavailable');
        }
        dayContainer.appendChild(dayNumber);
        return dayContainer;
    }

    function getWeekDays(date) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            week.push(day);
        }
        return week;
    }

    function getMonthDays(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = [];
        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            daysInMonth.push(null);
        }
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            daysInMonth.push(new Date(year, month, i));
        }
        return daysInMonth;
    }

    function isSameDay(d1, d2) {
        if (!d1 || !d2) return false;
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    }

    function isDateUnavailable(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return true;
        const dateString = date.toISOString().split('T')[0];
        return unavailableDates.includes(dateString);
    }

    function updateCalendarView() {
        calendarMonthContainer.classList.toggle('hidden', !isMonthView);
        calendarWeekContainer.classList.toggle('hidden', isMonthView);
    }

    function handleDaySelection(target) {
        if (target && target.classList.contains('day-number') && !target.classList.contains('unavailable')) {
            // Atualiza tanto a data de visualização quanto a data selecionada
            viewDate = new Date(target.dataset.date + 'T12:00:00Z');
            selectedDate = new Date(target.dataset.date + 'T12:00:00Z');
            renderAll();
        }
    }

    // --- EVENT LISTENERS ---
    toggleButton.addEventListener('click', () => {
        isMonthView = !isMonthView;
        updateCalendarView();
    });

    calendarWeekContainer.addEventListener('click', (e) => handleDaySelection(e.target.closest('.day-number')));
    calendarMonthContainer.addEventListener('click', (e) => handleDaySelection(e.target.closest('.day-number')));

    timeSlotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('time-slot')) {
            const oldSelected = timeSlotsContainer.querySelector('.time-slot.selected');
            if (oldSelected) oldSelected.classList.remove('selected');
            e.target.classList.add('selected');
        }
    });

    scheduleButton.addEventListener('click', () => {
        const selectedTimeEl = timeSlotsContainer.querySelector('.time-slot.selected');
        
        // A validação agora checa a `selectedDate`, que só é definida após um clique.
        if (!selectedDate) {
            alert('Por favor, selecione uma data no calendário.');
            return;
        }
        if (!selectedTimeEl) {
            alert('Por favor, selecione um horário.');
            return;
        }

        const selectedTime = selectedTimeEl.dataset.time;
        const formattedDate = selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        
        // Salva os dados do agendamento no localStorage para usar na tela de ordens
        const agendamentoData = {
            prestador: 'Pedro Augusto',
            servico: 'Muros e Paredes',
            data: formattedDate,
            horario: selectedTime,
            observacoes: document.querySelector('.observations-section textarea').value || ''
        };
        
        localStorage.setItem('ultimoAgendamento', JSON.stringify(agendamentoData));
        
        console.log('Agendamento realizado para:', formattedDate, 'às', selectedTime);
        
        // Redireciona para a tela de ordens de serviço
        window.location.href = 'orders.html';
    });

    // --- INICIALIZAÇÃO ---
    renderAll();
});

