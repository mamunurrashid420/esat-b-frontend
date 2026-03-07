import { useEffect, useState } from 'react'
import { apiClient } from '@/api/client'
import type { PublicMember } from '@/types/api'

export function ExecutiveMembers() {
  const [members, setMembers] = useState<PublicMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient
      .getMembers({ has_secondary_type: true, per_page: 100 })
      .then((res) => {
        setMembers(res.data)
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary-custom text-white px-6 py-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Executive Members</h1>
            <p className="text-sm sm:text-base mt-1 opacity-90">
              Members with Secondary Type (Executive Committee)
            </p>
          </div>
          <div className="p-4 sm:p-6 overflow-x-auto">
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-custom rounded-full animate-spin" />
              </div>
            )}
            {error && (
              <p className="text-center py-8 text-red-600">{error}</p>
            )}
            {!loading && !error && members.length === 0 && (
              <p className="text-center py-8 text-black">No executive members to display.</p>
            )}
            {!loading && !error && members.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((member) => (
                  <article
                    key={member.id}
                    className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
                  >
                    <div className="flex justify-center pt-6 pb-2">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="h-24 w-24 rounded-full object-cover ring-2 ring-gray-100"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div
                        className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-black/60 text-2xl font-medium"
                        style={{ display: member.photo ? 'none' : 'flex' }}
                      >
                        {member.name.charAt(0)}
                      </div>
                    </div>
                    <div className="px-4 pb-4 text-center space-y-1 text-black">
                      <h3 className="font-semibold text-black">{member.name}</h3>
                      {member.secondary_member_type && (
                        <p className="text-sm font-medium text-black">
                          {member.secondary_member_type.name}
                        </p>
                      )}
                      {member.designation && (
                        <p className="text-sm text-black">{member.designation}</p>
                      )}
                      {member.profession && (
                        <p className="text-sm text-black">{member.profession}</p>
                      )}
                      {member.institute_name && (
                        <p className="text-sm text-black">{member.institute_name}</p>
                      )}
                      {member.member_id && (
                        <p className="text-sm text-black">Member ID: {member.member_id}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
