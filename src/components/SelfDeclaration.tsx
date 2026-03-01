import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/api/client'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import type { MemberType } from '@/types/api'

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const selfDeclarationSchema = z.object({
  name: z.string().min(1, 'নাম আবশ্যক'),
  signature_file: z.any().optional(), // Validated manually in onSubmit
  secondary_member_type_id: z.number().min(1, 'পদবী নির্বাচন করুন'),
  date: z.string().min(1, 'তারিখ নির্বাচন করুন'),
  template_name: z.string().optional(),
  template_designation: z.string().optional(),
  template_member_number: z.string().optional(),
})

type SelfDeclarationFormData = z.infer<typeof selfDeclarationSchema>

export function SelfDeclaration() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [memberTypes, setMemberTypes] = useState<MemberType[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const user = useAuthStore((state) => state.user)
  const hasLoadedData = useRef(false)
  const hasFetchedUser = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SelfDeclarationFormData>({
    resolver: zodResolver(selfDeclarationSchema),
  })
  const selectedMemberTypeId = watch('secondary_member_type_id')
  const formName = watch('name') || ''
  
  // Template field values
  const templateName = watch('template_name') || ''
  const templateDesignation = watch('template_designation') || ''
  const templateMemberNumber = watch('template_member_number') || ''
  
  // Debounced values for template fields (300ms delay)
  const debouncedTemplateName = useDebounce(templateName, 300)
  const debouncedTemplateDesignation = useDebounce(templateDesignation, 300)
  
  // Sync template name to form name field (only if form field is empty)
  useEffect(() => {
    if (debouncedTemplateName && !formName) {
      setValue('name', debouncedTemplateName, { shouldValidate: false })
    }
  }, [debouncedTemplateName, formName, setValue])
  
  // Sync form name to template (bidirectional sync)
  useEffect(() => {
    if (formName && !templateName) {
      setValue('template_name', formName, { shouldValidate: false })
    }
  }, [formName, templateName, setValue])
  
  // Auto-fill designation from template (try to match member type)
  useEffect(() => {
    if (debouncedTemplateDesignation && !selectedMemberTypeId && memberTypes.length > 0) {
      // Try to find matching member type by name
      const matchingType = memberTypes.find(
        (type) => type.name.toLowerCase().includes(debouncedTemplateDesignation.toLowerCase()) ||
                  debouncedTemplateDesignation.toLowerCase().includes(type.name.toLowerCase())
      )
      if (matchingType) {
        setValue('secondary_member_type_id', matchingType.id, { shouldValidate: false })
        // Also update template designation to match the selected type
        setValue('template_designation', matchingType.name, { shouldValidate: false })
      }
    }
  }, [debouncedTemplateDesignation, selectedMemberTypeId, memberTypes, setValue])
  
  // Sync selected member type to template designation
  useEffect(() => {
    if (selectedMemberTypeId && memberTypes.length > 0) {
      const selectedType = memberTypes.find(type => type.id === selectedMemberTypeId)
      if (selectedType && selectedType.name !== templateDesignation) {
        setValue('template_designation', selectedType.name, { shouldValidate: false })
      }
    }
  }, [selectedMemberTypeId, memberTypes, templateDesignation, setValue])

  // Load member types once on mount
  useEffect(() => {
    if (hasLoadedData.current) return
    
    const loadMemberTypes = async () => {
      hasLoadedData.current = true
      try {
        setLoadingTypes(true)
        const response = await apiClient.getMemberTypes()
        setMemberTypes(response.data)
      } catch (error: any) {
        toast.error('সদস্য প্রকার লোড করতে ব্যর্থ হয়েছে')
        console.error('Error loading member types:', error)
      } finally {
        setLoadingTypes(false)
      }
    }

    loadMemberTypes()
  }, [])

  // Always refetch user when visiting this page to get fresh latest_self_declaration status
  // (e.g. after admin approves/rejects - persisted store would otherwise have stale data)
  useEffect(() => {
    if (!apiClient.isAuthenticated()) return
    if (hasFetchedUser.current) return

    hasFetchedUser.current = true
    useAuthStore.getState().fetchUser().catch((error) => {
      console.error('Error fetching user:', error)
      hasFetchedUser.current = false
    })
  }, [])

  // Refresh user data after successful submission to get updated self-declaration
  useEffect(() => {
    if (success) {
      useAuthStore.getState().fetchUser().catch((error) => {
        console.error('Error refreshing user:', error)
      })
    }
  }, [success])

  // Check if user already has secondary member type (only show once)
  useEffect(() => {
    if (user?.secondary_member_type_id && !success) {
      // Only show toast if we haven't already shown success message
      toast.info('আপনার ইতিমধ্যে একটি সেকেন্ডারি সদস্য প্রকার নির্ধারিত রয়েছে')
    }
  }, [user?.secondary_member_type_id, success])

  // Pre-populate member number from user data
  useEffect(() => {
    if (user?.member_id && !templateMemberNumber) {
      setValue('template_member_number', user.member_id, { shouldValidate: false })
    }
  }, [user?.member_id, templateMemberNumber, setValue])

  const onSubmit = async (data: SelfDeclarationFormData) => {
    if (user?.secondary_member_type_id) {
      toast.error('আপনার ইতিমধ্যে একটি সেকেন্ডারি সদস্য প্রকার নির্ধারিত রয়েছে')
      return
    }

    // Check if user already has a pending self-declaration
    if (user?.latest_self_declaration?.status === 'PENDING') {
      toast.error('আপনার একটি স্ব-ঘোষণাপত্র ইতিমধ্যে পর্যালোচনার অপেক্ষায় রয়েছে')
      return
    }

    // Validate signature file
    if (!signatureFile) {
      toast.error('অনুগ্রহ করে একটি স্বাক্ষর ফাইল নির্বাচন করুন')
      setValue('signature_file', {} as File, { shouldValidate: true })
      return
    }

    // Validate file size and type
    if (signatureFile.size > 2 * 1024 * 1024) {
      toast.error('সই ফাইল 2MB এর বেশি হতে পারবে না')
      return
    }

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(signatureFile.type)) {
      toast.error('শুধুমাত্র JPG, JPEG বা PNG ফাইল গ্রহণযোগ্য')
      return
    }

    try {
      setLoading(true)
      await apiClient.submitSelfDeclaration({
        name: data.name,
        signature_file: signatureFile,
        secondary_member_type_id: data.secondary_member_type_id,
        date: data.date,
      })
      setSuccess(true)
      setSignatureFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      toast.success('স্ব-ঘোষণাপত্র সফলভাবে জমা দেওয়া হয়েছে')
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'স্ব-ঘোষণাপত্র জমা দিতে ব্যর্থ হয়েছে'
      toast.error(errorMessage)
      console.error('Error submitting self-declaration:', error)
    } finally {
      setLoading(false)
    }
  }

  // Check if user already has a secondary member type
  if (user?.secondary_member_type_id) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-black mb-2">
            ইতিমধ্যে সেকেন্ডারি সদস্য প্রকার নির্ধারিত
          </h2>
          <p className="text-black">
            আপনার ইতিমধ্যে একটি সেকেন্ডারি সদস্য প্রকার নির্ধারিত রয়েছে। নতুন স্ব-ঘোষণাপত্র জমা দেওয়ার প্রয়োজন নেই।
          </p>
        </div>
      </div>
    )
  }

  // Check if user has a pending self-declaration
  if (user?.latest_self_declaration?.status === 'PENDING') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-black mb-2">
            স্ব-ঘোষণাপত্র পর্যালোচনার অপেক্ষায়
          </h2>
          <p className="text-black mb-4">
            আপনার একটি স্ব-ঘোষণাপত্র ইতিমধ্যে জমা দেওয়া হয়েছে এবং এটি প্রশাসক কর্তৃক পর্যালোচনার অপেক্ষায় রয়েছে। 
            পর্যালোচনা সম্পন্ন হলে আপনাকে অবহিত করা হবে।
          </p>
          {user.latest_self_declaration.date && (
            <p className="text-sm text-black/70">
              জমা দেওয়ার তারিখ: {new Date(user.latest_self_declaration.date).toLocaleDateString('bn-BD')}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-black mb-2">
            স্ব-ঘোষণাপত্র সফলভাবে জমা দেওয়া হয়েছে
          </h2>
          <p className="text-black mb-4">
            আপনার স্ব-ঘোষণাপত্র সফলভাবে জমা দেওয়া হয়েছে। প্রশাসক কর্তৃক পর্যালোচনার পর আপনাকে অবহিত করা হবে।
          </p>
        </div>
      </div>
    )
  }

  const hasRejectedDeclaration = user?.latest_self_declaration?.status === 'REJECTED'

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Show warning if previous declaration was rejected */}
      {hasRejectedDeclaration && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-black mb-1">
                পূর্ববর্তী স্ব-ঘোষণাপত্র প্রত্যাখ্যান করা হয়েছে
              </h3>
              <p className="text-sm text-black mb-2">
                আপনার পূর্ববর্তী স্ব-ঘোষণাপত্র প্রত্যাখ্যান করা হয়েছে। আপনি একটি নতুন স্ব-ঘোষণাপত্র জমা দিতে পারেন।
              </p>
              {user.latest_self_declaration.rejected_reason && (
                <div className="mt-2 p-3 bg-white rounded border border-red-200">
                  <p className="text-xs font-semibold text-black mb-1">প্রত্যাখ্যানের কারণ:</p>
                  <p className="text-xs text-black">{user.latest_self_declaration.rejected_reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">
            স্ব-ঘোষণাপত্র (Self-Declaration Form)
          </h1>
          <p className="text-sm text-black">
            টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ, বরিশাল প্রাক্তন ছাত্র সমিতি (ইএসএটি-বি)
          </p>
        </div>

        {/* Declaration Text */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-4 text-sm text-black leading-relaxed">
            <p className="font-semibold mb-4 leading-relaxed flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span>আমি,</span>
              <Input
                type="text"
                value={templateName}
                onChange={(e) => setValue('template_name', e.target.value, { shouldValidate: false })}
                className="inline-flex min-w-[180px] max-w-[220px] h-7 px-2 py-0 text-sm text-black bg-transparent border-0 border-b-2 border-gray-400 rounded-none focus:border-gray-600 focus-visible:ring-0 focus-visible:outline-none shadow-none"
                placeholder="নাম"
              />
              <span>পদবি</span>
              <Input
                type="text"
                value={templateDesignation}
                onChange={(e) => setValue('template_designation', e.target.value, { shouldValidate: false })}
                className="inline-flex min-w-[180px] max-w-[220px] h-7 px-2 py-0 text-sm text-black bg-transparent border-0 border-b-2 border-gray-400 rounded-none focus:border-gray-600 focus-visible:ring-0 focus-visible:outline-none shadow-none"
                placeholder="পদবি"
              />
              <span>সদস্য নম্বর</span>
              <Input
                type="text"
                value={templateMemberNumber}
                onChange={(e) => setValue('template_member_number', e.target.value, { shouldValidate: false })}
                disabled={!!user?.member_id}
                className="inline-flex min-w-[120px] max-w-[160px] h-7 px-2 py-0 text-sm text-black bg-transparent border-0 border-b-2 border-gray-400 rounded-none focus:border-gray-600 focus-visible:ring-0 focus-visible:outline-none shadow-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100"
                placeholder="সদস্য নম্বর"
              />
              <span>টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ, বরিশাল প্রাক্তন ছাত্র সমিতি (ইএসএটি-বি) এর নির্বাহী কমিটির একজন সদস্য হিসেবে দায়িত্ব গ্রহণ করছি এবং সম্পূর্ণ সততার সাথে নিম্নোক্ত অঙ্গীকারসমূহ করছি:</span>
            </p>

            <div className="space-y-3 ml-4">
              <p>
                <span className="font-semibold">ক)</span> বিদ্যালয় ও সংগঠনের স্বার্থকে সর্বোচ্চ অগ্রাধিকার দেব এবং সংগঠনের গঠনতন্ত্র, নীতিমালা ও সিদ্ধান্ত যথাযথভাবে মেনে চলবো।
              </p>
              <p>
                <span className="font-semibold">খ)</span> দায়িত্ব পালনের ক্ষেত্রে জাত, লিঙ্গ, ধর্ম, বর্ণ, পেশা, মতাদর্শ, ভৌগোলিক বা সামাজিক পরিচয় নির্বিশেষে সকলের প্রতি সমান ও ন্যায়সঙ্গত আচরণ করবো।
              </p>
              <p>
                <span className="font-semibold">গ)</span> ব্যক্তিগত, পারিবারিক, গোষ্ঠীগত বা রাজনৈতিক স্বার্থে সংগঠনের পদ বা প্রভাব ব্যবহার করবো না এবং স্বার্থের সংঘাত (Conflict of Interest) এড়িয়ে চলবো।
              </p>
              <p>
                <span className="font-semibold">ঘ)</span> সকল কার্যক্রমে স্বচ্ছতা, জবাবদিহিতা ও নৈতিকতা বজায় রাখবো এবং আর্থিক অনিয়ম, দুর্নীতি, তহবিলের অপব্যবহার ও ক্ষমতার অপব্যবহারের বিরুদ্ধে অবস্থান করবো।
              </p>
              <p>
                <span className="font-semibold">ঙ)</span> সংগঠনের সম্মান, ঐক্য ও সুনাম রক্ষায় সচেষ্ট থাকবো এবং বিভেদ, অসদাচরণ, হয়রানি, মানহানিকর বা অশালীন আচরণ, মিথ্যা তথ্য ছড়ানো (অনলাইন/অফলাইন) থেকে বিরত থাকবো।
              </p>
            </div>

            <p className="mt-4">
              উপরোক্ত ঘোষণার কোনো অংশ ভঙ্গ করলে সংগঠনের গঠনতন্ত্র অনুযায়ী শৃঙ্খলামূলক ব্যবস্থা গ্রহণ করা হতে পারে—যা আমি মেনে নিতে বাধ্য থাকবো। আমি এ ঘোষণা পূর্ণ বিবেচনা ও স্বেচ্ছায় প্রদান করলাম।
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
              নাম <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="আপনার নাম লিখুন"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Signature File Upload */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              স্বাক্ষর <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-black">
                  <label
                    htmlFor="signature_file"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>ফাইল আপলোড করুন</span>
                    <input
                      id="signature_file"
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSignatureFile(file)
                          setValue('signature_file', file, { shouldValidate: true })
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">বা ড্র্যাগ করুন</p>
                </div>
                <p className="text-xs text-black">PNG, JPG, JPEG (সর্বোচ্চ 2MB)</p>
                {signatureFile && (
                  <p className="text-sm text-black mt-2">
                    নির্বাচিত: {signatureFile.name}
                  </p>
                )}
              </div>
            </div>
            {errors.signature_file && (
              <p className="mt-1 text-sm text-red-600">
                {typeof errors.signature_file.message === 'string' ? errors.signature_file.message : 'অনুগ্রহ করে একটি স্বাক্ষর ফাইল নির্বাচন করুন'}
              </p>
            )}
          </div>

          {/* Designation/Post Field */}
          <div>
            <label
              htmlFor="secondary_member_type_id"
              className="block text-sm font-medium text-black mb-2"
            >
              পদবী <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedMemberTypeId?.toString() || ''}
              onValueChange={(value) => {
                setValue('secondary_member_type_id', parseInt(value), { shouldValidate: true })
              }}
            >
              <SelectTrigger
                id="secondary_member_type_id"
                className={errors.secondary_member_type_id ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="পদবী নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {loadingTypes ? (
                  <SelectItem value="loading" disabled>
                    লোড হচ্ছে...
                  </SelectItem>
                ) : (
                  memberTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.secondary_member_type_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.secondary_member_type_id.message}
              </p>
            )}
          </div>

          {/* Date Field */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-black mb-2">
              তারিখ <span className="text-red-500">*</span>
            </label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              className={errors.date ? 'border-red-500' : ''}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="min-w-[150px]">
              {loading ? 'জমা দেওয়া হচ্ছে...' : 'জমা দিন'}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-black text-center">
          <p>Address: Hossain Tower, 5th Floor, Sector #7, Uttara, Dhaka, Bangladesh</p>
          <p>Contact: +880 1712631461</p>
          <p>Web: www.esatb.org</p>
          <p>Email: info@esatb.org</p>
        </div>
      </div>
    </div>
  )
}
