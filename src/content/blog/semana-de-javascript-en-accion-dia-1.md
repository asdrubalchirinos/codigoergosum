---
title: Semana de JavaScript en Acción - Día 1
pubDate: "2023-07-31"
author: Asdrúbal Chirinos
tags: ["javascript", "web"]
---

¡Bienvenidos a **Semana de JavaScript en Acción!** Durante los próximos cinco días, emprenderemos una emocionante jornada de programación, donde explorarás los conceptos fundamentales de JavaScript y construirás cinco proyectos prácticos para fortalecer tus habilidades.

Hoy, comenzaremos nuestra semana con un clásico: ¡una aplicación de Lista de Tareas! Prepárate para sumergirte en la manipulación del DOM y las interacciones del usuario mientras creamos un organizador de tareas dinámico usando JavaScript.

### **Comprendiendo la Lista de Tareas**

Antes de comenzar a codificar, es importante comprender los componentes básicos de nuestra aplicación de Lista de Tareas:

1.  Un campo de entrada y un botón para crear nuevas tareas.

2.  Una lista para mostrar las tareas.

3.  Opciones para marcar tareas como completadas.


### **Configurando el HTML**

Comencemos estableciendo la estructura HTML para nuestra Lista de Tareas. `(index.html)`

```
<!DOCTYPE html>
<html>
<head> <title>Lista de Tareas</title> <script src="todo.js"></script> <style> .completed { text-decoration: line-through; } li { cursor: pointer; } </style>
</head>
<body> <h1>Lista de Tareas</h1> <input type="text" id="taskInput" placeholder="Ingrese una tarea"> <button onclick="addTask()">Agregar Tarea</button> <ul id="taskList"> <!-- Las tareas se mostrarán aquí --> </ul>
</body>
</html>
```

### **Creando la Lógica en JavaScript**

Ahora, adentrémonos en el código JavaScript y exploremos la lógica detrás de cada paso. `(todo.js)`

```
// Función para agregar una nueva tarea
function addTask() { const taskInput = document.getElementById('taskInput'); const taskList = document.getElementById('taskList'); const taskText = taskInput.value.trim(); if (taskText === '') { alert('Por favor, ingresa una tarea.'); return; } const taskItem = document.createElement('li'); taskItem.textContent = taskText; // Agregar un listener para marcar la tarea como completada taskItem.addEventListener('click', () => { taskItem.classList.toggle('completed'); }); taskList.appendChild(taskItem); taskInput.value = '';
}
```

En esta parte, definimos la función `addTask()` responsable de agregar nuevas tareas a nuestra lista. Extraemos el texto de la tarea del campo de entrada, creamos un elemento `<li>` para representar la tarea y agregamos un listener para alternar la clase `completed` cuando se haga clic en una tarea.

### Conclusión

¡Voila acabas de construir una aplicación básica de Lista de Tareas usando JavaScript! Has explorado la manipulación del DOM, las interacciones del usuario y creado un práctico organizador de tareas. Esto es solo el comienzo de tu trayecto con JavaScript, y hay mucho más por explorar y crear.

Mantente atento para el Día 2, donde nos adentraremos en la creación de una Aplicación del Clima, obtendrás datos climáticos en tiempo real y crearás una aplicación dinámica del clima. ¡Feliz codificación!
