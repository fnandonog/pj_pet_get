// tipos dos dados que vem da API

// dono ou adotante do pet (a API so manda esses campos)
export type Pessoa = {
  id: number
  name: string
  phone: string
}

export type Pet = {
  id: number
  name: string
  age: number
  weight: number
  color: string
  image: string | null
  available: boolean
  userId: number
  adopterId: number | null
  user?: Pessoa // dono
  adopter?: Pessoa | null // quem agendou a visita
}
