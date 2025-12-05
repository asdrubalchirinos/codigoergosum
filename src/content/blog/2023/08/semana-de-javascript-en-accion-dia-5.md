---
title: Semana de JavaScript en Acción - Día 5
pubDate: '2023-08-04'
author: Asdrúbal Chirinos
tags:
  - javascript
  - productividad
slug: semana-de-javascript-en-accion-dia-5
---

Bienvenidos al Último Día de **Semana de JavaScript en Acción!** Hoy, culminaremos nuestra emocionante semana creando un Temporizador Pomodoro, una herramienta diseñada para mejorar tu productividad y gestionar tu tiempo de manera efectiva.

### **Comprendiendo el Temporizador Pomodoro**

Antes de comenzar a codificar, es importante comprender cómo funcionará nuestro Temporizador Pomodoro:

1.  Un temporizador que alterna entre períodos de trabajo y descanso.

2.  Un contador de ciclos Pomodoro completados.

3.  Opciones para personalizar la duración de los períodos de trabajo y descanso.


### **Configurando el HTML**

Comencemos estableciendo la estructura HTML para nuestro Temporizador Pomodoro. (`index.html`)

```
<!DOCTYPE html>
<html>
<head> <title>Temporizador Pomodoro</title>
</head>
<body> <h1>Temporizador Pomodoro</h1> <div id="timer">25:00</div> <button onclick="startTimer()">Iniciar</button> <button onclick="pauseTimer()">Pausar</button> <button onclick="resetTimer()">Reiniciar</button> <div id="cycles">Ciclos Completados: 0</div>
</body>
</html>
```

### **Creando la Lógica en JavaScript**

Ahora, adentrémonos en el código JavaScript y exploremos la lógica detrás de cada paso. (`pomodoro.js`)

```
let timerInterval;
let isTimerRunning = false;
let pomodoro = 1500; // 25 minutos en segundos
let remainingTime = pomodoro;
let completedCycles = 0; // Funciones para controlar el Temporizador Pomodoro
function startTimer() { if (isTimerRunning) return; updateTimerDisplay(); isTimerRunning = true; timerInterval = setInterval(updateTimer, 1000);
} function pauseTimer() { clearInterval(timerInterval); isTimerRunning = false;
} function resetTimer() { pauseTimer(); remainingTime = pomodoro; updateTimerDisplay();
} // Función para actualizar la visualización del temporizador
function updateTimerDisplay() { const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0'); const seconds = (remainingTime % 60).toString().padStart(2, '0'); const timerDisplay = document.getElementById('timer'); timerDisplay.textContent = `${minutes}:${seconds}`;
} // Función para actualizar el temporizador
function updateTimer() { remainingTime--; updateTimerDisplay(); if (remainingTime <= 0) { clearInterval(timerInterval); isTimerRunning = false; completedCycles++; setTimeout(function () { alert("¡Tiempo completado! Toma un descanso."); }, 100); // Retrasa la alerta para permitir que la actualización de la pantalla surta efecto displayCompletedCycles(); // Agregar código para iniciar el temporizador de descanso o reproducir un sonido de notificación }
} // Función para mostrar los ciclos completados
function displayCompletedCycles() { const cyclesElement = document.getElementById('cycles'); cyclesElement.textContent = `Ciclos Completados: ${completedCycles}`;
}
```

En esta parte, definimos las variables necesarias para controlar el temporizador, y creamos las funciones `startTimer()`, `pauseTimer()`, `resetTimer()`, `updateTimerDisplay()`, y `updateTimer()` para controlar el temporizador y actualizar la visualización. También agregamos la función `displayCompletedCycles()` para mostrar los ciclos Pomodoro completados.

### **Conclusión**

¡Felicidades por completar **Semana de JavaScript en Acción!** Durante esta emocionante semana, has explorado los conceptos fundamentales de JavaScript y has construido cinco proyectos prácticos e interesantes.

Desde la Lista de Tareas hasta la Aplicación del Clima, desde el Juego de Preguntas hasta el Generador de Contraseñas, y finalmente el Temporizador Pomodoro, has fortalecido tus habilidades de codificación y has aprendido cómo aplicar JavaScript en proyectos del mundo real.

Recuerda que la clave para convertirte en un desarrollador experto es la práctica constante y una mentalidad curiosa. Así que sigue codificando, sigue construyendo y nunca dejes de aprender. El mundo del desarrollo web está lleno de posibilidades infinitas, y ahora tienes todas las herramientas para dejar tu huella.

Gracias por acompañarnos en esta emocionante semana de proyectos. Esperamos que no solo hayas ampliado tus habilidades de codificación, sino que también hayas descubierto la alegría de dar vida a tus ideas a través del código.

Recuerda, cada gran desarrollador fue una vez principiante. Sigue practicando, sigue construyendo y nunca dejes de soñar en grande. Tu futuro en la programación es brillante, y estamos emocionados de ver todas las increíbles creaciones que lograrás.

¡Sigue codificando y sigue creando!
