let timeoutInatividade;

export function resetarTimer(){

    clearTimeout(timeoutInatividade);

    timeoutInatividade = setTimeout(() => {

        logout();

    }, 1000 * 60 * 15);

    // 15 minutos

}

[
  'click',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart'
].forEach(evento => {

    window.addEventListener(
      evento,
      resetarTimer
    );

});

function logout(){

    sessionStorage.clear();

    window.location.href =
      'index.html';

}

resetarTimer();