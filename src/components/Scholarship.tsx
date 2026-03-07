import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { GraduationCap, Award, BookOpen, Users, Heart, CheckCircle2 } from 'lucide-react'
import { apiClient } from '@/api/client'
import type { Scholarship } from '@/types/api'
import { useAuthStore } from '@/stores/authStore'
import { useScholarshipApplyModal } from '@/contexts/ScholarshipApplyModalContext'

const objectives = [
  'Provide financial assistance to deserving students',
  'Encourage academic excellence and continuity in education',
  'Support meritorious students from economically disadvantaged backgrounds',
  'Strengthen the bond between alumni and current students',
  'Promote a culture of social responsibility within the alumni community',
]

const coverageItems = [
  'Tuition fee support (full or partial)',
  'Examination or registration fees',
  'Books and study materials',
  'Monthly/Yearly stipend (if applicable)',
  'One-time financial grant',
]

const eligibilityCriteria = [
  'Must be a current student of Textile Engineering College, Barishal/Ex-students (studying right now)/ current student of other institution (Inter Union, Upazilla & Zilla)',
  'Must have a satisfactory academic record',
  'Must demonstrate financial need',
  'Must show good moral character and discipline',
  'Priority may be given to students from disadvantaged backgrounds',
]

const applicationRequirements = [
  'A completed scholarship application form',
  'Academic transcripts or certificates',
  'A recommendation letter (if required)',
  'Proof of financial need',
  'A personal statement explaining why the scholarship is needed',
]

const selectionCriteria = [
  'Academic performance',
  'Financial need',
  'Personal motivation and commitment',
  'Overall evaluation by the selection committee',
]

const responsibilities = [
  'Maintain satisfactory academic performance',
  'Follow the institution\'s rules and regulations',
  'Participate in alumni or mentorship activities if requested',
  'Use the scholarship funds solely for educational purposes',
]

export function Scholarship() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { openModal } = useScholarshipApplyModal()
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loadingScholarships, setLoadingScholarships] = useState(true)
  const [errorScholarships, setErrorScholarships] = useState<string | null>(null)

  useEffect(() => {
    apiClient
      .getScholarships()
      .then((res) => setScholarships(res.data))
      .catch(() => setErrorScholarships('Failed to load scholarships'))
      .finally(() => setLoadingScholarships(false))
  }, [])

  const handleApplyClick = () => {
    if (isAuthenticated) {
      navigate({ to: '/scholarship-apply' })
    } else {
      openModal()
    }
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-[var(--color-primary)]/10 to-white">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <div className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--color-primary)] text-white mb-4">
              <GraduationCap className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight"
              style={{ color: 'var(--color-dark-lighter)' }}
            >
              ESAT-B Scholarship Program
            </h1>
            <p 
              className="text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl"
              style={{ color: '#696868' }}
            >
              Supporting meritorious and financially deserving students through the Alumni Scholarship Program
            </p>
            <div className="flex justify-center mt-2">
              <Button
                type="button"
                onClick={handleApplyClick}
                className="w-full sm:w-auto px-8 h-[50px] md:h-[56px] text-base md:text-lg font-semibold rounded-md"
                style={{ 
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                }}
              >
                Apply for Scholarship
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarship Types Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
          <div className="flex flex-col gap-8 md:gap-12">
            <div className="flex flex-col gap-2 text-center">
              <p 
                className="text-sm md:text-base font-semibold"
                style={{ color: '#999898' }}
              >
                Available Scholarships
              </p>
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-semibold"
                style={{ color: 'var(--color-dark-lighter)' }}
              >
                Scholarship Categories
              </h2>
            </div>

            {loadingScholarships && (
              <p className="text-center text-black-600">Loading scholarships…</p>
            )}
            {errorScholarships && (
              <p className="text-center text-red-600">{errorScholarships}</p>
            )}
            {!loadingScholarships && !errorScholarships && scholarships.length === 0 && (
              <p className="text-center text-black-600">No scholarships available at the moment.</p>
            )}
            {!loadingScholarships && !errorScholarships && scholarships.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {scholarships.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="flex flex-col gap-4 p-6 md:p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                    style={{
                      background: '#FFFFFF',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'var(--color-primary)' }}
                      >
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      {scholarship.category && (
                        <span 
                          className="text-xs md:text-sm font-semibold px-3 py-1 rounded-full"
                          style={{ 
                            background: 'var(--color-primary)',
                            color: '#FFFFFF'
                          }}
                        >
                          {scholarship.category}
                        </span>
                      )}
                    </div>
                    <h3 
                      className="text-lg md:text-xl font-semibold"
                      style={{ color: 'var(--color-dark-lighter)' }}
                    >
                      {scholarship.title}
                    </h3>
                    {scholarship.description && (
                      <p 
                        className="text-sm md:text-base leading-relaxed"
                        style={{ color: '#696868' }}
                      >
                        {scholarship.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="w-full py-12 md:py-16 lg:py-20" style={{ background: '#F5F7F9' }}>
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
          <div className="flex flex-col gap-6 md:gap-8">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-semibold"
              style={{ color: 'var(--color-dark-lighter)' }}
            >
              Introduction
            </h2>
            <p 
              className="text-base md:text-lg leading-relaxed md:leading-[26px]"
              style={{ color: '#696868' }}
            >
              The Alumni Scholarship Program is an initiative of the Ex-Students Association Of Textile Engineering College, Barishal (ESAT-B) aimed at supporting meritorious and financially deserving students. This program reflects the alumni community's commitment to giving back to their alma mater and contributing to the academic and personal development of the students including ex-students who are studying now.
            </p>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
          <div className="flex flex-col gap-6 md:gap-8">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-semibold"
              style={{ color: 'var(--color-dark-lighter)' }}
            >
              Objectives
            </h2>
            <p 
              className="text-base md:text-lg leading-relaxed mb-4"
              style={{ color: '#696868' }}
            >
              The main objectives of the Alumni Scholarship Program are to:
            </p>
            <ul className="flex flex-col gap-4">
              {objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 
                    className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-1"
                    style={{ color: 'var(--color-primary)' }}
                  />
                  <p 
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: '#696868' }}
                  >
                    {objective}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Scholarship Coverage Section */}
      <section className="w-full py-12 md:py-16 lg:py-20" style={{ background: '#F5F7F9' }}>
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-primary)' }}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-semibold"
                style={{ color: 'var(--color-dark-lighter)' }}
              >
                Scholarship Coverage
              </h2>
            </div>
            <p 
              className="text-base md:text-lg leading-relaxed mb-4"
              style={{ color: '#696868' }}
            >
              The scholarship may include one or more of the following benefits:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coverageItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg"
                  style={{ background: '#FFFFFF' }}
                >
                  <div 
                    className="w-2 h-2 rounded-full shrink-0 mt-2"
                    style={{ background: 'var(--color-primary)' }}
                  />
                  <p 
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: '#696868' }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Criteria Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-primary)' }}
              >
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-semibold"
                style={{ color: 'var(--color-dark-lighter)' }}
              >
                Eligibility Criteria
              </h2>
            </div>
            <p 
              className="text-base md:text-lg leading-relaxed mb-4"
              style={{ color: '#696868' }}
            >
              Applicants must meet the following criteria:
            </p>
            <ul className="flex flex-col gap-4">
              {eligibilityCriteria.map((criterion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ 
                      background: 'var(--color-primary)',
                      color: '#FFFFFF'
                    }}
                  >
                    <span className="text-xs font-semibold">{index + 1}</span>
                  </div>
                  <p 
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: '#696868' }}
                  >
                    {criterion}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="w-full py-12 md:py-16 lg:py-20" style={{ background: '#F5F7F9' }}>
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
          <div className="flex flex-col gap-6 md:gap-8">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-semibold"
              style={{ color: 'var(--color-dark-lighter)' }}
            >
              Application Process
            </h2>
            <p 
              className="text-base md:text-lg leading-relaxed mb-4"
              style={{ color: '#696868' }}
            >
              Interested students must submit:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applicationRequirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg"
                  style={{ background: '#FFFFFF' }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ 
                      background: 'var(--color-primary)',
                      color: '#FFFFFF'
                    }}
                  >
                    <span className="text-sm font-semibold">{index + 1}</span>
                  </div>
                  <p 
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: '#696868' }}
                  >
                    {requirement}
                  </p>
                </div>
              ))}
            </div>
            <p 
              className="text-base md:text-lg leading-relaxed mt-4"
              style={{ color: '#696868' }}
            >
              Applications will be reviewed by the Alumni Scholarship Committee, and shortlisted candidates may be called for an interview.
            </p>
          </div>
        </div>
      </section>

      {/* Selection Process Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
          <div className="flex flex-col gap-6 md:gap-8">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-semibold"
              style={{ color: 'var(--color-dark-lighter)' }}
            >
              Selection Process
            </h2>
            <p 
              className="text-base md:text-lg leading-relaxed mb-4"
              style={{ color: '#696868' }}
            >
              Scholarship recipients are selected based on:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectionCriteria.map((criterion, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg"
                  style={{ background: '#F5F7F9' }}
                >
                  <CheckCircle2 
                    className="w-5 h-5 md:w-6 md:h-6 shrink-0"
                    style={{ color: 'var(--color-primary)' }}
                  />
                  <p 
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: '#696868' }}
                  >
                    {criterion}
                  </p>
                </div>
              ))}
            </div>
            <p 
              className="text-base md:text-lg leading-relaxed mt-4 font-semibold"
              style={{ color: 'var(--color-dark-lighter)' }}
            >
              The decision of the Scholarship Committee will be final.
            </p>
          </div>
        </div>
      </section>

      {/* Responsibilities Section */}
      <section className="w-full py-12 md:py-16 lg:py-20" style={{ background: '#F5F7F9' }}>
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
          <div className="flex flex-col gap-6 md:gap-8">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-semibold"
              style={{ color: 'var(--color-dark-lighter)' }}
            >
              Responsibilities of Scholarship Recipients
            </h2>
            <p 
              className="text-base md:text-lg leading-relaxed mb-4"
              style={{ color: '#696868' }}
            >
              Selected students are expected to:
            </p>
            <ul className="flex flex-col gap-4">
              {responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ 
                      background: 'var(--color-primary)',
                      color: '#FFFFFF'
                    }}
                  >
                    <span className="text-xs font-semibold">{index + 1}</span>
                  </div>
                  <p 
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: '#696868' }}
                  >
                    {responsibility}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Funding Source Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-primary)' }}
              >
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-semibold"
                style={{ color: 'var(--color-dark-lighter)' }}
              >
                Funding Source
              </h2>
            </div>
            <p 
              className="text-base md:text-lg leading-relaxed md:leading-[26px]"
              style={{ color: '#696868' }}
            >
              The Alumni Scholarship Fund is supported by voluntary contributions from alumni members, donors, and well-wishers. Transparent financial management and reporting will be ensured by the Alumni Association.
            </p>
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="w-full py-12 md:py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
          <div className="flex flex-col gap-6 md:gap-8 text-center">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-semibold"
              style={{ color: '#FFFFFF' }}
            >
              Conclusion
            </h2>
            <p 
              className="text-base md:text-lg lg:text-xl leading-relaxed md:leading-[26px] max-w-4xl mx-auto"
              style={{ color: '#FFFFFF' }}
            >
              Through the Alumni Scholarship Program, the Alumni Association seeks to empower students, reduce financial barriers to education, and foster a strong, supportive academic community. This initiative represents the shared belief that education is an investment in the future.
            </p>
            <div className="flex justify-center mt-4">
              <Button
                type="button"
                onClick={handleApplyClick}
                className="w-full sm:w-auto px-8 h-[50px] md:h-[56px] text-base md:text-lg font-semibold rounded-md"
                style={{ 
                  background: '#FFFFFF',
                  color: 'var(--color-primary)',
                }}
              >
                Apply for Scholarship
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
