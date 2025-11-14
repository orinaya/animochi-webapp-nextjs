import {betterAuth} from "better-auth"
import {mongodbAdapter} from "better-auth/adapters/mongodb"
import {client} from "@/db"
import {createOrUpdateUserFromOAuth, findUserByEmail} from "./auth-helpers"

// Types pour les callbacks Better Auth
interface SignInUser {
  email?: string | null
  name?: string | null
  image?: string | null
}

interface Account {
  provider?: string
}

interface Session {
  user?: {
    email?: string | null
    id?: string
    displayName?: string
    level?: number
  }
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.MONGODB_DATABASE_NAME as string)),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      // Forcer la sélection de compte GitHub
      scope: ["user:email"],
      authorizationParams: {
        prompt: "select_account", // Force le choix de compte
      },
    },
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Forcer la sélection de compte Google
      scope: ["openid", "email", "profile"],
      authorizationParams: {
        prompt: "select_account", // Force le choix de compte
      },
    },
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: SignInUser
      account: Account | null
      profile: Record<string, unknown> | null
    }) {
      // Synchroniser les connexions OAuth (GitHub ET Google)
      if (
        (account?.provider === "github" || account?.provider === "google") &&
        user.email != null
      ) {
        try {
          await createOrUpdateUserFromOAuth(
            {
              email: user.email,
              name: user.name,
              image: user.image,
            },
            profile ?? undefined
          )
          console.log(`Synchronisation réussie pour: ${user.email} via ${account.provider}`)
        } catch (error) {
          console.error("Erreur lors de la synchronisation OAuth:", error)
          // Continue la connexion même en cas d'erreur de synchronisation
        }
      }
      return true
    },
    async session({session}: {session: Session; token: unknown}) {
      // Enrichir la session avec l'ID utilisateur Animochi
      if (session.user?.email != null) {
        try {
          const animochiUser = await findUserByEmail(session.user.email)
          if (animochiUser != null) {
            session.user.id =
              typeof animochiUser._id === "string"
                ? animochiUser._id
                : animochiUser._id?.toString?.() ?? ""
            if ("pseudo" in animochiUser && animochiUser.pseudo) {
              ;(session.user as import("@/types/user/user").User).pseudo = animochiUser.pseudo
            }
            if ("username" in animochiUser && animochiUser.username) {
              ;(session.user as import("@/types/user/user").User).username = animochiUser.username
            }
            if ("displayName" in animochiUser && animochiUser.displayName) {
              session.user.displayName = animochiUser.displayName
            }
            if ("level" in animochiUser && animochiUser.level) {
              session.user.level = animochiUser.level
            }
          }
        } catch (error) {
          console.error("Erreur lors de l'enrichissement de session:", error)
        }
      }
      return session
    },
  },
})
