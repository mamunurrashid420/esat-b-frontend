import { useState } from 'react'
import ভূমিকা from '@/assets/documents/constitution/ভূমিকা.pdf'
import সংগঠনেরনাম from '@/assets/documents/constitution/সংগঠনের নাম, সংজ্ঞাসমূহ, প্রতীক, স্লোগান ও প্রধান কার্যালয় (অনুচ্ছেদঃ ১-৮).pdf'
import লক্ষ্যউদ্দেশ্য from '@/assets/documents/constitution/লক্ষ্য , উদ্দেশ্য ও কার্যাবলি (অনুচ্ছেদঃ ৯-১০).pdf'
import সদস্যচাঁদা from '@/assets/documents/constitution/সদস্য, চাঁদা , আয় ও ব্যয় (অনুচ্ছেদঃ ১১-১৬).pdf'
import সভা from '@/assets/documents/constitution/সভা (অনুচ্ছেদঃ ১৭-১৮).pdf'
import পৃষ্ঠপোষকমণ্ডলী from '@/assets/documents/constitution/পৃষ্ঠপোষকমণ্ডলী , উপদেষ্টামণ্ডলী ও ব্যাচ প্রতিনিধি (অনুচ্ছেদঃ ১৯-২১).pdf'
import নির্বাচন from '@/assets/documents/constitution/নির্বাচন  (অনুচ্ছেদঃ২২-২৫).pdf'
import কার্যনির্বাহী from '@/assets/documents/constitution/কার্যনির্বাহী কমিটির (অনুচ্ছেদঃ২৬-৩৩).pdf'
import তহবিল from '@/assets/documents/constitution/তহবিল ও নিরীক্ষা (অনুচ্ছেদঃ৩৪-৩৮).pdf'
import গঠনতন্ত্রের from '@/assets/documents/constitution/গঠনতন্ত্রের নির্ভরযোগ্য পাঠ, সংশোধন ও অলিখিত বিষয়সমূহ (অনুচ্ছেদঃ ৩৯-৪২.pdf'
import পরিশিষ্টসমূহ from '@/assets/documents/constitution/পরিশিষ্টসমূহ.pdf'

const constitutionItems = [
  {
    id: 1,
    label: 'ভূমিকা',
    pdf: ভূমিকা,
  },
  {
    id: 2,
    label: 'সংগঠনের নাম, সংজ্ঞাসমূহ, প্রতীক, স্লোগান ও প্রধান কার্যালয় (অনুচ্ছেদঃ ১-৮)',
    pdf: সংগঠনেরনাম,
  },
  {
    id: 3,
    label: 'লক্ষ্য , উদ্দেশ্য ও কার্যাবলী (অনুচ্ছেদঃ ৯-১০)',
    pdf: লক্ষ্যউদ্দেশ্য,
  },
  {
    id: 4,
    label: 'সদস্য, চাঁদা , আয় ও বায় (অনুচ্ছেদঃ ১১-১৬)',
    pdf: সদস্যচাঁদা,
  },
  {
    id: 5,
    label: 'সভা (অনুচ্ছেদঃ ১৭-১৮)',
    pdf: সভা,
  },
  {
    id: 6,
    label: 'পৃষ্ঠপোষকমণ্ডলী , উপদেষ্টামণ্ডলী ও ব্যাচ প্রতিনিধি (অনুচ্ছেদঃ ১৯-২১)',
    pdf: পৃষ্ঠপোষকমণ্ডলী,
  },
  {
    id: 7,
    label: 'নির্বাচন  (অনুচ্ছেদঃ২২-২৫)',
    pdf: নির্বাচন,
  },
  {
    id: 8,
    label: 'কার্যনির্বাহী কমিটির (অনুচ্ছেদঃ২৬-৩৩)',
    pdf: কার্যনির্বাহী,
  },
  {
    id: 9,
    label: 'তহবিল ও নিরীক্ষা (অনুচ্ছেদঃ৩৪-৩৮)',
    pdf: তহবিল,
  },
  {
    id: 10,
    label: 'গঠনতন্ত্রের নির্ভরযোগ্য পাঠ, সংশোধন ও অলিখিত বিষয়সমূহ (অনুচ্ছেদঃ ৩৯-৪২)',
    pdf: গঠনতন্ত্রের,
  },
  {
    id: 11,
    label: 'পরিশিষ্টসমূহ',
    pdf: পরিশিষ্টসমূহ,
  },
]

export function Constitution() {
  const [selectedItem, setSelectedItem] = useState(constitutionItems[0])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#3B60C9] text-white px-6 py-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Constitution</h1>
            <p className="text-sm sm:text-base mt-1 opacity-90">
              গঠনতন্ত্র
            </p>
          </div>
          <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[600px]">
            {/* Left Sidebar - Menu Items */}
            <div className="w-full lg:w-80 border-r border-gray-200 bg-white overflow-y-auto">
              <div className="p-4">
                <nav className="space-y-1">
                  {constitutionItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedItem.id === item.id
                          ? 'bg-[#3B60C9] text-white'
                          : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span className={`text-sm font-medium leading-relaxed ${
                        selectedItem.id === item.id ? 'text-white' : 'text-black'
                      }`}>
                        {item.id}. {item.label}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Side - PDF Viewer */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 sm:p-6 flex-1 overflow-hidden">
                <div className="w-full h-full border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <iframe
                    src={selectedItem.pdf}
                    className="w-full h-full"
                    title={selectedItem.label}
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <a
                    href={selectedItem.pdf}
                    download={`${selectedItem.label}.pdf`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
