/**
 * TransactionHistory - Component UI
 * Affiche l'historique des transactions
 * Principe SRP : Responsable uniquement de l'affichage de l'historique
 */

'use client'

interface Transaction {
  id: string
  type: 'CREDIT' | 'DEBIT'
  amount: number
  reason: string
  createdAt: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
  loading?: boolean
}

const reasonLabels: Record<string, string> = {
  DAILY_REWARD: 'Récompense quotidienne',
  FEED_CREATURE: 'Nourriture créature',
  MANUAL_ADD: 'Ajout manuel',
  MANUAL_SUBTRACT: 'Retrait manuel',
  QUEST_REWARD: 'Récompense quête',
  LEVEL_UP: 'Passage de niveau',
  PURCHASE: 'Achat',
  BOOST_XP: 'Boost XP',
  INITIAL_BALANCE: 'Bonus de bienvenue'
}

function formatDate (dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  )

  if (diffInHours < 1) {
    return 'À l\'instant'
  }
  if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`
  }
  if (diffInHours < 48) {
    return 'Hier'
  }

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

export function TransactionHistory ({
  transactions,
  loading = false
}: TransactionHistoryProps) {
  if (loading) {
    return (
      <div className='bg-white rounded-xl p-6 border border-latte-200 shadow-sm'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-4'>
          Historique des transactions
        </h3>
        <div className='space-y-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='animate-pulse'>
              <div className='flex items-center justify-between p-3 bg-latte-50 rounded-lg'>
                <div className='flex-1'>
                  <div className='h-4 w-32 bg-latte-200 rounded mb-2' />
                  <div className='h-3 w-24 bg-latte-200 rounded' />
                </div>
                <div className='h-6 w-20 bg-latte-200 rounded' />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className='bg-white rounded-xl p-6 border border-latte-200 shadow-sm'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-4'>
          Historique des transactions
        </h3>
        <div className='text-center py-8'>
          <span className='text-4xl mb-2 block'>📜</span>
          <p className='text-latte-600'>Aucune transaction pour le moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-xl p-6 border border-latte-200 shadow-sm'>
      <h3 className='text-lg font-semibold text-blueberry-950 mb-4'>
        Historique des transactions
      </h3>
      <div className='space-y-2 max-h-96 overflow-y-auto'>
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className='flex items-center justify-between p-3 bg-latte-50 rounded-lg hover:bg-latte-100 transition-colors'
          >
            <div className='flex items-center gap-3'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'CREDIT'
                    ? 'bg-blueberry-100 text-blueberry-950'
                    : 'bg-strawberry-100 text-strawberry-600'
                  }`}
              >
                {transaction.type === 'CREDIT' ? '➕' : '➖'}
              </div>
              <div>
                <p className='text-sm font-medium text-blueberry-950'>
                  {reasonLabels[transaction.reason] ?? transaction.reason}
                </p>
                <p className='text-xs text-latte-600'>
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
            </div>
            <div
              className={`text-base font-semibold ${transaction.type === 'CREDIT'
                  ? 'text-blueberry-950'
                  : 'text-strawberry-600'
                }`}
            >
              {transaction.type === 'CREDIT' ? '+' : '-'}
              {transaction.amount.toLocaleString('fr-FR')} Ⱥ
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
