import { useState, type FormEvent } from 'react'
import { api } from '../api'

type Props = {
  aoEntrar: () => void
}

export default function Login({ aoEntrar }: Props) {
  // o que o usuario digita nos campos
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  async function entrar(e: FormEvent<HTMLFormElement>) {
    // impede a pagina de recarregar quando envia o formulario
    e.preventDefault()
    try {
      const resposta = await api('/users/login', 'POST', { email, password: senha })
      // guarda o token no navegador para usar nas proximas requisições
      localStorage.setItem('token', resposta.token)
      aoEntrar()
    } catch (error) {
      setErro((error as Error).message)
    }
  }

  return (
    <form onSubmit={entrar} className="bg-white rounded-lg shadow p-6 max-w-sm mx-auto flex flex-col gap-3">
      <h2 className="text-xl font-bold">Entrar</h2>

      <input className="border rounded p-2" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="border rounded p-2" placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />

      {/* mensagem de erro da API (ex: senha invalida) */}
      {erro && <p className="text-red-600 text-sm">{erro}</p>}

      <button className="bg-blue-600 text-white rounded p-2">Entrar</button>
    </form>
  )
}
