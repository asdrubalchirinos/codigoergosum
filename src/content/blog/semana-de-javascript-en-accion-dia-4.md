---
title: Semana de JavaScript en Acción - Día 4
pubDate: "2023-08-03"
author: Asdrúbal Chirinos
tags: ["javascript"]
---

¡Bienvenidos al Día 4 de **Semana de JavaScript en Acción!** Hoy, exploraremos la importancia de la seguridad al crear un Generador de Contraseñas usando JavaScript. Prepárate para aumentar la seguridad de tus cuentas en línea al generar contraseñas fuertes y únicas.

### **Comprendiendo el Generador de Contraseñas**

Antes de comenzar a codificar, es importante comprender cómo funcionará nuestro Generador de Contraseñas:

1.  Un formulario para seleccionar las características de la contraseña (longitud, caracteres especiales, números, etc.).

2.  Un botón para generar la contraseña según las preferencias del usuario.

3.  Un campo de texto para mostrar la contraseña generada.


**Configurando el HTML** Comencemos estableciendo la estructura HTML para nuestro Generador de Contraseñas. (`index.html`)

```
<!DOCTYPE html>
<html>
<head> <title>Generador de Contraseñas</title> <script src="passgen.js"></script>
</head>
<body> <h1>Generador de Contraseñas</h1> <label for="length">Longitud:</label> <input type="number" id="length" min="8" max="20" value="12"> <label for="includeSpecial">Incluir caracteres especiales:</label> <input type="checkbox" id="includeSpecial"> <label for="includeNumbers">Incluir números:</label> <input type="checkbox" id="includeNumbers"> <button onclick="generatePassword()">Generar Contraseña</button> <input type="text" id="password" readonly>
</body>
</html>
```

### **Creando la Lógica en JavaScript**

Ahora, adentrémonos en el código JavaScript y exploremos la lógica detrás de cada paso. (`passgen.js`)

```
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?'; // Función para generar la contraseña
function generatePassword() { const length = document.getElementById('length').value; const includeSpecial = document.getElementById('includeSpecial').checked; const includeNumbers = document.getElementById('includeNumbers').checked; let chars = uppercaseChars + lowercaseChars; if (includeSpecial) chars += specialChars; if (includeNumbers) chars += numberChars; const password = generateRandomPassword(chars, length); displayPassword(password);
} // Función para generar una contraseña aleatoria
function generateRandomPassword(chars, length) { let password = ''; for (let i = 0; i < length; i++) { const randomIndex = Math.floor(Math.random() * chars.length); password += chars.charAt(randomIndex); } return password;
} // Función para mostrar la contraseña generada
function displayPassword(password) { const passwordElement = document.getElementById('password'); passwordElement.value = password;
}
```

En esta parte, definimos las variables `uppercaseChars`, `lowercaseChars`, `numberChars`, y `specialChars`, que contienen los conjuntos de caracteres disponibles para generar la contraseña. Luego, creamos las funciones `generatePassword()`, `generateRandomPassword()`, y `displayPassword()` para generar y mostrar la contraseña generada.

### **Conclusión**

¡Bingo has creado tu Generador de Contraseñas usando JavaScript! Ahora tienes una herramienta que te permitirá generar contraseñas fuertes y aleatorias para proteger tus cuentas en línea.

Esperamos que hayas disfrutado de este importante proyecto en **Semana de JavaScript en Acción** y que te haya inspirado a seguir explorando y creando con JavaScript.

Mantente atento para el Día 5, donde mejorarás tu productividad al crear un Temporizador Pomodoro. ¡Feliz codificación!
