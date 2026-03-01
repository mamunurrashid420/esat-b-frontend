import { useEffect } from 'react'

export function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-4xl">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <p className="text-sm md:text-base font-semibold" style={{ color: '#999898' }}>
            Privacy Policy
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight" style={{ color: '#021E40' }}>
            Ex-Students Association Of Textile Engineering College, Barishal (ESAT-B) Privacy Policy
          </h1>
          <p className="text-sm md:text-base mt-2" style={{ color: '#696868' }}>
            Effective Date: <span className="font-semibold">17TH January, 2026</span>
          </p>
        </div>

        {/* Introduction */}
        <div className="mt-4">
          <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            This Privacy Policy explains how Ex-Students Association Of Textile Engineering College, Barishal (ESAT-B) collects, uses, stores, and protects personal information of its members, event participants, and other related individuals.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: '#021E40' }}>
            1. Information We Collect
          </h2>
          <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            The Association may collect the following information:
          </p>
          <ul className="list-disc pl-6 md:pl-8 space-y-2 text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            <li>Full name, Father's & Mother's Name, Gender, Blood group & T-shirt Size</li>
            <li>Batch / passing year, student's proof copy & Highest educational degree</li>
            <li>Phone number, email address, Present & Permanent address</li>
            <li>Professional and organizational information</li>
            <li>Event registration details</li>
            <li>Payment-related information (such as payment method and transaction ID)</li>
            <li>Any other information voluntarily provided by the user</li>
          </ul>
        </div>

        {/* Section 2: Purpose of Data Collection */}
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: '#021E40' }}>
            2. Purpose of Data Collection
          </h2>
          <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            The collected information is used for the following purposes:
          </p>
          <ul className="list-disc pl-6 md:pl-8 space-y-2 text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            <li>Managing alumni membership records</li>
            <li>Organizing alumni events and activities</li>
            <li>Verifying event registration fees and payments</li>
            <li>Communicating notices, updates, and announcements</li>
            <li>Internal analysis and organizational development</li>
          </ul>
        </div>

        {/* Section 3: Use and Sharing of Information */}
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: '#021E40' }}>
            3. Use and Sharing of Information
          </h2>
          <ul className="list-disc pl-6 md:pl-8 space-y-2 text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            <li>The Association does not sell, rent, or trade personal information to third parties.</li>
            <li>Personal information is accessed only by authorized Association officials or event committee members on a need-to-know basis.</li>
            <li>Information may be disclosed if required by law or legal authorities.</li>
          </ul>
        </div>

        {/* Section 4: Data Security */}
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: '#021E40' }}>
            4. Data Security
          </h2>
          <ul className="list-disc pl-6 md:pl-8 space-y-2 text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            <li>Personal data is stored securely using digital platforms such as Google Forms, Google Sheets, or other approved systems.</li>
            <li>Reasonable administrative and technical measures are taken to protect data from unauthorized access, misuse, alteration, or disclosure.</li>
          </ul>
        </div>

        {/* Section 5: Payment Information */}
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: '#021E40' }}>
            5. Payment Information
          </h2>
          <ul className="list-disc pl-6 md:pl-8 space-y-2 text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            <li>The Association does not collect sensitive financial information such as card numbers, PINs, or OTPs.</li>
            <li>Only necessary payment details (e.g., payment method and transaction ID) are collected for verification purposes.</li>
          </ul>
        </div>

        {/* Section 6: Rights of Members and Participants */}
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: '#021E40' }}>
            6. Rights of Members and Participants
          </h2>
          <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            Members and participants have the right to:
          </p>
          <ul className="list-disc pl-6 md:pl-8 space-y-2 text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            <li>Request correction or update of their personal information</li>
            <li>Request deletion of their personal data, subject to organizational and legal requirements</li>
            <li>Opt out of non-essential communications from the Association</li>
          </ul>
        </div>

        {/* Section 7: Cookies and Online Tracking */}
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: '#021E40' }}>
            7. Cookies and Online Tracking (If Applicable)
          </h2>
          <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            Limited use of cookies may occur solely to improve user experience and website functionality.
          </p>
        </div>

        {/* Section 8: Policy Updates */}
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: '#021E40' }}>
            8. Policy Updates
          </h2>
          <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            The Association reserves the right to update or modify this Privacy Policy at any time. Any changes will be communicated through official channels or published on the Association's website.
          </p>
        </div>

        {/* Section 9: Contact Information */}
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: '#021E40' }}>
            9. Contact Information
          </h2>
          <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            For questions, concerns, or requests regarding this Privacy Policy, please contact:
          </p>
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200 mt-2">
            <ul className="space-y-3 text-sm md:text-base leading-relaxed" style={{ color: '#696868' }}>
              <li>
                <span className="font-semibold" style={{ color: '#021E40' }}>Email:</span> info@esatb.org
              </li>
              <li>
                <span className="font-semibold" style={{ color: '#021E40' }}>Call:</span> +880 1712631461
              </li>
              <li>
                <span className="font-semibold" style={{ color: '#021E40' }}>Office Address:</span> Hossain Tower, 5th Floor, Sector #7, Uttara, Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        {/* Consent Section */}
        <div className="flex flex-col gap-4 mt-8">
          <div className="bg-blue-50 p-4 md:p-6 rounded-lg border-l-4" style={{ borderLeftColor: '#3B60C9' }}>
            <h3 className="text-lg md:text-xl font-semibold mb-3" style={{ color: '#021E40' }}>
              Consent
            </h3>
            <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
              By registering as a member, submitting information, or participating in any Association event, you acknowledge that you have read, understood, and agreed to this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
