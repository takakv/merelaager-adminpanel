import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/arved')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Töö käib</div>
}
