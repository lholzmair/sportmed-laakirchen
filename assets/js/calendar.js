document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  // FullCalendar-Initialisierung
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    locale: 'de',
    hiddenDays: [0, 6], // Versteckt Sonntag (0) und Samstag (6)
    slotMinTime: '07:00:00',
    slotMaxTime: '20:00:00',
    slotDuration: '01:00:00', 
    slotLabelInterval: '01:00:00', 
    allDaySlot: false,
    contentHeight: 'auto',
    expandRows: true,
    eventTimeFormat: { // Deaktiviert die Zeitformatierung
    hour: undefined,
    minute: undefined,
    },      
  
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek'
    },

    buttonText: {
      today: 'Heute', 
      week: 'Woche', 
    },

    eventSources: [
      {
        url: 'http://127.0.0.1:5000/api/get-events',
        method: 'GET',
        extraParams: function () {
          return {
            timestamp: new Date().getTime() // Cache umgehen
          };
        },
        failure: function () {
          alert('Fehler beim Laden der Events!');
        },
        success: function (events) {
          // Dynamisch Farben zuweisen basierend auf dem Event-Titel
          events.forEach(event => {
            if (event.reason === 'Urlaub') {
              event.color = '#6096BA';
            } else if (event.reason === 'Fortbildung') {
              event.color = '#274C77';
            } else if (event.reason === 'Feiertag') {
              event.color = '#6e6e6e';
            }
          });
        }
      },
      {
        events: [ // Statische Öffnungszeiten und manuelle Events
          {
            title: 'Ordinationszeiten',
            startTime: '17:00',
            endTime: '19:00',
            daysOfWeek: [1], // Montag
            display: 'background',
            className: 'business-hours'
          },
          {
            title: 'Ordinationszeiten',
            startTime: '08:30',
            endTime: '13:00',
            daysOfWeek: [4], // Donnerstag
            display: 'background',
            className: 'business-hours'
          },
          {
            title: 'Urlaub',
            start: '2025-01-23T07:00:00',
            end: '2025-01-23T20:00:00',
            allDay: false,
            color: '#1A3E54'
          }
        ]
      }
    ],
    loading: function (isLoading) {
      if (isLoading) {
        console.log('Events werden geladen...');
      } else {
        console.log('Events erfolgreich geladen!');
      }
    }
  });

  calendar.render();
});