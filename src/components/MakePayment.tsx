import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Upload, CheckCircle2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { useAuthStore } from '@/stores/authStore'
import { apiClient } from '@/api/client'

interface MemberInfo {
  member_id: string
  name: string
  address: string
  mobile_number: string
}

interface MakePaymentProps {
  showMemberId?: boolean
}

// Create schema based on whether user is authenticated
const createPaymentSchema = (isAuthenticated: boolean) => z.object({
  member_id: z.string().optional(),
  payment_purpose: z.string().min(1, 'Please select a payment purpose'),
  name: isAuthenticated 
    ? z.string().optional() 
    : z.string().min(1, 'Name is required').trim(),
  address: isAuthenticated 
    ? z.string().optional() 
    : z.string().min(1, 'Address is required').trim(),
  mobile_number: isAuthenticated 
    ? z.string().optional() 
    : z.string().min(1, 'Mobile number is required').trim(),
  payment_method: z.string().min(1, 'Please select a payment method'),
  payment_amount: z.string().min(1, 'Please enter a payment amount').refine(
    (val) => {
      const num = parseFloat(val)
      return !isNaN(num) && num > 0
    },
    { message: 'Please enter a valid payment amount' }
  ),
  payment_proof_file: z.custom<File>(
    (val) => val instanceof File,
    { message: 'Please upload payment proof' }
  ).refine((file) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
    return validTypes.includes(file.type)
  }, {
    message: 'Invalid file type. Please upload PDF, PNG, or JPG files.',
  }).refine((file) => {
    return file.size <= 5 * 1024 * 1024 // 5MB
  }, {
    message: 'File size exceeds 5MB limit.',
  }),
})

type PaymentFormData = z.infer<ReturnType<typeof createPaymentSchema>>

export function MakePayment({ showMemberId = true }: MakePaymentProps = {}) {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingMemberInfo, setFetchingMemberInfo] = useState(false)
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({})
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)
  const [submittedPaymentData, setSubmittedPaymentData] = useState<{
    name: string
    paymentPurpose: string
    paymentAmount: string
    memberId?: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const memberIdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Determine if user is authenticated (showMemberId=false means authenticated user)
  const isAuthUser = !showMemberId && isAuthenticated

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(createPaymentSchema(isAuthUser)),
    mode: 'onSubmit',
    defaultValues: {
      member_id: '',
      payment_purpose: '',
      payment_method: '',
      name: '',
      address: '',
      mobile_number: '',
      payment_amount: '',
      payment_proof_file: undefined as any,
    },
  })

  // Populate user data when authenticated
  useEffect(() => {
    if (isAuthUser && user) {
      // Set name from user
      if (user.name) {
        setValue('name', user.name)
      }
      
      // Set address and mobile from profile or user if available
      if (user.profile?.present_address) {
        setValue('address', user.profile.present_address)
      }
      if (user.phone) {
        setValue('mobile_number', user.phone)
      }
      
      // Set member_id if available
      if (user.member_id) {
        setValue('member_id', user.member_id)
      }
    }
  }, [isAuthUser, user, setValue])

  const memberId = watch('member_id')
  const paymentAmount = watch('payment_amount')
  const paymentMethod = watch('payment_method')
  const paymentPurpose = watch('payment_purpose')

  // Auto-populate payment amount based on purpose
  useEffect(() => {
    let feeValue = ''
    switch (paymentPurpose) {
      case 'GENERAL_MEMBERSHIP_FEES':
      case 'YEARLY_SUBSCRIPTION_GENERAL_MEMBER':
        feeValue = '500'
        break
      case 'LIFETIME_MEMBERSHIP_FEES':
      case 'YEARLY_SUBSCRIPTION_LIFETIME_MEMBER':
        feeValue = '10000'
        break
      case 'ASSOCIATE_MEMBERSHIP_FEES':
      case 'YEARLY_SUBSCRIPTION_ASSOCIATE_MEMBER':
        feeValue = '300'
        break
      default:
        // Keep existing value or clear it? 
        // If we clear it, it might annoy users switching from a preset to custom.
        // But if we don't, the old preset value remains.
        // Given the requirement "show total amount to be paid", let's clear it if it's not one of the presets,
        // so the user knows they need to enter it.
        // However, we should check if the current amount is one of the *other* preset values before clearing.
        // For simplicity and user experience, if the user selects a preset type, we set it.
        // If they select 'OTHERS' or 'DONATIONS', we might want to clear it if it equals one of the other presets.
        break
    }

    if (feeValue) {
      setValue('payment_amount', feeValue)
    }
  }, [paymentPurpose, setValue])

  // Function to scroll to first error field
  const scrollToFirstError = (formErrors?: typeof errors) => {
    // Field order based on form layout
    const fieldOrder = [
      'member_id',
      'payment_purpose',
      'name',
      'address',
      'mobile_number',
      'payment_method',
      'payment_amount',
      'payment_proof_file',
    ]

    // Find first error field (check both form errors and API errors)
    const firstErrorField = fieldOrder.find((field) => {
      const fieldKey = field as keyof PaymentFormData
      return (formErrors && formErrors[fieldKey]) || apiErrors[fieldKey]
    })

    if (firstErrorField) {
      // Get the element
      let element: HTMLElement | null = null

      if (firstErrorField === 'payment_purpose') {
        // For Select, find the trigger element
        element = document.getElementById('paymentPurpose')
      } else if (firstErrorField === 'payment_method') {
        element = document.getElementById('paymentMethod')
      } else {
        // For all other fields including file input, use the field ID
        element = document.getElementById(firstErrorField)
      }

      if (element) {
        // Scroll to element with smooth behavior
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        // Focus the element if it's focusable
        if (element instanceof HTMLElement && 'focus' in element) {
          setTimeout(() => {
            if (element && 'focus' in element) {
              ;(element as HTMLElement).focus()
            }
          }, 300)
        }
      }
    }
  }

  // Fetch member info when member_id is entered
  useEffect(() => {
    if (memberId && memberId.trim() !== '') {
      // Clear previous timeout
      if (memberIdTimeoutRef.current) {
        clearTimeout(memberIdTimeoutRef.current)
      }

      // Debounce API call
      memberIdTimeoutRef.current = setTimeout(async () => {
        setFetchingMemberInfo(true)
        try {
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
          const response = await axios.get<MemberInfo>(
            `${apiBaseUrl}/api/members/${memberId}/info`
          )
          const memberInfo = response.data
          setValue('name', memberInfo.name || '')
          setValue('address', memberInfo.address || '')
          setValue('mobile_number', memberInfo.mobile_number || '')
        } catch (error) {
          // Member not found or invalid - allow manual entry
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            // Clear fields if member not found
            setValue('name', '')
            setValue('address', '')
            setValue('mobile_number', '')
          }
        } finally {
          setFetchingMemberInfo(false)
        }
      }, 500) // 500ms debounce
    } else {
      // Clear fields if member_id is empty
      setValue('name', '')
      setValue('address', '')
      setValue('mobile_number', '')
    }

    return () => {
      if (memberIdTimeoutRef.current) {
        clearTimeout(memberIdTimeoutRef.current)
      }
    }
  }, [memberId, setValue])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file type and size - only PDF and images
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload PDF, PNG, or JPG files.')
        return
      }
      
      if (file.size > maxSize) {
        toast.error('File size exceeds 5MB limit.')
        return
      }
      
      setValue('payment_proof_file', file, { shouldValidate: true })
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload PDF, PNG, or JPG files.')
        return
      }
      
      if (file.size > maxSize) {
        toast.error('File size exceeds 5MB limit.')
        return
      }
      
      setValue('payment_proof_file', file, { shouldValidate: true })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const calculateTotalAmount = (): number => {
    if (!paymentAmount || paymentAmount.trim() === '') return 0
    const parsed = parseFloat(paymentAmount)
    return Number.isNaN(parsed) ? 0 : parsed
  }

  const totalAmount = calculateTotalAmount()

  // Handle form validation errors
  const onError = (formErrors: typeof errors) => {
    scrollToFirstError(formErrors)
  }

  // Effect to scroll to first error when API errors change
  useEffect(() => {
    const hasFieldErrors = Object.keys(apiErrors).some(
      (key) => key !== '_general' && apiErrors[key]?.length > 0
    )
    if (hasFieldErrors) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        scrollToFirstError(errors)
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiErrors])

  const onSubmit = async (data: PaymentFormData) => {
    setLoading(true)
    setApiErrors({})

    try {
      const apiFormData = new FormData()
      
      // For authenticated users, populate from user data if not provided
      let name: string = data.name || ''
      let address: string = data.address || ''
      let mobile_number: string = data.mobile_number || ''
      
      if (isAuthUser && user) {
        // Use provided data or fallback to user data
        name = name || user.name || ''
        if (user.profile?.present_address) {
          address = address || user.profile.present_address || ''
        }
        if (user.phone) {
          mobile_number = mobile_number || user.phone || ''
        }
      }
      
      if (data.member_id) {
        apiFormData.append('member_id', data.member_id)
      } else if (isAuthUser && user?.member_id) {
        apiFormData.append('member_id', user.member_id)
      }
      
      // Ensure all values are strings before appending
      apiFormData.append('name', name || '')
      apiFormData.append('address', address || '')
      apiFormData.append('mobile_number', mobile_number || '')
      apiFormData.append('payment_purpose', data.payment_purpose)
      apiFormData.append('payment_method', data.payment_method)
      apiFormData.append('payment_amount', data.payment_amount)
      apiFormData.append('payment_proof_file', data.payment_proof_file)

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      
      // Prepare headers with authentication token if user is authenticated
      const headers: Record<string, string> = {
        'Content-Type': 'multipart/form-data',
      }
      
      // Add authorization token if user is authenticated
      if (isAuthUser) {
        const token = apiClient.getToken()
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
      }
      
      await axios.post(`${apiBaseUrl}/api/payments`, apiFormData, {
        headers,
      })

      // Success - handle based on page type
      if (showMemberId) {
        // Donate page - show success card instead of redirecting
        setSubmittedPaymentData({
          name: name,
          paymentPurpose: data.payment_purpose,
          paymentAmount: data.payment_amount,
          memberId: data.member_id || undefined,
        })
        setPaymentSubmitted(true)
        toast.success('Payment submitted successfully!')
        // Reset form
        reset()
      } else {
        // Dashboard page - redirect to payment list
        toast.success('Payment submitted successfully!')
        // Reset form
        reset()
        navigate({ to: '/payment' })
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        setApiErrors(error.response.data.errors)
        toast.error('Please check the form for errors')
      } else {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting payment'
        setApiErrors({
          _general: [errorMessage],
        })
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  // Show success card if payment was submitted on donate page
  if (paymentSubmitted && showMemberId && submittedPaymentData) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 max-w-2xl mx-auto">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold  mb-2">
                Payment Details Recorded
              </h2>
              <p className="">
                Thank you for your payment submission. Your payment details have been recorded successfully.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 mt-6 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm font-semibold ">{submittedPaymentData.name}</span>
              </div>
              {submittedPaymentData.memberId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Member ID:</span>
                  <span className="text-sm font-semibold ">{submittedPaymentData.memberId}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payment Purpose:</span>
                <span className="text-sm font-semibold ">
                  {submittedPaymentData.paymentPurpose === 'ASSOCIATE_MEMBERSHIP_FEES' && 'Associate Membership Fees'}
                  {submittedPaymentData.paymentPurpose === 'GENERAL_MEMBERSHIP_FEES' && 'General Membership Fees'}
                  {submittedPaymentData.paymentPurpose === 'LIFETIME_MEMBERSHIP_FEES' && 'Lifetime Membership Fees'}
                  {submittedPaymentData.paymentPurpose === 'YEARLY_SUBSCRIPTION_ASSOCIATE_MEMBER' && 'Yearly Subscription for Associate Member'}
                  {submittedPaymentData.paymentPurpose === 'YEARLY_SUBSCRIPTION_GENERAL_MEMBER' && 'Yearly Subscription for General Member'}
                  {submittedPaymentData.paymentPurpose === 'YEARLY_SUBSCRIPTION_LIFETIME_MEMBER' && 'Yearly Subscription for Lifetime Member'}
                  {submittedPaymentData.paymentPurpose === 'SPECIAL_YEARLY_CONTRIBUTION_EXECUTIVE' && 'Special Yearly Contribution (Executive)'}
                  {submittedPaymentData.paymentPurpose === 'DONATIONS' && 'Donations'}
                  {submittedPaymentData.paymentPurpose === 'PATRON' && 'Patron'}
                  {submittedPaymentData.paymentPurpose === 'OTHERS' && 'Others'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Amount:</span>
                <span className="text-sm font-semibold text-green-600">
                  {parseFloat(submittedPaymentData.paymentAmount).toLocaleString()} ৳
                </span>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-sm mb-4">
                Your payment is pending approval. You will be notified once it has been reviewed.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    setPaymentSubmitted(false)
                    setSubmittedPaymentData(null)
                  }}
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white"
                >
                  Submit Another Payment
                </Button>
                <Link to="/">
                  <Button variant="outline">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Payment Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">Payment</h2>
          <p className="text-sm">Select your purpose and make your payment</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
          {apiErrors._general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{apiErrors._general[0]}</p>
            </div>
          )}

          {/* Member Unique ID Number - Only show if showMemberId is true */}
          {showMemberId && (
            <div>
              <label htmlFor="memberId" className="block text-sm font-medium mb-2">
                Member Unique ID Number
              </label>
              <Input
                id="memberId"
                type="text"
                placeholder="Enter member ID (optional)"
                {...register('member_id')}
                className={apiErrors.member_id ? 'border-red-500' : ''}
              />
              {fetchingMemberInfo && (
                <p className="mt-1 text-sm">Fetching member information...</p>
              )}
              {apiErrors.member_id && (
                <p className="mt-1 text-sm text-red-600">{apiErrors.member_id[0]}</p>
              )}
            </div>
          )}

          {/* Select payment purpose */}
          <div>
            <label htmlFor="paymentPurpose" className="block text-sm font-medium mb-2">
              Payment Purpose <span className="text-red-500">*</span>
            </label>
            <Controller
              name="payment_purpose"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="paymentPurpose" className={`w-full ${errors.payment_purpose || apiErrors.payment_purpose ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select payment purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASSOCIATE_MEMBERSHIP_FEES">Associate Membership fees</SelectItem>
                    <SelectItem value="GENERAL_MEMBERSHIP_FEES">General Membership fees</SelectItem>
                    <SelectItem value="LIFETIME_MEMBERSHIP_FEES">Lifetime Membership fees</SelectItem>
                    <SelectItem value="YEARLY_SUBSCRIPTION_ASSOCIATE_MEMBER">Yearly Subscription for Associate Member</SelectItem>
                    <SelectItem value="YEARLY_SUBSCRIPTION_GENERAL_MEMBER">Yearly Subscription for General Member</SelectItem>
                    <SelectItem value="YEARLY_SUBSCRIPTION_LIFETIME_MEMBER">Yearly Subscription for Lifetime Member</SelectItem>
                    <SelectItem value="SPECIAL_YEARLY_CONTRIBUTION_EXECUTIVE">Special Yearly Contribution for Executive Committee Members</SelectItem>
                    <SelectItem value="DONATIONS">Donations</SelectItem>
                    <SelectItem value="PATRON">Patron</SelectItem>
                    <SelectItem value="OTHERS">Others</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {(errors.payment_purpose || apiErrors.payment_purpose) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.payment_purpose?.message || apiErrors.payment_purpose?.[0]}
              </p>
            )}
          </div>

          {/* Name - Only show for non-authenticated users */}
          {showMemberId && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter full name"
                {...register('name')}
                className={errors.name || apiErrors.name ? 'border-red-500' : ''}
              />
              {(errors.name || apiErrors.name) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name?.message || apiErrors.name?.[0]}
                </p>
              )}
            </div>
          )}

          {/* Address - Only show for non-authenticated users */}
          {showMemberId && (
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                placeholder="Enter address"
                rows={3}
                {...register('address')}
                className={cn(
                  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                  (errors.address || apiErrors.address) && 'border-red-500'
                )}
              />
              {(errors.address || apiErrors.address) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address?.message || apiErrors.address?.[0]}
                </p>
              )}
            </div>
          )}

          {/* Mobile number - Only show for non-authenticated users */}
          {showMemberId && (
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="mobileNumber"
                type="text"
                placeholder="Enter mobile number"
                {...register('mobile_number')}
                className={errors.mobile_number || apiErrors.mobile_number ? 'border-red-500' : ''}
              />
              {(errors.mobile_number || apiErrors.mobile_number) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mobile_number?.message || apiErrors.mobile_number?.[0]}
                </p>
              )}
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium mb-2">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <Controller
              name="payment_method"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="paymentMethod" className={`w-full ${errors.payment_method || apiErrors.payment_method ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BKASH">BKash</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {(errors.payment_method || apiErrors.payment_method) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.payment_method?.message || apiErrors.payment_method?.[0]}
              </p>
            )}
            
            {/* Show BKash number if BKash is selected */}
            {paymentMethod === 'BKASH' && (
               <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm font-medium">
                  Send Money to 01773411528
               </div>
            )}
          </div>

          {/* Payment amount */}
          <div>
            <label htmlFor="paymentAmount" className="block text-sm font-medium mb-2">
              Payment Amount <span className="text-red-500">*</span>
            </label>
            <Input
              id="paymentAmount"
              type="text"
              inputMode="decimal"
              placeholder="Enter payment amount"
              {...register('payment_amount')}
              className={errors.payment_amount || apiErrors.payment_amount ? 'border-red-500' : ''}
            />
            {(errors.payment_amount || apiErrors.payment_amount) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.payment_amount?.message || apiErrors.payment_amount?.[0]}
              </p>
            )}
          </div>

          {/* Total Payable Amount */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total payable amount</p>
              <p className="text-xs mt-1">Vat/charge included</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-700">{totalAmount.toLocaleString()} ৳</p>
            </div>
          </div>

          {/* Attachment of payment proof */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Attachment of payment proof<span className="text-red-500">*</span>
            </label>
            <div
              id="payment_proof_file"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragging
                  ? "border-[var(--color-primary)] bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 bg-gray-50",
                (errors.payment_proof_file || apiErrors.payment_proof_file) && "border-red-500"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto mb-4" />
              <p className="text-sm font-medium mb-1">
                Upload any Files or drag and drop
              </p>
              <p className="text-xs">
                PDF, PNG, JPG up to 5MB
              </p>
              {watch('payment_proof_file') && (
                <p className="text-sm text-[var(--color-primary)] mt-2 font-medium">
                  Selected: {watch('payment_proof_file')?.name}
                </p>
              )}
            </div>
            {(errors.payment_proof_file || apiErrors.payment_proof_file) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.payment_proof_file?.message || apiErrors.payment_proof_file?.[0]}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white h-12 text-base font-medium disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Payment'}
            </Button>
            <Link
              to={showMemberId ? "/" : "/payment"}
              className="text-center text-sm underline"
            >
              Go back
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
