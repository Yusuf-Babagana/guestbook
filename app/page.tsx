'use client'

import { useState, useEffect } from 'react'
import supabase from '@/lib/supabaseClient'

type Guest = {
  id: string
  name: string
  inserted_at: string
}

export default function Home() {
  const [name, setName] = useState('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(false)

  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('inserted_at', { ascending: false })

    if (error) {
      console.error('Error fetching guests:', error.message)
    } else {
      setGuests(data || [])
    }
  }

  const submitGuest = async () => {
    if (!name.trim()) return

    setLoading(true)
    const { error } = await supabase.from('guests').insert({ name })
    setLoading(false)
    setName('')

    if (error) {
      console.error('Error inserting guest:', error.message)
    } else {
      fetchGuests()
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [])

  return (
    <main className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">📘 Guestbook</h1>

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        <button
          onClick={submitGuest}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      <ul className="border-t pt-4 space-y-2">
        {guests.map((g) => (
          <li key={g.id} className="text-gray-800">
            {g.name}
          </li>
        ))}
      </ul>
    </main>
  )
}
