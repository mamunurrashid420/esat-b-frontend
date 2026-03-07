import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/api/client'
import type { PublicMember } from '@/types/api'

const PER_PAGE = 12

function getStatusLabel(type: string | null): string {
  switch (type) {
    case 'GENERAL':
      return 'General Member'
    case 'LIFETIME':
      return 'Life Member'
    case 'ASSOCIATE':
      return 'Associate Member'
    default:
      return 'Member'
  }
}

function getStatusButtonColor(type: string | null): string {
  switch (type) {
    case 'GENERAL':
      return 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
    case 'LIFETIME':
      return 'bg-green-600 hover:bg-green-700'
    case 'ASSOCIATE':
      return 'bg-purple-600 hover:bg-purple-700'
    default:
      return 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
  }
}

export function Membership() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{
    members: PublicMember[]
    meta: { current_page: number; last_page: number; total: number; per_page: number }
    links: { prev: string | null; next: string | null }
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    apiClient
      .getMembers({ page, per_page: PER_PAGE })
      .then((res) => {
        setData({
          members: res.data,
          meta: res.meta,
          links: res.links,
        })
      })
      .catch((err) => {
        setError(err?.message ?? 'Failed to load members.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page])

  const meta = data?.meta
  const members = data?.members ?? []
  const hasPrev = !!data?.links.prev
  const hasNext = !!data?.links.next

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-7xl">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm md:text-base font-semibold" style={{ color: 'var(--color-dark-lighter)' }}>
            Membership
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight" style={{ color: 'var(--color-dark-lighter)' }}>
            Our Members
          </h1>
        </div>
        <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: 'var(--color-dark-lighter)' }}>
          Meet our distinguished alumni members who are making a difference in their respective fields and contributing to the growth of our community.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <p className="text-[var(--color-dark-lighter)]">Loading members…</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {!loading && !error && members.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-[var(--color-dark-lighter)]">
          No members to display.
        </div>
      )}

      {!loading && !error && members.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-100 flex flex-col"
              >
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                  ) : (
                    <svg
                      className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--color-dark-lighter)] mb-1 truncate">
                    {member.name}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--color-dark-lighter)] mb-2">
                    {member.designation ?? member.profession ?? '—'}
                  </p>
                  {member.institute_name && (
                    <p className="text-sm text-[var(--color-dark-lighter)] mb-2">{member.institute_name}</p>
                  )}
                  <div className="space-y-1 mb-3">
                    <p className="text-xs sm:text-sm text-[var(--color-dark-lighter)]">
                      <span className="text-[var(--color-dark-lighter)]">Membership No :</span>{' '}
                      <span className="text-[var(--color-dark-lighter)] font-medium">{member.member_id ?? '—'}</span>
                    </p>
                  </div>
                  <Button
                    className={`${getStatusButtonColor(member.primary_member_type)} text-white text-xs sm:text-sm px-3 py-1.5 h-auto rounded-md font-medium mt-auto w-fit`}
                  >
                    {getStatusLabel(member.primary_member_type)}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {meta && (meta.last_page > 1 || meta.total > PER_PAGE) && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[var(--color-dark-lighter)]">
                Showing {(meta.current_page - 1) * meta.per_page + 1}–{Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-[var(--color-dark-lighter)] px-2">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasNext}
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
