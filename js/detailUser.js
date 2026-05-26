import { API_URL, API_KEY } from "../config.js";
import { resetarTimer } from "../js/exitTime.js";

const btnBack = document.getElementById("back"); 
btnBack.addEventListener("click", () => {
    history.go(-1)
});

const userSession = JSON.parse(sessionStorage.getItem("user"));

if(!userSession){
    window.location.href = 'index.html';
}
const logViews = document.getElementById("mainLogs");
const coresStatus = [
    'error',
    'secondary',
];

function renderizar(){

    const userViewData = JSON.parse(localStorage.getItem("userView"));
    
    const pageName = document.getElementById("namePage");
    const container = document.getElementById('teamList');
    const userName = document.getElementById("nameUser");
    const tipoUser = document.getElementById("tipo");
    const statusUser = document.getElementById("status");
    const ledStatus = document.getElementById("ledStatus");
    const userData = userViewData[0];
    

    statusUser.classList.add(`bg-${coresStatus[userData.status]}/80`);
    ledStatus.classList.add(`bg-${coresStatus[userData.status]}`);

    //userSession.charAt(0).toUpperCase() -> pega a primeira letra e deixa maiuscula
    //userSession.slice(1).toLowerCase() -> paga o retante e deixa minuscula
    const userFormat = userData.user.charAt(0).toUpperCase() + userData.user.slice(1).toLowerCase();

    if(userData.status === 1){
        statusUser.innerText = "Online"   
    }
    else{
        statusUser.innerText = "Offline"
    }

    pageName.innerText = "Detalhe do Usuário";

    userName.innerText = userFormat;
    tipoUser.innerText = userData.tiposAcesso.tipo;
   
    carregarLogs(userData.id)
}

let listaLogs = [];

async function carregarLogs(id) {

    try {
        const response = await fetch(
            
            `${API_URL}logs?select=*&idUser=eq.${id}&order=id.desc`,
            {
                headers: {
                    apikey: API_KEY,
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        );

        listaLogs = await response.json();
  
        logView(listaLogs);

    } catch (erro) {
        console.error(erro);
        logViews.innerHTML = '<p class="text-red-400 text-center">Erro ao carregar</p>';
    }
}

async function logView(listaLogs){

    console.log(listaLogs);

    if (!listaLogs.length) {
        logViews.innerHTML = '<p class="text-center text-sm">Nada encontrado</p>';
        return;
    }

    let html = '';
    
    let contador = 0;
    listaLogs.forEach(log => {
        
        contador++;

        console.log(contador);
                
        // const data = new Intl.DateTimeFormat('pt-BR', {
        //         dateStyle: 'full',
        //         timeStyle: 'short'
        //     }
        //     ).format(new Date(log.datahora)
        // );

        const data = new Date(log.datahora).toLocaleString('pt-BR',
            {
                dateStyle: 'short',
                timeStyle: 'short'
            }
        );
        
        const tipos = {
            Entrou: "login",
            Deslogou: "logout",
            Editou: "edit_note",
            Cadastrou: "add_ad",
            Excluiu: "delete",
        };

        const cores = {
            Entrou: "secondary",
            Deslogou: "primary",
            Editou: "yellow-400",
            Cadastrou: "primary",
            Excluiu: "error",
        }

        const status = tipos[log.acao] || "";
        
        const color = cores[log.acao];
        const obs = log.obs == null ? "": log.obs;
                        
        html += `
            <div class="bg-surface-container rounded-2xl p-4 flex items-start gap-4 mt-3">

                <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span class="material-symbols-outlined text-${color}">
                        ${status}
                    </span>
                </div>

                    <div class="flex-1">
                        <h3 class="font-semibold">
                            ${log.acao}
                        </h3>

                        <p class="text-sm text-on-surface-variant">
                            ${obs}
                        </p>

                        <span class="text-xs text-outline mt-2 block">

                        ${data}
                        </span>

                    </div>

                </div>
        `;
    });

    const logNumber = document.getElementById("contagemLog");

    logViews.innerHTML = html;   
    logNumber.innerText = String(`${contador}`).padStart(2, '0');; 
    
}

renderizar();