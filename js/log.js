import { API_URL, API_KEY } from "../config.js";

 export async function criarLog(dados, acao, obs) {
            
        const novoLog= {
            idUser: dados.id,
            userName: dados.user,
            acao: acao,
            obs: obs,
        };

        const response = await fetch(API_URL + "logs", {
            method: 'POST',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                Prefer: 'return=representation'
            },
            body: JSON.stringify(novoLog)
        });

        const data = await response.json();

        console.log(data);

    }
