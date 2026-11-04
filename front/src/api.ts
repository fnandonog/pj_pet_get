// endereço da nossa API
const API_URL = 'http://localhost:3030'

// função que faz as requisições para a API
// ela já manda o token (se o usuario estiver logado) e devolve a resposta em JSON
export async function api(rota: string, metodo = 'GET', dados?: object) {
  const token = localStorage.getItem('token')

  const resposta = await fetch(API_URL + rota, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: dados ? JSON.stringify(dados) : undefined,
  })

  const json = await resposta.json()

  // se a API devolveu erro (401, 403, 404, 422...) mostra a mensagem dela
  if (!resposta.ok) {
    throw new Error(json.message)
  }

  return json
}
