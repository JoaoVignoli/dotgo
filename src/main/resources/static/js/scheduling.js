document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const calendarWeekContainer = document.getElementById('calendar-week-container');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const monthYearDisplay = document.getElementById('calendar-month-year');

    // --- DADOS DE EXEMPLO (Simulando um banco de dados) ---
    const serviceDurationHours = 4; // Duração do serviço em horas
    const breakTimeMinutes = 90;    // Intervalo de 1h30m

    // Simula dias que já estão sem horários
    const unavailableDates = ['2025-07-13', '2025-07-14']; 
    
    // Simula horários já agendados para um dia específico
    const bookedSlots = {
        '2025-07-17': ['10:00'] 
    };

    // --- ESTADO DA APLICAÇÃO ---
    let selectedDate = new Date('2025-07-17T12:00:00Z'); // Começa com um dia selecionado

    // --- FUNÇÕES PRINCIPAIS ---

    /**
     * Gera e exibe a visualização da semana no calendário.
     */
    function renderWeekCalendar() {
        calendarWeekContainer.innerHTML = ''; // Limpa o calendário
        const weekDays = getWeekDays(selectedDate);

        // Atualiza o mês/ano no cabeçalho
        monthYearDisplay.textContent = selectedDate.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        }).replace(/^\w/, c => c.toUpperCase());

        weekDays.forEach(day => {
            const dayContainer = document.createElement('div');
            dayContainer.className = 'day-container';

            const dayLetter = document.createElement('span');
            dayLetter.className = 'day-letter';
            dayLetter.textContent = day.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase();

            const dayNumber = document.createElement('button');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day.getDate();
            dayNumber.dataset.date = day.toISOString().split('T')[0]; // Formato YYYY-MM-DD

            // Adiciona classes de estado
            if (isSameDay(day, selectedDate)) {
                dayNumber.classList.add('selected');
            }
            if (isDateUnavailable(day)) {
                dayNumber.classList.add('unavailable');
            }

            dayContainer.appendChild(dayLetter);
            dayContainer.appendChild(dayNumber);
            calendarWeekContainer.appendChild(dayContainer);
        });
    }

    /**
     * Gera e exibe os horários disponíveis para a data selecionada.
     */
    function renderTimeSlots() {
        timeSlotsContainer.innerHTML = ''; // Limpa os horários
        const availableSlots = generateAvailableSlots(selectedDate);

        if (availableSlots.length === 0) {
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

    /**
     * Gera uma lista de horários disponíveis com base nas regras.
     * @param {Date} date - O dia para gerar os horários.
     * @returns {string[]} - Uma lista de horários no formato "HH:MM".
     */
    function generateAvailableSlots(date) {
        const slots = [];
        const dateString = date.toISOString().split('T')[0];
        const alreadyBooked = bookedSlots[dateString] || [];

        // Começa às 8h da manhã
        let currentTime = new Date(date.setHours(8, 0, 0, 0));
        const endTime = new Date(date.setHours(22, 0, 0, 0)); // Termina às 22h

        while (currentTime < endTime) {
            const slotTime = currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            // Adiciona o slot apenas se não estiver já agendado
            if (!alreadyBooked.includes(slotTime)) {
                slots.push(slotTime);
            }

            // Adiciona a duração do serviço + o intervalo para calcular o próximo slot
            currentTime.setHours(currentTime.getHours() + serviceDurationHours);
            currentTime.setMinutes(currentTime.getMinutes() + breakTimeMinutes);
        }
        return slots;
    }


    // --- FUNÇÕES AUXILIARES ---

    function getWeekDays(currentDate) {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Vai para o Domingo
        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            week.push(day);
        }
        return week;
    }

    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    function isDateUnavailable(date) {
        const dateString = date.toISOString().split('T')[0];
        return unavailableDates.includes(dateString);
    }

    // --- EVENT LISTENERS ---

    calendarWeekContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('day-number') && !target.classList.contains('unavailable')) {
            // Remove a seleção antiga
            const oldSelected = calendarWeekContainer.querySelector('.day-number.selected');
            if (oldSelected) oldSelected.classList.remove('selected');

            // Adiciona a nova seleção
            target.classList.add('selected');
            selectedDate = new Date(target.dataset.date + 'T12:00:00Z');
            
            // Atualiza os horários para o novo dia selecionado
            renderTimeSlots();
        }
    });

    timeSlotsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('time-slot')) {
            const oldSelected = timeSlotsContainer.querySelector('.time-slot.selected');
            if (oldSelected) oldSelected.classList.remove('selected');
            target.classList.add('selected');
        }
    });

    // --- INICIALIZAÇÃO ---
    function init() {
        renderWeekCalendar();
        renderTimeSlots();
    }

    init();
});
