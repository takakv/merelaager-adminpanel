import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { useAuthStore } from '@/stores/authStore.ts'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'

import { Route as homeRoute } from './_auth/index.tsx'
import { submitPasswordResetRequest } from '@/requests/password-reset.ts'

// export const Route = createFileRoute('/login')({
//   component: LoginComponent,
//   beforeLoad: async ({ context }) => {
//     const auth = await context.auth
//     console.log('login.tsx:', auth)
//     if (auth.isAuthenticated) {
//       console.log('login.tsx:', 'Redirecting to /')
//       throw redirect({ to: fallback })
//     }
//   },
// })

export const Route = createFileRoute('/login')({
  component: LoginComponent,
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user) {
      throw redirect({ to: homeRoute.to })
    }
  },
})

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Kasutajanimi peab olema vähemalt 2 tähemärki pikk.',
  }),
  password: z.string().min(6, {
    message: 'Salasõna peab olema vähemalt 6 tähemärki pikk.',
  }),
})

const passwordResetFormSchema = z.object({
  email: z.string().email({
    message: 'Peab olema meiliaadress.',
  }),
})

const PasswordReset = () => {
  const form = useForm<z.infer<typeof passwordResetFormSchema>>({
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof passwordResetFormSchema>) => {
    try {
      await submitPasswordResetRequest(values.email)
    } catch (err) {
      console.error(err)
      toast.error('Viga meili saatmisel!', {
        description: (err as Error).message,
      })
      return
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="inline-block text-sm underline-offset-4 hover:underline opacity-50 hover:opacity-100 cursor-pointer">
          Unustasid salasõna?
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Lähtesta salasõna?</AlertDialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meiliaadress</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <AlertDialogCancel>Tühista</AlertDialogCancel>
              <AlertDialogAction type="submit">Lähtesta</AlertDialogAction>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function LoginComponent() {
  const { login } = useAuthStore()
  const navigate = Route.useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const usernameValue = values.username
      const passwordValue = values.password

      if (!usernameValue || !passwordValue) return
      const username = usernameValue.toString()
      const password = passwordValue.toString()

      try {
        await login(username, password)
      } catch (err) {
        console.error(err)
        toast.error('Viga sisselogimisel!', {
          description: (err as Error).message,
        })
        return
      }

      // await router.invalidate()
      console.log('navigating')
      navigate({ to: homeRoute.to, replace: true })
    } catch (error) {
      console.error('Error logging in: ', error)
      toast.error('Viga sisselogimisel!', {
        description: 'Ootamatu viga: rohkem infot konsoolis.',
      })
    }
  }

  return (
    <div className="w-full flex items-center h-auto sm:items-start top-1/4 relative">
      <Toaster position="top-center" />
      <div className="px-6 w-full max-w-sm mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-[50px] mx-auto">
              <img
                src="https://merelaager.ee/img/merelaager_ship.svg"
                alt="Merelaagri logo"
              />
            </div>
            <CardTitle>Kambüüs</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(onFormSubmit)}
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kasutajanimi</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salasõna</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Logi sisse</Button>
              </form>
            </Form>
            <div className="pt-4">
              <PasswordReset />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
