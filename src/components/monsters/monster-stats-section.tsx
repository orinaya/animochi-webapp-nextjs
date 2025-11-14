/**
 * MonsterStatsSection - Section des statistiques du monstre
 *
 * Affiche les stats émotionnelles du monstre (bonheur, tristesse, etc.)
 * basées sur son état actuel
 *
 * Respecte le principe SRP : Gère uniquement l'affichage des stats
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/monster-stats-section
 */

'use client'

import type { Monster, MonsterState } from '@/types/monster/monster'
import { STATE_CONFIG } from '@/components/ui/monster-card'

/**
 * Configuration d'une stat émotionnelle
 */

/**
 * Retourne les stats émotionnelles basées sur l'état du monstre
 *
 * @param {string | null} state - État actuel du monstre
 * @returns {StatConfig[]} Configuration des stats avec valeurs
 */

/**
 * Section des statistiques émotionnelles du monstre
 *
 * @param {MonsterStatsSectionProps} props - Les propriétés du composant
 * @returns {React.ReactNode} La section des stats
 */
import { FiZap } from 'react-icons/fi'

interface MonsterStatsSectionProps {
  /** Données du monstre */
  monster: Monster
  /** Composant actions à insérer */
  actionsComponent?: React.ReactNode
}

export default function MonsterStatsSection ({ monster, actionsComponent }: MonsterStatsSectionProps): React.ReactNode {
  const state = (monster.state ?? 'happy') as MonsterState
  const stateConf = STATE_CONFIG[state]
  return (
    <div className='relative bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-latte-100 h-fit flex flex-col justify-center items-center overflow-hidden gap-8'>
      {/* Effet décoratif subtil */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute -top-8 -right-8 w-32 h-32 bg-blueberry-100/20 rounded-full blur-2xl' />
        <div className='absolute -bottom-8 -left-8 w-24 h-24 bg-strawberry-100/20 rounded-full blur-2xl' />
      </div>
      <div className='relative z-10 w-full flex flex-col items-center'>
        {/* Titre + sous-titre alignés à gauche, badge à droite */}
        <div className='w-full mb-1 mt-1 flex items-start justify-between'>
          <div className='flex flex-col items-start'>
            <div className='flex items-center gap-2'>
              <FiZap className='text-strawberry-500' size={22} />
              <h2 className='text-lg sm:text-xl font-bold text-blueberry-950'>Actions</h2>
            </div>
            {/* Sous-titre aligné à gauche */}
            <div className='text-xs text-latte-600 mt-1 mb-4 text-left'>Interagis avec ton monstre</div>
          </div>
          {/* Badge d'état animé (glow, scale, ombre colorée) */}
          <div className='flex flex-col items-end gap-2'>
            {(stateConf != null)
              ? (
                <div
                  className={`flex items-center gap-2 px-4 py-1 rounded-full border-2 font-bold text-base shadow-lg transition-all ${stateConf.className} animate-bounce-slow relative`}
                  style={{
                    minWidth: 120,
                    justifyContent: 'center',
                    boxShadow:
                      '0 0 16px 4px rgba(255,255,0,0.25), 0 0 8px 2px ' +
                      (state === 'happy'
                        ? '#22c55e'
                        : state === 'angry'
                          ? '#ef4444'
                          : state === 'sad'
                            ? '#3b82f6'
                            : '#fbbf24')
                  }}
                >
                  <span className='text-xl drop-shadow-lg'>{stateConf.emoji}</span>
                  <span className='tracking-wide drop-shadow'>{stateConf.label}</span>
                  {/* Particules effet gaming */}
                  <span className='absolute -top-2 -right-2 animate-ping-slow text-yellow-300 text-lg select-none'>★</span>
                </div>
                )
              : (
                <div
                  className='flex items-center gap-2 px-4 py-1 rounded-full border-2 font-bold text-base shadow-lg transition-all bg-gray-100 text-gray-700 border-gray-300 animate-bounce-slow relative'
                  style={{ minWidth: 120, justifyContent: 'center' }}
                >
                  <span className='text-xl drop-shadow-lg'>❓</span>
                  <span className='tracking-wide drop-shadow'>État inconnu</span>
                  <span className='absolute -top-2 -right-2 animate-ping-slow text-yellow-300 text-lg select-none'>★</span>
                </div>
                )}
          </div>
        </div>
        {actionsComponent != null && (
          <div className='w-full flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 place-content-center'>
            {/* On attend que MonsterActionsSection rende chaque bouton dans un fragment ou un tableau */}
            {Array.isArray(actionsComponent)
              ? actionsComponent.map((action, i) => (
                <div key={i} className='w-full flex'>
                  {action}
                </div>
              ))
              : <div className='col-span-2 w-full flex'>{actionsComponent}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
