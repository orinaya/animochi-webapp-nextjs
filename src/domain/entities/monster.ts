// src/domain/entities/monster.ts
// Entité Monster avec gestion des états et transitions

import type { MonsterState } from '@/config/rewards.config'

export type { MonsterState }

export interface MonsterProps {
  id: string
  ownerId: string
  state: MonsterState
  stateUpdatedAt: Date
  nextStateAt: Date
  // autres propriétés métier (nom, niveau, etc)
}

export class Monster {
  private readonly props: MonsterProps

  constructor (props: MonsterProps) {
    this.props = props
  }

  get id (): string {
    return this.props.id
  }

  get ownerId (): string {
    return this.props.ownerId
  }

  get state (): MonsterState {
    return this.props.state
  }

  get stateUpdatedAt (): Date {
    return this.props.stateUpdatedAt
  }

  get nextStateAt (): Date {
    return this.props.nextStateAt
  }

  // Transitionne vers un nouvel état aléatoire
  changeState (newState: MonsterState, now: Date, nextStateAt: Date): void {
    this.props.state = newState
    this.props.stateUpdatedAt = now
    this.props.nextStateAt = nextStateAt
  }

  // Génère un prochain timestamp de transition (5-10 min)
  static getNextStateAt (now: Date): Date {
    const min = 5 * 60 * 1000
    const max = 10 * 60 * 1000
    const delta = Math.floor(Math.random() * (max - min + 1)) + min
    return new Date(now.getTime() + delta)
  }
}
