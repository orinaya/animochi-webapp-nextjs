
import MonsterCard from '@/components/ui/monster-card'
import Section from '../layout/section'
import { monsters } from '@/types'
// import { monsters } from '@/data'

interface MonstersSectionProps {
  children?: React.ReactNode
}

export default function MonstersSection({ children }: MonstersSectionProps): React.ReactNode {
  return (
    <Section
      id='monsters'
      title='Rencontrez vos futurs compagnons'
      subtitle='Chaque créature Animochi possède sa propre personnalité, ses besoins et ses talents uniques. Laquelle choisirez-vous ?'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {monsters.map((monster) => (
          <MonsterCard
            key={monster.id}
            monster={monster}
          />
        ))}
      </div>
    </Section>
  )
}
