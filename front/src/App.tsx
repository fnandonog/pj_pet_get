import { useState } from 'react'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Pets from './pages/Pets'
import MeusPets from './pages/MeusPets'
import MinhasAdocoes from './pages/MinhasAdocoes'

// as telas que existem no site
type Tela = 'pets' | 'meusPets' | 'adocoes' | 'login' | 'cadastro'

export default function App() {
  // se tem token salvo, o usuario esta logado
  const [logado, setLogado] = useState(!!localStorage.getItem('token'))
  // qual tela esta aparecendo agora
  const [tela, setTela] = useState<Tela>('pets')

  // chamado quando o login da certo
  function entrou() {
    setLogado(true)
    setTela('pets')
  }

  // apaga o token e volta para o login
  function sair() {
    localStorage.removeItem('token')
    setLogado(false)
    setTela('login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* menu do topo */}
      <header className="bg-blue-600 text-white p-4 flex flex-wrap gap-4 items-center">
        <h1 className="font-bold text-xl mr-auto">🐶 Get A Pet</h1>

        <button onClick={() => setTela('pets')}>Pets</button>

        {/* se esta logado mostra umas opções, se não mostra outras */}
        {logado ? (
          <>
            <button onClick={() => setTela('meusPets')}>Meus pets</button>
            <button onClick={() => setTela('adocoes')}>Minhas adoções</button>
            <button onClick={sair}>Sair</button>
          </>
        ) : (
          <>
            <button onClick={() => setTela('login')}>Entrar</button>
            <button onClick={() => setTela('cadastro')}>Cadastrar</button>
          </>
        )}
      </header>

      {/* mostra a tela escolhida */}
      <main className="max-w-3xl mx-auto p-4">
        {tela === 'pets' && <Pets logado={logado} />}
        {tela === 'meusPets' && <MeusPets />}
        {tela === 'adocoes' && <MinhasAdocoes />}
        {tela === 'login' && <Login aoEntrar={entrou} />}
        {tela === 'cadastro' && <Cadastro aoEntrar={entrou} />}
      </main>
    </div>
  )
}
