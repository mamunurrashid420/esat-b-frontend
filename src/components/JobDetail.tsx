import { useEffect, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { Calendar, Building2, ArrowLeft, ExternalLink } from 'lucide-react'
import { apiClient } from '@/api/client'
import type { JobListing } from '@/types/api'
import { Button } from '@/components/ui/button'

const PLACEHOLDER_LOGO = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23eee" width="100" height="100"/%3E%3Ctext x="50" y="55" font-size="40" fill="%23999" text-anchor="middle"%3E?%3C/text%3E%3C/svg%3E'

function formatJobDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function JobDetail() {
  const params = useParams({ strict: false })
  const id = params?.id != null ? Number(params.id) : NaN
  const [job, setJob] = useState<JobListing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (Number.isNaN(id) || id <= 0) {
      setLoading(false)
      return
    }
    apiClient
      .getJob(id)
      .then((res) => setJob(res.data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="w-full py-12 md:py-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px] flex flex-col items-center gap-6">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        <p style={{ color: '#737887' }}>Loading...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="w-full py-12 md:py-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px] flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-dark-lighter)' }}>
          Job not found
        </h1>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <article className="w-full">
      <div className="w-full py-8 md:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium mb-6 no-underline transition opacity-90 hover:opacity-100"
          style={{ color: 'var(--color-dark-lighter)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
          <div className="shrink-0 w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex items-center justify-center rounded-lg overflow-hidden bg-[#E0E0E0]">
            <img
              src={job.logo || PLACEHOLDER_LOGO}
              alt={job.company_name ?? 'Company logo'}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-4 mb-2" style={{ color: '#737887' }}>
              {job.company_name && (
                <span className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4" />
                  {job.company_name}
                </span>
              )}
              {job.closes_at && (
                <span className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  Closes {formatJobDate(job.closes_at)}
                </span>
              )}
              <span
                className="text-sm font-medium px-2 py-0.5 rounded"
                style={{
                  background: job.status === 'active' ? '#E8F5E9' : '#FFEBEE',
                  color: job.status === 'active' ? '#2E7D32' : '#C62828',
                }}
              >
                {job.status === 'active' ? 'Active' : 'Expired'}
              </span>
            </div>

            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4"
              style={{ color: '#141D38' }}
            >
              {job.title}
            </h1>

            {job.description && (
              <div
                className="prose prose-lg max-w-none whitespace-pre-wrap mb-6"
                style={{ color: '#141D38' }}
              >
                {job.description}
              </div>
            )}

            {job.application_url && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium" style={{ color: '#737887' }}>
                  Apply URL:
                </p>
                <a
                  href={job.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base break-all underline hover:no-underline"
                  style={{ color: 'var(--color-dark-lighter)' }}
                >
                  {job.application_url}
                </a>
                {job.status === 'active' && (
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-fit"
                  >
                    <Button
                      className="h-12 px-6 rounded-md text-xl font-semibold"
                      style={{
                        background: '#2ACA55',
                        color: '#FFFFFF',
                        letterSpacing: '0.01em',
                      }}
                    >
                      Apply Now
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
