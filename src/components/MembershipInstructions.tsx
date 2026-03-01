import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function MembershipInstructions() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm md:text-base font-semibold" style={{ color: '#999898' }}>
            Instructions to apply for membership
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight" style={{ color: '#021E40' }}>
            Instructions to fill the Membership Form
          </h1>
        </div>

        <div className="flex flex-col gap-6 md:gap-8 mt-4">
          <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
            Please read the following instructions carefully before filling out the ESAT-B Membership Form-
          </p>

          <div className="flex flex-col gap-4 md:gap-5">
            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                <strong>a)</strong> This form is only for the former students and eligible individuals who wish to become members of the Ex-Students Association Of Textile Engineering College, Barishal (ESAT-B).
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                <strong>b)</strong> Select the appropriate membership type (General, Lifetime or Associate) and ensure that the correct fee is paid accordingly before filling this form:
              </p>
              <div className="ml-4 md:ml-6 mt-2 flex flex-col gap-2">
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>i)</strong> <strong>General Members:</strong> Former students who passed at least class eight/JSC or SSC/Matric from Textile Engineering College, Barishal. Yearly subscription for general member is 500/- (five hundred) taka only.
                </p>
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>ii)</strong> <strong>Lifetime Members:</strong> Former students who passed at least class eight/JSC or SSC/Matric from Textile Engineering College, Barishal. A one-time subscription for lifetime members is 10,000/- (ten thousand) taka.
                </p>
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>iii)</strong> <strong>Associate Members:</strong> Former students who were admitted to any class of Textile Engineering College, Barishal. Yearly subscription for associate member is 300/- (three hundred) taka only.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                <strong>c)</strong> All fields marked with an asterisk (*) are mandatory and must be filled correctly and completely.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                <strong>d)</strong> Applicants must provide accurate personal, academic, and contact information. Any false or incomplete information may result in rejection or cancellation of membership.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                <strong>e)</strong> You must upload/attach your JSC/SSC/Equivalent Certificate or Marksheet with proof of payment where required.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                <strong>f)</strong> Membership fees once paid are non-refundable and non-transferable, even in case of rejection, cancellation, or voluntary withdrawal.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                <strong>g)</strong> Ensure that your mobile number and email address are active as all official communications will be made through these.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                <strong>h)</strong> Submission of this form does not automatically confirm your membership. Membership will be effective only after verification and approval by the ESAT-B authority.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                <strong>i)</strong> By submitting this form, you agree to abide by the constitution, rules, and regulations of ESAT-B.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                <strong>j)</strong> Please review all information carefully before final submission.
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-[#3B60C9]">
            <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
              <strong>Note:</strong> Membership number will be sent by the admin panel of the registration to the contact number/e-mail of the alumni upon reviewing the provided information in the form and receipt of actual payments.
            </p>
          </div>

          {/* Call to Action Button */}
          <div className="mt-8 flex justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-[#3B60C9] hover:bg-[#3B60C9]/90 text-white px-8 py-6 text-base md:text-lg font-semibold"
              >
                Apply for Membership Now
              </Button>
            </Link>
          </div>

          {/* Bengali Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ color: '#021E40' }}>
              সদস্যপদ ফরম পূরণের নির্দেশনাবলী
            </h2>
            <p className="text-sm md:text-base leading-relaxed md:leading-[26px] mb-6" style={{ color: '#696868' }}>
              টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ, বরিশাল প্রাক্তন ছাত্র সমিতি (ইএসএটি-বি) এর সদস্যপদ ফরম পূরণ করার পূর্বে অনুগ্রহ করে নিচের নির্দেশনাগুলো মনোযোগসহকারে পড়ুন-
            </p>

            <div className="flex flex-col gap-4 md:gap-5">
              <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>ক)</strong> এই ফরমটি শুধুমাত্র যারা টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ, বরিশাল প্রাক্তন ছাত্র সমিতি (ইএসএটি-বি)-এর সদস্য হতে ইচ্ছুক এমন যোগ্য প্রাক্তন শিক্ষার্থীদের জন্য প্রযোজ্য।
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>খ)</strong> এই ফর্মটি পূরণ করার আগে উপযুক্ত সদস্যপদ (সাধারণ, আজীবন বা সহযোগী) নির্বাচন করুন এবং সে অনুযায়ী ফি প্রদান নিশ্চিৎ করুন:
                </p>
                <div className="ml-4 md:ml-6 mt-2 flex flex-col gap-2">
                  <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                    <strong>i)</strong> <strong>সাধারণ সদস্য (General Member):</strong> প্রাক্তন শিক্ষার্থীদের মধ্যে যারা টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ, বরিশাল থেকে কমপক্ষে অষ্টম শ্রেণি/JSC অথবা SSC/ম্যাট্রিক পাশ করেছেন। সাধারণ সদস্যদের বার্ষিক চাঁদা ৫০০/- (পাঁচশত) টাকা মাত্র।
                  </p>
                  <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                    <strong>ii)</strong> <strong>আজীবন সদস্য (Lifetime Member):</strong> প্রাক্তন শিক্ষার্থীদের মধ্যে যারা টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ, বরিশাল থেকে কমপক্ষে অষ্টম শ্রেণি/JSC অথবা SSC/ম্যাট্রিক পাশ করেছেন। আজীবন সদস্যদের জন্য এককালীন চাঁদা ১০,০০০/- (দশ হাজার) টাকা মাত্র।
                  </p>
                  <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                    <strong>iii)</strong> <strong>সহযোগী সদস্য (Associate Member):</strong> প্রাক্তন শিক্ষার্থী যারা জাহাপুর মাধ্যমিক বিদ্যালয়ের যেকোনো শ্রেণিতে অধ্যয়ন করেছেন। সহযোগী সদস্যদের বার্ষিক চাঁদা ৩০০/- (তিনশত) টাকা মাত্র।
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>গ)</strong> ফরমে তারকাচিহ্নত (*) তথ্য সমূহ আবশ্যিকভাবে পূরণ করতে হবে।
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>ঘ)</strong> আবেদনকারীকে ব্যক্তিগত, শিক্ষাগত ও যোগাযোগ সংক্রান্ত সকল তথ্য সঠিকভাবে প্রদান করতে হবে। কোনো ভুল বা অসম্পূর্ণ তথ্যের কারণে সদস্যপদ বাতিল বা প্রত্যাখ্যাত হতে পারে।
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>ঙ)</strong> আবেদনকারীকে JSC/SSC/সমমান সনদ বা মার্কশিট এবং ফি পরিশোধের প্রমাণপত্র আবশ্যিকভাবে সংযুক্ত করতে হবে।
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>চ)</strong> পরিশোধিত সদস্য ফি ফেরতযোগ্য বা হস্তান্তরযোগ্য নয়, এমনকি সদস্যপদ প্রত্যাখ্যান, বাতিল বা স্বেচ্ছায় প্রত্যাহারের ক্ষেত্রেও নয়।
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>ছ)</strong> আবেদনকারীর প্রদত্ত মোবাইল নম্বর ও ই-মেইল ঠিকানা অবশ্যই সচল থাকতে হবে, কারণ সকল আনুষ্ঠানিক যোগাযোগ এই মাধ্যমেই করা হবে।
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>জ)</strong> এই ফরম জমা দেওয়ার মাধ্যমে আবেদনকারী টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ, বরিশাল প্রাক্তন ছাত্র সমিতি (ইএসএটি-বি) এর গঠনতন্ত্র, নিয়মাবলি ও বিধি-বিধান মেনে চলতে সম্মত বলে বিবেচিত হবেন।
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>ঝ)</strong> এই ফরম জমা দেওয়া মানেই সদস্যপদ চূড়ান্ত নয়। তথ্য যাচাই ও কর্তৃপক্ষের অনুমোদনের পরই সদস্যপদ কার্যকর হবে।
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                  <strong>ঞ)</strong> চূড়ান্তভাবে জমা দেওয়ার পূর্বে অনুগ্রহ করে ফরমে প্রদত্ত সমস্ত তথ্য ভালোভাবে যাচাই করুন।
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-[#3B60C9]">
              <p className="text-sm md:text-base leading-relaxed md:leading-[26px]" style={{ color: '#696868' }}>
                <strong>***</strong> ফরমে প্রদত্ত তথ্য যাচাই এবং প্রকৃত অর্থ পরিশোধ নিশ্চিত হওয়ার পর, নিবন্ধনের অ্যাডমিন প্যানেল থেকে আবেদনকারীর মোবাইল নম্বর বা ই-মেইল ঠিকানায় সদস্য নম্বর (Membership Number) প্রেরণ করা হবে।
              </p>
            </div>
          </div>

          {/* Bengali Call to Action Button */}
          <div className="mt-8 flex justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-[#3B60C9] hover:bg-[#3B60C9]/90 text-white px-8 py-6 text-base md:text-lg font-semibold"
              >
                এখনই সদস্যপদের জন্য আবেদন করুন
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
