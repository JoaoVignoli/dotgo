document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const calendarWeekContainer = document.getElementById('calendar-week-container');
    const calendarMonthContainer = document.getElementById('calendar-month-container');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const toggleButton = document.getElementById('toggle-calendar-view');

    // --- DADOS DE EXEMPLO ---
    const serviceDurationHours = 4;
    const breakTimeMinutes = 90;
    const unavailableDates = ['2025-07-13', '2025-07-14'];
    const bookedSlots = { '2025-07-17': ['10:00'] };

    // --- ESTADO DA APLICAÇÃO ---
    let selectedDate = new Date('2025-07-18T12:00:00Z'); // Dia 18 para corresponder ao print
    let isMonthView = false; // Controla a visualização atual

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    function renderCalendars() {
        renderWeekCalendar();
        renderMonthCalendar();
        updateCalendarView();
    }

    function renderWeekCalendar() {
        calendarWeekContainer.innerHTML = '';
        const weekDays = getWeekDays(selectedDate);

        monthYearDisplay.textContent = selectedDate.toLocaleDateString('pt-BR', {
            month: 'long', year: 'numeric'
        }).replace(/^\w/, c => c.toUpperCase());

        weekDays.forEach(day => {
            const dayElement = createDayElement(day);
            calendarWeekContainer.appendChild(dayElement);
        });
    }

    // NOVO: Função para renderizar o calendário mensal
    function renderMonthCalendar() {
        calendarMonthContainer.innerHTML = '';
        const monthDays = getMonthDays(selectedDate);

        // Adiciona as letras dos dias da semana (D, S, T...)
        const dayLetters = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        dayLetters.forEach(letter => {
            const letterEl = document.createElement('div');
            letterEl.className = 'month-day-letter';
            letterEl.textContent = letter;
            calendarMonthContainer.appendChild(letterEl);
        });

        // Adiciona os dias do mês
        monthDays.forEach(day => {
            // Se o dia for nulo (para preencher o grid), cria um placeholder
            if (!day) {
                calendarMonthContainer.appendChild(document.createElement('div'));
                return;
            }
            const dayElement = createDayElement(day, true); // true indica que é para o mês
            calendarMonthContainer.appendChild(dayElement);
        });
    }

    function renderTimeSlots() {
        timeSlotsContainer.innerHTML = '';
        const availableSlots = generateAvailableSlots(selectedDate);

        if (availableSlots.length === 0 || isDateUnavailable(selectedDate)) {
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

    // NOVO: Função centralizada para criar um elemento de dia
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

        if (isSameDay(day, selectedDate)) dayNumber.classList.add('selected');
        if (isDateUnavailable(day)) dayNumber.classList.add('unavailable');

        dayContainer.appendChild(dayNumber);
        return dayContainer;
    }

    function getWeekDays(currentDate) {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            week.push(day);
        }
        return week;
    }

    // NOVO: Função para pegar todos os dias de um mês para o grid
    function getMonthDays(currentDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = [];

        // Preenche com dias vazios no início para alinhar a semana
        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            daysInMonth.push(null);
        }
        // Adiciona os dias do mês
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            daysInMonth.push(new Date(year, month, i));
        }
        return daysInMonth;
    }

    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    }

    function isDateUnavailable(date) {
        return unavailableDates.includes(date.toISOString().split('T')[0]);
    }

    // NOVO: Função para atualizar qual calendário está visível
    function updateCalendarView() {
        if (isMonthView) {
            calendarWeekContainer.classList.add('hidden');
            calendarMonthContainer.classList.remove('hidden');
        } else {
            calendarWeekContainer.classList.remove('hidden');
            calendarMonthContainer.classList.add('hidden');
        }
    }
    
    // NOVO: Função para lidar com a seleção de um dia
    function handleDaySelection(target) {
        if (target.classList.contains('day-number') && !target.classList.contains('unavailable')) {
            selectedDate = new Date(target.dataset.date + 'T12:00:00Z');
            renderCalendars(); // Re-renderiza tudo para atualizar a seleção
            renderTimeSlots();
        }
    }

    // --- EVENT LISTENERS ---

    toggleButton.addEventListener('click', () => {
        isMonthView = !isMonthView; // Inverte a visualização
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

    // --- INICIALIZAÇÃO ---
    function init() {
        renderCalendars();
        renderTimeSlots();
    }

    init();
});
