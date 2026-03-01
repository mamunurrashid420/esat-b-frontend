import { MapPin, Phone, Mail, Facebook, Linkedin, Youtube, Twitter } from 'lucide-react'

export function Contact() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-6xl">
      <div className="flex flex-col gap-8 md:gap-12">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <p className="text-sm md:text-base font-semibold" style={{ color: '#999898' }}>
            Contact Us
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight" style={{ color: '#021E40' }}>
            Get in Touch with Us
          </h1>
          <p className="text-sm md:text-base leading-relaxed md:leading-[26px] mt-4" style={{ color: '#696868' }}>
            We'd love to hear from you. Reach out to us through any of the following channels.
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6">
          {/* Address Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-[#3B60C9]/10 rounded-full p-3 shrink-0">
                <MapPin className="w-6 h-6 text-[#3B60C9]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold mb-3" style={{ color: '#021E40' }}>
                  Address
                </h3>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: '#696868' }}>
                  Hossain Tower, 5th Floor, Sector #7, Uttara, Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-[#3B60C9]/10 rounded-full p-3 shrink-0">
                <Phone className="w-6 h-6 text-[#3B60C9]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold mb-3" style={{ color: '#021E40' }}>
                  Phone
                </h3>
                <div className="flex flex-col gap-2">
                  <a 
                    href="tel:+8801712631461" 
                    className="text-sm md:text-base leading-relaxed hover:text-[#3B60C9] transition-colors" 
                    style={{ color: '#696868' }}
                  >
                    +880 1712631461
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-[#3B60C9]/10 rounded-full p-3 shrink-0">
                <Mail className="w-6 h-6 text-[#3B60C9]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold mb-3" style={{ color: '#021E40' }}>
                  Email
                </h3>
                <div className="flex flex-col gap-2">
                  <a 
                    href="mailto:info@esatb.org" 
                    className="text-sm md:text-base leading-relaxed hover:text-[#3B60C9] transition-colors break-all" 
                    style={{ color: '#696868' }}
                  >
                    info@esatb.org
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-8 md:mt-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ color: '#021E40' }}>
            Follow Us
          </h2>
          <div className="flex gap-4">
            <a 
              href="#" 
              className="w-12 h-12 bg-[#3B60C9] rounded-lg flex items-center justify-center text-white transition-all duration-200 hover:bg-[#3B60C9]/90 hover:-translate-y-0.5 hover:shadow-lg"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 bg-[#3B60C9] rounded-lg flex items-center justify-center text-white transition-all duration-200 hover:bg-[#3B60C9]/90 hover:-translate-y-0.5 hover:shadow-lg"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 bg-[#3B60C9] rounded-lg flex items-center justify-center text-white transition-all duration-200 hover:bg-[#3B60C9]/90 hover:-translate-y-0.5 hover:shadow-lg"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 bg-[#3B60C9] rounded-lg flex items-center justify-center text-white transition-all duration-200 hover:bg-[#3B60C9]/90 hover:-translate-y-0.5 hover:shadow-lg"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
