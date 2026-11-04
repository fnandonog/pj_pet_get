import type { ReactNode } from 'react'
import type { Pet } from '../types'

// cartão que mostra um pet
// "children" são os botões/textos extras que cada tela coloca embaixo
type Props = {
  pet: Pet
  children?: ReactNode
}

export default function PetCard({ pet, children }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex gap-4">
      {/* se o pet tem foto mostra a foto, se não mostra um emoji */}
      {pet.image ? (
        <img src={pet.image} alt={pet.name} className="w-24 h-24 object-cover rounded" />
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-4xl">🐾</div>
      )}

      <div className="flex-1">
        <h3 className="font-bold text-lg">{pet.name}</h3>
        <p className="text-sm text-gray-600">
          {pet.age} anos · {pet.weight} kg · {pet.color}
        </p>

        {/* nome do dono (quando a API manda) */}
        {pet.user && <p className="text-sm text-gray-600">Dono: {pet.user.name}</p>}

        {/* disponivel ou adotado */}
        {pet.available ? (
          <span className="text-sm text-green-700 font-semibold">Disponível</span>
        ) : (
          <span className="text-sm text-red-700 font-semibold">Adotado</span>
        )}

        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}
