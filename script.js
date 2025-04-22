const convertButton = document.querySelector('.convert-button');
const currencySelectFrom = document.querySelector('#from-currency');
const currencySelectTo = document.querySelector('#to-currency');
const inputCurrency = document.querySelector('.input-currency');
const currencyValueToConvert = document.querySelector('.currency-value-to-convert');
const currencyValue = document.querySelector('.currency-value');
const currencyName = document.querySelector('#currency-name');
const currencyConvertedName = document.querySelector('#currency-converted-name');
const currencyConvertedImg = document.querySelector('#currency-converted-img');
const currencyImg = document.querySelector('.currency-img');
const loading = document.querySelector('#loading');
const cotacaoHora = document.querySelector('#cotacao-hora');

// Aplica máscara de valor ao input
IMask(inputCurrency, {
  mask: Number,
  scale: 2,
  signed: false,
  thousandsSeparator: '.',
  padFractionalZeros: true,
  normalizeZeros: true,
  radix: ',',
  mapToRadix: ['.']
});

// Dados simulados de moedas
const moedas = {
  real:   { nome: "Real",   img: "./assets/real.jpg",           simbolo: "R$",  codigo: "BRL", locale: "pt-BR", rate: 1 },
  dolar:  { nome: "Dólar",  img: "./assets/dolar.jpg",          simbolo: "US$", codigo: "USD", locale: "en-US", rate: 5.0 },
  euro:   { nome: "Euro",   img: "./assets/euro.jpg",           simbolo: "€",   codigo: "EUR", locale: "de-DE", rate: 5.5 },
  franco: { nome: "Franco", img: "./assets/franco-suico.jpg",  simbolo: "CHF", codigo: "CHF", locale: "fr-CH", rate: 6.0 },
  riyal:  { nome: "Riyal",  img: "./assets/riyal-saudita.jpg",  simbolo: "SAR", codigo: "SAR", locale: "en-US", rate: 1.3 },
};

// Simula requisição de cotação com delay
function obterCotacoes() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        real: 1,
        dolar: 5.0,
        euro: 5.5,
        franco: 6.0,
        riyal: 1.3,
      });
    }, 1200);
  });
}

// Atualiza nome e imagem da moeda
function atualizarInfoMoeda(moeda, nomeEl, imgEl) {
  nomeEl.textContent = moedas[moeda].nome;
  imgEl.src = moedas[moeda].img;
  imgEl.alt = `Bandeira ${moedas[moeda].nome}`;
}

// Função principal de conversão
async function converterValores() {
  const de = currencySelectFrom.value;
  const para = currencySelectTo.value;
  const valorTexto = inputCurrency.value;

  if (!valorTexto) return;

  // Animação de carregamento
  loading.style.display = 'block';
  currencyValueToConvert.classList.add('skeleton');
  currencyValue.classList.add('skeleton');

  const cotacoes = await obterCotacoes();
  const valorNumber = parseFloat(valorTexto.replace(/\./g, '').replace(',', '.'));

  // Converte valor para real e depois para a moeda desejada
  const valorEmReal = valorNumber * cotacoes[de];
  const valorConvertido = valorEmReal / cotacoes[para];

  // Formata o valor com base na localidade e moeda
  const formatar = (valor, moeda) => {
    return valor.toLocaleString(moedas[moeda].locale, {
      style: 'currency',
      currency: moedas[moeda].codigo,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  currencyValueToConvert.textContent = formatar(valorNumber, de);
  currencyValue.textContent = formatar(valorConvertido, para);
  cotacaoHora.textContent = `Cotação atualizada em: ${new Date().toLocaleString('pt-BR')}`;

  atualizarInfoMoeda(de, currencyName, currencyImg);
  atualizarInfoMoeda(para, currencyConvertedName, currencyConvertedImg);

  // Finaliza carregamento
  currencyValueToConvert.classList.remove('skeleton');
  currencyValue.classList.remove('skeleton');
  loading.style.display = 'none';
}

// Eventos de clique e tecla Enter
convertButton.addEventListener('click', converterValores);
inputCurrency.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') converterValores();
});