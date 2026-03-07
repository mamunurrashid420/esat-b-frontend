import { useState, useEffect, useRef } from 'react'
import { Camera, Edit, Save, Loader2 } from 'lucide-react'
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
import { useAuthStore } from '@/stores/authStore'
import { AuthenticatedImage } from '@/components/AuthenticatedImage'
import { toast } from 'sonner'

export function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const { setUser } = useAuthStore()
  const [formData, setFormData] = useState({
    fullName: '',
    nameInBengali: '',
    fathersName: '',
    gender: '',
    sscMatricYear: '',
    highestDegree: '',
    presentAddress: '',
    permanentAddress: '',
    email: '',
    phone: '',
    profession: '',
    instituteName: '',
    designation: '',
    tShirtSize: '',
    bloodGroup: '',
    membershipType: '',
    password: '***********',
    idNo: '',
    passingYear: '',
    displayEmail: '',
    displayPhone: '',
  })

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true)
        // Fetch fresh user data
        const user = await apiClient.getCurrentUser()
        
        // Map user + profile to form fields (profile from member_profiles)
        const profile = user.profile
        const genderDisplay = profile?.gender
          ? profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase()
          : ''
        setFormData((prev) => ({
          ...prev,
          fullName: user.name || '',
          nameInBengali: profile?.name_bangla || '',
          fathersName: profile?.father_name || '',
          gender: genderDisplay,
          sscMatricYear: profile?.ssc_year?.toString() || '',
          highestDegree: profile?.highest_educational_degree || '',
          presentAddress: profile?.present_address || '',
          permanentAddress: profile?.permanent_address || '',
          email: user.email || '',
          phone: user.phone || '',
          profession: profile?.profession || '',
          instituteName: profile?.institute_name || '',
          designation: profile?.designation || '',
          tShirtSize: profile?.t_shirt_size || '',
          bloodGroup: profile?.blood_group || '',
          membershipType: user.primary_member_type
            ? user.primary_member_type.charAt(0) + user.primary_member_type.slice(1).toLowerCase() + ' member'
            : '',
          password: '***********',
          idNo: user.member_id || '',
          passingYear: profile?.ssc_year?.toString() || '',
          displayEmail: user.email || '',
          displayPhone: user.phone || '',
        }))
        setProfilePhotoUrl(profile?.photo ?? null)
      } catch (error: any) {
        console.error('Failed to load profile:', error)
        toast.error(error.message || 'Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfileData()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoClick = () => {
    if (!isUploadingPhoto) photoInputRef.current?.click()
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast.error('Please choose a JPG or PNG image')
      e.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      e.target.value = ''
      return
    }
    try {
      setIsUploadingPhoto(true)
      const updated = await apiClient.updateMemberProfile({ photo: file })
      setProfilePhotoUrl(updated.profile?.photo ?? null)
      setUser(updated)
      toast.success('Photo updated')
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : 'Failed to update photo'
      toast.error(message)
    } finally {
      setIsUploadingPhoto(false)
      e.target.value = ''
    }
  }

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    const name = formData.fullName.trim()
    const phone = formData.phone.trim()
    if (!phone) {
      toast.error('Phone number is required')
      return
    }
    try {
      setIsSaving(true)
      await apiClient.updateProfile({
        name,
        email: formData.email?.trim() || null,
        phone,
      })
      const profilePayload = {
        name_bangla: formData.nameInBengali?.trim() || null,
        father_name: formData.fathersName?.trim() || null,
        mother_name: null as string | null,
        gender: formData.gender
          ? (formData.gender.toUpperCase() as 'MALE' | 'FEMALE' | 'OTHER')
          : null,
        // SSC/JSC batch are not editable on profile update
        highest_educational_degree: formData.highestDegree?.trim() || null,
        present_address: formData.presentAddress?.trim() || null,
        permanent_address: formData.permanentAddress?.trim() || null,
        profession: formData.profession?.trim() || null,
        designation: formData.designation?.trim() || null,
        institute_name: formData.instituteName?.trim() || null,
        t_shirt_size: formData.tShirtSize?.trim() || null,
        blood_group: formData.bloodGroup?.trim() || null,
      }
      try {
        await apiClient.updateMemberProfile(profilePayload)
      } catch {
        // User may not have a member profile yet (e.g. not approved)
      }
      toast.success('Profile updated successfully')
      setIsEditing(false)
      const user = await apiClient.getCurrentUser()
      const profile = user.profile
      const genderDisplay = profile?.gender
        ? profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase()
        : ''
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || '',
        nameInBengali: profile?.name_bangla || '',
        fathersName: profile?.father_name || '',
        gender: genderDisplay,
        sscMatricYear: profile?.ssc_year?.toString() || '',
        highestDegree: profile?.highest_educational_degree || '',
        presentAddress: profile?.present_address || '',
        permanentAddress: profile?.permanent_address || '',
        email: user.email || '',
        phone: user.phone || '',
        profession: profile?.profession || '',
        instituteName: profile?.institute_name || '',
        designation: profile?.designation || '',
        tShirtSize: profile?.t_shirt_size || '',
        bloodGroup: profile?.blood_group || '',
        displayEmail: user.email || '',
        displayPhone: user.phone || '',
      }))
      setProfilePhotoUrl(profile?.photo ?? null)
    } catch (error: any) {
      const message =
        error?.errors?.phone?.[0] ??
        error?.errors?.email?.[0] ??
        error?.errors?.name?.[0] ??
        error?.message
      toast.error(message ?? 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    )
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'U'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name[0].toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">User Profile</h1>
        <div className="h-px bg-gray-200 border-dashed border-t border-gray-300"></div>
      </div>

      {/* User Summary Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="border-t-4 border-dashed border-[var(--color-primary)] pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Section - Profile Picture and Name */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="relative w-24 h-24">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="hidden"
                  onChange={handlePhotoChange}
                  disabled={isUploadingPhoto}
                />
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  disabled={isUploadingPhoto}
                  className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:opacity-60"
                >
                  {profilePhotoUrl ? (
                    <AuthenticatedImage
                      src={profilePhotoUrl}
                      alt={formData.fullName || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-black/70">
                      {getInitials(formData.fullName)}
                    </span>
                  )}
                </button>
                <span className="absolute -bottom-0.5 -right-0.5 w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center pointer-events-none shrink-0">
                  {isUploadingPhoto ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-white" />
                  )}
                </span>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-xl font-bold text-black mb-1">
                  {formData.fullName || '—'}
                </h2>
                {formData.idNo && (
                  <p className="text-sm text-[var(--color-primary)] font-medium mb-1">
                    ID No: {formData.idNo}
                  </p>
                )}
                {formData.passingYear && (
                  <p className="text-sm text-[var(--color-primary)] font-medium">
                    Passing year: {formData.passingYear}
                  </p>
                )}
              </div>
            </div>

            {/* Right Section - Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border-l border-gray-200 pl-6">
              <div className="space-y-3">
                {formData.bloodGroup && (
                  <div>
                    <span className="text-sm text-black/70">Blood group: </span>
                    <span className="text-sm font-medium text-black">{formData.bloodGroup}</span>
                  </div>
                )}
                {formData.membershipType && (
                  <div>
                    <span className="text-sm text-black/70">Membership Type: </span>
                    <span className="text-sm font-medium text-black">{formData.membershipType}</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {formData.displayPhone && (
                  <div>
                    <span className="text-sm text-black/70">Phone: </span>
                    <span className="text-sm font-medium text-black">{formData.displayPhone}</span>
                  </div>
                )}
                {formData.displayEmail && (
                  <div>
                    <span className="text-sm text-black/70">Email: </span>
                    <span className="text-sm font-medium text-black">{formData.displayEmail}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-black mb-2">Professional information</h2>
            <div className="h-px bg-gray-200 border-dashed border-t border-gray-300"></div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-black/70 hover:text-[var(--color-primary)] transition-colors p-2"
            >
              <Edit className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-black">{formData.fullName || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Father's Name
              </label>
              {isEditing ? (
                <Input
                  value={formData.fathersName}
                  onChange={(e) => handleInputChange('fathersName', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-black">{formData.fathersName || '—'}</p>
              )}
            </div>

            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-black/70 mb-2">
                  SSC/Matric Year
                </label>
                <p className="text-sm text-black">{formData.sscMatricYear || '—'}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Present Address
              </label>
              {isEditing ? (
                <Input
                  value={formData.presentAddress}
                  onChange={(e) => handleInputChange('presentAddress', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-black">{formData.presentAddress || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Email address
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-black">{formData.email || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Profession
              </label>
              {isEditing ? (
                <Input
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-black">{formData.profession || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Institute Name with Workplace
              </label>
              {isEditing ? (
                <Input
                  value={formData.instituteName}
                  onChange={(e) => handleInputChange('instituteName', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-black">{formData.instituteName || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Blood Group
              </label>
              {isEditing ? (
                <Input
                  value={formData.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-black">{formData.bloodGroup || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Password
              </label>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full"
                    />
                    <Button
                      variant="link"
                      className="text-[var(--color-primary)] text-sm px-0"
                      onClick={() => {
                        // TODO: Implement change password functionality
                      }}
                    >
                      Change Password
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-black">{formData.password}</p>
                    <Button
                      variant="link"
                      className="text-[var(--color-primary)] text-sm px-0"
                      onClick={() => {
                        // TODO: Implement change password functionality
                      }}
                    >
                      Change Password
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Name in (বাংলা)
              </label>
              {isEditing ? (
                <Input
                  value={formData.nameInBengali}
                  onChange={(e) => handleInputChange('nameInBengali', e.target.value)}
                  className="w-full"
                  placeholder="Enter name in Bengali"
                />
              ) : (
                <p className="text-sm text-black">
                  {formData.nameInBengali || '—'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Gender
              </label>
              {isEditing ? (
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-black">{formData.gender || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Highest Degree Obtained
              </label>
              {isEditing ? (
                <Input
                  value={formData.highestDegree}
                  onChange={(e) => handleInputChange('highestDegree', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-black">{formData.highestDegree || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Permanent Address
              </label>
              {isEditing ? (
                <Input
                  value={formData.permanentAddress}
                  onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-black">{formData.permanentAddress || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Phone number
              </label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-black">{formData.phone || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Designation (Optional)
              </label>
              {isEditing ? (
                <Input
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  className="w-full"
                  placeholder="Enter designation"
                />
              ) : (
                <p className="text-sm text-black">{formData.designation || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                T-Shirt Size
              </label>
              {isEditing ? (
                <Select
                  value={formData.tShirtSize}
                  onValueChange={(value) => handleInputChange('tShirtSize', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select T-shirt size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XS">XS</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                    <SelectItem value="XXL">XXL</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-black">{formData.tShirtSize || '—'}</p>
              )}
            </div>

            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-black/70 mb-2">
                  Membership Type
                </label>
                <p className="text-sm text-black">{formData.membershipType || '—'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Changes Button */}
        {isEditing && (
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
