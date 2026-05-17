import { API_URL, API_KEY } from "../config.js";

let todosItens = [];

const btnBack = document.getElementById("back");

btnBack.addEventListener("click", () => {
    history.go(-1)
});

// 🔥 CARREGAR UMA VEZ
async function carregarItens() {


    const container = document.getElementById('equipment-list');

    container.innerHTML = '<p class="text-center text-sm">Carregando...</p>';

    try {
        const response = await fetch(
            //id,item,estado,local,codigo
            `${API_URL}itens?select=*,categoria(categoria,img),tipos(tipo),voltagens(voltagem),situacao(situacao)&order=id.asc`,
            {
                headers: {
                    apikey: API_KEY,
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        );

        todosItens = await response.json();

        console.log('Itens carregados:', todosItens);

        renderizar(todosItens);

    } catch (erro) {
        console.error(erro);
        container.innerHTML = '<p class="text-red-400 text-center">Erro ao carregar</p>';
    }
}

const coresStatus = {
    funcionando: 'bg-green-500/15 text-green-400',
    manutencao: 'bg-yellow-500/15 text-yellow-400',
    defeito: 'bg-red-500/15 text-red-400',
    evento: 'bg-blue-500/15 text-blue-400',
    locado: 'bg-purple-500/15 text-purple-400',
    analise: 'bg-orange-500/15 text-orange-400'
};
// 🎯 RENDER
function renderizar(lista) {


    const container = document.getElementById('equipment-list');

    if (!lista.length) {
        container.innerHTML = '<p class="text-center text-sm">Nada encontrado</p>';
        return;
    }

    let html = '';

    lista.forEach(item => {
        const patrimonio = String(`${item.patrimonio}`).padStart(4, '0');

        const statusCor = coresStatus[item.situacao.situacao] || "";

        html += `
          <div data-id="${item.id}" class="bg-surface-container p-4 rounded-xl shadow-lg border border-outline-variant/10 item">
            <div class="flex gap-4">

              <div class="flex-1 flex flex-col justify-between">

                <div>
                  <div class="flex justify-between items-start">

                    <h3 class="font-headline font-bold text-lg text-on-surface leading-tight">
                      ${item.item || 'Sem nome'}
                    </h3>

                    <span class="${statusCor} px-5 py-2 rounded text-[15px] font-bold uppercase tracking-wider">
                      #${patrimonio || 'Sem status'}
                    </span>

                  </div>

                  <p class="text-on-surface-variant text-[10px]  font-body">
                    Categoria: ${item.categoria.categoria || 'Sem Categoria'} 
                  </p>
                  
                  <p class="text-on-surface-variant text-xs mt-1 font-body">
                    Situação: ${item.situacao.situacao || 'Sem dados'} 
                  </p>
                </div>

              </div>

            </div>
          </div>
        `;

    });

    container.innerHTML = html;

}

document.getElementById('equipment-list').addEventListener('click', (e) => {

    const el = e.target.closest('.item');

    if (!el) return;

    const id = el.dataset.id;

    const item = todosItens.find(i => i.id == id);
    console.log(item);

    // salva o objeto (rápido)
    localStorage.setItem('itemSelecionado', JSON.stringify(item));

    // 👉 passa o ID na URL
    window.location.href = `../details_equipment.html`;

});

const btnFiltro =
  document.querySelectorAll('.buscaCategoria');

btnFiltro.forEach(botao => {

  botao.addEventListener('click', () => {

    const filtro =
      botao.dataset.filtro;

    buscarItens(filtro);

  });

});


// 🔎 BUSCA LOCAL (INSTANTÂNEA)
function buscarItens(termo) {

    console.log(termo);

    const texto = termo.toLowerCase();

    const filtrados = todosItens.filter(item =>
        (item.item || '').toLowerCase().includes(texto) ||
        (item.local || '').toLowerCase().includes(texto) ||
        (item.patrimonio || '').includes(texto) ||
        (item.categoria.categoria || '').includes(texto) ||
        (item.situacao.situacao || '').toLowerCase().includes(texto)
    );

    renderizar(filtrados);
}

// ⌨️ INPUT COM DEBOUNCE
let timeoutBusca;

document.getElementById('search-input')
    .addEventListener('input', (e) => {

        clearTimeout(timeoutBusca);

        timeoutBusca = setTimeout(() => {
            const busca = e.target.value.replace(/^0+/, '');
            buscarItens(busca);
        }, 300);
    });

const btnTopo = document.getElementById('btn-topo');

// Mostrar/esconder botão ao rolar
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        btnTopo.classList.remove('opacity-0', 'pointer-events-none');
        btnTopo.classList.add('opacity-100');
    } else {
        btnTopo.classList.add('opacity-0', 'pointer-events-none');
        btnTopo.classList.remove('opacity-100');
    }
});

// Ação de voltar ao topo
btnTopo.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 🚀 START
carregarItens();

window.addEventListener('pageshow', () => {

    document.getElementById('search-input').value = '';

});