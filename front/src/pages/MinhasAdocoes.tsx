import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Pet } from '../types'
import PetCard from '../components/PetCard'

// pets em que o usuario agendou visita
export default function MinhasAdocoes() {
  const [pets, setPets] = useState<Pet[]>([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    api('/pets/myadoptions')
      .then((resposta) => setPets(resposta.pets))
      .catch((error) => setErro(error.message))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Minhas adoções</h2>

      {erro && <p className="text-red-600">{erro}</p>}
      {pets.length === 0 && <p>Você ainda não agendou nenhuma visita.</p>}

      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet}>
          {/* contato do dono para combinar a visita */}
          <p className="text-sm">Telefone do dono: {pet.user?.phone}</p>
          {pet.available ? (
            <p className="text-sm text-gray-600">Aguardando o dono concluir a adoção.</p>
          ) : (
            <p className="text-sm text-green-700 font-semibold">Parabéns, o pet é seu! 🎉</p>
          )}
        </PetCard>
      ))}
    </div>
  )
}
