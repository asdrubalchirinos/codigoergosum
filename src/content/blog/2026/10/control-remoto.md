---
title: Control remoto
subtitle: 'Cómo quitarle los anuncios a tu Android TV con un prompt y un asistente de código.'
pubDate: '2026-10-23'
heroImage: /images/blog/2026/10/control-remoto/hero.png
heroImageAlt: 'Ilustración: un hombre apunta el control remoto a una Android TV y los anuncios y apps salen volando y desaparecen en nubecitas'
author: Asdrúbal Chirinos
featured: false
draft: false
kind: short
tags: ['ia', 'personal-software', 'tendencias']
slug: control-remoto
---

Cómo quitarle los anuncios a tu Android TV con un prompt y un asistente de código.

¿Te ha pasado que prendes la tele y, antes de llegar a Netflix, te sale un anuncio? A [@gathint](https://x.com/gathint/status/2111379569030939102) le pasó con la tele de sus papás, y lo resolvió en una tarde:

> «Vibe codeé la tele de mis papás esta tarde. Mostraba un anuncio patrocinado antes de poder llegar a Netflix. Le di a Claude Code el número de modelo, encontró la tele en el wifi, quitó 25 paquetes de Xiaomi y escribió un launcher nuevo. Ahora parece un Apple TV.»

De ese tweet salió [cleanyourtv](https://github.com/Gathin23/cleanyourtv): un prompt, un launcher ligero y una colección de listas de bloatware por modelo que la comunidad sigue ampliando. Ya hay 30.

¿Quieres probarlo en tu tele? Así funciona.

## Antes de empezar

Funciona con **Android TV** y **Google TV**: Xiaomi, TCL, Sony, Hisense, Philips, Nvidia Shield y otros. No funciona en Samsung (Tizen) ni en LG (webOS). En Fire TV solo puedes hacer la mitad del debloat, porque Fire OS no deja cambiar el launcher.

Necesitas una computadora conectada al mismo wifi que la tele y un asistente de código con acceso a la terminal, como Claude Code o similar. Si prefieres ejecutar las herramientas del repo a mano, también necesitas Python 3.

En la tele, entra a **Settings → Device Preferences → About** y presiona OK sobre **Build** siete veces. Regresa, entra a **Developer options** y activa **USB debugging**. Si aparece un toggle de **Network** o **ADB debugging**, actívalo también. Y deja la tele encendida.

No hace falta cable: aunque la opción diga "USB", la conexión va por wifi.

## Paso a paso

1. **Descarga el repo** en tu computadora. No es obligatorio, pero ayuda: si se lo dices al asistente, reutiliza `tools/` y `launcher/` en lugar de escribirlos desde cero.
2. **Pega [`PROMPT.md`](https://github.com/Gathin23/cleanyourtv/blob/main/PROMPT.md)** en tu asistente y reemplaza `<MODEL NAME HERE>` con el modelo de tu tele.
3. **Acepta en la tele** el aviso "Allow USB debugging?" cuando el asistente se conecte por ADB.
4. **Respaldo.** Antes de cambiar nada, el asistente guarda la lista de paquetes y la configuración, y escribe un script de restauración.
5. **Debloat.** Clasifica los paquetes y desactiva telemetría, publicidad y apps precargadas con `pm disable-user --user 0`, en lotes pequeños y tomando capturas de pantalla entre uno y otro. No desinstala nada.
6. **Tus preferencias.** Te pregunta qué apps usas, cuáles cuatro van en el dock y si quieres conservar el asistente de voz, Chromecast y las actualizaciones.
7. **Launcher.** Compila un launcher nativo de unos 250 KB, lo instala y lo deja como pantalla de inicio.

Con el repo como contexto, el autor calcula unos quince minutos. No hay APK para descargar: el launcher lo compilas tú.

## Si quieres volver atrás

Guarda la lista que aplicaste. Con ella, una sola línea reactiva los paquetes y devuelve el launcher original:

```bash
TV_HOST=192.168.1.50 tools/restore.sh examples/<your tv>/debloat.txt
```

En Google TV, agrega al final `com.google.android.apps.tv.launcherx`. Si la tele no responde, puedes reactivar cada paquete desde **Settings → Apps**.

## Ojo con esto

**Apaga la depuración cuando termines.** El launcher no la necesita, y un puerto ADB abierto es una puerta: en 2018 un [gusano](https://blog.netlab.360.com/early-warning-adb-miner-a-mining-botnet-utilizing-android-adb-is-now-rapidly-spreading-en/) infectó miles de TV boxes por ahí.

**Lee el prompt antes de pegarlo.** Le estás dando a un agente una terminal sobre un aparato de tu casa. Si no entiendes un paso, pregúntale antes de que lo ejecute.

**Las actualizaciones pueden revertirlo.** La mayoría de las listas desactiva el servicio de actualización. Si aun así llega una, algún paquete puede volver y te tocará correr el script de nuevo.

**Y la garantía.** El fabricante no espera que hagas esto. Si tu tele es nueva, revisa las condiciones antes de empezar.

Al final, para eso sirve el Personal Software: para que el control remoto vuelva a estar en tus manos.
