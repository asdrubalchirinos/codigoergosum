---
title: Semana de JavaScript en Acción - Día 2
pubDate: '2023-08-01'
author: Asdrúbal Chirinos
tags:
  - javascript
  - web
slug: semana-de-javascript-en-accion-dia-2
---

¡Bienvenidos al Día 2 de **Semana de JavaScript en Acción!** Hoy, nos embarcaremos en la interesante tarea de crear una "Aplicación del Clima" utilizando JavaScript. Aprenderemos cómo obtener las coordenadas geográficas de una ciudad y, utilizando esas coordenadas, realizaremos una consulta a la API de OpenWeatherMap para obtener datos climáticos precisos y actualizados.

### **Comprendiendo la Aplicación del Clima**

Antes de comenzar a codificar, es importante comprender los componentes clave de nuestra Aplicación del Clima:

1.  Un campo de entrada para ingresar la ubicación deseada.

2.  Un botón para buscar los datos climáticos de la ubicación ingresada.

3.  Una sección para mostrar la información climática, como temperatura, descripción del clima y ubicación.


**Configurando el HTML** Comencemos estableciendo la estructura HTML para nuestra Aplicación del Clima. (`index.html`)

```
<!DOCTYPE html>
<html>
<head> <title>Aplicación del Clima</title> <script src="weather.js"></script>
</head>
<body> <h1>Aplicación del Clima</h1> <input type="text" id="locationInput" placeholder="Ingrese una ubicación"> <button onclick="getWeatherData()">Buscar Clima</button> <div id="weatherInfo"> <!-- La información del clima se mostrará aquí --> </div>
</body>
</html>
```

### Obteniendo una Clave API de OpenWeatherMap

Ahora prosigamos con el código javaScript, pero primero, es necesario obtener una clave API (Application Programming Interface) de OpenWeatherMap. La clave API es un identificador único que te permite acceder a los servicios de la API y obtener datos climáticos en tiempo real. Sigue los siguientes pasos para obtener tu clave API:

1.  **Regístrate en el sitio web de OpenWeatherMap**: Ve a la página de registro de OpenWeatherMap (https://home.openweathermap.org/users/sign\_up) y crea una cuenta.

2.  **Confirma tu cuenta:** Después de registrarte, verifica tu cuenta a través del correo electrónico que te enviará OpenWeatherMap.

3.  **Inicia sesión en OpenWeatherMap:** Accede a tu cuenta en OpenWeatherMap utilizando las credenciales que registraste.

4.  **Obtén tu clave API:** Una vez dentro de tu cuenta, busca la sección de "API Keys" o "Claves API" en el panel de control. Haz clic en "Generate API Key" o "Generar Clave API" para obtener tu clave API única.


### Definiendo la Clave API

Una vez que tengas tu clave API de OpenWeatherMap, es hora de utilizarla en tu aplicación JavaScript. Definiremos la constante `apiKey` al inicio del archivo (`weather.js)`

```
// Definimos la constante apiKey con tu clave API de OpenWeatherMap const apiKey = 'TU_CLAVE_API';
```

Recuerda reemplazar 'TU\_CLAVE\_API' con la clave API que obtuviste en el paso anterior.

### Obteniendo las Coordenadas de la Ciudad

El primer paso para obtener información climática es obtener las coordenadas (latitud y longitud) de la ciudad ingresada por el usuario. Utilizaremos la API de Geocoding de OpenWeatherMap para este propósito. A continuación, presentamos el código para obtener las coordenadas:

```
// Función para obtener las coordenadas de la ciudad
async function getCoordinates(city) { const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`; try { const response = await fetch(geocodingUrl); const data = await response.json(); if (data.length === 0) { throw new Error('Ciudad no encontrada.'); } const { lat, lon } = data[0]; return { lat, lon }; } catch (error) { console.error(error); return null; }
}
```

### Obteniendo Datos Climáticos utilizando las Coordenadas

Una vez que tenemos las coordenadas de la ciudad, podemos realizar una consulta a la API de OpenWeatherMap para obtener datos climáticos precisos. A continuación, presentamos el código para obtener los datos climáticos:

```
// Función para obtener datos climáticos usando las coordenadas
async function getWeatherDataByCoordinates(lat, lon) { const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`; try { const response = await fetch(weatherUrl); const data = await response.json(); return data; } catch (error) { console.error(error); return null; }
}
```

### Mostrando los Datos Climáticos en la Aplicación

Una vez que hemos obtenido los datos climáticos, es hora de mostrarlos en la interfaz de usuario de nuestra aplicación. A continuación, presentamos el código para mostrar los datos climáticos:

```
// Función para mostrar los datos climáticos en la interfaz de usuario
function displayWeatherData(weatherData) { const weatherDataDiv = document.getElementById('weatherData'); // Limpiamos el contenido anterior weatherDataDiv.innerHTML = ''; // Creamos elementos para mostrar la información const cityName = document.createElement('h2'); cityName.textContent = weatherData.name; const temperature = document.createElement('p'); temperature.textContent = `Temperatura: ${weatherData.main.temp}°C`; const description = document.createElement('p'); description.textContent = `Descripción: ${weatherData.weather[0].description}`; // Agregamos los elementos al div weatherDataDiv.appendChild(cityName); weatherDataDiv.appendChild(temperature); weatherDataDiv.appendChild(description);
} // Función para obtener el clima
async function getWeather() { const cityInput = document.getElementById('cityInput').value; try { const { lat, lon } = await getCoordinates(cityInput); if (lat && lon) { const weatherData = await getWeatherDataByCoordinates(lat, lon); displayWeatherData(weatherData); } else { throw new Error('Error al obtener las coordenadas.'); } } catch (error) { console.error(error); alert('Error al obtener los datos climáticos. Verifica el nombre de la ciudad ingresada.'); }
}
```

### Conclusión

¡Felicidades por desarrollar tu propia "Aplicación del Clima" usando JavaScript! Ahora tienes una herramienta que puede proporcionar información meteorológica precisa y actualizada para cualquier ciudad que el usuario desee conocer.

En este día, aprendimos cómo obtener las coordenadas de una ciudad utilizando la API de Geocoding de OpenWeatherMap, definimos y utilizamos una clave API para acceder a los servicios de la API, y realizamos una consulta a la API de OpenWeatherMap para obtener datos climáticos precisos y actualizar la interfaz de usuario con esa información.

Continúa practicando y explorando con JavaScript, y estarás preparado para el próximo emocionante proyecto del Día 3. ¡No te pierdas las aventuras que tenemos reservadas para ti en **Semana de JavaScript en Acción!**

Repasa el código JavaScript en su totalidad (`weather.js`):

```
// Definimos la constante apiKey con tu clave API de OpenWeatherMap
const apiKey = 'TU_CLAVE_API'; // Función para obtener las coordenadas de la ciudad
async function getCoordinates(city) { const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`; try { const response = await fetch(geocodingUrl); const data = await response.json(); if (data.length === 0) { throw new Error('Ciudad no encontrada.'); } const { lat, lon } = data[0]; return { lat, lon }; } catch (error) { console.error(error); return null; }
} // Función para obtener datos climáticos usando las coordenadas
async function getWeatherDataByCoordinates(lat, lon) { const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`; try { const response = await fetch(weatherUrl); const data = await response.json(); return data; } catch (error) { console.error(error); return null; }
} // Función para mostrar los datos climáticos en la interfaz de usuario
function displayWeatherData(weatherData) { const weatherDataDiv = document.getElementById('weatherData'); // Limpiamos el contenido anterior weatherDataDiv.innerHTML = ''; // Creamos elementos para mostrar la información const cityName = document.createElement('h2'); cityName.textContent = weatherData.name; const temperature = document.createElement('p'); temperature.textContent = `Temperatura: ${weatherData.main.temp}°C`; const description = document.createElement('p'); description.textContent = `Descripción: ${weatherData.weather[0].description}`; // Agregamos los elementos al div weatherDataDiv.appendChild(cityName); weatherDataDiv.appendChild(temperature); weatherDataDiv.appendChild(description);
} // Función para obtener el clima
async function getWeather() { const cityInput = document.getElementById('cityInput').value; try { const { lat, lon } = await getCoordinates(cityInput); if (lat && lon) { const weatherData = await getWeatherDataByCoordinates(lat, lon); displayWeatherData(weatherData); } else { throw new Error('Error al obtener las coordenadas.'); } } catch (error) { console.error(error); alert('Error al obtener los datos climáticos. Verifica el nombre de la ciudad ingresada.'); }
}
```

Recuerda reemplazar 'TU\_CLAVE\_API' con la clave API que obtuviste de OpenWeatherMap para que el ejemplo funcione correctamente. ¡Espero que esta explicación te ayude a tener un código funcional y bien entendido en tu "Aplicación del Clima"! ¡Diviértete codificando!
