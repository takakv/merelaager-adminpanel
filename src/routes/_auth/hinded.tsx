import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/hinded')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Töö käib</div>
}
