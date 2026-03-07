import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import type { JobListing } from '@/types/api'

const PLACEHOLDER_LOGO = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23eee" width="100" height="100"/%3E%3Ctext x="50" y="55" font-size="40" fill="%23999" text-anchor="middle"%3E?%3C/text%3E%3C/svg%3E'

interface RecentJobsSectionProps {
  jobs: JobListing[]
  loading: boolean
}

interface JobCardProps {
  id: number
  logo: string
  title: string
  description: string
  status: 'active' | 'expired'
}

function JobCard({ id, logo, title, description, status }: JobCardProps) {
  return (
    <div
      className="flex flex-col items-center p-6 md:p-8 gap-6 md:gap-8 rounded-2xl w-full max-w-[416px]"
      style={{
        border: '1px solid #EFEFEF',
        boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex items-center justify-center">
        <img
          src={logo || PLACEHOLDER_LOGO}
          alt="Company logo"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-[368px]">
        <h3 
          className="text-xl font-semibold text-center leading-[23px]"
          style={{ color: '#121212', letterSpacing: '0.01em' }}
        >
          {title}
        </h3>
        <p 
          className="text-base leading-[26px] text-center"
          style={{ color: '#000000' }}
        >
          {description}
        </p>
        {status === 'active' ? (
          <Link to="/jobs/$id" params={{ id: String(id) }}>
            <Button
              className="h-12 px-6 rounded-md text-xl font-semibold"
              style={{
                background: '#2ACA55',
                color: '#FFFFFF',
                letterSpacing: '0.01em'
              }}
            >
              Apply Now
            </Button>
          </Link>
        ) : (
          <Button
            className="h-12 px-6 rounded-md text-xl font-semibold"
            style={{
              background: '#BFBFBF',
              color: '#FFFFFF',
              letterSpacing: '0.01em'
            }}
            disabled
          >
            Expired
          </Button>
        )}
      </div>
    </div>
  )
}

export function RecentJobsSection({ jobs, loading }: RecentJobsSectionProps) {
  const displayJobs = jobs.slice(0, 6)
  const cardItems = displayJobs.map((job) => ({
    id: job.id,
    logo: job.logo ?? '',
    title: job.title,
    description: job.description ?? '',
    status: job.status,
  }))

  return (
    <section className="w-full py-12 md:py-16 flex flex-col items-center gap-6 md:gap-8">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px] box-border">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[56px] lg:leading-[72px] text-center"
          style={{ color: 'var(--color-dark-lighter)' }}
        >
          Job Opportunity
        </h2>

        {loading ? (
          <p className="text-center mt-6" style={{ color: '#696868' }}>
            Loading...
          </p>
        ) : cardItems.length === 0 ? (
          <p className="text-center mt-6" style={{ color: '#696868' }}>
            No job openings at the moment.
          </p>
        ) : (
          <div className="flex flex-col gap-4 md:gap-6 w-full mt-6 md:mt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-stretch">
              {cardItems.slice(0, 3).map((job, index) => (
                <JobCard key={displayJobs[index].id} {...job} />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-stretch">
              {cardItems.slice(3, 6).map((job, index) => (
                <JobCard key={displayJobs[index + 3].id} {...job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
