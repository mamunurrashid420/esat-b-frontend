export function MissionAndVision() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm md:text-base font-semibold" style={{ color: '#999898' }}>
            Mission & Vision
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight" style={{ color: 'var(--color-dark-lighter)' }}>
            Mission & Vision
          </h1>
        </div>

        <div className="flex flex-col gap-6 md:gap-8 mt-4">
          {/* Vision Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--color-dark-lighter)' }}>
              Vision
            </h2>
            <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
              To contribute to the welfare of the school and alumni through building bridges, cooperation and joint development activities among the alumni of Textile Engineering College, Barishal.
            </p>
          </div>

          {/* Mission Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--color-dark-lighter)' }}>
              Mission
            </h2>
            <div className="flex flex-col gap-4">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                a) To bring alumni members on the same platform and build fraternal relations and also play a role in enhancing the skills of interested members and creating employment opportunities.
              </p>
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                b) To make Textile Engineering College, Barishal the best educational institution at the national level through the active participation of alumni and the joint efforts of all stakeholders.
              </p>
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                c) To build a strong network of alumni for social, professional and humanitarian support.
              </p>
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                d) To contribute to the development of the school's infrastructure and the overall development of the education system.
              </p>
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                e) To play an effective role in improving the quality of education of students studying in the school.
              </p>
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                f) To coordinate between the school authorities, the board of directors and all concerned in order to accelerate the overall development of the school.
              </p>
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                g) To actively participate in social and humanitarian welfare activities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
