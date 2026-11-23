# Tarea automática: reels de Paco

Esta tarea se ejecuta cada día a las 10:17 (Europe/Madrid) en una sesión nueva. Lee este archivo entero antes de hacer nada. Antes de escribir cualquier guion, lee también `tarea/GUIA-AUDIENCIA.md`: tiene las reglas sacadas de los datos reales de la cuenta y son obligatorias.

## Reglas fijas de publicación (cuenta Instagram cosas.de.paco)
- Metricool, marca blogId `7780607`, zona `Europe/Madrid`, Instagram tipo `REEL`, `showReelOnFeed: true`, `autoPublish: true`.
- Hora: 10:00 Madrid. Días alternos: un día de publicación y uno de descanso.
- Fechas de publicación de esta tarea: 2026-11-28, y desde 2026-12-03 cada 2 días (12-05, 12-07, 12-09…). Las fechas están en `calendario.json`.
- 2026-12-01 está reservado para el reel del calendario de Adviento: esta tarea no lo hace.
- Portada siempre: `videoCoverMilliseconds` en el momento de más tensión, con la cara de Paco grande y el rótulo del planteamiento visible (nunca 0).
- Texto en castellano de España, 2-3 líneas: empieza por la situación en una línea (sin desvelar el giro) y acaba con un «Mándaselo a…» concreto (ver GUIA-AUDIENCIA.md). Exactamente 5 hashtags: 1-2 de formato (#animacionespañol #humoranimado), 2 del tema concreto, y #cosasdepaco. Nada de #fyp ni #viral.
- Vídeo: URL raw pública del repo, `https://raw.githubusercontent.com/Cosas-de-Paco/paco-reels/main/videos/<archivo>.mp4` (Metricool la acepta y copia el vídeo; comprobado el 2026-11-18).

## Qué hacer en cada ejecución
Hoy = fecha actual en Madrid.

0. Comprueba que tienes las herramientas de Metricool (mcp__Metricool_Social_Media_Management__*, búscalas con ToolSearch) haciendo un getScheduledPosts de los próximos 3 días. Si no están, termina con: "FALLO: la tarea de reels no tiene acceso a Metricool. Revisa los conectores del proyecto."

1. Si no existe `/home/user/paco-reels`, adjunta el repo `Cosas-de-Paco/paco-reels` (add_repo) y clónalo. Haz `git pull`.
2. Comprobar publicación de hoy: si en `calendario.json` hay un reel con fecha de hoy y estado `programado`, consulta Metricool (getScheduledPosts de hoy; si ya no aparece como pendiente, se ha publicado). Marca el estado `publicado` (o `fallo` si sigue pendiente con error) y apúntalo para la notificación final.
3. Producir: si hoy es exactamente 2 días antes de la siguiente fecha `libre` de `calendario.json`, crea el reel para esa fecha:
   - Antes, mira en Metricool si esa fecha ya tiene algo programado a las 10:00. Si lo tiene, no produzcas y avísalo en la notificación.
   - Saca las métricas de los últimos 30 días como dice la sección final de `GUIA-AUDIENCIA.md` y rellena su tabla con los reels que lleven 3 días o más publicados.
   - Si la fecha `libre` de `calendario.json` trae `tema` (y quizá `intro`), ese tema ya está aprobado por Sergio: úsalo sin elegir otro. Si trae `intro`, esa escena es el arranque aprobado: cópiala como base de `<tema>.html`, no cambies sus primeros segundos y continúa la historia desde donde acaba (su sonido está en `fuente/sfx_<nombre>.py`). Si no trae tema:
   - Elige tema nuevo según `temas.md` y `GUIA-AUDIENCIA.md` (nunca repetir uno hecho; frustración universal; temas de fecha solo el mismo día o el anterior). Humor cotidiano, situación reconocible, giro final, Paco protagonista. Nunca sagas ni partes.
   - Guion de 35-42 s, 5-6 escenas, con rótulos caption2 (solo resalta palabras sueltas: `*79€*`, no `*79 €*`). El primer rótulo sale en t = 0 y plantea la situación; en los 2 primeros segundos ya pasa algo.
   - Animación: copia `fuente/` a un directorio de trabajo; crea `<tema>.html` partiendo de una escena existente (p. ej. `blackfriday.html`) con los mismos scripts en el mismo orden: common.js, hd.js, fx.js, body2.js, cel.js, props14.js, lib.js, arms.js, anim.js, p20.js. Atrezo nuevo en un `p<N>.js` propio cargado al final. Quita las llamadas a `titleCard`, `irisIn` e `irisOut` que trae la escena de partida: el vídeo empieza ya en la escena, sin negro ni título, y acaba en corte seco. Brazos siempre con arms.js (codo hacia fuera).
   - Comprueba: `node render2.js escena.html <seg> 30 chk --at 0 1 2 6 10 ...` (0, 1 y 2 s siempre, y un instante por escena) y `python3 sheet.py chk hoja.jpg 4`; mira la hoja (Read de la imagen). Revisa que en 0, 1 y 2 s se entienda la situación sin sonido, que no haya errores de consola, cuerpos o caras rotos, textos tapados, codos hacia dentro (`elb.js`). Corrige y repite.
   - Render: `bash par.sh escena.html <seg> fr`; audio con un `sfx_<tema>.py` como los existentes (usa sfx_saga.py); ffmpeg: `ffmpeg -y -framerate 30 -i fr/f%04d.jpg -i audio.wav -c:v libx264 -preset medium -crf 25 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart videos/reel<N>-<slug>.mp4` (debe quedar < 15 MB).
   - Portada: extrae el fotograma elegido a `portadas/portada-reel<N>.jpg`.
   - Escribe `videos/reel<N>-<slug>.md` con portada, fecha, texto de publicación y guion (mismo formato que reel23-black-friday.md).
   - Copia la escena, el p<N>.js y el sfx a `fuente/`. Añade el tema a `temas.md`. Actualiza `calendario.json` (número, slug, tema, portada_ms, estado `programado`).
   - Commit y `git push origin main`. Comprueba con curl que la URL raw devuelve 200 con el tamaño correcto.
   - Programa en Metricool con createScheduledPost (fecha 10:00 Madrid, media = URL raw, videoCoverMilliseconds, texto). Si falla, deja el estado `fallo` y explícalo en la notificación.
4. Si no hay nada que comprobar ni producir, termina con una sola línea: "Sin tareas hoy".

## Notificación final (lo último que escribes; llega al móvil de Sergio)
En castellano, corto, sin saludos. Ejemplos:
- "Reel 24 programado: «<tema>». Se publica el jueves 3 dic a las 10:00."
- "Publicado hoy a las 10:00: reel 24 «<tema>»."
Si hay fallo, empieza por el fallo y qué tiene que hacer Sergio.

## Numeración
El siguiente número es el mayor de `calendario.json` + 1 (los reels 1-23 ya existen).
