# Tarea automática: reels de Paco

Esta tarea se ejecuta cada día a las 10:17 (Europe/Madrid) en una sesión nueva. Lee este archivo entero antes de hacer nada.

## Reglas fijas de publicación (cuenta Instagram cosas.de.paco)
- Metricool, marca blogId `7780607`, zona `Europe/Madrid`, Instagram tipo `REEL`, `showReelOnFeed: true`, `autoPublish: true`.
- Hora: 10:00 Madrid. Días alternos: un día de publicación y uno de descanso.
- Fechas de publicación de esta tarea: 2026-11-28, y desde 2026-12-03 cada 2 días (12-05, 12-07, 12-09…). Las fechas están en `calendario.json`.
- 2026-12-01 está reservado para el reel del calendario de Adviento: esta tarea no lo hace.
- Portada siempre: `videoCoverMilliseconds` en un fotograma con gancho (el vídeo empieza en negro, nunca 0).
- Texto en castellano de España, 2-3 líneas con gancho + una pregunta al público, y exactamente 5 hashtags: 1-2 de formato (#animacionespañol #humoranimado), 2 del tema concreto, y #cosasdepaco. Nada de #fyp ni #viral.
- Vídeo: URL raw pública del repo, `https://raw.githubusercontent.com/Cosas-de-Paco/paco-reels/main/videos/<archivo>.mp4` (Metricool la acepta y copia el vídeo; comprobado el 2026-11-18).

## Qué hacer en cada ejecución
Hoy = fecha actual en Madrid.

1. Si no existe `/home/user/paco-reels`, adjunta el repo `Cosas-de-Paco/paco-reels` (add_repo) y clónalo. Haz `git pull`.
2. Comprobar publicación de hoy: si en `calendario.json` hay un reel con fecha de hoy y estado `programado`, consulta Metricool (getScheduledPosts de hoy; si ya no aparece como pendiente, se ha publicado). Marca el estado `publicado` (o `fallo` si sigue pendiente con error) y apúntalo para la notificación final.
3. Producir: si hoy es exactamente 2 días antes de la siguiente fecha `libre` de `calendario.json`, crea el reel para esa fecha:
   - Antes, mira en Metricool si esa fecha ya tiene algo programado a las 10:00. Si lo tiene, no produzcas y avísalo en la notificación.
   - Elige tema nuevo según `temas.md` (nunca repetir uno hecho; preferir actualidad de la semana o fecha señalada en España si la hay). Humor cotidiano, situación reconocible, giro final, Paco protagonista.
   - Guion de 40-50 s, 5-7 escenas, con rótulos caption2 (solo resalta palabras sueltas: `*79€*`, no `*79 €*`).
   - Animación: copia `fuente/` a un directorio de trabajo; crea `<tema>.html` partiendo de una escena existente (p. ej. `blackfriday.html`) con los mismos scripts en el mismo orden: common.js, hd.js, fx.js, body2.js, cel.js, props14.js, lib.js, arms.js, anim.js, p20.js. Atrezo nuevo en un `p<N>.js` propio cargado al final. Brazos siempre con arms.js (codo hacia fuera).
   - Comprueba: `node render2.js escena.html <seg> 30 chk --at 2 6 10 ...` (un instante por escena) y `python3 sheet.py chk hoja.jpg 4`; mira la hoja (Read de la imagen). Revisa que no haya errores de consola, cuerpos o caras rotos, textos tapados, codos hacia dentro (`elb.js`). Corrige y repite.
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
