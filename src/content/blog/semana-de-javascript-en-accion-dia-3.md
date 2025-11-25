---
title: Semana de JavaScript en Acción - Día 3
pubDate: "2023-08-02"
author: Asdrúbal Chirinos
tags: ["javascript", "web"]
---

¡Bienvenidos al Día 3 de **Semana de JavaScript en Acción!** Hoy, enfrentaremos un emocionante desafío al crear un Juego de Preguntas Interactivo usando JavaScript. Prepárate para poner a prueba tus conocimientos y habilidades mientras construimos un juego interactivo que pondrá a prueba tu ingenio.

### **Comprendiendo el Juego de Preguntas**

Antes de comenzar a codificar, es importante comprender los elementos clave de nuestro Juego de Preguntas:

1.  Un conjunto de preguntas y respuestas almacenadas en una lista.

2.  Un temporizador para limitar el tiempo para responder cada pregunta.

3.  Un contador de puntuación para evaluar el rendimiento del jugador.

4.  Una interfaz interactiva para mostrar las preguntas y opciones de respuesta.


### **Configurando el HTML**

Comencemos estableciendo la estructura HTML para nuestro Juego de Preguntas. (`index.html`)

```
<!DOCTYPE html>
<html>
<head> <title>Juego de Preguntas Interactivo</title>
</head>
<body> <h1>Juego de Preguntas Interactivo</h1> <div id="score" style="display: none;">Puntuación: 0</div> <div id="questionContainer"> <!-- Aquí se mostrarán las preguntas --> </div> <button id="startQuiz" onclick="startQuiz()">Comenzar Juego</button> <script src="trivia.js"></script>
</body>
</html>
```

### **Creando la Lógica en JavaScript**

Ahora, adentrémonos en el código JavaScript y exploremos la lógica detrás de cada paso. (`trivia.js`)

```
const quizData = [ { question: '¿Cuál es el río más largo del mundo?', options: ['Nilo', 'Amazonas', 'Yangtsé', 'Misisipi'], correctAnswer: 'Nilo' }, { question: '¿Cuál es la montaña más alta del mundo?', options: ['Everest', 'K2', 'Kangchenjunga', 'Makalu'], correctAnswer: 'Everest' }, { question: '¿Cuál es la capital de Australia?', options: ['Sídney', 'Melbourne', 'Brisbane', 'Canberra'], correctAnswer: 'Canberra' } // Agrega más preguntas aquí
]; const questionContainer = document.getElementById('questionContainer');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startQuiz'); let currentQuestion = 0;
let score = 0;
let timeLimit = 10; //Límite de tiempo para cada pregunta en segundos let countdownTimer; // Contiene la referencia del temporizador function displayQuestion() { resetTimer() questionContainer.innerHTML = ''; const questionText = document.createElement('p'); questionText.textContent = quizData[currentQuestion].question; questionContainer.appendChild(questionText); const options = document.createElement('ul'); quizData[currentQuestion].options.forEach(option => { const li = document.createElement('li'); li.textContent = option; li.addEventListener('click', () => checkAnswer(option)); options.appendChild(li); }); questionContainer.appendChild(options);
} function displayScore() { scoreElement.style.display = 'block'; scoreElement.textContent = `Puntuación: ${score} / ${quizData.length}`;
} function checkAnswer(selectedOption) { const correctAnswer = quizData[currentQuestion].correctAnswer; if (selectedOption === correctAnswer) { score++; alert('¡Respuesta correcta! :)'); } else { alert('Respuesta incorrecta :('); } currentQuestion++; if (currentQuestion < quizData.length) { displayQuestion(); } else { endQuiz(); }
} function startTimer() { let timeRemaining = timeLimit; countdownTimer = setInterval(() => { timeRemaining--; if (timeRemaining >= 0) { // Actualizar temporizador si es necesario } else { // Se acabó el tiempo, marque la respuesta como incorrecta clearInterval(countdownTimer); checkAnswer(null); // Pasar nulo para respuesta incorrecta } }, 1000);
} function resetTimer() { clearInterval(countdownTimer); // Si es necesario, reinicia el temporizador startTimer();
} function startQuiz() { startButton.style.display = 'none'; scoreElement.style.display = 'none'; currentQuestion = 0; score = 0; displayQuestion();
} function endQuiz() { alert('¡Has completado el Juego de Preguntas!'); currentQuestion = 0; questionContainer.innerHTML = ''; startButton.style.display = 'block'; scoreElement.style.display = 'block'; displayScore();
}
```

En esta parte, definimos una base de datos de preguntas y respuestas almacenada en el arreglo `questions`. Luego, creamos las funciones `displayQuestion()`, `selectAnswer()`, y `displayScore()` para mostrar las preguntas, manejar las respuestas y mostrar la puntuación final.

### **Conclusión**

¡Excelente has creado tu Juego de Preguntas Interactivo usando JavaScript! Ahora tienes un juego divertido y desafiante que pondrá a prueba tus conocimientos.

Esperamos que hayas disfrutado de este emocionante proyecto en **Semana de JavaScript en Acción** y que te haya inspirado a seguir explorando y creando con JavaScript.

Mantente atento para el Día 4, donde abordaremos la importancia de la seguridad al crear un Generador de Contraseñas. ¡Feliz codificación!
