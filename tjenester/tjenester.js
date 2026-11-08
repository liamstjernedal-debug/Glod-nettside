(function () {
  'use strict';
  var booking = document.querySelectorAll('[data-booking]');
  var result = document.querySelector('.booking-result');
  booking.forEach(function (button) {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', function () {
      booking.forEach(function (item) { item.setAttribute('aria-pressed', String(item === button)); });
      result.textContent = 'Valgt: tirsdag 12. mai kl. ' + button.dataset.booking + '. Dette er bare en demo.';
    });
  });
  var answers = {
    apning: 'Vi har åpent mandag til fredag kl. 09–17. Velkommen innom!',
    bestilling: 'Du kan bestille time via bookingknappen på nettsiden eller kontakte oss direkte.',
    pris: 'Prisene varierer etter behandling. Se prislisten vår eller ta kontakt for et tilbud.'
  };
  var chat = document.querySelector('.chat-window');
  var buttons = document.querySelectorAll('[data-chat]');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var timer;
  if (chat) {
    chat.removeAttribute('aria-live');
    var status = document.createElement('p');
    status.className = 'visually-hidden';
    status.setAttribute('role', 'status');
    chat.after(status);
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', function () {
        clearInterval(timer);
        buttons.forEach(function (item) { item.setAttribute('aria-pressed', String(item === button)); });
        chat.replaceChildren();
        var question = document.createElement('p');
        question.className = 'chat-bubble chat-bubble--question';
        question.textContent = button.textContent;
        var response = document.createElement('p');
        response.className = 'chat-bubble chat-bubble--answer';
        chat.append(question, response);
        var answer = answers[button.dataset.chat];
        status.textContent = '';
        if (motion.matches) { response.textContent = answer; status.textContent = answer; return; }
        var pos = 0;
        timer = setInterval(function () {
          pos = Math.min(pos + 2, answer.length);
          response.textContent = answer.slice(0, pos);
          if (pos === answer.length) { clearInterval(timer); status.textContent = answer; }
        }, 18);
      });
    });
  }
})();
