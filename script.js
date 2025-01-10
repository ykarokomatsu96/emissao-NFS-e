document.addEventListener('DOMContentLoaded', function () {
    // Máscaras para os campos
    Inputmask({"mask": "99.999.999/9999-99"}).mask(document.getElementById('destinatarioCpfCnpj'));  // Mascara para CNPJ do Destinatário
    Inputmask({"mask": "99.999.999/9999-99"}).mask(document.getElementById('emissorCpf'));  // Mascara para CNPJ do Emissor
    Inputmask({"mask": "(99) 99999-9999"}).mask(document.getElementById('emissorTelefone'));  // Mascara para celular do Emissor
    Inputmask({"mask": "9999.99.99"}).mask(document.getElementById('ncm'));  // Mascara para NCM
    Inputmask({"mask": "9.999"}).mask(document.getElementById('cfop'));  // Mascara para NCM

    // Função para o campo Valor da Venda
    const valorVendaInput = document.getElementById('valorVenda');

    valorVendaInput.addEventListener('input', function(event) {
        let valor = valorVendaInput.value.replace(/[^\d,]/g, ''); // Remove tudo que não for número ou vírgula
        valor = valor.replace(',', '.'); // Substitui a vírgula por ponto para formatação decimal

        // Só formata se o valor tiver sido inserido corretamente
        if (valor) {
            // Criação de um formato monetário para o valor (com mais dígitos)
            let valorFormatado = parseFloat(valor).toLocaleString('pt-BR', { style: 'decimal' });
            valorVendaInput.value = valorFormatado; // Atualiza o campo com o valor formatado
        } else {
            valorVendaInput.value = ''; // Se não houver valor, mantém o campo vazio
        }
    });

    // Adiciona o "R$" quando o campo perde o foco (ao sair do campo de input)
    valorVendaInput.addEventListener('blur', function () {
        let valor = valorVendaInput.value.replace(/[^\d,]/g, ''); // Remove tudo que não for número ou vírgula
        if (valor) {
            valorVendaInput.value = "R$ " + valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ',' + valor.slice(-2); // Formata com R$
        }
    });

    // Função para os campos de porcentagem (IRPF, PIS, COFINS, INSS, ISSQN)
    const impostosInputs = ['irpf', 'pis', 'cofins', 'inss', 'issqn'];
    
    impostosInputs.forEach(function(inputId) {
        const input = document.getElementById(inputId);

        input.addEventListener('input', function(event) {
            let valor = input.value.replace(/[^\d,]/g, ''); // Remove tudo que não for número ou vírgula
            valor = valor.replace(',', '.'); // Substitui a vírgula por ponto para formatação decimal

            // Só formata se o valor tiver sido inserido corretamente
            if (valor) {
                let valorFormatado = parseFloat(valor).toLocaleString('pt-BR', { style: 'decimal' });
                input.value = valorFormatado; // Atualiza o campo com o valor formatado
            } else {
                input.value = ''; // Se não houver valor, mantém o campo vazio
            }
        });

        // Adiciona o "%" quando o campo perde o foco
        input.addEventListener('blur', function () {
            let valor = input.value.replace(/[^\d,]/g, ''); // Remove tudo que não for número ou vírgula
            if (valor) {
                input.value = valor + ' %'; // Formata com o símbolo "%"
            }
        });
    });

    // Quando o formulário for enviado
    document.getElementById('formNFS').addEventListener('submit', function (event) {
        event.preventDefault();

        // Leitura dos dados
        const destinatarioNome = document.getElementById('destinatarioNome').value;
        const destinatarioCpfCnpj = document.getElementById('destinatarioCpfCnpj').value;
        const destinatarioInscricaoEstadual = document.getElementById('destinatarioInscricaoEstadual').value;
        const destinatarioEndereco = document.getElementById('destinatarioEndereco').value;
        const destinatarioMunicipio = document.getElementById('destinatarioMunicipio').value;
        const destinatarioCep = document.getElementById('destinatarioCep').value;

        const emissorNome = document.getElementById('emissorNome').value;
        const emissorCpf = document.getElementById('emissorCpf').value;
        const emissorInscricaoEstadual = document.getElementById('emissorInscricaoEstadual').value;
        const emissorEndereco = document.getElementById('emissorEndereco').value;
        const emissorTelefone = document.getElementById('emissorTelefone').value;
        const emissorEmail = document.getElementById('emissorEmail').value;

        const ncm = document.getElementById('ncm').value;
        const cest = document.getElementById('cest').value;
        const cfop = document.getElementById('cfop').value;

        // Leitura do valor da venda após remover o prefixo "R$" e substituir a vírgula por ponto
        let valorVenda = parseFloat(document.getElementById('valorVenda').value.replace("R$ ", "").replace(".", "").replace(",", "."));
        const itensVenda = document.getElementById('itensVenda').value;

        // Leitura dos campos de imposto
        const irpf = parseFloat(document.getElementById('irpf').value.replace(" %", ""));
        const pis = parseFloat(document.getElementById('pis').value.replace(" %", ""));
        const cofins = parseFloat(document.getElementById('cofins').value.replace(" %", ""));
        const inss = parseFloat(document.getElementById('inss').value.replace(" %", ""));
        const issqn = parseFloat(document.getElementById('issqn').value.replace(" %", ""));

        // Verifica se os campos de imposto são válidos, se não, atribui 0
        if (isNaN(irpf)) irpf = 0;
        if (isNaN(pis)) pis = 0;
        if (isNaN(cofins)) cofins = 0;
        if (isNaN(inss)) inss = 0;
        if (isNaN(issqn)) issqn = 0;

        // Cálculo dos impostos
        let valorIrpf = valorVenda * (irpf / 100);
        let valorPis = valorVenda * (pis / 100);
        let valorCofins = valorVenda * (cofins / 100);
        let valorInss = valorVenda * (inss / 100);
        let valorIssqn = valorVenda * (issqn / 100);

        // Total de impostos
        let totalImpostos = valorIrpf + valorPis + valorCofins + valorInss + valorIssqn;

        // Valor final após impostos
        let valorFinal = valorVenda - totalImpostos;

        // Exibição da Nota Fiscal
        const notaFiscalHTML = `
            <p><strong>Destinatário:</strong> ${destinatarioNome}</p>
            <p><strong>CPF/CNPJ:</strong> ${destinatarioCpfCnpj}</p>
            <p><strong>Inscrição Estadual:</strong> ${destinatarioInscricaoEstadual}</p>
            <p><strong>Endereço:</strong> ${destinatarioEndereco}</p>
            <p><strong>Município:</strong> ${destinatarioMunicipio}</p>
            <p><strong>CEP:</strong> ${destinatarioCep}</p>
            <br>
            <p><strong>Emissor:</strong> ${emissorNome}</p>
            <p><strong>CNPJ:</strong> ${emissorCpf}</p>
            <p><strong>Inscrição Estadual:</strong> ${emissorInscricaoEstadual}</p>
            <p><strong>Endereço:</strong> ${emissorEndereco}</p>
            <p><strong>Telefone:</strong> ${emissorTelefone}</p>
            <p><strong>E-mail:</strong> ${emissorEmail}</p>
            <br>
            <p><strong>NCM:</strong> ${ncm}</p>
            <p><strong>CEST:</strong> ${cest}</p>
            <p><strong>CFOP:</strong> ${cfop}</p>
            <br>
            <p><strong>Itens Vendidos:</strong> ${itensVenda}</p>
            <p><strong>Valor da Venda:</strong> R$ ${valorVenda.toFixed(2)}</p>
            <p><strong>IRPF (${irpf}%):</strong> R$ ${valorIrpf.toFixed(2)}</p>
            <p><strong>PIS (${pis}%):</strong> R$ ${valorPis.toFixed(2)}</p>
            <p><strong>COFINS (${cofins}%):</strong> R$ ${valorCofins.toFixed(2)}</p>
            <p><strong>INSS (${inss}%):</strong> R$ ${valorInss.toFixed(2)}</p>
            <p><strong>ISSQN (${issqn}%):</strong> R$ ${valorIssqn.toFixed(2)}</p>
            <p><strong>Total de Impostos:</strong> R$ ${totalImpostos.toFixed(2)}</p>
            <p><strong>Valor Final (após impostos):</strong> R$ ${valorFinal.toFixed(2)}</p>
        `;

        // Exibir a nota fiscal
        document.getElementById('notaFiscalDisplay').innerHTML = notaFiscalHTML;
        document.getElementById('notaFiscal').style.display = 'block';
    });
});
