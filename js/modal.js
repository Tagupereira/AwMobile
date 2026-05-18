let modal = null;

export function showModal({

  title = '',
  message = '',
  confirmText = 'OK',
  cancelText = 'Cancelar',
  onConfirm = null,
  toast = {}

}) {

  // remove modal antigo
  if(modal){

    modal.remove();

  }

  modal = document.createElement('div');

  modal.className =
    'fixed inset-0 bg-black/70 z-50 flex items-center justify-center';

  modal.innerHTML = `

    <div class="bg-[#0f1930] p-6 rounded-2xl w-[90%] max-w-md text-white">

      <h2 class="text-2xl font-bold mb-4">
        ${title}
      </h2>

      <p class="text-gray-300 mb-6">
        ${message}
      </p>

      <div class="flex gap-3 justify-end">

        <button id="modal-cancel"
        class="px-4 py-2 rounded-xl bg-gray-600">
          ${cancelText}
        </button>

        <button id="modal-confirm"
        class="px-4 py-2 rounded-xl bg-blue-600">
          ${confirmText}
        </button>

      </div>

    </div>

  `;

  document.body.appendChild(modal);

  // fechar
  modal
    .querySelector('#modal-cancel')
    .addEventListener('click', fecharModal);

  // confirmar
  modal
    .querySelector('#modal-confirm')
    .addEventListener('click', () => {

      if(onConfirm){

        onConfirm();

      }

      fecharModal();

    });

}

export function fecharModal(){

  if(modal){

    modal.remove();

    modal = null;

  }

}