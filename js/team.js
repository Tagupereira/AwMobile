import { API_URL, API_KEY } from "../config.js";
import { resetarTimer } from "../js/exitTime.js";

const btnBack = document.getElementById("back");

btnBack.addEventListener("click", () => {
    history.go(-1)
});

const userSession = JSON.parse(sessionStorage.getItem("user"));
    console.log(userSession);

    if(!userSession){

        window.location.href = 'index.html';

    }

const pageName = document.getElementById("namePage");
const container = document.getElementById('teamList');

//userSession.charAt(0).toUpperCase() -> pega a primeira letra e deixa maiuscula
//userSession.slice(1).toLowerCase() -> paga o retante e deixa minuscula
const userFormat = userSession.user.charAt(0).toUpperCase() + userSession.user.slice(1).toLowerCase();

pageName.innerText = "Usuarios cadastrados";

let listaUser = [];

async function carregarTeam() {

    container.innerHTML = '<p class="text-center text-sm">Carregando...</p>';

    try {
        const response = await fetch(
            
            `${API_URL}acesso?select=*,tiposAcesso(tipo)&order=status.desc,user.asc`,
            {
                headers: {
                    apikey: API_KEY,
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        );

        listaUser = await response.json();

        console.log('Usuarios carregados:', listaUser);

        renderizar(listaUser);

    } catch (erro) {
        console.error(erro);
        container.innerHTML = '<p class="text-red-400 text-center">Erro ao carregar</p>';
    }
}

const coresStatus = [
    'error',
    'secondary',
];

function renderizar(lista) {

    if (!lista.length) {
        container.innerHTML = '<p class="text-center text-sm">Nada encontrado</p>';
        return;
    }

    let html = '<h2 class="font-headline font-bold text-lg text-[#90abff] mb-6 px-2">Access Control List</h2>';
    const userImg = "https://img.magnific.com/psd-gratuitas/ilustracao-de-icone-de-contacto-isolada_23-2151903337.jpg?semt=ais_hybrid&w=740&q=80"
    
    lista.forEach(user => {
        
        const userName = [user.user];
        const color = coresStatus[user.status];
                
        html += `
            <div class="space-y-4">
              
              <!-- Team Member Card: Admin -->
              <div class="group bg-surface-container hover:bg-surface-container-high transition-all duration-300 rounded-xl p-4 mb-7 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <img class="w-14 h-14 rounded-xl object-cover"
                      data-alt="Portrait of a creative professional woman with glasses in a minimalist dark workspace"
                      src="${userImg}" />
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-${color} border-4 border-surface rounded-full"></div>
                  </div>

                  <div>
                    <h4 class="font-headline font-bold text-on-surface text-lg">${userName}</h4>
                    <p class="text-on-surface-variant text-sm">Usuario tipo: ${user.tiposAcesso.tipo}</p>
                  </div>
                  
                </div>
                <div class="flex items-center gap-6">
                  <span
                    class="hidden md:block bg-primary-dim/10 text-primary-fixed-dim text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary-dim/20">Admin</span>
                  <button
                    class="p-2 rounded-lg bg-surface-variant text-on-surface-variant hover:text-primary transition-colors active:scale-90">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                </div>
              </div>
            </div>
        `;
    });

    container.innerHTML = html;

}

carregarTeam();