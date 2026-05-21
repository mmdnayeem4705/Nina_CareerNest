import axios from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/utils/cn'
import { getSupabase, isSupabaseRealtimeEnabled } from '@/lib/supabase'
import api from '@/services/api'
import toast from 'react-hot-toast'

type ProfileData = Record<string, unknown>

const LOCAL_STORAGE_KEY = 'nina-organization-profile'

function loadLocalProfile(): ProfileData {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveLocalProfile(profile: ProfileData) {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // ignore local storage errors
  }
}

export default function ProfilePage() {
  const { firstName, lastName, email } = useAuthStore()
  const [profile, setProfile] = useState<ProfileData>(loadLocalProfile())
  const [loading, setLoading] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const getString = (value: unknown) => (typeof value === 'string' ? value : '')

  useEffect(() => {
    const supabase = getSupabase()

    async function fetchBackend() {
      try {
        const response = await api.get('/profile')
        const data = response.data.data || {}
        setProfile(data)
        saveLocalProfile(data)
      } catch (error) {
        console.error('Backend profile fetch failed', error)
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          return
        }
      }
    }

    async function loadProfile() {
      const localProfile = loadLocalProfile()
      if (Object.keys(localProfile).length) {
        setProfile(localProfile)
      }

      if (!email) {
        return
      }

      if (supabase) {
        try {
          const res = await supabase.from('profiles').select('*').eq('user_email', email).single()
          if (res.data) {
            setProfile(res.data)
            saveLocalProfile(res.data)
          } else {
            await fetchBackend()
          }
        } catch (error) {
          console.error('Supabase load failed', error)
          await fetchBackend()
        }
      } else {
        await fetchBackend()
      }
    }

    void loadProfile()
  }, [email])

  function updateField(path: string, value: unknown) {
    setProfile((p) => {
      const next = { ...(p || {}), [path]: value }
      saveLocalProfile(next)
      return next
    })
  }

  async function save() {
    setLoading(true)
    const supabase = getSupabase()
    const payload = { ...(profile || {}), user_email: email || null }

    if (!email) {
      toast.error('Please login to save your profile')
      setLoading(false)
      return
    }

    try {
      await saveToBackend(payload)
      if (supabase && isSupabaseRealtimeEnabled()) {
        await saveToSupabase(payload)
      }
      saveLocalProfile(payload)
      setSavedAt(new Date().toLocaleString())
    } finally {
      setLoading(false)
    }
  }

  async function saveToSupabase(payload: ProfileData) {
    try {
      const supabase = getSupabase()
      if (!supabase) return
      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'user_email' })
      if (error) throw error
      toast.success('Profile also saved to Supabase')
    } catch (e) {
      console.error(e)
      toast.error('Could not save Supabase copy')
    }
  }

  async function uploadFile(file: File, kind: 'photo' | 'resume') {
    const formData = new FormData()
    formData.append('file', file)
    const url = `/profile/upload?kind=${encodeURIComponent(kind)}`
    try {
      const response = await api.post(url, formData)
      return response.data?.data?.url
    } catch (error) {
      console.error(error)
      toast.error('Upload failed')
      return null
    }
  }

  async function handleFileInput(e: ChangeEvent<HTMLInputElement>, kind: 'photo' | 'resume') {
    const f = e.target.files?.[0]
    if (!f) return
    const url = await uploadFile(f, kind)
    if (url) {
      if (kind === 'photo') updateField('profilePhotoUrl', url)
      else updateField('resumeUrl', url)
      toast.success('File uploaded')
    }
  }

  async function saveToBackend(payload: ProfileData) {
    try {
      const response = await api.post('/profile', payload)
      if (response.data?.success) {
        const savedProfile = response.data.data || payload
        toast.success('Profile saved to server')
        setProfile(savedProfile)
        saveLocalProfile(savedProfile)
      } else {
        toast.error(response.data?.message || 'Save failed')
      }
    } catch (e) {
      console.error(e)
      toast.error('Save failed')
    }
  }

  const missing = () => {
    const p = profile || {}
    const missingFields: string[] = []
    if (!p.fullName && !(firstName || lastName)) missingFields.push('Full name')
    if (!p.city) missingFields.push('City')
    if (!p.educationJson) missingFields.push('Education details')
    if (!p.skillsJson) missingFields.push('Skills')
    return missingFields
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <p className="text-sm text-slate-500 mt-1">Your profile is editable and saved to the server. Fill in details once, then update anytime.</p>

      <div className={cn('mt-6 p-4 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800')}>
        <h2 className="text-lg font-semibold">1. Personal Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <Input placeholder="First Name" value={getString(profile?.firstName) || firstName || ''} onChange={(e) => updateField('firstName', e.target.value)} />
          <Input placeholder="Last Name" value={getString(profile?.lastName) || lastName || ''} onChange={(e) => updateField('lastName', e.target.value)} />
          <Input placeholder="Full Name" value={getString(profile?.fullName)} onChange={(e) => updateField('fullName', e.target.value)} />
          <Input placeholder="Email Address" value={email || getString(profile?.user_email) || getString(profile?.email) || ''} disabled />
          <Input placeholder="Phone Number" value={getString(profile?.phone)} onChange={(e) => updateField('phone', e.target.value)} />
          <Input placeholder="Alternate Phone Number" value={getString(profile?.phoneAlt)} onChange={(e) => updateField('phoneAlt', e.target.value)} />
          <Input placeholder="Date of Birth" value={getString(profile?.dob)} onChange={(e) => updateField('dob', e.target.value)} />
          <Input placeholder="Gender" value={getString(profile?.gender)} onChange={(e) => updateField('gender', e.target.value)} />
          <Input placeholder="Nationality" value={getString(profile?.nationality)} onChange={(e) => updateField('nationality', e.target.value)} />
          <Input placeholder="Profile Photo URL" value={getString(profile?.profilePhotoUrl)} onChange={(e) => updateField('profilePhotoUrl', e.target.value)} />
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-lg font-semibold">2. Address Details</h2>
        <div className="grid grid-cols-1 gap-3 mt-3">
          <Input placeholder="Current Address" value={getString(profile?.currentAddress)} onChange={(e) => updateField('currentAddress', e.target.value)} />
          <Input placeholder="Permanent Address" value={getString(profile?.permanentAddress)} onChange={(e) => updateField('permanentAddress', e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input placeholder="City" value={getString(profile?.city)} onChange={(e) => updateField('city', e.target.value)} />
            <Input placeholder="State" value={getString(profile?.state)} onChange={(e) => updateField('state', e.target.value)} />
            <Input placeholder="Country" value={getString(profile?.country)} onChange={(e) => updateField('country', e.target.value)} />
          </div>
          <Input placeholder="Postal/ZIP Code" value={getString(profile?.postalCode)} onChange={(e) => updateField('postalCode', e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Preferred Job Location" value={getString(profile?.preferredJobLocation)} onChange={(e) => updateField('preferredJobLocation', e.target.value)} />
            <select className="w-full rounded-lg border px-3 py-2" value={getString(profile?.willingToRelocate) || ''} onChange={(e) => updateField('willingToRelocate', e.target.value === 'true')}>
              <option value="">Willing to Relocate?</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-lg font-semibold">3. Education Details (JSON)</h2>
        <p className="text-sm text-slate-500">Paste or input education JSON (10th, 12th, Graduation, Post Graduation)</p>
        <textarea className="w-full mt-2 rounded-lg border px-3 py-2 h-40" value={getString(profile?.educationJson)} onChange={(e) => updateField('educationJson', e.target.value)} />
      </div>

      <div className="mt-4 p-4 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-lg font-semibold">4. Employment Status</h2>
        <select className="w-full rounded-lg border px-3 py-2 mt-2" value={getString(profile?.employmentStatus)} onChange={(e) => updateField('employmentStatus', e.target.value)}>
          <option value="">Select status</option>
          <option value="Fresher">Fresher</option>
          <option value="Experienced">Experienced</option>
        </select>
      </div>

      <div className="mt-4 p-4 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-lg font-semibold">5. Skills</h2>
        <p className="text-sm text-slate-500">Store primary/secondary skills and technologies as JSON or comma-separated list.</p>
        <textarea className="w-full mt-2 rounded-lg border px-3 py-2 h-32" value={getString(profile?.skillsJson)} onChange={(e) => updateField('skillsJson', e.target.value)} />
      </div>

      <div className="mt-4 p-4 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-lg font-semibold">9. Social Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <Input placeholder="LinkedIn URL" value={getString(profile?.linkedInUrl)} onChange={(e) => updateField('linkedInUrl', e.target.value)} />
          <Input placeholder="GitHub URL" value={getString(profile?.githubUrl)} onChange={(e) => updateField('githubUrl', e.target.value)} />
          <Input placeholder="Portfolio Website" value={getString(profile?.portfolioUrl)} onChange={(e) => updateField('portfolioUrl', e.target.value)} />
          <Input placeholder="LeetCode Profile" value={getString(profile?.leetcodeUrl)} onChange={(e) => updateField('leetcodeUrl', e.target.value)} />
          <Input placeholder="HackerRank Profile" value={getString(profile?.hackerrankUrl)} onChange={(e) => updateField('hackerrankUrl', e.target.value)} />
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-lg font-semibold">6. Resume & Profile Photo</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Profile Photo (jpg, png)</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileInput(e, 'photo')} />
            {typeof profile?.profilePhotoUrl === 'string' && (
              <img src={profile.profilePhotoUrl} alt="profile" className="mt-2 h-20 w-20 object-cover rounded-full" />
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Resume (PDF)</label>
            <input type="file" accept="application/pdf" onChange={(e) => handleFileInput(e, 'resume')} />
            {typeof profile?.resumeUrl === 'string' && (
              <a className="block mt-2 text-sm text-indigo-600" href={profile.resumeUrl} target="_blank" rel="noreferrer">View uploaded resume</a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button onClick={save} loading={loading}>Save Profile</Button>
          {savedAt && <span className="text-sm text-slate-500">Saved {savedAt}</span>}
        </div>
        <div className="text-sm text-slate-500">Missing: {missing().join(', ') || 'None'}</div>
      </div>
    </div>
  )
}
