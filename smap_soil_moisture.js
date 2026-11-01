// ==============================================================================
// MONITORAMENTO INTERATIVO DE UMIDADE DO SOLO — SMAP L4
// ESPÍRITO SANTO
//
// VERSÃO COM INTERFACE COMPACTA E CENTRALIZADA VERTICALMENTE
//
// Produto:
// NASA/SMAP/SPL4SMGP/008
//
// Bandas físicas:
// sm_rootzone
// sm_profile
//
// RECURSOS:
// 1. Data final selecionável;
// 2. Período histórico selecionável;
// 3. Estado inteiro ou município;
// 4. Percentil histórico;
// 5. Zona radicular, perfil total ou ambos;
// 6. Tabela opcional;
// 7. CSV opcional;
// 8. GeoTIFF opcional;
// 9. Preenchimento espacial opcional;
// 10. Seletor de produto após processamento;
// 11. Legenda dinâmica;
// 12. Controle de pixels imputados e lacunas.
//
// IMPORTANTE:
// - processamento pesado somente após clique em PROCESSAR;
// - estatísticas utilizam dados originais;
// - preenchimento é produto complementar;
// - unidades temporais utilizam "second", nunca "millisecond".
// ==============================================================================



// ==============================================================================
// 1. CONFIGURAÇÕES FIXAS
// ==============================================================================

var ROI_ASSET =
  'projects/ee-aguascapixabas/assets/MUNICIPIOS_ES';

var CAMPO_MUNICIPIO =
  'nome';

var DATASET =
  'NASA/SMAP/SPL4SMGP/008';

var PASTA_DRIVE =
  'GEE_Exportacoes';


// Escala nominal operacional do produto.
var ESCALA_SMAP =
  11000;


// Escala de amostragem das estatísticas.
// NÃO representa resolução científica de 3 km.
var ESCALA_MUNICIPAL =
  3000;


// Simplificação geométrica apenas cartográfica.
var TOLERANCIA_SIMPLIFICACAO =
  1000;


// Buffer para reduzir cortes de células na borda.
var BUFFER_GRADE =
  8000;


// Preenchimento espacial progressivo.
var RAIO_FILL_1 =
  15000;

var RAIO_FILL_2 =
  30000;

var RAIO_FILL_3 =
  60000;



// ==============================================================================
// 2. ROI
// ==============================================================================

var roiRaw =
  ee.FeatureCollection(
    ROI_ASSET
  );


Map.centerObject(
  roiRaw,
  7
);



// ==============================================================================
// 3. COLEÇÃO BASE
// ==============================================================================

var smapBase =
  ee.ImageCollection(
    DATASET
  );



// ==============================================================================
// 4. DATA ATUAL — CLIENT SIDE
// ==============================================================================

var hojeJS =
  new Date();


var anoHoje =
  hojeJS.getUTCFullYear();


var mesHoje =
  hojeJS.getUTCMonth() + 1;


var diaHoje =
  hojeJS.getUTCDate();



// ==============================================================================
// 5. FUNÇÕES CLIENT-SIDE
// ==============================================================================

function sequenciaNumerica(
  inicio,
  fim
) {

  var lista = [];

  for (
    var i = inicio;
    i <= fim;
    i++
  ) {

    lista.push(
      i
    );
  }

  return lista;
}



function sequenciaTexto(
  inicio,
  fim
) {

  return sequenciaNumerica(
    inicio,
    fim
  ).map(
    function(valor) {

      return String(
        valor
      );
    }
  );
}



function diasNoMes(
  ano,
  mes
) {

  return new Date(
    Date.UTC(
      ano,
      mes,
      0
    )
  ).getUTCDate();
}



function preencher2(
  valor
) {

  valor =
    Number(
      valor
    );

  return valor < 10
    ? '0' + valor
    : String(valor);
}



function sanitizarNome(
  texto
) {

  return String(
    texto
  )
    .replace(
      /[^A-Za-z0-9]+/g,
      '_'
    )
    .replace(
      /^_+|_+$/g,
      ''
    );
}



// ==============================================================================
// 6. ANOS DISPONÍVEIS NA INTERFACE
// ==============================================================================
//
// 2016 é utilizado como primeiro ano de análise porque permite utilizar
// 2015 como primeira referência histórica.
// ==============================================================================

var primeiroAnoAnalise =
  2016;


var anosAnalise =
  sequenciaTexto(
    primeiroAnoAnalise,
    anoHoje
  );


var anosHistoricos =
  sequenciaTexto(
    2015,
    Math.max(
      2015,
      anoHoje - 1
    )
  );



// ==============================================================================
// 7. ESTILOS DA INTERFACE COMPACTA
// ==============================================================================

var UI_LARGURA_PAINEL =
  '330px';


var estiloTitulo = {

  fontWeight:
    'bold',

  fontSize:
    '13px',

  margin:
    '0 0 1px 0'
};


var estiloSubtitulo = {

  fontSize:
    '10px',

  color:
    '555555',

  margin:
    '0 0 5px 0'
};


var estiloSecao = {

  fontWeight:
    'bold',

  fontSize:
    '10px',

  margin:
    '5px 0 1px 0'
};


var estiloAuxiliar = {

  fontSize:
    '8px',

  color:
    '666666',

  margin:
    '1px 0 1px 0'
};


var estiloLabelLinha = {

  fontSize:
    '9px',

  margin:
    '5px 2px 0 0'
};


var estiloCheckbox = {

  fontSize:
    '9px',

  margin:
    '0 5px 0 0'
};



// ==============================================================================
// 8. DATA FINAL
// ==============================================================================

var selectAno =
  ui.Select({

    items:
      anosAnalise,

    value:
      String(
        anoHoje
      ),

    style: {

      width:
        '67px',

      fontSize:
        '9px',

      margin:
        '0 3px 0 0'
    }
  });


var selectMes =
  ui.Select({

    items:
      sequenciaTexto(
        1,
        12
      ),

    value:
      String(
        mesHoje
      ),

    style: {

      width:
        '48px',

      fontSize:
        '9px',

      margin:
        '0 3px 0 0'
    }
  });


var selectDia =
  ui.Select({

    items:
      sequenciaTexto(
        1,
        diasNoMes(
          anoHoje,
          mesHoje
        )
      ),

    value:
      String(
        diaHoje
      ),

    style: {

      width:
        '48px',

      fontSize:
        '9px',

      margin:
        '0'
    }
  });



// ==============================================================================
// 9. HISTÓRICO
// ==============================================================================

var selectHistInicio =
  ui.Select({

    items:
      anosHistoricos,

    value:
      '2015',

    style: {

      width:
        '70px',

      fontSize:
        '9px',

      margin:
        '0 5px 0 0'
    }
  });


var selectHistFim =
  ui.Select({

    items:
      anosHistoricos,

    value:
      String(
        Math.max(
          2015,
          anoHoje - 1
        )
      ),

    style: {

      width:
        '70px',

      fontSize:
        '9px',

      margin:
        '0'
    }
  });



// ==============================================================================
// 10. MUNICÍPIO
// ==============================================================================

var selectMunicipio =
  ui.Select({

    items: [
      'Todo o Espírito Santo'
    ],

    value:
      'Todo o Espírito Santo',

    style: {

      stretch:
        'horizontal',

      fontSize:
        '9px',

      margin:
        '0'
    }
  });



// ==============================================================================
// 11. CARREGA NOMES DOS MUNICÍPIOS
// ==============================================================================

roiRaw
  .aggregate_array(
    CAMPO_MUNICIPIO
  )
  .distinct()
  .sort()
  .evaluate(
    function(nomes) {

      var lista = [
        'Todo o Espírito Santo'
      ];


      if (
        nomes
      ) {

        for (
          var i = 0;
          i < nomes.length;
          i++
        ) {

          lista.push(
            nomes[i]
          );
        }
      }


      selectMunicipio
        .items()
        .reset(
          lista
        );


      selectMunicipio
        .setValue(
          'Todo o Espírito Santo'
        );
    }
  );



// ==============================================================================
// 12. PERCENTIL
// ==============================================================================

var selectPercentil =
  ui.Select({

    items: [

      'P10',
      'P20',
      'P30',
      'P40',
      'P50',
      'P60',
      'P70',
      'P80',
      'P90'
    ],

    value:
      'P50',

    style: {

      width:
        '78px',

      fontSize:
        '9px',

      margin:
        '0'
    }
  });



// ==============================================================================
// 13. PERFIL
// ==============================================================================

var selectPerfil =
  ui.Select({

    items: [

      'Perfil total',

      'Zona radicular',

      'Ambos'
    ],

    value:
      'Perfil total',

    style: {

      stretch:
        'horizontal',

      fontSize:
        '9px',

      margin:
        '0'
    }
  });



// ==============================================================================
// 14. PRODUTOS DE SAÍDA
// ==============================================================================

var checkTabela =
  ui.Checkbox({

    label:
      'Tabela',

    value:
      true,

    style:
      estiloCheckbox
  });


var checkCSV =
  ui.Checkbox({

    label:
      'CSV',

    value:
      false,

    style:
      estiloCheckbox
  });


var checkRaster =
  ui.Checkbox({

    label:
      'GeoTIFF',

    value:
      false,

    style:
      estiloCheckbox
  });


var checkPreenchimento =
  ui.Checkbox({

    label:
      'Preencher lacunas',

    value:
      true,

    style:
      estiloCheckbox
  });



// ==============================================================================
// 15. STATUS
// ==============================================================================

var labelStatus =
  ui.Label({

    value:
      'Configure e clique em PROCESSAR.',

    style: {

      fontSize:
        '8px',

      color:
        '555555',

      margin:
        '4px 0 0 0'
    }
  });



// ==============================================================================
// 16. ATUALIZA DIAS DO MÊS
// ==============================================================================

function atualizarDias() {

  var ano =
    Number(
      selectAno.getValue()
    );


  var mes =
    Number(
      selectMes.getValue()
    );


  var diaAtual =
    Number(
      selectDia.getValue()
    ) || 1;


  var nDias =
    diasNoMes(
      ano,
      mes
    );


  selectDia
    .items()
    .reset(
      sequenciaTexto(
        1,
        nDias
      )
    );


  selectDia
    .setValue(
      String(
        Math.min(
          diaAtual,
          nDias
        )
      )
    );
}



// ==============================================================================
// 17. ATUALIZA HISTÓRICO
// ==============================================================================

function atualizarHistorico() {

  var ano =
    Number(
      selectAno.getValue()
    );


  var maxHist =
    ano - 1;


  var lista =
    sequenciaTexto(
      2015,
      maxHist
    );


  selectHistInicio
    .items()
    .reset(
      lista
    );


  selectHistFim
    .items()
    .reset(
      lista
    );


  var inicioAtual =
    Number(
      selectHistInicio.getValue()
    );


  if (
    !inicioAtual ||
    inicioAtual > maxHist
  ) {

    selectHistInicio
      .setValue(
        '2015'
      );
  }


  var fimAtual =
    Number(
      selectHistFim.getValue()
    );


  if (
    !fimAtual ||
    fimAtual > maxHist
  ) {

    selectHistFim
      .setValue(
        String(
          maxHist
        )
      );
  }
}



// ==============================================================================
// 18. EVENTOS DA DATA
// ==============================================================================

selectAno.onChange(
  function() {

    atualizarDias();

    atualizarHistorico();
  }
);


selectMes.onChange(
  function() {

    atualizarDias();
  }
);



// ==============================================================================
// 19. PAINEL COMPACTO DE INPUT
// ==============================================================================
//
// ALTERAÇÃO PRINCIPAL:
//
// position = middle-left
// largura = 330 px
// fontes menores
// espaçamentos reduzidos
// ==============================================================================

var painelConfig =
  ui.Panel({

    style: {

      position:
        'middle-left',

      width:
        UI_LARGURA_PAINEL,

      padding:
        '7px 9px',

      backgroundColor:
        'FFFFFFEE',

      border:
        '1px solid DDDDDD'
    }
  });



// ------------------------------------------------------------------------------
// CABEÇALHO
// ------------------------------------------------------------------------------

painelConfig.add(

  ui.Label({

    value:
      'UMIDADE DO SOLO — SMAP L4',

    style:
      estiloTitulo
  })
);


painelConfig.add(

  ui.Label({

    value:
      'Configuração da análise',

    style:
      estiloSubtitulo
  })
);



// ------------------------------------------------------------------------------
// DATA
// ------------------------------------------------------------------------------

painelConfig.add(

  ui.Label({

    value:
      '1. Data final',

    style:
      estiloSecao
  })
);


painelConfig.add(

  ui.Panel({

    widgets: [

      ui.Label({
        value: 'Ano',
        style: estiloLabelLinha
      }),

      selectAno,

      ui.Label({
        value: 'Mês',
        style: estiloLabelLinha
      }),

      selectMes,

      ui.Label({
        value: 'Dia',
        style: estiloLabelLinha
      }),

      selectDia
    ],

    layout:
      ui.Panel.Layout.flow(
        'horizontal'
      ),

    style: {
      margin: '0'
    }
  })
);


painelConfig.add(

  ui.Label({

    value:
      'Dia 1º → último dado disponível.',

    style:
      estiloAuxiliar
  })
);



// ------------------------------------------------------------------------------
// HISTÓRICO
// ------------------------------------------------------------------------------

painelConfig.add(

  ui.Label({

    value:
      '2. Referência histórica',

    style:
      estiloSecao
  })
);


painelConfig.add(

  ui.Panel({

    widgets: [

      ui.Label({
        value: 'De',
        style: estiloLabelLinha
      }),

      selectHistInicio,

      ui.Label({
        value: 'até',
        style: estiloLabelLinha
      }),

      selectHistFim
    ],

    layout:
      ui.Panel.Layout.flow(
        'horizontal'
      ),

    style: {
      margin: '0'
    }
  })
);


painelConfig.add(

  ui.Label({

    value:
      'Mesma duração da janela atual.',

    style:
      estiloAuxiliar
  })
);



// ------------------------------------------------------------------------------
// ÁREA
// ------------------------------------------------------------------------------

painelConfig.add(

  ui.Label({

    value:
      '3. Área',

    style:
      estiloSecao
  })
);


painelConfig.add(
  selectMunicipio
);



// ------------------------------------------------------------------------------
// PERCENTIL + PERFIL NA MESMA LINHA
// ------------------------------------------------------------------------------

painelConfig.add(

  ui.Label({

    value:
      '4. Referência e perfil',

    style:
      estiloSecao
  })
);


var painelPercentilPerfil =
  ui.Panel({

    widgets: [

      ui.Label({
        value: 'Percentil',
        style: estiloLabelLinha
      }),

      selectPercentil,

      ui.Label({
        value: 'Perfil',
        style: estiloLabelLinha
      }),

      selectPerfil
    ],

    layout:
      ui.Panel.Layout.flow(
        'horizontal'
      ),

    style: {
      margin: '0'
    }
  });


painelConfig.add(
  painelPercentilPerfil
);



// ------------------------------------------------------------------------------
// SAÍDAS
// ------------------------------------------------------------------------------

painelConfig.add(

  ui.Label({

    value:
      '5. Saídas',

    style:
      estiloSecao
  })
);


var painelSaidas =
  ui.Panel({

    widgets: [

      checkTabela,

      checkCSV,

      checkRaster,

      checkPreenchimento
    ],

    layout:
      ui.Panel.Layout.flow(
        'horizontal',
        true
      ),

    style: {
      margin: '0'
    }
  });


painelConfig.add(
  painelSaidas
);



// ==============================================================================
// 20. VARIÁVEIS DOS RESULTADOS
// ==============================================================================

var painelResultado =
  null;

var painelLegenda =
  null;

var seletorProdutoResultado =
  null;


var checkboxLimites =
  null;

var checkboxImputados =
  null;

var checkboxLacunas =
  null;


var produtosResultado =
  {};

var nomesProdutosResultado =
  [];


var layerLimites =
  null;

var layerImputadosRZ =
  null;

var layerImputadosPF =
  null;

var layerLacunasRZ =
  null;

var layerLacunasPF =
  null;



// ==============================================================================
// 21. LINHA DA LEGENDA
// ==============================================================================

function linhaLegenda(
  cor,
  texto
) {

  var caixa =
    ui.Label({

      style: {

        backgroundColor:
          cor,

        padding:
          '7px',

        margin:
          '0 6px 3px 0'
      }
    });


  var rotulo =
    ui.Label({

      value:
        texto,

      style: {

        fontSize:
          '10px',

        margin:
          '1px 0 3px 0'
      }
    });


  return ui.Panel({

    widgets: [
      caixa,
      rotulo
    ],

    layout:
      ui.Panel.Layout.flow(
        'horizontal'
      )
  });
}



// ==============================================================================
// 22. LEGENDA — UMIDADE VOLUMÉTRICA
// ==============================================================================

function legendaUmidade(
  config
) {

  painelLegenda.add(

    ui.Label({

      value:
        config.titulo,

      style: {

        fontWeight:
          'bold',

        fontSize:
          '12px'
      }
    })
  );


  painelLegenda.add(

    ui.Label({

      value:
        config.subtitulo,

      style: {
        fontSize: '9px'
      }
    })
  );


  painelLegenda.add(

    ui.Label({

      value:
        'Unidade: m³/m³',

      style: {
        fontSize: '9px'
      }
    })
  );


  painelLegenda.add(
    linhaLegenda(
      '#8C510A',
      'Muito baixa'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#D8B365',
      'Baixa'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#F5F5F5',
      'Intermediária'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#5AB4AC',
      'Alta'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#01665E',
      'Muito alta'
    )
  );
}



// ==============================================================================
// 23. LEGENDA — VARIAÇÃO PERCENTUAL
// ==============================================================================

function legendaVariacao(
  config,
  pRef
) {

  painelLegenda.add(

    ui.Label({

      value:
        config.titulo,

      style: {

        fontWeight:
          'bold',

        fontSize:
          '12px'
      }
    })
  );


  painelLegenda.add(

    ui.Label({

      value:
        config.subtitulo,

      style: {
        fontSize: '9px'
      }
    })
  );


  painelLegenda.add(

    ui.Label({

      value:
        'P' +
        pRef +
        ' histórico | %',

      style: {
        fontSize: '9px'
      }
    })
  );


  painelLegenda.add(
    linhaLegenda(
      '#67001F',
      '≤ −50% — muito abaixo'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#B2182B',
      '−50 a −25%'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#F4A582',
      '−25 a 0%'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#F7F7F7',
      '0% — referência'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#92C5DE',
      '0 a +25%'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#2166AC',
      '+25 a +50%'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#053061',
      '≥ +50%'
    )
  );


  if (
    config.preenchido
  ) {

    painelLegenda.add(

      ui.Label({

        value:
          'Inclui imputação espacial em pixels sem dados.',

        style: {

          fontWeight:
            'bold',

          fontSize:
            '8px',

          margin:
            '4px 0 0 0'
        }
      })
    );
  }
}



// ==============================================================================
// 24. LEGENDA — POSIÇÃO PERCENTÍLICA
// ==============================================================================

function legendaRank(
  config
) {

  painelLegenda.add(

    ui.Label({

      value:
        config.titulo,

      style: {

        fontWeight:
          'bold',

        fontSize:
          '12px'
      }
    })
  );


  painelLegenda.add(

    ui.Label({

      value:
        config.subtitulo,

      style: {
        fontSize: '9px'
      }
    })
  );


  painelLegenda.add(
    linhaLegenda(
      '#67001F',
      'P0–P20 — muito baixa'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#D6604D',
      'P20–P40 — baixa'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#F7F7F7',
      'P40–P60 — mediana'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#4393C3',
      'P60–P80 — alta'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#053061',
      'P80–P100 — muito alta'
    )
  );
}



// ==============================================================================
// 25. LEGENDA — OBSERVAÇÕES
// ==============================================================================

function legendaObservacoes(
  config
) {

  painelLegenda.add(

    ui.Label({

      value:
        config.titulo,

      style: {

        fontWeight:
          'bold',

        fontSize:
          '12px'
      }
    })
  );


  painelLegenda.add(

    ui.Label({

      value:
        'Número de imagens válidas.',

      style: {
        fontSize: '9px'
      }
    })
  );


  painelLegenda.add(
    linhaLegenda(
      '#FF0000',
      'Poucas'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#FFFF00',
      'Intermediárias'
    )
  );


  painelLegenda.add(
    linhaLegenda(
      '#00FF00',
      'Elevadas'
    )
  );
}



// ==============================================================================
// 26. ATUALIZA LEGENDA
// ==============================================================================

function atualizarLegendaResultado(
  pRef
) {

  painelLegenda.clear();


  var nome =
    seletorProdutoResultado
      .getValue();


  var config =
    produtosResultado[
      nome
    ];


  if (
    config.tipo ===
    'umidade'
  ) {

    legendaUmidade(
      config
    );
  }


  if (
    config.tipo ===
    'variacao'
  ) {

    legendaVariacao(
      config,
      pRef
    );
  }


  if (
    config.tipo ===
    'rank'
  ) {

    legendaRank(
      config
    );
  }


  if (
    config.tipo ===
    'observacoes'
  ) {

    legendaObservacoes(
      config
    );
  }


  if (
    checkboxImputados &&
    checkboxImputados.getValue()
  ) {

    painelLegenda.add(
      linhaLegenda(
        '#FF00FF',
        'Pixels imputados'
      )
    );
  }


  if (
    checkboxLacunas &&
    checkboxLacunas.getValue()
  ) {

    painelLegenda.add(
      linhaLegenda(
        '#FFFF00',
        'Lacunas remanescentes'
      )
    );
  }


  if (
    checkboxLimites &&
    checkboxLimites.getValue()
  ) {

    painelLegenda.add(
      linhaLegenda(
        '#000000',
        'Limite da área'
      )
    );
  }
}



// ==============================================================================
// 27. DESLIGA PRODUTOS
// ==============================================================================

function desligarProdutosResultado() {

  for (
    var i = 0;
    i < nomesProdutosResultado.length;
    i++
  ) {

    produtosResultado[
      nomesProdutosResultado[i]
    ]
      .layer
      .setShown(
        false
      );
  }
}



// ==============================================================================
// 28. ATUALIZA OVERLAYS
// ==============================================================================

function atualizarOverlaysResultado(
  familia,
  pRef
) {

  if (layerImputadosRZ) {
    layerImputadosRZ.setShown(false);
  }

  if (layerImputadosPF) {
    layerImputadosPF.setShown(false);
  }

  if (layerLacunasRZ) {
    layerLacunasRZ.setShown(false);
  }

  if (layerLacunasPF) {
    layerLacunasPF.setShown(false);
  }


  if (
    layerLimites
  ) {

    layerLimites.setShown(
      checkboxLimites.getValue()
    );
  }


  if (
    checkboxImputados &&
    checkboxImputados.getValue()
  ) {

    if (
      familia === 'rootzone' &&
      layerImputadosRZ
    ) {

      layerImputadosRZ
        .setShown(true);
    }


    if (
      familia === 'profile' &&
      layerImputadosPF
    ) {

      layerImputadosPF
        .setShown(true);
    }
  }


  if (
    checkboxLacunas &&
    checkboxLacunas.getValue()
  ) {

    if (
      familia === 'rootzone' &&
      layerLacunasRZ
    ) {

      layerLacunasRZ
        .setShown(true);
    }


    if (
      familia === 'profile' &&
      layerLacunasPF
    ) {

      layerLacunasPF
        .setShown(true);
    }
  }


  atualizarLegendaResultado(
    pRef
  );
}



// ==============================================================================
// 29. SELECIONA PRODUTO
// ==============================================================================

function selecionarProdutoResultado(
  nome,
  pRef
) {

  desligarProdutosResultado();


  var config =
    produtosResultado[
      nome
    ];


  config.layer
    .setShown(
      true
    );


  atualizarOverlaysResultado(
    config.familia,
    pRef
  );
}



// ==============================================================================
// 30. PREENCHIMENTO PROGRESSIVO
// ==============================================================================

function preencherProgressivamente(
  imagem,
  nome
) {

  var estimativa15 =
    imagem.focalMean({

      radius:
        RAIO_FILL_1,

      units:
        'meters',

      kernelType:
        'circle',

      iterations:
        1
    });


  var etapa15 =
    imagem.unmask(
      estimativa15
    );


  var estimativa30 =
    etapa15.focalMean({

      radius:
        RAIO_FILL_2,

      units:
        'meters',

      kernelType:
        'circle',

      iterations:
        1
    });


  var etapa30 =
    etapa15.unmask(
      estimativa30
    );


  var estimativa60 =
    etapa30.focalMean({

      radius:
        RAIO_FILL_3,

      units:
        'meters',

      kernelType:
        'circle',

      iterations:
        1
    });


  return etapa30
    .unmask(
      estimativa60
    )
    .rename(
      nome
    );
}



// ==============================================================================
// 31. BOTÃO PROCESSAR — COMPACTO
// ==============================================================================

var botaoProcessar =
  ui.Button({

    label:
      'PROCESSAR',

    style: {

      stretch:
        'horizontal',

      fontSize:
        '10px',

      margin:
        '6px 0 0 0'
    }
  });


painelConfig.add(
  botaoProcessar
);


painelConfig.add(
  labelStatus
);


Map.add(
  painelConfig
);



// ==============================================================================
// 32. PROCESSAMENTO PRINCIPAL
// ==============================================================================

botaoProcessar.onClick(
  function() {


    // ==========================================================================
    // 32.1 PARÂMETROS
    // ==========================================================================

    var ano =
      Number(
        selectAno.getValue()
      );


    var mes =
      Number(
        selectMes.getValue()
      );


    var dia =
      Number(
        selectDia.getValue()
      );


    var histInicio =
      Number(
        selectHistInicio.getValue()
      );


    var histFim =
      Number(
        selectHistFim.getValue()
      );


    var municipio =
      selectMunicipio.getValue();


    var perfilEscolhido =
      selectPerfil.getValue();


    var pRef =
      Number(
        selectPercentil
          .getValue()
          .replace(
            'P',
            ''
          )
      );


    // ==========================================================================
    // 32.2 VALIDAÇÕES
    // ==========================================================================

    if (
      !histInicio ||
      !histFim
    ) {

      labelStatus.setValue(
        'ERRO: período histórico inválido.'
      );

      return;
    }


    if (
      histInicio > histFim
    ) {

      labelStatus.setValue(
        'ERRO: ano inicial > ano final.'
      );

      return;
    }


    if (
      histFim >= ano
    ) {

      labelStatus.setValue(
        'ERRO: histórico deve terminar antes da análise.'
      );

      return;
    }


    // ==========================================================================
    // 32.3 DATA
    // ==========================================================================

    var dataString =
      ano +
      '-' +
      preencher2(mes) +
      '-' +
      preencher2(dia);


    // ==========================================================================
    // 32.4 PERFIL
    // ==========================================================================

    var bandas =
      [];


    var processarRootzone =
      false;


    var processarProfile =
      false;


    if (
      perfilEscolhido ===
      'Zona radicular'
    ) {

      bandas = [
        'sm_rootzone'
      ];


      processarRootzone =
        true;
    }


    if (
      perfilEscolhido ===
      'Perfil total'
    ) {

      bandas = [
        'sm_profile'
      ];


      processarProfile =
        true;
    }


    if (
      perfilEscolhido ===
      'Ambos'
    ) {

      bandas = [

        'sm_rootzone',

        'sm_profile'
      ];


      processarRootzone =
        true;


      processarProfile =
        true;
    }


    // ==========================================================================
    // 32.5 ÁREA
    // ==========================================================================

    var roiAnalise;


    if (
      municipio ===
      'Todo o Espírito Santo'
    ) {

      roiAnalise =
        roiRaw;

    } else {

      roiAnalise =
        roiRaw.filter(
          ee.Filter.eq(
            CAMPO_MUNICIPIO,
            municipio
          )
        );
    }


    var geometria =
      roiAnalise
        .geometry()
        .simplify(
          TOLERANCIA_SIMPLIFICACAO
        );


    var geometriaExpandida =
      geometria.buffer(
        BUFFER_GRADE
      );


    Map.centerObject(

      roiAnalise,

      municipio ===
        'Todo o Espírito Santo'
        ? 7
        : 10
    );


    // ==========================================================================
    // 32.6 COLEÇÃO
    // ==========================================================================

    var smap =
      smapBase.select(
        bandas
      );


    // ==========================================================================
    // 32.7 JANELA SOLICITADA
    // ==========================================================================

    var inicioObservado =
      ee.Date.fromYMD(
        ano,
        mes,
        1
      );


    var fimSolicitado =
      ee.Date(
        dataString
      )
      .advance(
        1,
        'day'
      );


    var colecaoSolicitada =
      smap
        .filterDate(
          inicioObservado,
          fimSolicitado
        )
        .filterBounds(
          geometriaExpandida
        );


    labelStatus.setValue(
      'Verificando dados...'
    );


    // ==========================================================================
    // 32.8 VERIFICA DISPONIBILIDADE
    // ==========================================================================

    colecaoSolicitada
      .size()
      .evaluate(
        function(numeroImagens) {


          if (
            numeroImagens === 0
          ) {

            labelStatus.setValue(
              'ERRO: sem dados no período.'
            );

            return;
          }


          labelStatus.setValue(
            'Processando...'
          );


          // ====================================================================
          // 32.9 ÚLTIMA OBSERVAÇÃO
          // ====================================================================

          var ultimaImagem =
            ee.Image(
              colecaoSolicitada
                .sort(
                  'system:time_start',
                  false
                )
                .first()
            );


          var ultimaData =
            ee.Date(
              ultimaImagem.get(
                'system:time_start'
              )
            );


          // ====================================================================
          // 32.10 FIM EFETIVO
          // ====================================================================

          var fimObservado =
            ultimaData.advance(
              1,
              'second'
            );


          // ====================================================================
          // 32.11 DURAÇÃO
          // ====================================================================

          var duracaoSegundos =
            fimObservado.difference(
              inicioObservado,
              'second'
            );


          // ====================================================================
          // 32.12 COLEÇÃO OBSERVADA
          // ====================================================================

          var colecaoObservada =
            smap
              .filterDate(
                inicioObservado,
                fimObservado
              )
              .filterBounds(
                geometriaExpandida
              );


          // ====================================================================
          // 32.13 MÉDIA E CONTAGEM
          // ====================================================================

          var mediaObservada =
            colecaoObservada.mean();


          var contagemObservada =
            colecaoObservada.count();


          // ====================================================================
          // 32.14 IMAGEM VAZIA
          // ====================================================================

          var constantes =
            [];


          for (
            var b = 0;
            b < bandas.length;
            b++
          ) {

            constantes.push(0);
          }


          var imagemVazia =
            ee.Image
              .constant(
                constantes
              )
              .rename(
                bandas
              )
              .updateMask(
                ee.Image(0)
              );


          // ====================================================================
          // 32.15 HISTÓRICO
          // ====================================================================

          var listaAnos =
            ee.List.sequence(
              histInicio,
              histFim
            );


          var imagensHistoricas =
            listaAnos.map(
              function(anoRef) {


                anoRef =
                  ee.Number(
                    anoRef
                  );


                var inicioRef =
                  ee.Date.fromYMD(
                    anoRef,
                    mes,
                    1
                  );


                var fimRef =
                  inicioRef.advance(
                    duracaoSegundos,
                    'second'
                  );


                var colAno =
                  smap
                    .filterDate(
                      inicioRef,
                      fimRef
                    )
                    .filterBounds(
                      geometriaExpandida
                    );


                var mediaAno =
                  ee.Image(
                    ee.Algorithms.If(

                      colAno
                        .size()
                        .gt(0),

                      colAno.mean(),

                      imagemVazia
                    )
                  );


                return mediaAno.set({

                  'ano_referencia':
                    anoRef,

                  'duracao_segundos':
                    duracaoSegundos
                });
              }
            );


          var historicoMedias =
            ee.ImageCollection
              .fromImages(
                imagensHistoricas
              );


          // ====================================================================
          // 32.16 PERCENTIL HISTÓRICO
          // ====================================================================

          var nomesPx =
            [];


          for (
            var p = 0;
            p < bandas.length;
            p++
          ) {

            nomesPx.push(
              bandas[p] +
              '_P' +
              pRef
            );
          }


          var limiarPx =
            historicoMedias
              .reduce(
                ee.Reducer.percentile([
                  pRef
                ])
              )
              .rename(
                nomesPx
              );


          // ====================================================================
          // 32.17 DERIVAÇÃO
          // ====================================================================

          function derivarPerfil(
            banda,
            prefixo
          ) {


            var observada =
              mediaObservada
                .select(
                  banda
                )
                .rename(
                  prefixo +
                  '_obs_m3m3'
                );


            var referencia =
              limiarPx
                .select(
                  banda +
                  '_P' +
                  pRef
                )
                .rename(
                  prefixo +
                  '_ref_P' +
                  pRef +
                  '_m3m3'
                );


            var diferenca =
              observada
                .subtract(
                  referencia
                )
                .rename(
                  prefixo +
                  '_diff_m3m3'
                );


            var variacao =
              diferenca
                .divide(
                  referencia
                )
                .multiply(
                  100
                )
                .updateMask(
                  referencia.gt(0)
                )
                .rename(
                  prefixo +
                  '_var_pct'
                );


            // --------------------------------------------------------------
            // Percentil empírico da condição atual
            // --------------------------------------------------------------

            var rank =
              historicoMedias
                .select(
                  banda
                )
                .map(
                  function(img) {

                    return img
                      .lte(
                        mediaObservada.select(
                          banda
                        )
                      )
                      .rename(
                        prefixo +
                        '_rank'
                      );
                  }
                )
                .mean()
                .multiply(
                  100
                )
                .rename(
                  prefixo +
                  '_rank_pct'
                );


            var nObs =
              contagemObservada
                .select(
                  banda
                )
                .rename(
                  prefixo +
                  '_obs_n'
                );


            var nHist =
              historicoMedias
                .select(
                  banda
                )
                .count()
                .rename(
                  prefixo +
                  '_hist_n'
                );


            return {

              observada:
                observada,

              referencia:
                referencia,

              diferenca:
                diferenca,

              variacao:
                variacao,

              rank:
                rank,

              nObs:
                nObs,

              nHist:
                nHist
            };
          }


          // ====================================================================
          // 32.18 RESULTADOS
          // ====================================================================

          var resultadoRZ =
            null;


          var resultadoPF =
            null;


          if (
            processarRootzone
          ) {

            resultadoRZ =
              derivarPerfil(
                'sm_rootzone',
                'rz'
              );
          }


          if (
            processarProfile
          ) {

            resultadoPF =
              derivarPerfil(
                'sm_profile',
                'pf'
              );
          }


          // ====================================================================
          // 32.19 PREENCHIMENTO
          // ====================================================================

          var preenchimento =
            checkPreenchimento
              .getValue();


          if (
            preenchimento &&
            resultadoRZ
          ) {

            resultadoRZ.variacaoPreenchida =
              preencherProgressivamente(

                resultadoRZ
                  .variacao
                  .clip(
                    geometriaExpandida
                  ),

                'rz_var_pct_filled'
              );


            resultadoRZ.imputados =
              resultadoRZ
                .variacao
                .clip(
                  geometriaExpandida
                )
                .mask()
                .not()
                .and(
                  resultadoRZ
                    .variacaoPreenchida
                    .mask()
                )
                .selfMask()
                .rename(
                  'rz_imputado'
                );


            resultadoRZ.lacunas =
              resultadoRZ
                .variacaoPreenchida
                .mask()
                .not()
                .selfMask()
                .rename(
                  'rz_lacuna'
                );
          }


          if (
            preenchimento &&
            resultadoPF
          ) {

            resultadoPF.variacaoPreenchida =
              preencherProgressivamente(

                resultadoPF
                  .variacao
                  .clip(
                    geometriaExpandida
                  ),

                'pf_var_pct_filled'
              );


            resultadoPF.imputados =
              resultadoPF
                .variacao
                .clip(
                  geometriaExpandida
                )
                .mask()
                .not()
                .and(
                  resultadoPF
                    .variacaoPreenchida
                    .mask()
                )
                .selfMask()
                .rename(
                  'pf_imputado'
                );


            resultadoPF.lacunas =
              resultadoPF
                .variacaoPreenchida
                .mask()
                .not()
                .selfMask()
                .rename(
                  'pf_lacuna'
                );
          }


          // ====================================================================
          // 32.20 LIMPA MAPA
          // ====================================================================

          Map.layers()
            .reset([]);


          produtosResultado =
            {};


          nomesProdutosResultado =
            [];


          // ====================================================================
          // 32.21 VISUALIZAÇÕES
          // ====================================================================

          var visUmidade = {

            min: 0,

            max: 0.9,

            palette: [

              '8C510A',
              'D8B365',
              'F5F5F5',
              '5AB4AC',
              '01665E'
            ],

            opacity:
              0.88
          };


          var visVariacao = {

            min: -50,

            max: 50,

            palette: [

              '67001F',
              'B2182B',
              'F4A582',
              'F7F7F7',
              '92C5DE',
              '2166AC',
              '053061'
            ],

            opacity:
              0.88
          };


          var visRank = {

            min: 0,

            max: 100,

            palette: [

              '67001F',
              'D6604D',
              'F7F7F7',
              '4393C3',
              '053061'
            ],

            opacity:
              0.88
          };


          var visObs = {

            min: 0,

            max: numeroImagens,

            palette: [

              'FF0000',
              'FFFF00',
              '00FF00'
            ],

            opacity:
              0.88
          };


          // ====================================================================
          // 32.22 ADICIONAR PRODUTO
          // ====================================================================

          function adicionarProduto(
            nome,
            imagem,
            vis,
            familia,
            tipo,
            titulo,
            subtitulo,
            preenchido
          ) {

            var layer =
              ui.Map.Layer(

                imagem.clip(
                  geometriaExpandida
                ),

                vis,

                nome,

                false
              );


            Map.layers()
              .add(
                layer
              );


            produtosResultado[
              nome
            ] = {

              layer:
                layer,

              familia:
                familia,

              tipo:
                tipo,

              titulo:
                titulo,

              subtitulo:
                subtitulo,

              preenchido:
                preenchido || false
            };


            nomesProdutosResultado
              .push(
                nome
              );
          }


          // ====================================================================
          // 32.23 ROOTZONE
          // ====================================================================

          if (
            resultadoRZ
          ) {

            adicionarProduto(

              'Zona radicular — umidade observada',

              resultadoRZ.observada,

              visUmidade,

              'rootzone',

              'umidade',

              'Zona radicular — umidade média',

              'Período atual',

              false
            );


            adicionarProduto(

              'Zona radicular — limiar P' + pRef,

              resultadoRZ.referencia,

              visUmidade,

              'rootzone',

              'umidade',

              'Zona radicular — limiar histórico P' + pRef,

              'Referência ' +
              histInicio +
              '–' +
              histFim,

              false
            );


            adicionarProduto(

              'Zona radicular — variação % vs P' +
              pRef +
              ' — original',

              resultadoRZ.variacao,

              visVariacao,

              'rootzone',

              'variacao',

              'Zona radicular — variação relativa',

              'Atual × P' + pRef,

              false
            );


            adicionarProduto(

              'Zona radicular — posição percentílica',

              resultadoRZ.rank,

              visRank,

              'rootzone',

              'rank',

              'Zona radicular — posição percentílica',

              'Histórico ' +
              histInicio +
              '–' +
              histFim,

              false
            );


            adicionarProduto(

              'Zona radicular — observações válidas',

              resultadoRZ.nObs,

              visObs,

              'rootzone',

              'observacoes',

              'Zona radicular — cobertura',

              'Observações válidas',

              false
            );


            if (
              preenchimento
            ) {

              adicionarProduto(

                'Zona radicular — variação % vs P' +
                pRef +
                ' — preenchida',

                resultadoRZ
                  .variacaoPreenchida,

                visVariacao,

                'rootzone',

                'variacao',

                'Zona radicular — variação relativa',

                'Com preenchimento espacial',

                true
              );
            }
          }


          // ====================================================================
          // 32.24 PROFILE
          // ====================================================================

          if (
            resultadoPF
          ) {

            adicionarProduto(

              'Perfil total — umidade observada',

              resultadoPF.observada,

              visUmidade,

              'profile',

              'umidade',

              'Perfil total — umidade média',

              'Período atual',

              false
            );


            adicionarProduto(

              'Perfil total — limiar P' + pRef,

              resultadoPF.referencia,

              visUmidade,

              'profile',

              'umidade',

              'Perfil total — limiar histórico P' + pRef,

              'Referência ' +
              histInicio +
              '–' +
              histFim,

              false
            );


            adicionarProduto(

              'Perfil total — variação % vs P' +
              pRef +
              ' — original',

              resultadoPF.variacao,

              visVariacao,

              'profile',

              'variacao',

              'Perfil total — variação relativa',

              'Atual × P' + pRef,

              false
            );


            adicionarProduto(

              'Perfil total — posição percentílica',

              resultadoPF.rank,

              visRank,

              'profile',

              'rank',

              'Perfil total — posição percentílica',

              'Histórico ' +
              histInicio +
              '–' +
              histFim,

              false
            );


            adicionarProduto(

              'Perfil total — observações válidas',

              resultadoPF.nObs,

              visObs,

              'profile',

              'observacoes',

              'Perfil total — cobertura',

              'Observações válidas',

              false
            );


            if (
              preenchimento
            ) {

              adicionarProduto(

                'Perfil total — variação % vs P' +
                pRef +
                ' — preenchida',

                resultadoPF
                  .variacaoPreenchida,

                visVariacao,

                'profile',

                'variacao',

                'Perfil total — variação relativa',

                'Com preenchimento espacial',

                true
              );
            }
          }


          // ====================================================================
          // 32.25 LIMITES
          // ====================================================================

          var imagemLimites =
            ee.Image()
              .byte()
              .paint(
                roiAnalise,
                1,
                1
              )
              .selfMask();


          layerLimites =
            ui.Map.Layer(

              imagemLimites,

              {
                min: 1,
                max: 1,
                palette: ['000000']
              },

              'Limites',

              true
            );


          Map.layers()
            .add(
              layerLimites
            );


          // ====================================================================
          // 32.26 OVERLAYS
          // ====================================================================

          layerImputadosRZ = null;
          layerImputadosPF = null;

          layerLacunasRZ = null;
          layerLacunasPF = null;


          if (
            preenchimento &&
            resultadoRZ
          ) {

            layerImputadosRZ =
              ui.Map.Layer(

                resultadoRZ.imputados,

                {
                  min: 1,
                  max: 1,
                  palette: ['FF00FF']
                },

                'Pixels imputados — zona radicular',

                false
              );


            layerLacunasRZ =
              ui.Map.Layer(

                resultadoRZ.lacunas,

                {
                  min: 1,
                  max: 1,
                  palette: ['FFFF00']
                },

                'Lacunas — zona radicular',

                false
              );


            Map.layers().add(
              layerImputadosRZ
            );


            Map.layers().add(
              layerLacunasRZ
            );
          }


          if (
            preenchimento &&
            resultadoPF
          ) {

            layerImputadosPF =
              ui.Map.Layer(

                resultadoPF.imputados,

                {
                  min: 1,
                  max: 1,
                  palette: ['FF00FF']
                },

                'Pixels imputados — perfil total',

                false
              );


            layerLacunasPF =
              ui.Map.Layer(

                resultadoPF.lacunas,

                {
                  min: 1,
                  max: 1,
                  palette: ['FFFF00']
                },

                'Lacunas — perfil total',

                false
              );


            Map.layers().add(
              layerImputadosPF
            );


            Map.layers().add(
              layerLacunasPF
            );
          }


          // ====================================================================
          // 32.27 PRODUTO INICIAL
          // ====================================================================

          var produtoInicial;


          if (
            processarProfile
          ) {

            produtoInicial =
              preenchimento

                ? 'Perfil total — variação % vs P' +
                  pRef +
                  ' — preenchida'

                : 'Perfil total — variação % vs P' +
                  pRef +
                  ' — original';

          } else {

            produtoInicial =
              preenchimento

                ? 'Zona radicular — variação % vs P' +
                  pRef +
                  ' — preenchida'

                : 'Zona radicular — variação % vs P' +
                  pRef +
                  ' — original';
          }


          // ====================================================================
          // 32.28 REMOVE PAINÉIS ANTERIORES
          // ====================================================================

          if (
            painelResultado
          ) {

            Map.remove(
              painelResultado
            );
          }


          if (
            painelLegenda
          ) {

            Map.remove(
              painelLegenda
            );
          }


          // ====================================================================
          // 32.29 PAINEL DE RESULTADOS — TAMBÉM COMPACTO
          // ====================================================================

          painelResultado =
            ui.Panel({

              style: {

                position:
                  'top-right',

                width:
                  '330px',

                padding:
                  '8px 10px',

                backgroundColor:
                  'FFFFFFEE'
              }
            });


          painelResultado.add(

            ui.Label({

              value:
                'RESULTADO — SMAP L4',

              style: {

                fontWeight:
                  'bold',

                fontSize:
                  '13px'
              }
            })
          );


          painelResultado.add(

            ui.Label({

              value:
                dataString +
                ' | Ref. ' +
                histInicio +
                '–' +
                histFim +
                ' | P' +
                pRef +
                '\n' +
                municipio,

              style: {

                whiteSpace:
                  'pre',

                fontSize:
                  '9px',

                margin:
                  '2px 0 5px 0'
              }
            })
          );


          seletorProdutoResultado =
            ui.Select({

              items:
                nomesProdutosResultado,

              value:
                produtoInicial,

              style: {

                stretch:
                  'horizontal',

                fontSize:
                  '9px'
              }
            });


          painelResultado.add(
            seletorProdutoResultado
          );


          // ====================================================================
          // 32.30 OVERLAYS
          // ====================================================================

          checkboxLimites =
            ui.Checkbox({

              label:
                'Limites',

              value:
                true,

              style:
                estiloCheckbox
            });


          checkboxImputados =
            ui.Checkbox({

              label:
                'Imputados',

              value:
                false,

              disabled:
                !preenchimento,

              style:
                estiloCheckbox
            });


          checkboxLacunas =
            ui.Checkbox({

              label:
                'Lacunas',

              value:
                false,

              disabled:
                !preenchimento,

              style:
                estiloCheckbox
            });


          painelResultado.add(

            ui.Panel({

              widgets: [

                checkboxLimites,

                checkboxImputados,

                checkboxLacunas
              ],

              layout:
                ui.Panel.Layout.flow(
                  'horizontal',
                  true
                )
            })
          );


          // ====================================================================
          // 32.31 LEGENDA
          // ====================================================================

          painelLegenda =
            ui.Panel({

              style: {

                position:
                  'bottom-left',

                width:
                  '300px',

                padding:
                  '7px 9px',

                backgroundColor:
                  'FFFFFFEE'
              }
            });


          Map.add(
            painelLegenda
          );


          // ====================================================================
          // 32.32 EVENTOS
          // ====================================================================

          seletorProdutoResultado
            .onChange(
              function(nome) {

                selecionarProdutoResultado(
                  nome,
                  pRef
                );
              }
            );


          checkboxLimites
            .onChange(
              function() {

                var config =
                  produtosResultado[
                    seletorProdutoResultado
                      .getValue()
                  ];


                atualizarOverlaysResultado(
                  config.familia,
                  pRef
                );
              }
            );


          checkboxImputados
            .onChange(
              function() {

                var config =
                  produtosResultado[
                    seletorProdutoResultado
                      .getValue()
                  ];


                atualizarOverlaysResultado(
                  config.familia,
                  pRef
                );
              }
            );


          checkboxLacunas
            .onChange(
              function() {

                var config =
                  produtosResultado[
                    seletorProdutoResultado
                      .getValue()
                  ];


                atualizarOverlaysResultado(
                  config.familia,
                  pRef
                );
              }
            );


          // ====================================================================
          // 32.33 NOVA ANÁLISE
          // ====================================================================

          var botaoNovaAnalise =
            ui.Button({

              label:
                'NOVA ANÁLISE',

              style: {

                stretch:
                  'horizontal',

                fontSize:
                  '9px',

                margin:
                  '5px 0 0 0'
              },

              onClick:
                function() {

                  painelConfig
                    .style()
                    .set(
                      'shown',
                      true
                    );


                  painelResultado
                    .style()
                    .set(
                      'shown',
                      false
                    );


                  painelLegenda
                    .style()
                    .set(
                      'shown',
                      false
                    );
                }
            });


          painelResultado.add(
            botaoNovaAnalise
          );


          Map.add(
            painelResultado
          );


          painelConfig
            .style()
            .set(
              'shown',
              false
            );


          // ====================================================================
          // 32.34 ATIVA PRODUTO
          // ====================================================================

          selecionarProdutoResultado(
            produtoInicial,
            pRef
          );


          // ====================================================================
          // 32.35 CONSOLIDA BANDAS
          // ====================================================================

          var bandasConsolidadas =
            [];


          function adicionarBandasConsolidadas(
            resultado
          ) {

            bandasConsolidadas.push(
              resultado.observada
            );


            bandasConsolidadas.push(
              resultado.referencia
            );


            bandasConsolidadas.push(
              resultado.diferenca
            );


            bandasConsolidadas.push(
              resultado.variacao
            );


            bandasConsolidadas.push(
              resultado.rank
            );


            bandasConsolidadas.push(
              resultado.nObs
            );


            bandasConsolidadas.push(
              resultado.nHist
            );


            if (
              preenchimento
            ) {

              bandasConsolidadas.push(
                resultado
                  .variacaoPreenchida
              );
            }
          }


          if (
            resultadoRZ
          ) {

            adicionarBandasConsolidadas(
              resultadoRZ
            );
          }


          if (
            resultadoPF
          ) {

            adicionarBandasConsolidadas(
              resultadoPF
            );
          }


          var imagemConsolidada =
            ee.Image.cat(
              bandasConsolidadas
            );


          // ====================================================================
          // 32.36 TABELA
          // ====================================================================

          var precisaTabela =
            checkTabela.getValue() ||
            checkCSV.getValue();


          var tabelaFinal =
            null;


          if (
            precisaTabela
          ) {

            var projecao =
              imagemConsolidada
                .projection();


            var reducao =
              imagemConsolidada
                .reduceRegions({

                  collection:
                    roiAnalise,

                  reducer:
                    ee.Reducer
                      .mean()
                      .unweighted(),

                  scale:
                    ESCALA_MUNICIPAL,

                  crs:
                    projecao,

                  tileScale:
                    16,

                  maxPixelsPerRegion:
                    100000
                });


            tabelaFinal =
              reducao.map(
                function(feature) {

                  return feature.set({

                    'Nome_Municipio':
                      feature.get(
                        CAMPO_MUNICIPIO
                      ),

                    'Data_Solicitada':
                      dataString,

                    'Historico_Inicio':
                      histInicio,

                    'Historico_Fim':
                      histFim,

                    'Percentil_Referencia':
                      pRef,

                    'Perfil_Processado':
                      perfilEscolhido,

                    'Fonte':
                      DATASET,

                    'Metodo':
                      'Percentil sobre medias historicas de janela equivalente',

                    'Escala_Analise_m':
                      ESCALA_SMAP,

                    'Data_Processamento':
                      ee.Date(
                        Date.now()
                      )
                      .format(
                        'YYYY-MM-dd'
                      )
                  });
                }
              );


            if (
              checkTabela.getValue()
            ) {

              print(
                'TABELA DE RESULTADOS:',
                tabelaFinal
              );
            }
          }


          // ====================================================================
          // 32.37 NOME DOS ARQUIVOS
          // ====================================================================

          var nomeArea =
            municipio ===
              'Todo o Espírito Santo'

              ? 'ES'

              : sanitizarNome(
                  municipio
                );


          var prefixo =
            'SMAP_' +
            nomeArea +
            '_' +
            ano +
            preencher2(mes) +
            preencher2(dia) +
            '_REF_' +
            histInicio +
            '_' +
            histFim +
            '_P' +
            pRef;


          // ====================================================================
          // 32.38 CSV
          // ====================================================================

          if (
            checkCSV.getValue() &&
            tabelaFinal
          ) {

            var tabelaExportacao =
              tabelaFinal.map(
                function(f) {

                  return ee.Feature(
                    null,
                    f.toDictionary()
                  );
                }
              );


            Export.table.toDrive({

              collection:
                tabelaExportacao,

              description:
                prefixo +
                '_CSV',

              folder:
                PASTA_DRIVE,

              fileNamePrefix:
                prefixo,

              fileFormat:
                'CSV'
            });


            print(
              'Exportação CSV criada:',
              prefixo
            );
          }


          // ====================================================================
          // 32.39 RASTER
          // ====================================================================

          if (
            checkRaster.getValue()
          ) {

            var rasterExport =
              imagemConsolidada
                .clip(
                  geometriaExpandida
                )
                .set({

                  'data_solicitada':
                    dataString,

                  'historico_inicio':
                    histInicio,

                  'historico_fim':
                    histFim,

                  'percentil_referencia':
                    pRef,

                  'perfil':
                    perfilEscolhido,

                  'fonte':
                    DATASET
                });


            Export.image.toDrive({

              image:
                rasterExport,

              description:
                prefixo +
                '_RASTER',

              folder:
                PASTA_DRIVE,

              fileNamePrefix:
                prefixo +
                '_raster',

              region:
                geometriaExpandida,

              scale:
                ESCALA_SMAP,

              maxPixels:
                1e9,

              fileFormat:
                'GeoTIFF',

              skipEmptyTiles:
                true,

              formatOptions: {

                cloudOptimized:
                  true
              }
            });


            print(
              'Exportação raster criada:',
              prefixo +
              '_RASTER'
            );
          }


          // ====================================================================
          // 32.40 DIAGNÓSTICOS
          // ====================================================================

          print(
            'PARÂMETROS DA ANÁLISE:',
            {

              data_solicitada:
                dataString,

              historico:
                histInicio +
                '–' +
                histFim,

              percentil:
                'P' + pRef,

              area:
                municipio,

              perfil:
                perfilEscolhido,

              preenchimento:
                preenchimento,

              numero_imagens:
                numeroImagens
            }
          );


          print(
            'Última observação utilizada:',
            ultimaData.format(
              'YYYY-MM-dd HH:mm:ss'
            )
          );


          print(
            'Duração da janela:',
            duracaoSegundos
              .divide(
                3600
              ),
            'horas'
          );


          print(
            'Imagens efetivamente utilizadas:',
            colecaoObservada.size()
          );


          print(
            'Anos da referência histórica:',
            historicoMedias.size()
          );


          // ====================================================================
          // 32.41 STATUS
          // ====================================================================

          ultimaData
            .format(
              'YYYY-MM-dd HH:mm:ss'
            )
            .evaluate(
              function(dataReal) {

                labelStatus.setValue(
                  'Último dado: ' +
                  dataReal
                );
              }
            );

        }
      );

  }
);



// ==============================================================================
// 33. CONTROLES NATIVOS
// ==============================================================================
//
// O layer list nativo é ocultado porque os produtos são controlados pelo
// seletor personalizado.
// ==============================================================================

Map.setControlVisibility(

  true,

  false,

  true,

  true,

  true,

  true,

  false
);



// ==============================================================================
// 34. CONSOLE INICIAL
// ==============================================================================

print(
  'INTERFACE PRONTA:',
  'Defina os parâmetros no painel lateral e clique em PROCESSAR.'
);


print(
  'METODOLOGIA:',
  'O percentil histórico é calculado a partir de sm_rootzone e/ou sm_profile.'
);


print(
  'JANELA HISTÓRICA:',
  'Cada ano histórico utiliza a mesma duração da janela atual.'
);


print(
  'EXPORTAÇÕES:',
  'CSV e GeoTIFF são criados somente quando selecionados.'
);


print(
  'INTERFACE:',
  'Painel compacto posicionado em middle-left.'
);