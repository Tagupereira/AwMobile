let toastContainer = null;

function criarContainer() {

    if (toastContainer) return;

    toastContainer = document.createElement('div');

    toastContainer.className = `
    fixed top-5 right-5 z-[9999]
    flex flex-col gap-3
  `;

    document.body.appendChild(toastContainer);

}

export function showToast({

    message = '',
    type = 'success',
    duration = 3000,
    
}) {

  console.log(message, type,duration);
  

    criarContainer();

    const toast = document.createElement('div');

    const cores = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-500',
        info: 'bg-blue-600'
    };

    toast.className = `
    ${cores[type]}
    text-white
    px-5 py-4
    rounded-xl
    shadow-2xl
    min-w-[250px]
    animate-toast
    flex items-center gap-3
  `;

    toast.innerHTML = `
    <span>${message}</span>
  `;

    toastContainer.appendChild(toast);

    setTimeout(() => {

        toast.classList.add(
            'opacity-0',
            'translate-x-10'
        );

        setTimeout(() => {

            toast.remove();
            history.go(-1);
                        
        }, 300);

    }, duration);
    
}

let overlay = null;

function bloquearTela(){

  overlay = document.createElement('div');

  overlay.className = `
    fixed inset-0 z-[9998]
  `;

  document.body.appendChild(overlay);

}

function liberarTela(){

  if(overlay){

    overlay.remove();

    overlay = null;

  }

}