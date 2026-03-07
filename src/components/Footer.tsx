import { Link } from '@tanstack/react-router'
import { Facebook, Linkedin, Youtube, Twitter, MapPin, Phone, Mail, ChevronsRight } from 'lucide-react'
import logoImage from '@/assets/alumni/logo.png'

export function Footer() {
  return (
    <footer className="flex flex-col w-full" style={{ backgroundColor: 'var(--color-dark)' }}>
      <div className="grid grid-cols-4 gap-[44px] py-[68px] px-[320px] pb-[44px] flex-1 max-[1920px]:gap-8 max-[1920px]:py-16 max-[1920px]:px-8 max-[1536px]:px-6 max-[1280px]:grid-cols-2 max-[1280px]:gap-8 max-[1280px]:py-14 max-[1024px]:gap-6 max-[1024px]:py-12 max-[1024px]:px-5 max-md:grid-cols-1 max-md:gap-6 max-md:py-10 max-md:px-4 max-[640px]:py-8 max-[640px]:px-3 max-[640px]:gap-5">
        {/* Column 1: Brand and Social Media */}
        <div className="flex flex-col">
          <div className="flex flex-col gap-6 max-md:gap-5">
            <div className="mb-3">
              <img 
                src={logoImage} 
                alt="Ex-Students Association Of Textile Engineering College, Barishal (ESAT-B) Logo" 
                className="w-[120px] h-[120px] rounded-full object-cover mb-5 max-[1280px]:w-[100px] max-[1280px]:h-[100px] max-[1024px]:w-[90px] max-[1024px]:h-[90px] max-md:w-[80px] max-md:h-[80px] max-md:mb-4 max-[640px]:w-[70px] max-[640px]:h-[70px]"
              />
            </div>
            <p className="font-['Roboto'] font-normal text-base leading-6 text-white opacity-90 max-w-full max-[1024px]:text-sm max-[640px]:text-xs max-[640px]:leading-5">
              Ex-Students Association Of Textile Engineering College, Barishal (ESAT-B).
            </p>
            <div className="flex gap-3 mt-3 max-md:gap-2 max-[640px]:gap-2">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center text-white transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5 no-underline max-[640px]:w-8 max-[640px]:h-8" aria-label="Facebook">
                <Facebook className="w-5 h-5 max-[640px]:w-4 max-[640px]:h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center text-white transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5 no-underline max-[640px]:w-8 max-[640px]:h-8" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 max-[640px]:w-4 max-[640px]:h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center text-white transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5 no-underline max-[640px]:w-8 max-[640px]:h-8" aria-label="YouTube">
                <Youtube className="w-5 h-5 max-[640px]:w-4 max-[640px]:h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center text-white transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5 no-underline max-[640px]:w-8 max-[640px]:h-8" aria-label="Twitter">
                <Twitter className="w-5 h-5 max-[640px]:w-4 max-[640px]:h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Explore */}
        <div className="flex flex-col">
          <h3 className="font-['Roboto'] font-bold text-xl leading-6 text-white mb-8 capitalize max-[1280px]:text-lg max-[1280px]:mb-6 max-md:text-lg max-md:mb-5 max-[640px]:text-base max-[640px]:mb-4">Explore</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-4 max-md:gap-3">
            <li>
              <Link to="/about" className="flex items-center gap-2 font-['Roboto'] font-normal text-base leading-6 text-white no-underline transition-all duration-200 opacity-90 hover:opacity-100 hover:translate-x-1">
                <ChevronsRight className="w-4 h-4 text-white max-[640px]:w-3.5 max-[640px]:h-3.5" />
                About Us
              </Link>
            </li>
            <li>
              <Link to="/news-events" className="flex items-center gap-2 font-['Roboto'] font-normal text-base leading-6 text-white no-underline transition-all duration-200 opacity-90 hover:opacity-100 hover:translate-x-1">
                <ChevronsRight className="w-4 h-4 text-white max-[640px]:w-3.5 max-[640px]:h-3.5" />
                Upcoming Events
              </Link>
            </li>
            <li>
              <Link to="/news-events" className="flex items-center gap-2 font-['Roboto'] font-normal text-base leading-6 text-white no-underline transition-all duration-200 opacity-90 hover:opacity-100 hover:translate-x-1">
                <ChevronsRight className="w-4 h-4 text-white max-[640px]:w-3.5 max-[640px]:h-3.5" />
                Blog & News
              </Link>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 font-['Roboto'] font-normal text-base leading-6 text-white no-underline transition-all duration-200 opacity-90 hover:opacity-100 hover:translate-x-1">
                <ChevronsRight className="w-4 h-4 text-white max-[640px]:w-3.5 max-[640px]:h-3.5" />
                FAQ Question
              </a>
            </li>
            <li>
              <Link to="/privacy-policy" className="flex items-center gap-2 font-['Roboto'] font-normal text-base leading-6 text-white no-underline transition-all duration-200 opacity-90 hover:opacity-100 hover:translate-x-1">
                <ChevronsRight className="w-4 h-4 text-white max-[640px]:w-3.5 max-[640px]:h-3.5" />
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Useful Links */}
        <div className="flex flex-col">
          <h3 className="font-['Roboto'] font-bold text-xl leading-6 text-white mb-8 capitalize max-[1280px]:text-lg max-[1280px]:mb-6 max-md:text-lg max-md:mb-5 max-[640px]:text-base max-[640px]:mb-4">Useful Links</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-4 max-md:gap-3">
            <li>
              <Link to="/contact" className="flex items-center gap-2 font-['Roboto'] font-normal text-base leading-6 text-white no-underline transition-all duration-200 opacity-90 hover:opacity-100 hover:translate-x-1">
                <ChevronsRight className="w-4 h-4 text-white max-[640px]:w-3.5 max-[640px]:h-3.5" />
                Contact Us
              </Link>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 font-['Roboto'] font-normal text-base leading-6 text-white no-underline transition-all duration-200 opacity-90 hover:opacity-100 hover:translate-x-1">
                <ChevronsRight className="w-4 h-4 text-white max-[640px]:w-3.5 max-[640px]:h-3.5" />
                Job Opportunity
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 font-['Roboto'] font-normal text-base leading-6 text-white no-underline transition-all duration-200 opacity-90 hover:opacity-100 hover:translate-x-1">
                <ChevronsRight className="w-4 h-4 text-white max-[640px]:w-3.5 max-[640px]:h-3.5" />
                Gallery
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 font-['Roboto'] font-normal text-base leading-6 text-white no-underline transition-all duration-200 opacity-90 hover:opacity-100 hover:translate-x-1">
                <ChevronsRight className="w-4 h-4 text-white max-[640px]:w-3.5 max-[640px]:h-3.5" />
                Our Mission
              </a>
            </li>
            <li>
              <Link to="/scholarship" className="flex items-center gap-2 font-['Roboto'] font-normal text-base leading-6 text-white no-underline transition-all duration-200 opacity-90 hover:opacity-100 hover:translate-x-1">
                <ChevronsRight className="w-4 h-4 text-white max-[640px]:w-3.5 max-[640px]:h-3.5" />
                Scholarship
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div className="flex flex-col">
          <h3 className="font-['Roboto'] font-bold text-xl leading-6 text-white mb-8 capitalize max-[1280px]:text-lg max-[1280px]:mb-6 max-md:text-lg max-md:mb-5 max-[640px]:text-base max-[640px]:mb-4">Contact Info</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-5 max-md:gap-4 max-[640px]:gap-4">
            <li className="flex items-start gap-3 font-['Roboto'] font-normal text-base leading-6 text-white opacity-90 max-[1024px]:text-sm max-[640px]:text-xs">
              <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5 max-[640px]:w-3.5 max-[640px]:h-3.5" />
              <span className="flex-1">Hossain Tower, 5th Floor, Sector #7, Uttara, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-start gap-3 font-['Roboto'] font-normal text-base leading-6 text-white opacity-90 max-[1024px]:text-sm max-[640px]:text-xs">
              <Phone className="w-5 h-5 text-white shrink-0 mt-0.5 max-[640px]:w-3.5 max-[640px]:h-3.5" />
              <a href="tel:+8801712631461" className="flex-1 no-underline text-white opacity-90 hover:opacity-100">+880 1712631461</a>
            </li>
            <li className="flex items-start gap-3 font-['Roboto'] font-normal text-base leading-6 text-white opacity-90 max-[1024px]:text-sm max-[640px]:text-xs">
              <Phone className="w-5 h-5 text-white shrink-0 mt-0.5 max-[640px]:w-3.5 max-[640px]:h-3.5" />
              <a href="tel:+8801712631461" className="flex-1 no-underline text-white opacity-90 hover:opacity-100">+880 1712631461</a>
            </li>
            <li className="flex items-start gap-3 font-['Roboto'] font-normal text-base leading-6 text-white opacity-90 max-[1024px]:text-sm max-[640px]:text-xs">
              <Mail className="w-5 h-5 text-white shrink-0 mt-0.5 max-[640px]:w-3.5 max-[640px]:h-3.5" />
              <a href="mailto:info@esatb.org" className="flex-1 no-underline text-white opacity-90 hover:opacity-100">info@esatb.org</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="py-4 px-[320px] text-center w-full max-[1920px]:px-8 max-[1536px]:px-6 max-[1280px]:px-6 max-md:py-3 max-md:px-4 max-md:text-sm max-[640px]:py-2 max-[640px]:px-3" style={{ backgroundColor: 'var(--color-gold)' }}>
        <p className="font-['Roboto'] font-normal text-base leading-6 m-0 max-md:text-sm max-[640px]:text-xs wrap-break-word" style={{ color: 'var(--color-dark)' }}>Copyright 2026 | Design & Development by E3 Innovations Ltd.</p>
      </div>
    </footer>
  )
}
