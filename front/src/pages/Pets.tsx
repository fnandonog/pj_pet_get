import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Pet } from '../types'
import PetCard from '../components/PetCard'

type Props = {
  logado: boolean
}

// tela inicial: mostra todos os pets
export default function Pets({ logado }: Props) {
  const [pets, setPets] = useState<Pet[]>([])
  const [mensagem, setMensagem] = useState('')

  // busca os pets na API
  async function carregar() {
    const resposta = await api('/pets')
    setPets(resposta.pets)
  }

  // useEffect com [] roda uma vez quando a tela abre
  useEffect(() => {
    carregar()
  }, [])

  async function agendar(id: number) {
    try {
      const resposta = await api(`/pets/schedule/${id}`, 'PATCH')
      setMensagem(resposta.message)
    } catch (error) {
      // aqui aparecem as regras da API, ex: "não pode agendar o próprio pet"
      setMensagem((error as Error).message)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Pets para adoção</h2>

      {mensagem && <p className="bg-yellow-100 border border-yellow-300 rounded p-2">{mensagem}</p>}

      {pets.length === 0 && <p>Nenhum pet cadastrado ainda.</p>}

      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet}>
          {/* so mostra o botão se esta logado e o pet ainda esta disponivel */}
          {logado && pet.available && (
            <button onClick={() => agendar(pet.id)} className="bg-green-600 text-white rounded px-3 py-1">
              Agendar visita
            </button>
          )}
        </PetCard>
      ))}
    </div>
  )
}
