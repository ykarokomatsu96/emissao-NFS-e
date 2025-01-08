// script.js

function formatarMoeda(event) {
    var valor = event.target.value;

    // Remove qualquer caractere não numérico (exceto vírgula e ponto)
    valor = valor.replace(/\D/g, '');

    // Formata como moeda, incluindo o separador de milhar e a vírgula como decimal
    valor = valor.replace(/(\d)(\d{3})(\d{1,2}$)/, '$1.$2,$3');

    // Adiciona o "R$" no início
    if (valor.length > 0) {
        valor = 'R$ ' + valor;
    }

    // Atualiza o valor do campo
    event.target.value = valor;
}

function adicionarPorcentagem(event) {
    var valor = event.target.value;

    // Se o valor já tem o caractere '%', não adiciona novamente
    if (!valor.includes('%')) {
        valor = valor.replace(/\D/g, '') + '%';
    }

    // Atualiza o campo com o valor com o caractere '%' no final
    event.target.value = valor;
}

function gerarNFS() {
    // Captura o valor da venda formatado e remove o R$
    var valorVenda = parseFloat(document.getElementById('valorVenda').value.replace('R$ ', '').replace('.', '').replace(',', '.'));
    var itens = document.getElementById('itens').value;
    var irpf = parseFloat(document.getElementById('irpf').value.replace('%', ''));
    var pis = parseFloat(document.getElementById('pis').value.replace('%', ''));
    var cofins = parseFloat(document.getElementById('cofins').value.replace('%', ''));
    var inss = parseFloat(document.getElementById('inss').value.replace('%', ''));
    var issqn = parseFloat(document.getElementById('issqn').value.replace('%', ''));

    // Cálculo dos impostos
    var valorIRPF = (irpf / 100) * valorVenda;
    var valorPIS = (pis / 100) * valorVenda;
    var valorCOFINS = (cofins / 100) * valorVenda;
    var valorINSS = (inss / 100) * valorVenda;
    var valorISSQN = (issqn / 100) * valorVenda;

    // Exibindo os resultados
    var resultado = `
        <h3>Nota Fiscal de Serviço</h3>
        <p><strong>Itens:</strong> ${itens}</p>
        <p><strong>Valor da Venda:</strong> R$ ${valorVenda.toFixed(2)}</p>
        <p><strong>IRPF (R$):</strong> R$ ${valorIRPF.toFixed(2)}</p>
        <p><strong>PIS (R$):</strong> R$ ${valorPIS.toFixed(2)}</p>
        <p><strong>COFINS (R$):</strong> R$ ${valorCOFINS.toFixed(2)}</p>
        <p><strong>INSS (R$):</strong> R$ ${valorINSS.toFixed(2)}</p>
        <p><strong>ISSQN (R$):</strong> R$ ${valorISSQN.toFixed(2)}</p>
        <p><strong>Total de Impostos (R$):</strong> R$ ${(valorIRPF + valorPIS + valorCOFINS + valorINSS + valorISSQN).toFixed(2)}</p>
    `;

    document.getElementById('notaFiscal').innerHTML = resultado;
    document.getElementById('resultado').style.display = 'block';
}
