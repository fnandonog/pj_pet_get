import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../api'
import type { Pet } from '../types'
import PetCard from '../components/PetCard'

// formulario vazio (usado para limpar os campos)
const formVazio = { name: '', age: '', weight: '', color: '', image: '' }

// tela onde o usuario cadastra, edita e remove os pets dele
export default function MeusPets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [form, setForm] = useState(formVazio)
  // se for null esta cadastrando, se tiver um id esta editando esse pet
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mensagem, setMensagem] = useState('')

  async function carregar() {
    try {
      const resposta = await api('/pets/mypets')
      setPets(resposta.pets)
    } catch (error) {
      // ex: token expirou
      setMensagem((error as Error).message)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  // atualiza so o campo que mudou no formulario
  function mudarCampo(campo: string, valor: string) {
    setForm({ ...form, [campo]: valor })
  }

  // cadastra (POST) ou edita (PATCH) dependendo do editandoId
  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const dados = {
      name: form.name,
      age: Number(form.age),
      weight: Number(form.weight),
      color: form.color,
      image: form.image,
    }
    try {
      if (editandoId) {
        const resposta = await api(`/pets/${editandoId}`, 'PATCH', dados)
        setMensagem(resposta.message)
      } else {
        const resposta = await api('/pets/create', 'POST', dados)
        setMensagem(resposta.message)
      }
      setForm(formVazio)
      setEditandoId(null)
      carregar()
    } catch (error) {
      setMensagem((error as Error).message)
    }
  }

  // joga os dados do pet no formulario para editar
  function editar(pet: Pet) {
    setEditandoId(pet.id)
    setForm({
      name: pet.name,
      age: String(pet.age),
      weight: String(pet.weight),
      color: pet.color,
      image: pet.image ?? '',
    })
  }

  async function remover(id: number) {
    if (!confirm('Quer mesmo remover esse pet?')) return
    try {
      const resposta = await api(`/pets/${id}`, 'DELETE')
      setMensagem(resposta.message)
      carregar()
    } catch (error) {
      setMensagem((error as Error).message)
    }
  }

  async function concluir(id: number) {
    try {
      const resposta = await api(`/pets/conclude/${id}`, 'PATCH')
      setMensagem(resposta.message)
      carregar()
    } catch (error) {
      setMensagem((error as Error).message)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Meus pets</h2>

      {/* formulario de cadastro / edição */}
      <form onSubmit={salvar} className="bg-white rounded-lg shadow p-4 grid grid-cols-2 gap-2">
        <input className="border rounded p-2" placeholder="Nome" value={form.name} onChange={(e) => mudarCampo('name', e.target.value)} />
        <input className="border rounded p-2" placeholder="Cor" value={form.color} onChange={(e) => mudarCampo('color', e.target.value)} />
        <input className="border rounded p-2" placeholder="Idade" type="number" value={form.age} onChange={(e) => mudarCampo('age', e.target.value)} />
        <input className="border rounded p-2" placeholder="Peso (kg)" type="number" step="0.1" value={form.weight} onChange={(e) => mudarCampo('weight', e.target.value)} />
        <input className="border rounded p-2 col-span-2" placeholder="Link da foto (opcional)" value={form.image} onChange={(e) => mudarCampo('image', e.target.value)} />

        <button className="bg-blue-600 text-white rounded p-2 col-span-2">
          {editandoId ? 'Salvar alterações' : 'Cadastrar pet'}
        </button>
      </form>

      {mensagem && <p className="bg-yellow-100 border border-yellow-300 rounded p-2">{mensagem}</p>}

      {pets.length === 0 && <p>Você ainda não cadastrou nenhum pet.</p>}

      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet}>
          {/* se alguem agendou visita e ainda não foi adotado */}
          {pet.adopter && pet.available && (
            <p className="text-sm mb-2">
              Visita agendada por <b>{pet.adopter.name}</b> ({pet.adopter.phone})
            </p>
          )}

          <div className="flex gap-2">
            {/* pet adotado não pode mais ser editado */}
            {pet.available && (
              <button onClick={() => editar(pet)} className="bg-gray-500 text-white rounded px-3 py-1">Editar</button>
            )}
            <button onClick={() => remover(pet.id)} className="bg-red-600 text-white rounded px-3 py-1">Remover</button>
            {pet.adopter && pet.available && (
              <button onClick={() => concluir(pet.id)} className="bg-green-600 text-white rounded px-3 py-1">Concluir adoção</button>
            )}
          </div>
        </PetCard>
      ))}
    </div>
  )
}
