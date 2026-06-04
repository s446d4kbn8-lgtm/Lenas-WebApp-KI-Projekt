import MessageForm from '@/components/MessageForm'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nachricht hinterlassen</h1>
          <p className="text-gray-500 mt-2">
            Wir freuen uns über Ihre Nachricht und melden uns bei Bedarf bei Ihnen.
          </p>
        </div>
        <MessageForm />
      </div>
    </main>
  )
}
