# Anomalías de humedad del suelo — SMAP L4 / Brasil

[Licencia de uso y no modificación](LICENSE) — uso y acceso gratuitos; las modificaciones y obras derivadas requieren autorización expresa y escrita del autor.

[Português](README.md) | [English](README.en.md) | [Español](README.es.md)

Aplicación JavaScript para el Code Editor de Google Earth Engine. El archivo `smap_soil_moisture.js` conserva íntegramente el código proporcionado por el autor.

## Ejemplos de operación — octubre de 2026

Capturas de la aplicación para **São Paulo (SP), Rio de Janeiro (RJ), Minas Gerais (MG) y Espírito Santo (ES)**, con fecha solicitada del **10/10/2026**, referencia **2015–2025** y **P50**. Haga clic en una imagen para abrirla a tamaño completo.

### São Paulo — SP

**10/10/2026 · Zona radicular · Variación porcentual respecto al P50 de 2015–2025**

[![Humedad del suelo en São Paulo (SP): zona radicular, variación porcentual respecto al P50, fecha solicitada 10/10/2026](Captura%20de%20tela%20de%202026-11-01%2008-31-43.png)](Captura%20de%20tela%20de%202026-11-01%2008-31-43.png)

### Rio de Janeiro — RJ

**10/10/2026 · Zona radicular · Variación porcentual respecto al P50 de 2015–2025**

[![Humedad del suelo en Rio de Janeiro (RJ): zona radicular, variación porcentual respecto al P50, fecha solicitada 10/10/2026](Captura%20de%20tela%20de%202026-11-01%2008-22-54.png)](Captura%20de%20tela%20de%202026-11-01%2008-22-54.png)

### Minas Gerais — MG

**10/10/2026 · Zona radicular · Variación porcentual respecto al P50 de 2015–2025**

[![Humedad del suelo en Minas Gerais (MG): zona radicular, variación porcentual respecto al P50, fecha solicitada 10/10/2026](Captura%20de%20tela%20de%202026-11-01%2008-33-31.png)](Captura%20de%20tela%20de%202026-11-01%2008-33-31.png)

### Espírito Santo — ES

**10/10/2026 · Zona radicular · Variación porcentual respecto al P50 de 2015–2025**

[![Humedad del suelo en Espírito Santo (ES): zona radicular, variación porcentual respecto al P50, fecha solicitada 10/10/2026](Captura%20de%20tela%20de%202026-11-01%2008-30-46.png)](Captura%20de%20tela%20de%202026-11-01%2008-30-46.png)

### Configuración de los ejemplos

| Parámetro | Valor para reproducir los ejemplos |
| --- | --- |
| Aplicación | `smap_soil_moisture_brasil.js` |
| Fecha final solicitada | 10/10/2026 |
| Área | Todo o estado (todo el estado), repitiendo la ejecución para SP, RJ, MG y ES |
| Referencia histórica | 2015–2025 |
| Percentil de referencia | P50 |
| Perfil | Zona radicular (`sm_rootzone`) |
| Producto en el mapa | Zona radicular — variação % vs P50 — original (zona radicular — variación % frente al P50 — original) |
| Relleno de vacíos | Producto original, sin imputación espacial |

El P50 corresponde a la **mediana histórica de las medias de ventanas equivalentes**, y no a la media histórica. La condición de octubre de 2026 es la media de las imágenes válidas desde el 01/10/2026 hasta la última observación disponible dentro del período solicitado. La variación mostrada es `100 × (média observada − P50 histórico) / P50 histórico` (100 × (media observada − P50 histórico) / P50 histórico). Los valores inferiores a cero indican una humedad por debajo de la referencia; los superiores a cero, por encima.

Las capturas muestran la fecha solicitada. El instante de la última observación efectivamente utilizada no aparece en las imágenes; consulte la consola/estado de la ejecución.


## Versión nacional

El archivo [`smap_soil_moisture_brasil.js`](smap_soil_moisture_brasil.js) adapta la aplicación para seleccionar una unidad federativa (UF) y, a continuación, **Todo o estado** (todo el estado) o un municipio. Copie este archivo completo en el Code Editor. La versión original de Espírito Santo se mantiene en `smap_soil_moisture.js`.

- Estados: [`projects/ee-aguascapixabas/assets/BR_UF_2022`](https://code.earthengine.google.com/?asset=projects/ee-aguascapixabas/assets/BR_UF_2022), con `NM_UF` y `SIGLA_UF`.
- Municipios: [`projects/ee-aguascapixabas/assets/BR_Municipios_2022`](https://code.earthengine.google.com/?asset=projects/ee-aguascapixabas/assets/BR_Municipios_2022), configurado en `ROI_ASSET`, con el campo `NM_MUN`. El autor indicó la base nacional. El código detecta la presencia de `SIGLA_UF` en esta colección; el acceso y el esquema aún deben verificarse durante la ejecución autenticada.
- Si los municipios tienen `SIGLA_UF`, este campo se utiliza para filtrar por la UF seleccionada. Sin este campo, la asociación utiliza el centroide municipal contenido dentro del límite estatal; compruebe la asociación en casos de geometrías fragmentadas o límites divergentes.

Los estados se presentan por sigla y nombre y se procesan por sigla. La UF inicial es ES, cuando está disponible. La lista municipal carga únicamente la UF seleccionada y descarta respuestas antiguas cuando el usuario cambia rápidamente de estado. Si no hay municipios disponibles o se produce un error en el asset municipal, la interfaz informa del problema y mantiene disponible el análisis estatal.

**Agregación territorial:** en Todo o estado, la geometría procede del asset estatal y la tabla/CSV contiene una fila estatal, identificada por `Tipo_Area = Estado`. En un municipio, la geometría procede del asset municipal y la tabla contiene el resultado municipal. La versión nacional no genera automáticamente todas las filas municipales al seleccionar un estado completo. Esto permite analizar todo el límite estatal incluso con cobertura municipal parcial. Los metadatos incluyen UF y tipo de área; los nombres de exportación incluyen la sigla de la UF. El límite operativo de la reducción se amplió a 20 millones de píxeles por región para admitir estados extensos; el análisis estatal puede requerir más tiempo y recursos.

Se han conservado los cálculos científicos, las bandas, el relleno de vacíos y los controles de exportación. La sintaxis y el comportamiento de los selectores se comprobaron localmente mediante simulación de las API de la interfaz, incluidas respuestas fuera de orden, ausencia de municipios y fallos de carga. Estas comprobaciones no ejecutan procesamiento geoespacial en Earth Engine. La nueva versión aún requiere validación autenticada de los assets, mapas, estadísticas y tareas CSV/GeoTIFF; la ejecución confirmada por el autor corresponde a la versión original de ES.

## Ejecución de la versión original

1. Abra https://code.earthengine.google.com/ con una cuenta y un proyecto habilitados para Earth Engine.
2. Copie el contenido de `smap_soil_moisture.js` en un script del editor.
3. Asegúrese de tener acceso al asset `projects/ee-aguascapixabas/assets/MUNICIPIOS_ES`, cuyo campo municipal debe ser `nome`.
4. Ejecute el script, configure la fecha, el período histórico, el municipio, el percentil y el perfil; haga clic en **PROCESSAR** (procesar).
5. Consulte los productos en el selector y los diagnósticos en la consola. Cuando se seleccionan, las exportaciones crean tareas en la pestaña Tasks, que deben iniciarse para guardar los archivos en Google Drive, en la carpeta `GEE_Exportacoes`.

No hay servidor local, dependencias npm ni rutina de compilación. Node.js puede comprobar la sintaxis (`node --check smap_soil_moisture.js`), pero no ejecuta los objetos globales `ee`, `ui`, `Map`, `Export` y `print` de Earth Engine.

## Capa de entrada: municipios de Espírito Santo

[Abrir MUNICIPIOS_ES en Google Earth Engine](https://code.earthengine.google.com/?asset=projects/ee-aguascapixabas/assets/MUNICIPIOS_ES)

Asset: `projects/ee-aguascapixabas/assets/MUNICIPIOS_ES`. La aplicación utiliza el campo `nome` para listar y seleccionar municipios. El autor informa de que esta capa se comparte públicamente. La inclusión de este enlace en el repositorio no modifica los permisos del asset; el acceso se controla en Earth Engine.

## Fuente y perfiles

Colección: `NASA/SMAP/SPL4SMGP/008`. Se utilizan las bandas `sm_rootzone` (zona radicular) y `sm_profile` (perfil total), individualmente o en conjunto. No se utiliza la banda superficial. La humedad se expresa en m³/m³. Los dos perfiles representan volúmenes de suelo superpuestos; el script no calcula una capa profunda independiente mediante sustracción.

Referencia del producto: https://developers.google.com/earth-engine/datasets/catalog/NASA_SMAP_SPL4SMGP_008?hl=pt-br

## Método implementado

Los cálculos siguientes se realizan por píxel y por banda, antes de la agregación municipal.

1. **Ventana actual:** comienza el primer día del mes elegido, a medianoche UTC. La búsqueda incluye el día seleccionado, ya que el límite exclusivo de `filterDate` es el día siguiente. Dentro de esa búsqueda, identifica la imagen con el mayor `system:time_start`. El final efectivo pasa a ser ese instante más un segundo, para incluir la última imagen. Por tanto, el análisis se acumula desde el inicio del mes, en lugar de representar una observación aislada del día elegido.
2. **Condición observada:** media aritmética de las imágenes válidas en la ventana efectiva, sin ponderación por duración. El recuento se calcula por píxel y banda.
3. **Referencia histórica:** para cada año del intervalo inclusivo seleccionado, comienza el primer día del mismo mes y avanza exactamente la duración de la ventana actual, en segundos. Calcula una media por año. Los años sin imágenes reciben una imagen completamente enmascarada; no reciben humedad cero. No se rechaza la disponibilidad parcial de un año.
4. **Umbral histórico:** aplica `ee.Reducer.percentile` a las medias anuales, con P10, P20, …, P90. El valor predeterminado es P50. Cada media anual válida tiene el mismo peso, independientemente de su cantidad de imágenes. Es un percentil entre medias anuales de ventanas equivalentes, no el percentil de todas las imágenes históricas agrupadas.
5. **Diferencia absoluta:** `D = O - R`, en m³/m³, donde O es la media observada y R el percentil histórico elegido.
6. **Variación relativa:** `V = 100 × (O - R) / R`. Los píxeles con una referencia menor o igual a cero se enmascaran. Los valores negativos indican una condición inferior al umbral elegido; los positivos, superior. Ejemplo: O = 0,20 y R = 0,25 dan como resultado D = −0,05 m³/m³ y V = −20%. No se trata de una anomalía estandarizada por desviación estándar.
7. **Posición percentílica empírica:** `100 × média(H_y <= O)` (100 × media(H_y <= O)) entre los años válidos. Los empates cuentan como menores o iguales. Este indicador es distinto del percentil elegido como referencia.
8. **Cobertura:** registra la cantidad de imágenes actuales válidas y el número de medias anuales históricas válidas por píxel. El tamaño total de la colección histórica que aparece en la consola también incluye los años representados por imágenes vacías; no sustituye al recuento válido por píxel.

La interfaz permite análisis a partir de 2016 y referencias desde 2015, que terminan antes del año del análisis. El período histórico predeterminado va de 2015 hasta el año anterior al actual. Si no hay imágenes en la ventana solicitada, se interrumpe el procesamiento. Una ventana de igual duración en segundos puede superar el final de febrero al trasladarse entre años bisiestos y no bisiestos.

## Área, relleno y presentación

La selección estatal mantiene todos los municipios como entidades separadas; la tabla sigue siendo municipal. La geometría de visualización y exportación se simplifica con una tolerancia de 1.000 m y recibe un buffer de 8.000 m. Por tanto, los rásteres incluyen una franja externa al área seleccionada. La reducción municipal utiliza las entidades originales.

El relleno opcional actúa únicamente sobre la variación porcentual, después de recortarla a la geometría ampliada. Utiliza medias focales circulares progresivas de 15, 30 y 60 km, con `unmask`: conserva los valores originalmente válidos e intenta rellenar vacíos. Las etapas posteriores pueden utilizar valores estimados en las anteriores. No reconstruye observaciones físicas ni garantiza el relleno de todos los vacíos. Las máscaras separadas permiten visualizar los píxeles imputados y los vacíos restantes.

El selector ofrece humedad observada, umbral histórico, variación original, posición percentílica, recuento de observaciones y, si se activa, variación rellenada. La diferencia absoluta y el recuento histórico se consolidan en las salidas, pero no tienen un producto propio en el selector. La variación mostrada utiliza una rampa continua de −50% a +50%; los datos no se truncan en esos valores. Los intervalos textuales de la leyenda no son una reclasificación discreta del ráster.

## Tabla y exportaciones

Cada perfil genera las bandas siguientes (`rz` para zona radicular o `pf` para perfil total):

| Sufijo | Contenido |
| --- | --- |
| `_obs_m3m3` | Media observada |
| `_ref_P{p}_m3m3` | Percentil histórico elegido |
| `_diff_m3m3` | Diferencia absoluta |
| `_var_pct` | Variación porcentual original |
| `_rank_pct` | Posición percentílica empírica |
| `_obs_n` | Recuento de imágenes actuales válidas |
| `_hist_n` | Recuento de medias anuales válidas |
| `_var_pct_filled` | Variación rellenada, si está activada |

La tabla aplica `mean().unweighted()` a cada banda con `reduceRegions`, una escala solicitada de 3.000 m, la proyección obtenida de la imagen consolidada, `tileScale: 16` y `maxPixelsPerRegion: 100000`. Los valores de recuento de la tabla son medias espaciales y pueden ser fraccionarios. La media municipal de las variaciones por píxel no equivale necesariamente a la variación calculada a partir de las medias municipales de O y R.

**Comportamiento efectivo:** la imagen consolidada incluye la banda rellenada cuando está activada; por ello, la tabla y el CSV también contienen la media de esta banda, además de las bandas originales. Esto matiza el comentario inicial de que las estadísticas utilizan datos originales: los indicadores originales se conservan, pero también se incluye una estadística complementaria imputada.

El CSV elimina la geometría y conserva las propiedades y los metadatos municipales. El GeoTIFF exporta las bandas consolidadas en la geometría ampliada, con una escala solicitada de 11.000 m, `maxPixels: 1e9` y la opción Cloud Optimized. Las máscaras de imputación y vacíos son superposiciones, no bandas añadidas explícitamente al archivo exportado. Los nombres de los archivos utilizan la fecha solicitada; la fecha efectiva de la última imagen se presenta en la consola/estado, pero no se añade como metadato específico de la tabla o del ráster.

## Limitaciones y validación

- Las escalas de 3.000 m y 11.000 m son parámetros operativos del script. El muestreo municipal a 3 km no crea información física a esa resolución. El código no fija explícitamente una cuadrícula nativa con `crsTransform`; conviene comprobar la proyección de las imágenes reducidas en Earth Engine.
- El script no aplica filtros adicionales de calidad, cobertura temporal mínima ni un número mínimo de años válidos. Consulte los recuentos antes de interpretar los resultados, especialmente en ventanas históricas incompletas.
- No hay un tratamiento explícito de los errores devueltos por los callbacks de `evaluate`, ni un bloqueo de clics simultáneos en PROCESSAR.
- La comprobación local de sintaxis no valida el acceso al asset, el comportamiento de las API, las proyecciones, la representación ni la compatibilidad de los tipos de bandas en el GeoTIFF. Estas comprobaciones requieren ejecución autenticada en Earth Engine y la finalización de las tareas de exportación.

El código original se incorporó sin correcciones metodológicas ni cambios en la interfaz. Esta documentación describe la implementación mediante inspección; no constituye una validación científica de los resultados.
