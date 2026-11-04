import { useState, type FormEvent } from 'react'
import { api } from '../api'

type Props = {
  aoEntrar: () => void
}

export default function Cadastro({ aoEntrar }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [erro, setErro] = useState('')

  async function cadastrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      // cadastra o usuario (a API valida tudo e criptografa a senha)
      await api('/users/register', 'POST', {
        name: nome,
        email,
        phone: telefone,
        password: senha,
        confirmpassword: confirmaSenha,
      })
      // depois de cadastrar ja faz o login
      const resposta = await api('/users/login', 'POST', { email, password: senha })
      localStorage.setItem('token', resposta.token)
      aoEntrar()
    } catch (error) {
      setErro((error as Error).message)
    }
  }

  return (
    <form onSubmit={cadastrar} className="bg-white rounded-lg shadow p-6 max-w-sm mx-auto flex flex-col gap-3">
      <h2 className="text-xl font-bold">Criar conta</h2>

      <input className="border rounded p-2" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input className="border rounded p-2" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="border rounded p-2" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
      <input className="border rounded p-2" placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
      <input className="border rounded p-2" placeholder="Confirmar senha" type="password" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} />

      {erro && <p className="text-red-600 text-sm">{erro}</p>}

      <button className="bg-blue-600 text-white rounded p-2">Cadastrar</button>
    </form>
  )
}
