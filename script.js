// --- CONFIGURAÇÃO DA SIMULAÇÃO DO IRRIGADOR ---

// Variáveis que guardam o estado atual da planta
let umidadeAtual = 65; // Começa em 65%
let bombaAtiva = false;
let aguaEconomizada = 35; // Porcentagem inicial de economia

// Variáveis do simulador do fazendeiro
let energiaFazendeiro = 80;
let plantGrowth = 30;
let colheitas = 0;
let aguaSolo = 65;

// Função que atualiza a tela do site com os valores corretos
function atualizarPainel() {
    const painel = document.querySelector('#painel .dashboard');

    // 1. Atualiza a umidade na tela
    const elementoUmidade = painel.querySelector('.card:nth-child(1) .dado-importante');
    elementoUmidade.innerText = umidadeAtual + "%";

    // Atualiza o texto de status do solo baseado na umidade
    const statusSolo = painel.querySelector('.card:nth-child(1) p');
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
    const elementoBomba = painel.querySelector('.status-ativo');
    const textoBombaSub = painel.querySelector('.card:nth-child(2) p');
    
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
    const elementoEconomia = painel.querySelector('.card:nth-child(3) .dado-importante');
    elementoEconomia.innerText = aguaEconomizada + "%";
}

function atualizarSimulador() {
    const energiaElem = document.getElementById('energia-fazendeiro');
    const plantElem = document.getElementById('crescimento-planta');
    const aguaSoloElem = document.getElementById('agua-solo');
    const statusFazendeiro = document.getElementById('status-fazendeiro');
    const statusPlantas = document.getElementById('status-plantas');
    const statusAgua = document.getElementById('status-agua');
    const colheitaContador = document.getElementById('colheita-contador');

    energiaElem.innerText = energiaFazendeiro + "%";
    plantElem.innerText = plantGrowth + "%";
    aguaSoloElem.innerText = aguaSolo + "%";
    colheitaContador.innerText = colheitas;

    if (energiaFazendeiro > 70) {
        statusFazendeiro.innerText = "Fazendeiro cheio de energia e pronto para trabalhar";
        statusFazendeiro.style.color = "#2e7d32";
    } else if (energiaFazendeiro > 35) {
        statusFazendeiro.innerText = "Fazendeiro cansado, mas ainda ativo";
        statusFazendeiro.style.color = "#f57c00";
    } else {
        statusFazendeiro.innerText = "Fazendeiro precisa descansar em breve";
        statusFazendeiro.style.color = "#d32f2f";
    }

    if (plantGrowth >= 90) {
        statusPlantas.innerText = "As plantas estão quase prontas para a colheita!";
        statusPlantas.style.color = "#2e7d32";
    } else if (plantGrowth >= 50) {
        statusPlantas.innerText = "As plantas estão crescendo bem";
        statusPlantas.style.color = "#1b5e20";
    } else {
        statusPlantas.innerText = "As plantas ainda precisam de cuidado";
        statusPlantas.style.color = "#0288d1";
    }

    if (aguaSolo >= 60) {
        statusAgua.innerText = "Solo bem hidratado";
        statusAgua.style.color = "#2e7d32";
    } else if (aguaSolo >= 35) {
        statusAgua.innerText = "Solo úmido, mas precisa de atenção";
        statusAgua.style.color = "#f57c00";
    } else {
        statusAgua.innerText = "Solo muito seco, é hora de regar";
        statusAgua.style.color = "#d32f2f";
    }

    document.getElementById('botao-regar').disabled = energiaFazendeiro < 10 || aguaSolo >= 100;
    document.getElementById('botao-plantar').disabled = energiaFazendeiro < 15 || plantGrowth > 80;
    document.getElementById('botao-colher').disabled = energiaFazendeiro < 20 || plantGrowth < 80;
    document.getElementById('botao-descansar').disabled = energiaFazendeiro >= 100;
}

function adicionarEventosFazendeiro() {
    document.getElementById('botao-regar').addEventListener('click', () => {
        if (energiaFazendeiro >= 10 && aguaSolo < 100) {
            aguaSolo = Math.min(100, aguaSolo + 20);
            energiaFazendeiro = Math.max(0, energiaFazendeiro - 10);
            plantGrowth = Math.min(100, plantGrowth + 8);
            atualizarSimulador();
        }
    });

    document.getElementById('botao-plantar').addEventListener('click', () => {
        if (energiaFazendeiro >= 15 && plantGrowth <= 80) {
            plantGrowth = Math.min(100, plantGrowth + 15);
            energiaFazendeiro = Math.max(0, energiaFazendeiro - 15);
            atualizarSimulador();
        }
    });

    document.getElementById('botao-colher').addEventListener('click', () => {
        if (energiaFazendeiro >= 20 && plantGrowth >= 80) {
            colheitas += 1;
            plantGrowth = 35;
            energiaFazendeiro = Math.max(0, energiaFazendeiro - 20);
            atualizarSimulador();
        }
    });

    document.getElementById('botao-descansar').addEventListener('click', () => {
        energiaFazendeiro = Math.min(100, energiaFazendeiro + 25);
        if (aguaSolo > 0) {
            aguaSolo = Math.max(0, aguaSolo - 5);
        }
        atualizarSimulador();
    });
}

// Lógica que simula o passar do tempo na plantação
function simularCicloDaPlanta() {
    if (bombaAtiva) {
        umidadeAtual += 5;
        if (umidadeAtual >= 75) {
            bombaAtiva = false;
            aguaEconomizada += 1;
        }
    } else {
        umidadeAtual -= 2;
        if (umidadeAtual <= 38) {
            bombaAtiva = true;
        }
    }

    atualizarPainel();
}

function simularCicloDaFazenda() {
    if (aguaSolo > 0) {
        aguaSolo = Math.max(0, aguaSolo - 1);
    }

    if (plantGrowth < 100 && aguaSolo >= 40) {
        plantGrowth = Math.min(100, plantGrowth + 2);
    } else if (aguaSolo < 40) {
        plantGrowth = Math.max(0, plantGrowth - 1);
    }

    energiaFazendeiro = Math.max(0, energiaFazendeiro - 1);
    atualizarSimulador();
}

setInterval(() => {
    simularCicloDaPlanta();
    simularCicloDaFazenda();
}, 3000);

window.onload = () => {
    atualizarPainel();
    atualizarSimulador();
    adicionarEventosFazendeiro();
};