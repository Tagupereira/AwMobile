import { API_URL, API_KEY } from "../config.js";

const btnBack = document.getElementById("back");
btnBack.addEventListener("click", () => {
    history.go(-1);
    // limpa cache
    localStorage.removeItem('itemSelecionado');
})

// 🔥 pega ID da URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// 🔥 pega localStorage
let itemLS = null;

try {
    itemLS = JSON.parse(localStorage.getItem('itemSelecionado') || 'null');
} catch {
    itemLS = null;
}

console.log('ID URL:', id);
console.log('Cache:', itemLS);

// 🚀 INICIAR
if (itemLS && (!id || itemLS.id == id)) {
    console.log('✔ carregado do cache');
    preencherTela(itemLS);
} else if (id) {
    console.log('🌐 buscando do servidor');
    buscarDoServidor(id);
} else {
    erroTela();
}

const editItem = document.getElementById("editItem");

editItem.addEventListener("click", () => {

    window.location.href = `../cadastro.html?id=${itemLS.id}`;

})

// 🔥 BUSCAR DO SUPABASE
async function buscarDoServidor(id) {
    try {
        const response = await fetch(
            `${API_URL_ITENS}?id=eq.${id}`,
            {
                headers: {
                    apikey: API_KEY,
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        );

        const data = await response.json();

        if (!data.length) return erroTela();

        const item = data[0];

        preencherTela(item);

    } catch (e) {
        console.error(e);
        erroTela();
    }
}

// 🎯 PREENCHER TELA
function preencherTela(item) {

    document.getElementById('item-nome').innerText = `${item.item}` || 'Sem nome';
    document.getElementById('item-info').innerText = `${item.local || '-'}`;
    document.getElementById('item-serie').innerText = `• SN: ${item.n_serie || '-'}`;
    document.getElementById('item-cod').innerText = "#" + String(`${item.patrimonio}`).padStart(6, '0');
    document.getElementById('item-tipo').innerText = `${item.tipos.tipo.toUpperCase()}`;
    document.getElementById('item-categoria').innerText = `${item.categoria.categoria}`;
    document.getElementById('item-voltagem').innerText = `${item.voltagens.voltagem}`;
    document.getElementById('item-situacao').innerText = `${item.situacao.situacao}`;
    document.getElementById('item-obs').innerText = `${item.observacao}`;
    document.getElementById('item-img').src = item.categoria.img || 'https://placehold.co/800x400';

    const statusEl = document.getElementById('item-situacao');

    const status = item.situacao.situacao || 'Sem status';

    statusEl.innerText = status;

    const coresStatus = {
        funcionando: 'bg-green-500/15 text-green-400',
        manutencao: 'bg-yellow-500/15 text-yellow-400',
        defeito: 'bg-red-500/15 text-red-400',
        evento: 'bg-blue-500/15 text-blue-400',
        locado: 'bg-purple-500/15 text-purple-400',
        analise: 'bg-orange-500/15 text-orange-400'
    };

    // normaliza texto (remove acento e caixa alta)
    const key = status
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    statusEl.className = `
        ${coresStatus[key] || 'bg-gray-500/15 text-gray-400'}
        px-3 py-1 rounded-full inline-block mt-5 text-[15px] font-bold uppercase
      `;

}

// ❌ ERRO
function erroTela() {
    document.body.innerHTML = `
        <div class="text-center mt-20 text-red-400">
          Item não encontrado
        </div>
      `;
}
