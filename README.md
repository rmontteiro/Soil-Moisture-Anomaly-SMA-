# Anomalias de umidade do solo — SMAP L4 / Brasil

Aplicação JavaScript para o Code Editor do Google Earth Engine. O arquivo `smap_soil_moisture.js` preserva integralmente o código fornecido pelo autor.

## Versão nacional

O arquivo [`smap_soil_moisture_brasil.js`](smap_soil_moisture_brasil.js) adapta a aplicação para seleção de UF e, em seguida, **Todo o estado** ou um município. Copie esse arquivo completo para o Code Editor. A versão original do Espírito Santo permanece em `smap_soil_moisture.js`.

- Estados: [`projects/ee-aguascapixabas/assets/BR_UF_2022`](https://code.earthengine.google.com/?asset=projects/ee-aguascapixabas/assets/BR_UF_2022), com `NM_UF` e `SIGLA_UF`.
- Municípios: [`projects/ee-aguascapixabas/assets/BR_Municipios_2022`](https://code.earthengine.google.com/?asset=projects/ee-aguascapixabas/assets/BR_Municipios_2022), configurado em `ROI_ASSET`, com campo `NM_MUN`. A base nacional foi indicada pelo autor. A presença de `SIGLA_UF` nessa coleção é detectada pelo código; o acesso e o esquema ainda precisam ser verificados na execução autenticada.
- Se os municípios tiverem `SIGLA_UF`, esse campo será usado para filtrar pela UF selecionada. Sem esse campo, a associação usa o centroide municipal contido no limite estadual; confira a associação em casos de geometrias fragmentadas ou limites divergentes.

Os estados são apresentados como sigla e nome e processados pela sigla. A UF inicial é ES, quando disponível. A lista municipal carrega somente a UF selecionada e descarta respostas antigas quando o usuário troca rapidamente de estado. Sem municípios disponíveis ou diante de erro no asset municipal, a interface informa o problema e mantém a análise estadual disponível.

**Agregação territorial:** em Todo o estado, a geometria vem do asset estadual e a tabela/CSV contém uma linha estadual, identificada por `Tipo_Area = Estado`. Em um município, a geometria vem do asset municipal e a tabela contém o resultado municipal. A versão nacional não gera automaticamente todas as linhas municipais ao escolher um estado inteiro. Isso permite analisar o limite estadual completo mesmo com cobertura municipal parcial. Metadados incluem UF e tipo de área; nomes de exportação incluem a sigla da UF. O limite operacional da redução foi ampliado para 20 milhões de pixels por região para acomodar estados extensos; a análise estadual pode demandar mais tempo e recursos.

Os cálculos científicos, as bandas, o preenchimento e os controles de exportação foram preservados. A sintaxe e o comportamento dos seletores foram verificados localmente com simulação das APIs da interface, incluindo respostas fora de ordem, ausência de municípios e falha de carregamento. Essas verificações não executam processamento geoespacial no Earth Engine. A nova versão ainda requer validação autenticada dos assets, mapas, estatísticas e tarefas CSV/GeoTIFF; a execução confirmada pelo autor refere-se à versão original do ES.

## Exemplos de operação — outubro de 2026

Espaços reservados para capturas dos resultados estaduais de **São Paulo (SP), Rio de Janeiro (RJ), Minas Gerais (MG) e Espírito Santo (ES)**. As imagens serão inseridas manualmente pelo autor no GitHub; ainda não há resultados ilustrados nesta seção.

### Configuração dos exemplos

| Parâmetro | Valor para reproduzir os exemplos |
| --- | --- |
| Aplicação | `smap_soil_moisture_brasil.js` |
| Data final solicitada | 31/10/2026 |
| Área | Todo o estado, repetindo a execução para SP, RJ, MG e ES |
| Referência histórica | 2015–2025 |
| Percentil de referência | P50 |
| Perfil | Perfil total (`sm_profile`) |
| Produto no mapa | Perfil total — variação % vs P50 — original |
| Preenchimento de lacunas | Desativado para as capturas abaixo |

O P50 corresponde à **mediana histórica das médias de janelas equivalentes**, e não à média histórica. A condição de outubro de 2026 é a média das imagens válidas desde 01/10/2026 até a última observação disponível dentro do período solicitado. A variação exibida é `100 × (média observada − P50 histórico) / P50 histórico`. Abaixo de zero indica umidade inferior à referência; acima de zero, superior.

Ao adicionar cada captura, mantenha a legenda e o painel de parâmetros visíveis. Registre a última observação efetivamente utilizada, pois a seleção de 31/10/2026 não garante que o produto já contenha dados até esse dia. Se usar outro histórico, perfil ou preenchimento, atualize a configuração acima e as legendas correspondentes.

Para inserir as imagens, edite este README no GitHub e arraste a captura para o espaço do estado correspondente. O GitHub gerará o endereço da imagem; substitua o texto de reserva por esse Markdown.

### São Paulo — SP

**Outubro/2026 · Perfil total · Variação percentual em relação ao P50 de 2015–2025**

_Inserir aqui a imagem do resultado para São Paulo._

<!-- SP: inserir aqui o Markdown da imagem enviado pelo GitHub. -->

Última observação utilizada: _preencher após a execução_.

### Rio de Janeiro — RJ

**Outubro/2026 · Perfil total · Variação percentual em relação ao P50 de 2015–2025**

_Inserir aqui a imagem do resultado para o Rio de Janeiro._

<!-- RJ: inserir aqui o Markdown da imagem enviado pelo GitHub. -->

Última observação utilizada: _preencher após a execução_.

### Minas Gerais — MG

**Outubro/2026 · Perfil total · Variação percentual em relação ao P50 de 2015–2025**

_Inserir aqui a imagem do resultado para Minas Gerais._

<!-- MG: inserir aqui o Markdown da imagem enviado pelo GitHub. -->

Última observação utilizada: _preencher após a execução_.

### Espírito Santo — ES

**Outubro/2026 · Perfil total · Variação percentual em relação ao P50 de 2015–2025**

_Inserir aqui a imagem do resultado para o Espírito Santo._

<!-- ES: inserir aqui o Markdown da imagem enviado pelo GitHub. -->

Última observação utilizada: _preencher após a execução_.

## Execução da versão original

1. Abra https://code.earthengine.google.com/ com uma conta e um projeto habilitados para Earth Engine.
2. Copie o conteúdo de `smap_soil_moisture.js` para um script no editor.
3. Garanta acesso ao asset `projects/ee-aguascapixabas/assets/MUNICIPIOS_ES`, cujo campo municipal deve ser `nome`.
4. Execute o script, configure data, histórico, município, percentil e perfil; clique em **PROCESSAR**.
5. Consulte os produtos no seletor e os diagnósticos no Console. Quando selecionadas, as exportações criam tarefas na aba Tasks, que precisam ser iniciadas para gravar no Google Drive, na pasta `GEE_Exportacoes`.

Não há servidor local, dependências npm ou rotina de build. Node.js pode verificar a sintaxe (`node --check smap_soil_moisture.js`), mas não executa os objetos globais `ee`, `ui`, `Map`, `Export` e `print` do Earth Engine.

## Camada de entrada: municípios do Espírito Santo

[Abrir MUNICIPIOS_ES no Google Earth Engine](https://code.earthengine.google.com/?asset=projects/ee-aguascapixabas/assets/MUNICIPIOS_ES)

Asset: `projects/ee-aguascapixabas/assets/MUNICIPIOS_ES`. A aplicação usa o campo `nome` para listar e selecionar municípios. O autor informa que essa camada é compartilhada publicamente. A inclusão deste link no repositório não altera as permissões do asset; o acesso é controlado no Earth Engine.

## Fonte e perfis

Coleção: `NASA/SMAP/SPL4SMGP/008`. São usadas as bandas `sm_rootzone` (zona radicular) e `sm_profile` (perfil total), individualmente ou em conjunto. A banda superficial não é utilizada. A umidade é expressa em m³/m³. Os dois perfis representam volumes de solo sobrepostos; o script não calcula uma camada profunda independente por subtração.

Referência do produto: https://developers.google.com/earth-engine/datasets/catalog/NASA_SMAP_SPL4SMGP_008?hl=pt-br

## Método implementado

Os cálculos abaixo são feitos por pixel e por banda, antes da agregação municipal.

1. **Janela atual:** começa no primeiro dia do mês escolhido, à meia-noite UTC. A busca inclui o dia selecionado, pois o limite exclusivo de `filterDate` é o dia seguinte. Dentro dessa busca, identifica a imagem com o maior `system:time_start`. O fim efetivo passa a ser esse instante mais um segundo, para incluir a última imagem. Portanto, a análise é acumulada desde o início do mês, não uma observação isolada do dia escolhido.
2. **Condição observada:** média aritmética das imagens válidas na janela efetiva, sem ponderação por duração. A contagem é calculada por pixel e banda.
3. **Referência histórica:** para cada ano do intervalo inclusivo selecionado, começa no primeiro dia do mesmo mês e avança exatamente a duração da janela atual, em segundos. Calcula uma média por ano. Anos sem imagens recebem uma imagem totalmente mascarada; não recebem umidade zero. A disponibilidade parcial de um ano não é rejeitada.
4. **Limiar histórico:** aplica `ee.Reducer.percentile` às médias anuais, com P10, P20, …, P90. O padrão é P50. Cada média anual válida tem o mesmo peso, independentemente de sua quantidade de imagens. Esse é um percentil entre médias anuais de janelas equivalentes, não o percentil de todas as imagens históricas agrupadas.
5. **Diferença absoluta:** `D = O - R`, em m³/m³, sendo O a média observada e R o percentil histórico escolhido.
6. **Variação relativa:** `V = 100 × (O - R) / R`. Pixels com referência menor ou igual a zero são mascarados. Valores negativos indicam condição abaixo do limiar escolhido; positivos, acima. Exemplo: O = 0,20 e R = 0,25 resultam em D = −0,05 m³/m³ e V = −20%. Não se trata de anomalia padronizada por desvio-padrão.
7. **Posição percentílica empírica:** `100 × média(H_y <= O)` entre os anos válidos. Empates contam como menores ou iguais. Este indicador é distinto do percentil escolhido como referência.
8. **Cobertura:** registra a quantidade de imagens atuais válidas e o número de médias anuais históricas válidas por pixel. O tamanho total da coleção histórica impresso no Console inclui também os anos representados por imagens vazias; não substitui a contagem válida por pixel.

A interface permite análises a partir de 2016 e referências desde 2015, terminando antes do ano da análise. O histórico inicial padrão é 2015 até o ano anterior ao atual. Se não houver imagens na janela solicitada, o processamento é interrompido. Uma janela de mesma duração em segundos pode ultrapassar o fim de fevereiro ao ser transportada entre anos bissextos e não bissextos.

## Área, preenchimento e apresentação

A seleção estadual mantém todos os municípios como feições separadas; a tabela continua sendo municipal. A geometria de visualização e exportação é simplificada com tolerância de 1.000 m e recebe buffer de 8.000 m. Portanto, os rasters incluem uma faixa externa à área selecionada. A redução municipal usa as feições originais.

O preenchimento opcional atua somente na variação percentual, após seu recorte à geometria expandida. Usa médias focais circulares progressivas de 15, 30 e 60 km, com `unmask`: preserva valores originalmente válidos e tenta preencher lacunas. Etapas posteriores podem utilizar valores estimados nas anteriores. Não reconstrói observações físicas nem garante o preenchimento de todas as lacunas. Máscaras separadas permitem visualizar pixels imputados e lacunas remanescentes.

O seletor oferece umidade observada, limiar histórico, variação original, posição percentílica, contagem de observações e, se ativada, variação preenchida. A diferença absoluta e a contagem histórica são consolidadas nas saídas, mas não possuem produto próprio no seletor. A variação exibida usa uma rampa contínua de −50% a +50%; os dados não são truncados nesses valores. As faixas textuais da legenda não são uma reclassificação discreta do raster.

## Tabela e exportações

Cada perfil gera as bandas abaixo (`rz` para zona radicular ou `pf` para perfil total):

| Sufixo | Conteúdo |
| --- | --- |
| `_obs_m3m3` | Média observada |
| `_ref_P{p}_m3m3` | Percentil histórico escolhido |
| `_diff_m3m3` | Diferença absoluta |
| `_var_pct` | Variação percentual original |
| `_rank_pct` | Posição percentílica empírica |
| `_obs_n` | Contagem de imagens atuais válidas |
| `_hist_n` | Contagem de médias anuais válidas |
| `_var_pct_filled` | Variação preenchida, se ativada |

A tabela aplica `mean().unweighted()` a cada banda com `reduceRegions`, escala solicitada de 3.000 m, projeção obtida da imagem consolidada, `tileScale: 16` e `maxPixelsPerRegion: 100000`. Os valores de contagem na tabela são médias espaciais e podem ser fracionários. A média municipal das variações por pixel não equivale necessariamente à variação calculada a partir das médias municipais de O e R.

**Comportamento efetivo:** a imagem consolidada inclui a banda preenchida quando ativada; por isso a tabela e o CSV também contêm a média dessa banda, além das bandas originais. Isso qualifica o comentário inicial de que as estatísticas usam dados originais: os indicadores originais são preservados, mas há também uma estatística complementar imputada.

O CSV remove a geometria e mantém propriedades e metadados municipais. O GeoTIFF exporta as bandas consolidadas na geometria expandida, com escala solicitada de 11.000 m, `maxPixels: 1e9` e opção Cloud Optimized. As máscaras de imputação e lacunas são overlays, não bandas explicitamente adicionadas ao arquivo exportado. Os nomes dos arquivos usam a data solicitada; a data efetiva da última imagem é apresentada no Console/status, mas não é adicionada como metadado específico da tabela ou do raster.

## Limitações e validação

- As escalas de 3.000 m e 11.000 m são parâmetros operacionais do script. A amostragem municipal a 3 km não cria informação física nessa resolução. O código não fixa explicitamente uma grade nativa com `crsTransform`; a projeção das imagens reduzidas merece conferência no Earth Engine.
- O script não aplica filtros adicionais de qualidade, cobertura mínima temporal ou quantidade mínima de anos válidos. Consulte as contagens antes de interpretar os resultados, especialmente em janelas históricas incompletas.
- Não há tratamento explícito dos erros retornados pelos callbacks de `evaluate`, nem bloqueio de cliques concorrentes em PROCESSAR.
- A checagem local de sintaxe não valida acesso ao asset, comportamento das APIs, projeções, renderização ou compatibilidade dos tipos de bandas no GeoTIFF. Essas verificações exigem execução autenticada no Earth Engine e conclusão das tarefas de exportação.

O código original foi incorporado sem correções metodológicas ou mudanças de interface. Esta documentação descreve a implementação por inspeção; não constitui validação científica dos resultados.
