import { useRef, useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Upload, Star, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react'
import logoImage from '@/assets/alumni/logo.png'
import { apiClient } from '@/api/client'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { toast } from 'sonner'

// Zod schema for form validation
const registrationSchema = z.object({
  membershipType: z.union([z.string(), z.undefined()]).refine((val) => val && val.trim() !== '' && ['general', 'lifetime', 'associate'].includes(val), {
    message: 'Please select a membership type',
  }),
  fullName: z.string().min(1, 'Full name is required').min(2, 'Full name must be at least 2 characters long'),
  nameBangla: z.string().min(1, 'Name in Bangla is required'),
  fatherName: z.string().min(1, "Please enter your father's name"),
  motherName: z.string().optional(),
  gender: z.union([z.string(), z.undefined()]).refine((val) => val && val.trim() !== '' && ['male', 'female', 'other'].includes(val), {
    message: 'Please select your gender',
  }),
  jscYear: z.string().optional(),
  sscYear: z.string().optional(),
  studentshipProofType: z.string().refine((val) => !val || val === 'studentship_certificate', {
    message: 'Please select a valid studentship proof type',
  }).optional(),
  highestEducationalDegree: z.string().optional(),
  presentAddress: z.string().min(1, 'Please enter your present address'),
  permanentAddress: z.string().min(1, 'Please enter your permanent address'),
  email: z.union([z.string().email('Please enter a valid email address'), z.literal('')]).optional(),
  mobileNumber: z.string()
    .min(1, 'Mobile number is required')
    .refine((val) => {
      const nums = val.replace(/[^0-9]/g, '')
      if (nums.length === 13 && nums.startsWith('880')) {
        return true
      }
      return nums.length === 11
    }, 'Mobile number must be 11 digits (e.g., 017XXXXXXXX)'),
  profession: z.string().min(1, 'Please enter your profession'),
  designation: z.string().optional(),
  instituteName: z.string().optional(),
  tShirtSize: z.union([z.string(), z.undefined()]).refine((val) => val && val.trim() !== '' && ['xxxl', 'xxl', 'xl', 'l', 'm', 's'].includes(val), {
    message: 'Please select your T-shirt size',
  }),
  bloodGroup: z.union([z.string(), z.undefined()]).refine((val) => val && val.trim() !== '' && ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val), {
    message: 'Please select your blood group',
  }),
  entryFee: z.string().optional(),
  paymentYears: z.union([z.string(), z.undefined()]).refine((val) => val && val.trim() !== '', {
    message: 'Please select the number of years for payment',
  }),
  yearlyFee: z.string().min(1, 'Yearly fee is required'),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Please accept the terms and conditions to continue',
  }),
  studentshipProofFile: z.union([z.instanceof(File), z.undefined()]).refine((val) => val instanceof File, {
    message: 'Please upload your studentship proof copy',
  }),
  paymentReceiptFile: z.union([z.instanceof(File), z.undefined()]).refine((val) => val instanceof File, {
    message: 'Please upload your payment receipt',
  }),
  photo: z.union([z.instanceof(File), z.undefined()]).refine((val) => val instanceof File, {
    message: 'Please upload a formal photo of yourself',
  }),
  signature: z.union([z.instanceof(File), z.undefined()]).refine((val) => val instanceof File, {
    message: 'Please upload your signature',
  }),
}).superRefine((data, ctx) => {
  // For general and lifetime members: SSC year is required
  if (data.membershipType === 'general' || data.membershipType === 'lifetime') {
    if (!data.sscYear || data.sscYear.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'SSC year of passing is required',
        path: ['sscYear'],
      })
    }
  }
  // For associate members: year of passing is required
  if (data.membershipType === 'associate') {
    if (!data.jscYear || data.jscYear.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Year of passing is required',
        path: ['jscYear'],
      })
    }
  }
})

type RegistrationFormData = z.infer<typeof registrationSchema>

interface FormErrors {
  [key: string]: string[]
}

export function Registration() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiErrors, setApiErrors] = useState<FormErrors>({})
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  useEffect(() => {
    apiClient.getAuthPage().then((res) => setBackgroundImage(res.data.background_image)).catch(() => {})
  }, [])

  const studentshipProofFileInputRef = useRef<HTMLInputElement>(null)
  const paymentReceiptFileInputRef = useRef<HTMLInputElement>(null)
  const photoFileInputRef = useRef<HTMLInputElement>(null)
  const signatureFileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      membershipType: undefined,
      fullName: '',
      nameBangla: '',
      fatherName: '',
      motherName: '',
      gender: undefined,
      jscYear: '',
      sscYear: '',
      studentshipProofType: 'studentship_certificate',
      highestEducationalDegree: '',
      presentAddress: '',
      permanentAddress: '',
      email: '',
      mobileNumber: '',
      profession: '',
      designation: '',
      instituteName: '',
      tShirtSize: undefined,
      bloodGroup: undefined,
      entryFee: '',
      paymentYears: '',
      paymentMethod: '',
      yearlyFee: '',
      termsAccepted: false,
      studentshipProofFile: undefined,
      paymentReceiptFile: undefined,
      photo: undefined,
      signature: undefined,
    },
  })

  const membershipType = watch('membershipType')
  const yearlyFee = watch('yearlyFee')
  const paymentMethod = watch('paymentMethod')
  const paymentYears = watch('paymentYears')
  const studentshipProofFile = watch('studentshipProofFile')
  const paymentReceiptFile = watch('paymentReceiptFile')
  const photo = watch('photo')
  const signature = watch('signature')

  // Auto-populate yearly fee and entry fee with 1 year of membership fee based on membership type
  useEffect(() => {
    if (membershipType) {
      let feeValue = ''
      switch (membershipType) {
        case 'general':
          feeValue = '500'
          break
        case 'lifetime':
          feeValue = '10000'
          break
        case 'associate':
          feeValue = '300'
          break
        default:
          feeValue = ''
      }
      setValue('yearlyFee', feeValue)
      setValue('entryFee', feeValue)
    } else {
      setValue('yearlyFee', '')
      setValue('entryFee', '')
    }
  }, [membershipType, setValue])

  // File validation helper
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 5 * 1024 * 1024 // 5 MB in bytes
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size is too large. Please upload a file smaller than 5 MB' }
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload a PDF, JPG, JPEG, or PNG file' }
    }
    
    return { valid: true }
  }

  // Image validation helper (for photo and signature)
  const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 5 * 1024 * 1024 // 5 MB in bytes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size is too large. Please upload a file smaller than 5 MB' }
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload a JPG, JPEG, or PNG image' }
    }
    
    return { valid: true }
  }

  const handleStudentshipProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validation = validateFile(file)
      if (validation.valid) {
        setValue('studentshipProofFile', file, { shouldValidate: true })
        setApiErrors((prev: FormErrors) => {
          const newErrors = { ...prev }
          delete newErrors.studentship_proof_file
          return newErrors
        })
      } else {
        toast.error(validation.error || 'Invalid file')
        e.target.value = ''
      }
    }
  }

  const handleStudentshipProofDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const validation = validateFile(file)
      if (validation.valid) {
        setValue('studentshipProofFile', file, { shouldValidate: true })
        setApiErrors((prev: FormErrors) => {
          const newErrors = { ...prev }
          delete newErrors.studentship_proof_file
          return newErrors
        })
      } else {
        toast.error(validation.error || 'Invalid file')
      }
    }
  }

  const handlePaymentReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validation = validateFile(file)
      if (validation.valid) {
        setValue('paymentReceiptFile', file, { shouldValidate: true })
        setApiErrors((prev: FormErrors) => {
          const newErrors = { ...prev }
          delete newErrors.receipt_file
          return newErrors
        })
      } else {
        toast.error(validation.error || 'Invalid file')
        e.target.value = ''
      }
    }
  }

  const handlePaymentReceiptDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const validation = validateFile(file)
      if (validation.valid) {
        setValue('paymentReceiptFile', file, { shouldValidate: true })
        setApiErrors((prev: FormErrors) => {
          const newErrors = { ...prev }
          delete newErrors.receipt_file
          return newErrors
        })
      } else {
        toast.error(validation.error || 'Invalid file')
      }
    }
  }

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validation = validateImageFile(file)
      if (validation.valid) {
        setValue('photo', file, { shouldValidate: true })
        setApiErrors((prev: FormErrors) => {
          const newErrors = { ...prev }
          delete newErrors.photo
          return newErrors
        })
      } else {
        toast.error(validation.error || 'Invalid file')
        e.target.value = ''
      }
    }
  }

  const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const validation = validateImageFile(file)
      if (validation.valid) {
        setValue('photo', file, { shouldValidate: true })
        setApiErrors((prev: FormErrors) => {
          const newErrors = { ...prev }
          delete newErrors.photo
          return newErrors
        })
      } else {
        toast.error(validation.error || 'Invalid file')
      }
    }
  }

  const handleSignatureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validation = validateImageFile(file)
      if (validation.valid) {
        setValue('signature', file, { shouldValidate: true })
        setApiErrors((prev: FormErrors) => {
          const newErrors = { ...prev }
          delete newErrors.signature
          return newErrors
        })
      } else {
        toast.error(validation.error || 'Invalid file')
        e.target.value = ''
      }
    }
  }

  const handleSignatureDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const validation = validateImageFile(file)
      if (validation.valid) {
        setValue('signature', file, { shouldValidate: true })
        setApiErrors((prev: FormErrors) => {
          const newErrors = { ...prev }
          delete newErrors.signature
          return newErrors
        })
      } else {
        toast.error(validation.error || 'Invalid file')
      }
    }
  }

  // Calculate total amount based on membership type, yearly fee, and years
  const calculateTotalAmount = () => {
    if (!yearlyFee || !paymentYears) return 0
    
    if (paymentYears === 'lifetime') {
      return parseInt(yearlyFee) || 0
    }

    const years = parseInt(paymentYears) || 0
    const fee = parseInt(yearlyFee) || 0
    return fee * years
  }

  const totalAmount = calculateTotalAmount()

  // Map form values to API format
  const mapMembershipType = (value: string): 'GENERAL' | 'LIFETIME' | 'ASSOCIATE' => {
    switch (value.toLowerCase()) {
      case 'general':
        return 'GENERAL'
      case 'lifetime':
        return 'LIFETIME'
      case 'associate':
        return 'ASSOCIATE'
      default:
        return 'GENERAL'
    }
  }

  const mapGender = (value: string): 'MALE' | 'FEMALE' | 'OTHER' => {
    switch (value.toLowerCase()) {
      case 'male':
        return 'MALE'
      case 'female':
        return 'FEMALE'
      case 'other':
        return 'OTHER'
      default:
        return 'MALE'
    }
  }

  const mapTShirtSize = (value: string): 'XXXL' | 'XXL' | 'XL' | 'L' | 'M' | 'S' => {
    const upperValue = value.toUpperCase()
    if (['XXXL', 'XXL', 'XL', 'L', 'M', 'S'].includes(upperValue)) {
      return upperValue as 'XXXL' | 'XXL' | 'XL' | 'L' | 'M' | 'S'
    }
    return 'L'
  }

  const mapStudentshipProofType = (value: string): 'METRIC_CERTIFICATE' | undefined => {
    if (value === 'studentship_certificate') return 'METRIC_CERTIFICATE'
    return undefined
  }

  const onSubmit = async (data: RegistrationFormData) => {
    setLoading(true)
    setApiErrors({})
    setSuccess(false)

    // Type guards for required fields
    if (!data.membershipType || !['general', 'lifetime', 'associate'].includes(data.membershipType)) {
      setLoading(false)
      toast.error('Please select a membership type')
      return
    }
    if (!data.gender || !['male', 'female', 'other'].includes(data.gender)) {
      setLoading(false)
      toast.error('Please select your gender')
      return
    }
    if (!data.tShirtSize || !['xxxl', 'xxl', 'xl', 'l', 'm', 's'].includes(data.tShirtSize)) {
      setLoading(false)
      toast.error('Please select your T-shirt size')
      return
    }
    if (!data.bloodGroup || !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(data.bloodGroup)) {
      setLoading(false)
      toast.error('Please select your blood group')
      return
    }
    if (!data.paymentYears || data.paymentYears.trim() === '') {
      setLoading(false)
      toast.error('Please select the number of years for payment')
      return
    }
    if (!data.paymentMethod || data.paymentMethod.trim() === '') {
      setLoading(false)
      toast.error('Please select a payment method')
      return
    }
    if (!(data.studentshipProofFile instanceof File)) {
      setLoading(false)
      toast.error('Please upload your studentship proof copy')
      return
    }
    if (!(data.paymentReceiptFile instanceof File)) {
      setLoading(false)
      toast.error('Please upload your payment receipt')
      return
    }
    if (!(data.photo instanceof File)) {
      setLoading(false)
      toast.error('Please upload a formal photo of yourself')
      return
    }
    if (!(data.signature instanceof File)) {
      setLoading(false)
      toast.error('Please upload your signature')
      return
    }

    const apiFormData = new FormData()

    // Required fields - TypeScript now knows these are strings due to type guards above
    apiFormData.append('membership_type', mapMembershipType(data.membershipType))
    apiFormData.append('full_name', data.fullName)
    apiFormData.append('name_bangla', data.nameBangla)
    apiFormData.append('father_name', data.fatherName)
    apiFormData.append('gender', mapGender(data.gender))
    apiFormData.append('present_address', data.presentAddress)
    apiFormData.append('permanent_address', data.permanentAddress)
    if (data.email && data.email.trim() !== '') {
      apiFormData.append('email', data.email)
    }
    // Normalize mobile number
    let normalizedMobile = data.mobileNumber.replace(/[^0-9]/g, '')
    if (normalizedMobile.length === 13 && normalizedMobile.startsWith('880')) {
      normalizedMobile = normalizedMobile.substring(2)
    }
    apiFormData.append('mobile_number', normalizedMobile)
    apiFormData.append('profession', data.profession)
    apiFormData.append('t_shirt_size', mapTShirtSize(data.tShirtSize))
    apiFormData.append('blood_group', data.bloodGroup)
    apiFormData.append('payment_years', data.paymentYears)
    apiFormData.append('payment_method', data.paymentMethod)
    apiFormData.append('studentship_proof_file', data.studentshipProofFile)
    apiFormData.append('receipt_file', data.paymentReceiptFile)
    apiFormData.append('photo', data.photo)
    apiFormData.append('signature', data.signature)

    // Optional fields
    if (data.motherName) {
      apiFormData.append('mother_name', data.motherName)
    }
    if (data.jscYear) {
      apiFormData.append('jsc_year', data.jscYear)
    }
    if (data.sscYear) {
      apiFormData.append('ssc_year', data.sscYear)
    }
    const studentshipType = mapStudentshipProofType(data.studentshipProofType || 'studentship_certificate')
    if (studentshipType) {
      apiFormData.append('studentship_proof_type', studentshipType)
    }
    if (data.highestEducationalDegree) {
      apiFormData.append('highest_educational_degree', data.highestEducationalDegree)
    }
    if (data.designation) {
      apiFormData.append('designation', data.designation)
    }
    if (data.instituteName) {
      apiFormData.append('institute_name', data.instituteName)
    }
    if (data.entryFee) {
      apiFormData.append('entry_fee', data.entryFee)
    }

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      const response = await axios.post(`${apiBaseUrl}/api/membership-applications`, apiFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Success
      setSuccess(true)
      toast.success('Registration Successful!', {
        description: 'Your membership application has been submitted and is pending approval.',
        duration: 5000,
      })
      console.log('Application submitted successfully:', response.data)
    } catch (error) {
      console.error('Error submitting membership application:', error)
      
      if (axios.isAxiosError(error)) {
        // Handle validation errors
        if (error.response?.status === 422) {
          const validationErrors = error.response.data?.errors || {}
          setApiErrors(validationErrors)
          
          // Show toast for validation errors
          const errorMessages = Object.values(validationErrors).flat()
          if (errorMessages.length > 0) {
            toast.error('Validation Error', {
              description: errorMessages[0] as string,
              duration: 5000,
            })
          }
          return
        }
        
        // Handle other API errors
        const errorMessage = error.response?.data?.message || 'Failed to submit application'
        setApiErrors({ 
          _general: [errorMessage] 
        })
        toast.error('Submission Failed', {
          description: errorMessage,
          duration: 5000,
        })
      } else {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting the application'
        setApiErrors({ 
          _general: [errorMessage] 
        })
        toast.error('Submission Failed', {
          description: errorMessage,
          duration: 5000,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle membership type change
  const handleMembershipTypeChange = (value: string) => {
    setValue('membershipType', value as 'general' | 'lifetime' | 'associate')
    // Clear year fields when switching membership types
    setValue('jscYear', '')
    setValue('sscYear', '')
    
    // Set payment years for lifetime, clear for others
    if (value === 'lifetime') {
      setValue('paymentYears', 'lifetime')
    } else {
      setValue('paymentYears', '')
    }
    
    // Yearly fee and entry fee will be auto-populated by useEffect
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Background Image with Overlay */}
      <div className="hidden lg:flex lg:w-[40%] relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            ...(backgroundImage
              ? { backgroundImage: `url(${backgroundImage})` }
              : { background: 'linear-gradient(135deg, var(--color-primary) 0%, #1a365d 100%)' })
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col p-8 w-full">
          {/* Go Back Link */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-white hover:text-black transition-colors self-start mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go back</span>
          </Link>

          {/* Logo and School Info */}
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-[var(--color-primary)] bg-white flex items-center justify-center mx-auto mb-4 overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="ESAT-B Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-white text-2xl font-bold uppercase text-center mb-2">
              EX-STUDENTS ASSOCIATION OF
            </h1>
            <p className="text-white text-base uppercase text-center">
              TEXTILE ENGINEERING COLLEGE, BARISHAL (ESAT-B)
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="flex-1 lg:w-[60%] bg-white relative overflow-y-auto">
        {/* Decorative Elements */}
        <div className="hidden sm:block absolute top-10 left-10 opacity-10">
          <GraduationCap className="w-24 h-24 sm:w-32 sm:h-32 text-black" strokeWidth={1} />
        </div>
        <div className="hidden sm:block absolute top-20 right-20">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="hidden sm:block absolute top-40 right-32">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="hidden sm:block absolute top-60 right-16">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="hidden sm:block absolute top-80 right-28">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        </div>

        {/* Form Content */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-12 max-w-5xl mx-auto">
          {/* Mobile Go Back Link */}
          <Link 
            to="/" 
            className="lg:hidden flex items-center gap-2 text-black hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go back</span>
          </Link>

          {success ? (
            /* Success Card */
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 lg:p-12 max-w-md w-full text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">
                  Registration Successful!
                </h2>
                <p className="text-black mb-2">
                  Your membership application has been submitted successfully.
                </p>
                <p className="text-sm text-black mb-8">
                  Your application is now pending approval. We will notify you once it's been reviewed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/">
                    <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-2 rounded-md transition-colors">
                      Go to Homepage
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="px-6 py-2 rounded-md transition-colors">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Title and Subtitle */}
              <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold  mb-2">
                  Create Your Account
                </h1>
                <p className="text-sm lg:text-base mb-4">
                  Register your information to join Alumni
                </p>
                <div className="mb-4">
                  <Link 
                    to="/about" 
                    className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline font-medium"
                  >
                    <span>📋</span>
                    <span>Read instructions before filling the form</span>
                  </Link>
                </div>
              </div>

              {/* General Error Message */}
              {apiErrors._general && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800 mb-1">Submission Failed</h3>
                    <p className="text-sm text-red-700">{apiErrors._general[0]}</p>
                  </div>
                </div>
              )}

              {/* Registration Form */}
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4 sm:space-y-6">
                  {/* 01. Membership Type and 02. Full Name */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                    {/* 01. Membership Type */}
                    <div className="flex flex-col min-h-[120px]">
                      <label className="block text-sm font-medium mb-2">
                        Membership Type <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="membershipType"
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                              <input
                                type="radio"
                                {...field}
                                value="general"
                                checked={field.value === 'general'}
                                onChange={(e) => handleMembershipTypeChange(e.target.value)}
                                className="w-4 h-4 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)]"
                              />
                              <span className="text-sm text-black">General Member</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                              <input
                                type="radio"
                                {...field}
                                value="lifetime"
                                checked={field.value === 'lifetime'}
                                onChange={(e) => handleMembershipTypeChange(e.target.value)}
                                className="w-4 h-4 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)]"
                              />
                              <span className="text-sm text-black">Lifetime Member</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                              <input
                                type="radio"
                                {...field}
                                value="associate"
                                checked={field.value === 'associate'}
                                onChange={(e) => handleMembershipTypeChange(e.target.value)}
                                className="w-4 h-4 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)]"
                              />
                              <span className="text-sm text-black">Associate Member</span>
                            </label>
                          </div>
                        )}
                      />
                      {(errors.membershipType || apiErrors.membership_type) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.membershipType?.message || apiErrors.membership_type?.[0]}
                        </p>
                      )}
                    </div>

                    {/* 02. Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter full name"
                        {...register('fullName')}
                      />
                      {(errors.fullName || apiErrors.full_name) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.fullName?.message || apiErrors.full_name?.[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 03. Name (Bangla) and 04. Father's Name */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                    {/* 03. Name (Bangla) */}
                    <div>
                      <label htmlFor="nameBengali" className="block text-sm font-medium mb-2">
                        Name (Bangla) <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="nameBengali"
                        type="text"
                        placeholder="বাংলায় নাম লিখুন"
                        {...register('nameBangla')}
                      />
                      {(errors.nameBangla || apiErrors.name_bangla) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.nameBangla?.message || apiErrors.name_bangla?.[0]}
                        </p>
                      )}
                    </div>

                    {/* 04. Father's Name */}
                    <div>
                      <label htmlFor="fatherName" className="block text-sm font-medium mb-2">
                        Father's Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="fatherName"
                        type="text"
                        placeholder="Enter father's name"
                        {...register('fatherName')}
                      />
                      {(errors.fatherName || apiErrors.father_name) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.fatherName?.message || apiErrors.father_name?.[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 05. Mother's Name and 06. Gender */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                    {/* 05. Mother's Name */}
                    <div>
                      <label htmlFor="motherName" className="block text-sm font-medium mb-2">
                        Mother's Name
                      </label>
                      <Input
                        id="motherName"
                        type="text"
                        placeholder="Enter mother's name"
                        {...register('motherName')}
                      />
                      {apiErrors.mother_name && (
                        <p className="mt-1 text-sm text-red-600">{apiErrors.mother_name[0]}</p>
                      )}
                    </div>

                    {/* 06. Gender */}
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {(errors.gender || apiErrors.gender) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.gender?.message || apiErrors.gender?.[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 07. Year of Passing/Batch (Only for Associate Members) */}
                  {(membershipType === 'associate') && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                      <div className="flex flex-col min-h-[88px]">
                        <label htmlFor="jscYear" className="block text-sm font-medium mb-2">
                          Year of Passing/Batch*: <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name="jscYear"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value || ''} onValueChange={field.onChange}>
                              <SelectTrigger id="jscYear">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 50 }, (_, i) => {
                                  const year = new Date().getFullYear() - i
                                  return (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {(errors.jscYear || apiErrors.jsc_year) && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.jscYear?.message || apiErrors.jsc_year?.[0]}
                          </p>
                        )}
                      </div>
                      <div></div>
                    </div>
                  )}

                  {/* 07. Year of Passing (Only for General and Lifetime Members) */}
                  {(membershipType === 'general' || membershipType === 'lifetime') && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                      <div className="flex flex-col min-h-[88px]">
                        <label htmlFor="sscYear" className="block text-sm font-medium mb-2">
                          Year of Passing: <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name="sscYear"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value || ''} onValueChange={field.onChange}>
                              <SelectTrigger id="sscYear">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 100 }, (_, i) => {
                                  const year = new Date().getFullYear() - i
                                  return (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {(errors.sscYear || apiErrors.ssc_year) && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.sscYear?.message || apiErrors.ssc_year?.[0]}
                          </p>
                        )}
                      </div>
                      <div></div>
                    </div>
                  )}

                  {/* 09. Studentship Proof Copy and 10. Highest Educational Degree */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                    {/* 09. Studentship Proof Copy */}
                    <div className="flex flex-col">
                      <label htmlFor="studentshipProofType" className="block text-sm font-medium mb-2">
                        Studentship Proof Copy <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="studentshipProofType"
                        control={control}
                        defaultValue="studentship_certificate"
                        render={({ field }) => (
                          <Select value={field.value || 'studentship_certificate'} onValueChange={field.onChange}>
                            <SelectTrigger id="studentshipProofType" className="mb-2">
                              <SelectValue placeholder="Select proof type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="studentship_certificate">Studentship Certificate</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {apiErrors.studentship_proof_type && (
                        <p className="mt-1 text-sm text-red-600">{apiErrors.studentship_proof_type[0]}</p>
                      )}
                      <div
                        className={cn(
                          "border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-6 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors",
                          studentshipProofFile && "border-[var(--color-primary)] bg-blue-50"
                        )}
                        onDrop={handleStudentshipProofDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => studentshipProofFileInputRef.current?.click()}
                      >
                        <input
                          ref={studentshipProofFileInputRef}
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleStudentshipProofFileChange}
                        />
                        <Upload className="w-8 h-8 mx-auto mb-2 text-black" />
                        <p className="text-sm text-black mb-1">
                          {studentshipProofFile ? studentshipProofFile.name : "Upload any Files or drag and drop"}
                        </p>
                        <p className="text-xs text-black">
                          PDF, PNG, JPG, JPEG up to 5MB
                        </p>
                      </div>
                      {(errors.studentshipProofFile || apiErrors.studentship_proof_file) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.studentshipProofFile?.message || apiErrors.studentship_proof_file?.[0]}
                        </p>
                      )}
                    </div>

                    {/* 10. Highest Educational Degree */}
                    <div>
                      <label htmlFor="highestDegree" className="block text-sm font-medium mb-2">
                        Highest Educational Degree
                      </label>
                      <Input
                        id="highestDegree"
                        type="text"
                        placeholder="Enter highest educational degree"
                        {...register('highestEducationalDegree')}
                      />
                      {apiErrors.highest_educational_degree && (
                        <p className="mt-1 text-sm text-red-600">{apiErrors.highest_educational_degree[0]}</p>
                      )}
                    </div>
                  </div>

                  {/* 11. Present Address and 12. Permanent Address */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                    {/* 11. Present Address */}
                    <div>
                      <label htmlFor="presentAddress" className="block text-sm font-medium mb-2">
                        Present Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="presentAddress"
                        type="text"
                        placeholder="Enter present address"
                        {...register('presentAddress')}
                      />
                      {(errors.presentAddress || apiErrors.present_address) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.presentAddress?.message || apiErrors.present_address?.[0]}
                        </p>
                      )}
                    </div>

                    {/* 12. Permanent Address */}
                    <div>
                      <label htmlFor="permanentAddress" className="block text-sm font-medium mb-2">
                        Permanent Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="permanentAddress"
                        type="text"
                        placeholder="Enter permanent address"
                        {...register('permanentAddress')}
                      />
                      {(errors.permanentAddress || apiErrors.permanent_address) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.permanentAddress?.message || apiErrors.permanent_address?.[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 13. Email and 14. Mobile/Phone Number */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                    {/* 13. Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        {...register('email')}
                      />
                      {(errors.email || apiErrors.email) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email?.message || apiErrors.email?.[0]}
                        </p>
                      )}
                    </div>

                    {/* 14. Mobile/Phone Number */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Mobile/Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter mobile/phone number"
                        {...register('mobileNumber')}
                      />
                      {(errors.mobileNumber || apiErrors.mobile_number) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.mobileNumber?.message || apiErrors.mobile_number?.[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 15. Profession and 16. Designation */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                    {/* 15. Profession */}
                    <div>
                      <label htmlFor="profession" className="block text-sm font-medium mb-2">
                        Profession <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="profession"
                        type="text"
                        placeholder="Enter profession"
                        {...register('profession')}
                      />
                      {(errors.profession || apiErrors.profession) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.profession?.message || apiErrors.profession?.[0]}
                        </p>
                      )}
                    </div>

                    {/* 16. Designation */}
                    <div>
                      <label htmlFor="designation" className="block text-sm font-medium mb-2">
                        Designation
                      </label>
                      <Input
                        id="designation"
                        type="text"
                        placeholder="Enter designation"
                        {...register('designation')}
                      />
                      {apiErrors.designation && (
                        <p className="mt-1 text-sm text-red-600">{apiErrors.designation[0]}</p>
                      )}
                    </div>
                  </div>

                  {/* 17. Institute Name/Workplace and 18. Blood Group */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                    {/* 17. Institute Name/Workplace */}
                    <div>
                      <label htmlFor="instituteName" className="block text-sm font-medium mb-2">
                        Institute Name/Workplace
                      </label>
                      <Input
                        id="instituteName"
                        type="text"
                        placeholder="Enter institute name/workplace"
                        {...register('instituteName')}
                      />
                      {apiErrors.institute_name && (
                        <p className="mt-1 text-sm text-red-600">{apiErrors.institute_name[0]}</p>
                      )}
                    </div>

                    {/* 18. Blood Group */}
                    <div>
                      <label htmlFor="bloodGroup" className="block text-sm font-medium mb-2">
                        Blood Group <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="bloodGroup"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger id="bloodGroup">
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {(errors.bloodGroup || apiErrors.blood_group) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.bloodGroup?.message || apiErrors.blood_group?.[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Photo and Signature */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                    {/* Beautiful photo of you */}
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium mb-2">
                        Formal photo of yourself <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={cn(
                          "border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-6 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors",
                          photo && "border-[var(--color-primary)] bg-blue-50"
                        )}
                        onDrop={handlePhotoDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => photoFileInputRef.current?.click()}
                      >
                        <input
                          ref={photoFileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handlePhotoFileChange}
                        />
                        <Upload className="w-8 h-8 mx-auto mb-2 text-black" />
                        <p className="text-sm text-black mb-1">
                          {photo ? photo.name : "Upload any Files or drag and drop"}
                        </p>
                        <p className="text-xs text-black">
                          PNG, JPG, JPEG up to 5MB
                        </p>
                      </div>
                      {(errors.photo || apiErrors.photo) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.photo?.message || apiErrors.photo?.[0]}
                        </p>
                      )}
                    </div>

                    {/* Signature */}
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium mb-2">
                        Signature <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={cn(
                          "border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-6 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors",
                          signature && "border-[var(--color-primary)] bg-blue-50"
                        )}
                        onDrop={handleSignatureDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => signatureFileInputRef.current?.click()}
                      >
                        <input
                          ref={signatureFileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleSignatureFileChange}
                        />
                        <Upload className="w-8 h-8 mx-auto mb-2 text-black" />
                        <p className="text-sm text-black mb-1">
                          {signature ? signature.name : "Upload any Files or drag and drop"}
                        </p>
                        <p className="text-xs text-black">
                          PNG, JPG, JPEG up to 5MB
                        </p>
                      </div>
                      {(errors.signature || apiErrors.signature) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.signature?.message || apiErrors.signature?.[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 19. T-shirt Size and 20. Entry Fee */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                    {/* 19. T-shirt Size */}
                    <div>
                      <label htmlFor="tshirtSize" className="block text-sm font-medium mb-2">
                        T-shirt Size <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="tShirtSize"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger id="tshirtSize">
                              <SelectValue placeholder="Select T-shirt size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="xxxl">XXXL</SelectItem>
                              <SelectItem value="xxl">XXL</SelectItem>
                              <SelectItem value="xl">XL</SelectItem>
                              <SelectItem value="l">L</SelectItem>
                              <SelectItem value="m">M</SelectItem>
                              <SelectItem value="s">S</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {(errors.tShirtSize || apiErrors.t_shirt_size) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.tShirtSize?.message || apiErrors.t_shirt_size?.[0]}
                        </p>
                      )}
                    </div>

                    {/* 20. Entry Fee */}
                    <div>
                      <label htmlFor="entryFee" className="block text-sm font-medium mb-2">
                        Entry Fee
                      </label>
                      <Input
                        id="entryFee"
                        type="number"
                        placeholder="Enter entry fee amount"
                        {...register('entryFee')}
                        min="0"
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      {apiErrors.entry_fee && (
                        <p className="mt-1 text-sm text-red-600">{apiErrors.entry_fee[0]}</p>
                      )}
                    </div>
                  </div>

                  {/* 22. Yearly Fee and 23. Number of years for payment */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-8">
                    {/* 22. Yearly Fee (In Taka) */}
                    <div>
                      <label htmlFor="yearlyFee" className="block text-sm font-medium mb-2">
                        Yearly Fee (In Taka) <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="yearlyFee"
                        type="number"
                        placeholder="Yearly fee amount"
                        {...register('yearlyFee')}
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      {(errors.yearlyFee || apiErrors.yearly_fee) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.yearlyFee?.message || apiErrors.yearly_fee?.[0]}
                        </p>
                      )}
                    </div>

                    {/* 23. Number of years for payment */}
                    <div>
                      <label htmlFor="paymentYears" className="block text-sm font-medium mb-2">
                        Number of years for payment <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="paymentYears"
                        control={control}
                        render={({ field }) => (
                          membershipType === 'lifetime' ? (
                            <Input
                              value="Lifetime"
                              disabled
                              className="bg-gray-100 cursor-not-allowed font-medium text-gray-900"
                              readOnly
                            />
                          ) : (
                            <Select 
                              value={field.value || ''} 
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger id="paymentYears">
                                <SelectValue placeholder="Select number of years" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 Year</SelectItem>
                                <SelectItem value="2">2 Years</SelectItem>
                                <SelectItem value="3">3 Years</SelectItem>
                              </SelectContent>
                            </Select>
                          )
                        )}
                      />
                      {(errors.paymentYears || apiErrors.payment_years) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.paymentYears?.message || apiErrors.payment_years?.[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex flex-col">
                    <label htmlFor="paymentMethod" className="block text-sm font-medium mb-2">
                      Payment Method <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value || ''} onValueChange={field.onChange}>
                          <SelectTrigger id="paymentMethod">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BKASH">BKash</SelectItem>
                            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {(errors.paymentMethod || apiErrors.payment_method) && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.paymentMethod?.message || apiErrors.payment_method?.[0]}
                      </p>
                    )}
                    {paymentMethod === 'BKASH' && (
                       <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm font-medium">
                          Send Money to 01773411528
                       </div>
                    )}
                  </div>

                  {/* 24. Total Paid Amount with Receipt */}
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-2">
                      Total Paid Amount with Receipt <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={cn(
                        "border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-6 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors",
                        paymentReceiptFile && "border-[var(--color-primary)] bg-blue-50"
                      )}
                      onDrop={handlePaymentReceiptDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => paymentReceiptFileInputRef.current?.click()}
                    >
                      <input
                        ref={paymentReceiptFileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handlePaymentReceiptFileChange}
                      />
                      <Upload className="w-8 h-8 mx-auto mb-2 text-black" />
                      <p className="text-sm text-black mb-1">
                        {paymentReceiptFile ? paymentReceiptFile.name : "Upload any Files or drag and drop"}
                      </p>
                      <p className="text-xs text-black">
                        PDF, PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                    {totalAmount > 0 && (
                      <div className="mt-2 bg-green-50 border border-green-200 rounded-md p-3">
                        <p className="text-sm font-semibold text-green-700">
                          Total Amount: {totalAmount.toLocaleString()} ৳
                        </p>
                      </div>
                    )}
                    {(errors.paymentReceiptFile || apiErrors.receipt_file) && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.paymentReceiptFile?.message || apiErrors.receipt_file?.[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('termsAccepted')}
                      className="mt-1 w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-sm text-black">
                      Above information is correct. I must abide by the rules & regulations of this association. I will not demand my paid amount as entry fee of membership even after cancellation/rejection/withdrawal of membership. I agree to the above terms and conditions.
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message}</p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                  <p className="text-sm text-black">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[var(--color-primary)] hover:underline font-medium">
                      Login
                    </Link>
                  </p>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Create account'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
