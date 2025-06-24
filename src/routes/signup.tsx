import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { type SignupBody, signupUser } from '@/requests/user.ts'

import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner.tsx'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'

import { Route as loginRoute } from '@/routes/login.tsx'

const tokenSchema = z.object({ token: z.string().optional() }).strict()

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
  validateSearch: tokenSchema,
})

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Kasutajanimi peab olema vähemalt 2 tähemärki pikk.',
  }),
  email: z.string().email({
    message: 'Peab olema meiliaadress.',
  }),
  name: z
    .string()
    .trim()
    .refine((val) => val.split(/\s+/).length >= 2, {
      message: 'Nimi peab koosnema vähemalt kahest osast.',
    }),
  nickname: z.string().optional(),
  password: z.string().min(6, {
    message: 'Salasõna peab olema vähemalt 6 tähemärki pikk.',
  }),
  token: z.string().uuid(),
})

function RouteComponent() {
  const token = useSearch({ from: '/signup' }).token
  const navigate = Route.useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      name: '',
      nickname: '',
      password: '',
      token: token,
    },
  })

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data: SignupBody = {
        username: values.username,
        email: values.email,
        name: values.name,
        password: values.password,
        token: values.token,
      }
      if (values.nickname) data.nickname = values.nickname
      await signupUser(data)

      navigate({ to: loginRoute.to, replace: true })
    } catch (error) {
      toast.error('Viga konto loomisel!', {
        description: (error as Error).message,
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
            <CardTitle>Loo kambüüsi konto</CardTitle>
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
                        <Input {...field} placeholder="kotermann" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meiliaadress</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="kotermann@merelaager.ee"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nimi</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Kotermann Haldjas" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hüüdnimi (valikuline)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Poterman" />
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
                <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pääsmik</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!!token} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Loo konto</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
