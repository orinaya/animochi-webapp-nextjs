import { auth } from '@/lib/auth/auth'
import { pricingTable } from '@/config/pricing'
import { headers } from 'next/headers'
import { CreateCheckoutSessionUseCase } from '@/domain/usecases/create-checkout-session.usecase'
import { StripePaymentRepository } from '@/infrastructure/repositories/stripe-payment.repository'
import { MongoPurchaseRepository } from '@/infrastructure/repositories/mongo-purchase.repository'

export async function POST (request: Request): Promise<Response> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { amount } = await request.json()

    const product = pricingTable[amount]

    if (product === undefined || product === null) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Initialiser les repositories
    const paymentRepo = new StripePaymentRepository()
    const purchaseRepo = new MongoPurchaseRepository()

    // Créer le use case
    const useCase = new CreateCheckoutSessionUseCase(paymentRepo, purchaseRepo)

    // Construire l'URL de base
    const headersList = await headers()
    const host = headersList.get('host') ?? 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `${protocol}://${host}`

    // Exécuter le use case
    const result = await useCase.execute({
      userId: session.user.id,
      userEmail: session.user.email,
      purchaseType: 'animoneys-package',
      itemId: `animoneys-${String(amount)}`,
      amount: Math.round(product.price * 100), // Convertir en centimes
      currency: 'eur',
      productDescription: `${product.amount} Animoneys`,
      baseUrl,
      metadata: {
        animoneysAmount: product.amount,
        packagePrice: product.price
      }
    })

    if (!result.ok) {
      console.error('Error from use case:', result.error)
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(
      JSON.stringify({
        url: result.value.url,
        sessionId: result.value.sessionId
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in checkout session API:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
