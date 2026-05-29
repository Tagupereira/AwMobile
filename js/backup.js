import { API_URL, API_KEY } from '../config.js';
import { showToast } from "../js/toast.js";

const tabelas = [

'acesso',
'categoria',
'itens',
'logs',
'situacao',
'tipos',
'tiposAcesso',
'voltagens',
'teste'

];

export async function fazerBackup(){

   const backup = {};

   for(const tabela of tabelas){

      const response = await fetch(

         `${API_URL}${tabela}?select=*`,

         {

            headers: {

               apikey: API_KEY,

               Authorization:
               `Bearer ${API_KEY}`

            }

         }

      );

      const data =
      await response.json();

      backup[tabela] = data;

   }

   baixarBackup(backup);

}

function baixarBackup(dados){

   const blob = new Blob(

      [
        JSON.stringify(
          dados,
          null,
          2
        )
      ],

      {
        type: 'application/json'
      }

   );

   const url =
   URL.createObjectURL(blob);

   const a =
   document.createElement('a');

   a.href = url;

   a.download =
   'backup.json';

   a.click();

   URL.revokeObjectURL(url);

   const msg = "Realizando Backup";
   const color = "info";
   showToast({
      message: msg,
      type: color
   });

}
