# Soil moisture anomalies — SMAP L4 / Brazil

[Use and No-Modification License](LICENSE) — free use and access; modifications and derivative works require the author's express written authorization.

[Português](README.md) | [English](README.en.md) | [Español](README.es.md)

JavaScript application for the Google Earth Engine Code Editor. The `smap_soil_moisture.js` file preserves the code supplied by the author in full.

## Operation examples — October 2026

Application screenshots for **São Paulo (SP), Rio de Janeiro (RJ), Minas Gerais (MG), and Espírito Santo (ES)**, with a requested date of **10/10/2026**, a **2015–2025** reference period, and **P50**. Click an image to open it at full size.

### São Paulo — SP

**10/10/2026 · Root zone · Percentage change relative to the 2015–2025 P50**

[![Soil moisture in São Paulo (SP): root zone, percentage change relative to P50, requested date 10/10/2026](Captura%20de%20tela%20de%202026-11-01%2008-31-43.png)](Captura%20de%20tela%20de%202026-11-01%2008-31-43.png)

### Rio de Janeiro — RJ

**10/10/2026 · Root zone · Percentage change relative to the 2015–2025 P50**

[![Soil moisture in Rio de Janeiro (RJ): root zone, percentage change relative to P50, requested date 10/10/2026](Captura%20de%20tela%20de%202026-11-01%2008-22-54.png)](Captura%20de%20tela%20de%202026-11-01%2008-22-54.png)

### Minas Gerais — MG

**10/10/2026 · Root zone · Percentage change relative to the 2015–2025 P50**

[![Soil moisture in Minas Gerais (MG): root zone, percentage change relative to P50, requested date 10/10/2026](Captura%20de%20tela%20de%202026-11-01%2008-33-31.png)](Captura%20de%20tela%20de%202026-11-01%2008-33-31.png)

### Espírito Santo — ES

**10/10/2026 · Root zone · Percentage change relative to the 2015–2025 P50**

[![Soil moisture in Espírito Santo (ES): root zone, percentage change relative to P50, requested date 10/10/2026](Captura%20de%20tela%20de%202026-11-01%2008-30-46.png)](Captura%20de%20tela%20de%202026-11-01%2008-30-46.png)

### Example settings

| Parameter | Value for reproducing the examples |
| --- | --- |
| Application | `smap_soil_moisture_brasil.js` |
| Requested end date | 10/10/2026 |
| Area | Todo o estado (entire state), repeating execution for SP, RJ, MG, and ES |
| Historical reference | 2015–2025 |
| Reference percentile | P50 |
| Profile | Zona radicular (root zone, `sm_rootzone`) |
| Map product | Zona radicular — variação % vs P50 — original (root zone — % change vs P50 — original) |
| Gap filling | Original product, without spatial imputation |

P50 corresponds to the **historical median of equivalent-window means**, rather than the historical mean. The October 2026 condition is the mean of valid images from 01/10/2026 to the latest observation available within the requested period. The displayed change is `100 × (média observada − P50 histórico) / P50 histórico` (100 × (observed mean − historical P50) / historical P50). Below zero indicates moisture below the reference; above zero indicates moisture above it.

The screenshots show the requested date. The timestamp of the latest observation actually used is not visible in the images; check the execution Console/status.


## National version

The [`smap_soil_moisture_brasil.js`](smap_soil_moisture_brasil.js) file adapts the application to select a state (UF), followed by **Todo o estado** (entire state) or a municipality. Copy this entire file into the Code Editor. The original Espírito Santo version remains in `smap_soil_moisture.js`.

- States: [`projects/ee-aguascapixabas/assets/BR_UF_2022`](https://code.earthengine.google.com/?asset=projects/ee-aguascapixabas/assets/BR_UF_2022), with `NM_UF` and `SIGLA_UF`.
- Municipalities: [`projects/ee-aguascapixabas/assets/BR_Municipios_2022`](https://code.earthengine.google.com/?asset=projects/ee-aguascapixabas/assets/BR_Municipios_2022), configured in `ROI_ASSET`, with the `NM_MUN` field. The national dataset was specified by the author. The code detects whether this collection contains `SIGLA_UF`; access and schema still need to be checked during authenticated execution.
- If municipalities have `SIGLA_UF`, this field is used to filter by the selected state. Without this field, the association uses the municipal centroid contained within the state boundary; check the association when geometries are fragmented or boundaries differ.

States are displayed by abbreviation and name and processed by abbreviation. The initial state is ES, when available. The municipality list loads only the selected state and discards stale responses when the user switches states quickly. When no municipalities are available or the municipal asset returns an error, the interface reports the issue and keeps state analysis available.

**Territorial aggregation:** under Todo o estado, the geometry comes from the state asset and the table/CSV contains one state row, identified by `Tipo_Area = Estado`. For a municipality, the geometry comes from the municipal asset and the table contains the municipal result. The national version does not automatically generate all municipal rows when an entire state is selected. This allows the full state boundary to be analyzed even with partial municipal coverage. Metadata include the state and area type; export names include the state abbreviation. The operational reduction limit was increased to 20 million pixels per region to accommodate large states; state analysis may require more time and resources.

The scientific calculations, bands, gap filling, and export controls have been preserved. Selector syntax and behavior were checked locally using simulated interface APIs, including out-of-order responses, missing municipalities, and loading failures. These checks do not perform geospatial processing in Earth Engine. The new version still requires authenticated validation of assets, maps, statistics, and CSV/GeoTIFF tasks; the execution confirmed by the author refers to the original ES version.

## Running the original version

1. Open https://code.earthengine.google.com/ with an Earth Engine-enabled account and project.
2. Copy the contents of `smap_soil_moisture.js` into a script in the editor.
3. Ensure access to the `projects/ee-aguascapixabas/assets/MUNICIPIOS_ES` asset, whose municipality field must be `nome`.
4. Run the script, configure the date, historical period, municipality, percentile, and profile; click **PROCESSAR** (process).
5. Browse products in the selector and diagnostics in the Console. When selected, exports create tasks in the Tasks tab, which must be started to write to Google Drive in the `GEE_Exportacoes` folder.

There is no local server, npm dependencies, or build routine. Node.js can check syntax (`node --check smap_soil_moisture.js`), but it does not execute Earth Engine's global `ee`, `ui`, `Map`, `Export`, and `print` objects.

## Input layer: municipalities of Espírito Santo

[Open MUNICIPIOS_ES in Google Earth Engine](https://code.earthengine.google.com/?asset=projects/ee-aguascapixabas/assets/MUNICIPIOS_ES)

Asset: `projects/ee-aguascapixabas/assets/MUNICIPIOS_ES`. The application uses the `nome` field to list and select municipalities. The author states that this layer is publicly shared. Including this link in the repository does not change the asset permissions; access is controlled in Earth Engine.

## Source and profiles

Collection: `NASA/SMAP/SPL4SMGP/008`. The `sm_rootzone` (root zone) and `sm_profile` (full profile) bands are used, individually or together. The surface band is not used. Moisture is expressed in m³/m³. The two profiles represent overlapping soil volumes; the script does not calculate an independent deep layer by subtraction.

Product reference: https://developers.google.com/earth-engine/datasets/catalog/NASA_SMAP_SPL4SMGP_008?hl=pt-br

## Implemented method

The calculations below are performed per pixel and per band, before municipal aggregation.

1. **Current window:** starts on the first day of the chosen month, at midnight UTC. The search includes the selected day because the exclusive `filterDate` limit is the following day. Within that search, it identifies the image with the greatest `system:time_start`. The effective end becomes that instant plus one second, to include the last image. Therefore, the analysis accumulates from the beginning of the month, rather than representing an isolated observation on the chosen day.
2. **Observed condition:** arithmetic mean of valid images within the effective window, without duration weighting. Counts are calculated per pixel and band.
3. **Historical reference:** for each year in the selected inclusive range, it starts on the first day of the same month and advances by exactly the duration of the current window, in seconds. It calculates one mean per year. Years without images receive a fully masked image; they do not receive zero moisture. Partial availability within a year is not rejected.
4. **Historical threshold:** applies `ee.Reducer.percentile` to the annual means, using P10, P20, …, P90. The default is P50. Each valid annual mean has equal weight, regardless of its image count. This is a percentile across annual means of equivalent windows, rather than a percentile of all historical images pooled together.
5. **Absolute difference:** `D = O - R`, in m³/m³, where O is the observed mean and R is the selected historical percentile.
6. **Relative change:** `V = 100 × (O - R) / R`. Pixels with a reference less than or equal to zero are masked. Negative values indicate a condition below the selected threshold; positive values indicate a condition above it. Example: O = 0.20 and R = 0.25 yield D = −0.05 m³/m³ and V = −20%. This is not a standard-deviation-standardized anomaly.
7. **Empirical percentile rank:** `100 × média(H_y <= O)` (100 × mean(H_y <= O)) across valid years. Ties count as less than or equal. This indicator is distinct from the percentile selected as the reference.
8. **Coverage:** records the number of valid current images and the number of valid historical annual means per pixel. The total historical collection size printed in the Console also includes years represented by empty images; it does not replace the valid count per pixel.

The interface allows analyses from 2016 onward and references from 2015 onward, ending before the analysis year. The default historical period is 2015 through the year before the current year. If there are no images in the requested window, processing stops. A window of equal duration in seconds can extend beyond the end of February when transferred between leap and non-leap years.

## Area, gap filling, and presentation

State selection retains all municipalities as separate features; the table remains municipal. The display and export geometry is simplified with a tolerance of 1,000 m and receives an 8,000 m buffer. Therefore, rasters include a strip outside the selected area. Municipal reduction uses the original features.

Optional gap filling acts only on percentage change, after clipping it to the expanded geometry. It uses progressive circular focal means of 15, 30, and 60 km with `unmask`: it preserves originally valid values and attempts to fill gaps. Later stages may use values estimated in earlier stages. It neither reconstructs physical observations nor guarantees that all gaps will be filled. Separate masks allow imputed pixels and remaining gaps to be displayed.

The selector offers observed moisture, historical threshold, original change, percentile rank, observation count, and, if enabled, gap-filled change. Absolute difference and historical count are consolidated in the outputs but do not have their own product in the selector. Displayed change uses a continuous ramp from −50% to +50%; data are not truncated at those values. The text ranges in the legend are not a discrete reclassification of the raster.

## Table and exports

Each profile generates the bands below (`rz` for root zone or `pf` for full profile):

| Suffix | Content |
| --- | --- |
| `_obs_m3m3` | Observed mean |
| `_ref_P{p}_m3m3` | Selected historical percentile |
| `_diff_m3m3` | Absolute difference |
| `_var_pct` | Original percentage change |
| `_rank_pct` | Empirical percentile rank |
| `_obs_n` | Count of valid current images |
| `_hist_n` | Count of valid annual means |
| `_var_pct_filled` | Gap-filled change, if enabled |

The table applies `mean().unweighted()` to each band with `reduceRegions`, a requested scale of 3,000 m, the projection obtained from the consolidated image, `tileScale: 16`, and `maxPixelsPerRegion: 100000`. Count values in the table are spatial means and may be fractional. The municipal mean of per-pixel changes does not necessarily equal the change calculated from municipal means of O and R.

**Actual behavior:** the consolidated image includes the gap-filled band when enabled; therefore, the table and CSV also contain the mean of this band, in addition to the original bands. This qualifies the initial comment that statistics use original data: original indicators are preserved, but an additional imputed statistic is also included.

The CSV removes geometry and retains municipal properties and metadata. The GeoTIFF exports the consolidated bands within the expanded geometry, with a requested scale of 11,000 m, `maxPixels: 1e9`, and the Cloud Optimized option. Imputation and gap masks are overlays, rather than bands explicitly added to the exported file. File names use the requested date; the actual date of the last image is shown in the Console/status, but is not added as specific metadata to the table or raster.

## Limitations and validation

- The 3,000 m and 11,000 m scales are operational script parameters. Municipal sampling at 3 km does not create physical information at that resolution. The code does not explicitly fix a native grid with `crsTransform`; the projection of reduced images should be checked in Earth Engine.
- The script does not apply additional quality filters, minimum temporal coverage, or a minimum number of valid years. Check the counts before interpreting results, especially for incomplete historical windows.
- There is no explicit handling of errors returned by `evaluate` callbacks, nor any blocking of concurrent clicks on PROCESSAR.
- Local syntax checking does not validate asset access, API behavior, projections, rendering, or GeoTIFF band-type compatibility. These checks require authenticated execution in Earth Engine and completion of export tasks.

The original code was incorporated without methodological corrections or interface changes. This documentation describes the implementation through inspection; it does not constitute scientific validation of the results.
