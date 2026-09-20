// Estrutura de dados inicial (Caso o usuário nunca tenha aberto o app)
let userState = {
    currentWater: 0,
    targetWater: 2000, // Começa em 2000ml por padrão, mas agora muda!
    streak: 0,
    lastDate: "" 
};

const STORAGE_KEY = 'AquaGrow_UserData_v2'; // Atualizado para v2

window.onload = function() {
    loadData();
    checkNewDay();
    updateUI();
};

function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        userState = JSON.parse(savedData);
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
}

function checkNewDay() {
    const today = new Date().toDateString();
    if (userState.lastDate !== today) {
        if (userState.currentWater < userState.targetWater && userState.lastDate !== "") {
            userState.streak = 0;
        }
        userState.currentWater = 0;
        userState.lastDate = today;
        saveData();
    }
}

// NOVA FUNÇÃO: Atualizar a meta do usuário
function updateTarget() {
    const input = document.getElementById('new-target');
    const newTarget = parseInt(input.value);
    
    if (!isNaN(newTarget) && newTarget > 0) {
        userState.targetWater = newTarget; // Altera a meta no estado do app
        saveData();                        // Salva no iPhone do usuário
        updateUI();                        // Atualiza a tela e o desenho da barra
        input.value = "";                  // Limpa o campo
        input.blur();                      // Fecha o teclado do celular
    } else {
        alert("Por favor, digite um valor válido de ml para a meta.");
    }
}

function addWater(amount) {
    userState.currentWater += amount;
    saveData();
    updateUI();
}

function addCustomWater() {
    const input = document.getElementById('custom-amount');
    const amount = parseInt(input.value);
    
    if (!isNaN(amount) && amount > 0) {
        addWater(amount);
        input.value = "";
        input.blur();
    }
}

function updateUI() {
    document.getElementById('current-water').innerText = userState.currentWater;
    document.getElementById('target-water').innerText = userState.targetWater;
    document.getElementById('streak-count').innerText = userState.streak;

    let percentage = (userState.currentWater / userState.targetWater) * 100;
    if (percentage > 100) percentage = 100;
    document.getElementById('progress-bar-fill').style.width = percentage + '%';

    const plantEmoji = document.getElementById('plant-stage');
    const plantStatus = document.getElementById('plant-status');

    if (userState.currentWater === 0) {
        plantEmoji.innerText = "🫙";
        plantStatus.innerText = "Defina sua meta e beba água para começar o dia!";
    } else if (percentage < 35) {
        plantEmoji.innerText = "🌱";
        plantStatus.innerText = "Sua semente brotou! Continue progredindo.";
    } else if (percentage < 70) {
        plantEmoji.innerText = "🌿";
        plantStatus.innerText = "Sua planta está crescendo forte!";
    } else if (percentage < 100) {
        plantEmoji.innerText = "🌳";
        plantStatus.innerText = "Quase lá! Só mais um pouco de água.";
    } else {
        plantEmoji.innerText = "🌸";
        plantStatus.innerText = "Parabéns! Sua planta floresceu hoje!";
        
        if (sessionStorage.getItem('streakGainedToday') !== new Date().toDateString()) {
            userState.streak += 1;
            sessionStorage.setItem('streakGainedToday', new Date().toDateString());
            document.getElementById('streak-count').innerText = userState.streak;
            saveData();
        }
    }
}

function resetDayManual() {
    if(confirm("Deseja zerar a água de hoje?")) {
        userState.currentWater = 0;
        saveData();
        updateUI();
    }
}
