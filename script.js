// --- CONFIGURAÇÃO DA SIMULAÇÃO DO IRRIGADOR ---

// Variáveis que guardam o estado atual da planta
let umidadeAtual = 65; // Começa em 65%
let bombaAtiva = false;
let aguaEconomizada = 35; // Porcentagem inicial de economia

// Função que atualiza a tela do site com os valores corretos
function atualizarPainel() {
    // 1. Atualiza a umidade na tela
    const elementoUmidade = document.querySelector('.dashboard .card:nth-child(1) .dado-importante');
    elementoUmidade.innerText = umidadeAtual + "%";

    // Atualiza o texto de status do solo baseado na umidade
    const statusSolo = document.querySelector('.dashboard .card:nth-child(1) p');
    if (umidadeAtual < 40) {
        statusSolo.innerText = "Status: Solo Seco! 🚨";
        statusSolo.style.color = "#d32f2f"; // Vermelho
    } else if (umidadeAtual > 80) {
        statusSolo.innerText = "Status: Solo Encharcado! ⚠️";
        statusSolo.style.color = "#f57c00"; // Laranja
    } else {
        statusSolo.innerText = "Status: Solo Ideal Encontrado ✅";
        statusSolo.style.color = "#2e7d32"; // Verde
    }

    // 2. Atualiza o status da bomba na tela
    const elementoBomba = document.querySelector('.status-ativo');
    const textoBombaSub = document.querySelector('.dashboard .card:nth-child(2) p');
    
    if (bombaAtiva) {
        elementoBomba.innerText = "LIGADA";
        elementoBomba.style.color = "#0288d1"; // Azul (regando)
        textoBombaSub.innerText = "Injetando água com precisão...";
    } else {
        elementoBomba.innerText = "DESLIGADA";
        elementoBomba.style.color = "#2e7d32"; // Verde (economizando)
        textoBombaSub.innerText = "Água preservada no reservatório";
    }

    // 3. Atualiza a economia de água de forma dinâmica
    const elementoEconomia = document.querySelector('.dashboard .card:nth-child(3) .dado-importante');
    elementoEconomia.innerText = aguaEconomizada + "%";
}

// Lógica que simula o passar do tempo na plantação
function simularCicloDaPlanta() {
    if (bombaAtiva) {
        // Se a bomba está ligada, a umidade do solo sobe rápido
        umidadeAtual += 5;
        
        // Quando chega em um nível bom (ex: 75%), o sistema desliga a bomba automaticamente
        if (umidadeAtual >= 75) {
            bombaAtiva = false;
            aguaEconomizada += 1; // Aumenta a métrica de economia por ter usado a água no momento certo
        }
    } else {
        // Se a bomba está desligada, o sol/tempo vai secando a terra aos poucos
        umidadeAtual -= 2;
        
        // Se a terra secar demais (abaixo de 40%), o sistema inteligente decide ligar a bomba
        if (umidadeAtual <= 38) {
            bombaAtiva = true;
        }
    }

    // Depois de calcular os novos valores, atualiza o visual do site
    atualizarPainel();
}

// Executa a função de simulação a cada 3 segundos (3000 milissegundos)
setInterval(simularCicloDaPlanta, 3000);

// Executa uma vez assim que a página carrega para garantir que os dados iniciais apareçam
window.onload = atualizarPainel;