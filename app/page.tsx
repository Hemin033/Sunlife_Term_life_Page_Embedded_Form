'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IoMdWalk } from 'react-icons/io'
import { MdDirectionsRun } from 'react-icons/md'
import { GiWeightLiftingUp } from 'react-icons/gi'
import { FaDollarSign, FaShieldAlt, FaHeart, FaUsers, FaCalendarAlt, FaCog, FaChartLine, FaExchangeAlt, FaPlus, FaLaptop, FaHandHoldingHeart, FaUserMd } from 'react-icons/fa'
import { AiOutlineDollar, AiOutlineHeart, AiOutlineCalendar, AiOutlinePlus, AiOutlineLaptop, AiOutlineSwap } from 'react-icons/ai'
import { BsShield, BsPeople, BsGraphUp } from 'react-icons/bs'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'

export default function Home() {
  const router = useRouter()
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    smokerStatus: '',
    province: '',
    coverageAmount: '',
    termLength: ''
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [mobileProvinceOpen, setMobileProvinceOpen] = useState(false)
  const [modalProvinceOpen, setModalProvinceOpen] = useState(false)
  const [embeddedProvinceOpen, setEmbeddedProvinceOpen] = useState(false)
  const [mobileCoverageOpen, setMobileCoverageOpen] = useState(false)
  const [modalCoverageOpen, setModalCoverageOpen] = useState(false)
  const [embeddedCoverageOpen, setEmbeddedCoverageOpen] = useState(false)
  const [mobileTermOpen, setMobileTermOpen] = useState(false)
  const [modalTermOpen, setModalTermOpen] = useState(false)
  const [embeddedTermOpen, setEmbeddedTermOpen] = useState(false)
  const [showOtpField, setShowOtpField] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [otpError, setOtpError] = useState('')

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validation functions
  const validateFirstName = (name: string): string => {
    if (!name.trim()) return 'First name is required'
    if (name.trim().length < 2) return 'Name must be at least 2 characters'
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name can only contain letters'
    return ''
  }

  const validateLastName = (name: string): string => {
    if (!name.trim()) return 'Last name is required'
    if (name.trim().length < 2) return 'Name must be at least 2 characters'
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name can only contain letters'
    return ''
  }

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return 'Phone number is required'
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    if (!/^\+?[0-9]{10,14}$/.test(cleanPhone)) return 'Please enter a valid phone number'
    return ''
  }

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return ''
  }

  const validateDateOfBirth = (age: string): string => {
    if (!age.trim()) return 'Age is required'
    const ageNum = parseInt(age, 10)
    if (isNaN(ageNum)) return 'Please enter a valid age'
    if (ageNum < 18) return 'Age must be between 18-70'
    if (ageNum > 70) return 'Age must be between 18-70'
    return ''
  }

  const validateGender = (gender: string): string => {
    if (!gender) return 'Please select your gender'
    return ''
  }

  const validateSmokerStatus = (status: string): string => {
    if (!status) return 'Please select your smoker status'
    return ''
  }

  const validateProvince = (province: string): string => {
    if (!province) return 'Please select your province'
    return ''
  }

  const validateCoverageAmount = (coverage: string): string => {
    if (!coverage) return 'Please select coverage amount'
    return ''
  }

  const validateTermLength = (term: string): string => {
    if (!term) return 'Please select term length'
    return ''
  }

  const coverageOptions = [
    { value: 'under25k', label: 'Under $25K' },
    { value: '25k-100k', label: '$25K - $100K' },
    { value: '100k-250k', label: '$100K - $250K' },
    { value: '250k-500k', label: '$250K - $500K' },
    { value: '500k-1m', label: '$500K - $1M' },
    { value: '1m-2m', label: '$1M - $2M' },
    { value: '2m-3m', label: '$2M - $3M' },
    { value: '3m-4m', label: '$3M - $4M' },
    { value: 'not-sure', label: "I'm not sure" }
  ]

  const termLengthOptions = Array.from({ length: 46 }, (_, i) => ({
    value: String(i + 5),
    label: `${i + 5} years`
  }))

  // Format phone number as (XXX) XXX-XXXX
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format based on length
    if (digits.length === 0) return ''
    if (digits.length <= 3) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {}
    
    errors.firstName = validateFirstName(formData.firstName)
    errors.lastName = validateLastName(formData.lastName)
    errors.phoneNumber = validatePhone(formData.phoneNumber)
    errors.email = validateEmail(formData.email)
    errors.dateOfBirth = validateDateOfBirth(formData.dateOfBirth)
    errors.gender = validateGender(formData.gender)
    errors.smokerStatus = validateSmokerStatus(formData.smokerStatus)
    errors.province = validateProvince(formData.province)
    errors.coverageAmount = validateCoverageAmount(formData.coverageAmount)
    errors.termLength = validateTermLength(formData.termLength)
    
    // Filter out empty errors
    const activeErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value !== '')
    )
    
    setFormErrors(activeErrors)
    return Object.keys(activeErrors).length === 0
  }

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Form is valid - redirect to thank you page
    setShowLeadForm(false)
    router.push('/thank-you?return=/')
  }

  return (
    <main>
      {/* Mobile Responsive Styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          /* Lead Form Modal */
          .lead-form-modal {
            padding: 10px !important;
          }
          .lead-form-content {
            padding: 24px 16px !important;
            max-height: 95vh !important;
          }
          .lead-form-content h2 {
            font-size: 24px !important;
          }
          .lead-form-content p {
            font-size: 14px !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .form-row label {
            font-size: 14px !important;
          }
          .form-row input,
          .form-row select {
            font-size: 16px !important;
            padding: 12px !important;
          }
          .gender-buttons button,
          .smoker-buttons button {
            padding: 12px !important;
            font-size: 14px !important;
          }
          
          /* CTA Box */
          .cta-box {
            flex-direction: column !important;
            padding: 24px 16px !important;
            gap: 16px !important;
            text-align: center !important;
          }
          .cta-box > div:first-child {
            max-width: 100% !important;
            width: 100% !important;
          }
          .cta-box img {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: none !important;
            object-fit: cover !important;
          }
          .cta-box h2 {
            font-size: 24px !important;
            text-align: center !important;
            margin-bottom: 8px !important;
          }
          .cta-box p {
            font-size: 16px !important;
            text-align: center !important;
            margin-bottom: 20px !important;
          }
          .cta-box button {
            width: 100% !important;
          }
          
          /* Hero Section */
          .hero-section h1 {
            font-size: 28px !important;
            line-height: 1.25 !important;
          }
          .hero-section p {
            font-size: 16px !important;
          }
          
          /* Product Cards */
          .products-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .product-card {
            margin: 0 auto;
            max-width: 400px;
          }
          
          /* Benefits Grid */
          .benefits-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          /* Features Grid */
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .feature-card {
            padding: 16px !important;
            flex-wrap: wrap !important;
          }
          .feature-card > div:first-child {
            flex-shrink: 0 !important;
          }
          .feature-card > div:last-child {
            flex: 1 !important;
            min-width: 0 !important;
          }
          .feature-card > div:last-child h3 {
            font-size: 16px !important;
            margin-bottom: 4px !important;
          }
          .feature-card > div:last-child p {
            font-size: 14px !important;
            margin-top: 0 !important;
          }
          
          /* Cost Section */
          .cost-section {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 0 16px !important;
          }
          .cost-section h2 {
            font-size: 22px !important;
          }
          .cost-section p {
            font-size: 14px !important;
            white-space: normal !important;
          }
          .cost-table {
            font-size: 14px !important;
            width: 100% !important;
          }
          .cost-table th,
          .cost-table td {
            padding: 12px 10px !important;
            font-size: 14px !important;
            font-size: 14px !important;
            white-space: nowrap;
          }
          
          /* Yellow CTA Banner */
          .cta-banner {
            padding: 30px 16px !important;
            text-align: center !important;
          }
          .cta-banner h2 {
            font-size: 18px !important;
            text-align: center !important;
          }
          .cta-banner p {
            font-size: 14px !important;
            text-align: center !important;
          }
          .cta-banner button {
            width: 100% !important;
            max-width: 280px !important;
          }
          
          /* Section Headers */
          .section-header {
            font-size: 24px !important;
            margin-bottom: 24px !important;
          }
        }
        
        @media (max-width: 480px) {
          .lead-form-content {
            padding: 20px 12px !important;
          }
          .lead-form-content h2 {
            font-size: 22px !important;
          }
          .cta-box h2,
          .cta-banner h2,
          .section-header {
            font-size: 22px !important;
          }
          .cost-table th,
          .cost-table td {
            padding: 10px 8px !important;
            font-size: 13px !important;
          }
          .cost-section {
            padding: 0 12px !important;
          }
          .cost-section h2 {
            font-size: 20px !important;
          }
        }
      `}</style>
      
      {/* Lead Form Modal */}
      {showLeadForm && (
        <div className="lead-form-modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          zIndex: 1000,
          padding: '10px',
          overflowY: 'auto'
        }}>
          <div className="lead-form-content" style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: 'clamp(16px, 3vw, 24px)',
            maxWidth: '720px',
            width: '100%',
            maxHeight: '95vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            margin: 'auto 0'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowLeadForm(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '4px',
                lineHeight: 1
              }}
            >
              ×
            </button>

            {/* Form Header */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '6px',
              textAlign: 'center'
            }}>
              Get your life insurance options
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              Complete a short form to receive a free, no-obligation quote.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmitLead}>
              {/* First Name and Last Name */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    First Name <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    onBlur={() => {
                      const error = validateFirstName(formData.firstName)
                      if (error) setFormErrors(prev => ({ ...prev, firstName: error }))
                    }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                      border: `1px solid ${formErrors.firstName ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                  {formErrors.firstName && <p style={{ color: '#ef4444', fontSize: '11px', margin: '2px 0 0 0' }}>{formErrors.firstName}</p>}
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Last Name <span style={{ color: '#013946' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    onBlur={() => {
                      const error = validateLastName(formData.lastName)
                      if (error) setFormErrors(prev => ({ ...prev, lastName: error }))
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.lastName ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                  {formErrors.lastName && <p style={{ color: '#ef4444', fontSize: '11px', margin: '2px 0 0 0' }}>{formErrors.lastName}</p>}
                </div>
              </div>

              {/* Email and Phone Number */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px', alignItems: 'start' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Email Address <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                    type="email"
                  required
                    placeholder="john.smith@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => {
                      const error = validateEmail(formData.email)
                      if (error) setFormErrors(prev => ({ ...prev, email: error }))
                    }}
                  style={{
                    width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.email ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                  {formErrors.email && <p style={{ color: '#ef4444', fontSize: '11px', margin: '2px 0 0 0' }}>{formErrors.email}</p>}
              </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Phone Number <span style={{ color: '#013946' }}>*</span> <span style={{ fontWeight: 400, color: '#6b7280' }}>(we'll send a code)</span>
                </label>
                <input
                    type="tel"
                  required
                    placeholder="(555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      handleInputChange('phoneNumber', formatted)
                    }}
                    onBlur={() => {
                      const error = validatePhone(formData.phoneNumber)
                      if (error) setFormErrors(prev => ({ ...prev, phoneNumber: error }))
                    }}
                  style={{
                    width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.phoneNumber ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                  {formErrors.phoneNumber && <p style={{ color: '#ef4444', fontSize: '11px', margin: '2px 0 0 0' }}>{formErrors.phoneNumber}</p>}
                </div>
              </div>

              {/* Gender and Age Row */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px', alignItems: 'start' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Gender <span style={{ color: '#013946' }}>*</span>
                </label>
                  <div className="gender-buttons" style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                      onClick={() => {
                        handleInputChange('gender', 'Man')
                        setFormErrors(prev => ({ ...prev, gender: '' }))
                      }}
                    style={{
                      flex: 1,
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: `1px solid ${formData.gender === 'Man' ? '#FFB800' : formErrors.gender ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        backgroundColor: formData.gender === 'Man' ? '#FFB800' : '#fff',
                        color: formData.gender === 'Man' ? '#013946' : '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Man
                  </button>
                  <button
                    type="button"
                      onClick={() => {
                        handleInputChange('gender', 'Woman')
                        setFormErrors(prev => ({ ...prev, gender: '' }))
                      }}
                    style={{
                      flex: 1,
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: `1px solid ${formData.gender === 'Woman' ? '#FFB800' : formErrors.gender ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        backgroundColor: formData.gender === 'Woman' ? '#FFB800' : '#fff',
                        color: formData.gender === 'Woman' ? '#013946' : '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Woman
                  </button>
                  </div>
                  {formErrors.gender && <p style={{ color: '#ef4444', fontSize: '11px', margin: '2px 0 0 0' }}>{formErrors.gender}</p>}
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Age <span style={{ color: '#013946' }}>*</span>
                  </label>
                <input
                  type="text"
                  required
                    maxLength={3}
                    placeholder="e.g. 35"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 3)
                      handleInputChange('dateOfBirth', value)
                  }}
                    onBlur={() => {
                      const error = validateDateOfBirth(formData.dateOfBirth)
                      if (error) setFormErrors(prev => ({ ...prev, dateOfBirth: error }))
                  }}
                  style={{
                    width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.dateOfBirth ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                  {formErrors.dateOfBirth && <p style={{ color: '#ef4444', fontSize: '11px', margin: '2px 0 0 0' }}>{formErrors.dateOfBirth}</p>}
                </div>
              </div>

              {/* Smoker Status and Province Row */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px', alignItems: 'start' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Smoker Status <span style={{ color: '#013946' }}>*</span>
                  </label>
                  <div className="smoker-buttons" style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                      onClick={() => {
                        handleInputChange('smokerStatus', 'No')
                        setFormErrors(prev => ({ ...prev, smokerStatus: '' }))
                      }}
                    style={{
                      flex: 1,
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: `1px solid ${formData.smokerStatus === 'No' ? '#FFB800' : formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        backgroundColor: formData.smokerStatus === 'No' ? '#FFB800' : '#fff',
                        color: formData.smokerStatus === 'No' ? '#013946' : '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                      No
                  </button>
                  <button
                    type="button"
                      onClick={() => {
                        handleInputChange('smokerStatus', 'Yes')
                        setFormErrors(prev => ({ ...prev, smokerStatus: '' }))
                      }}
                    style={{
                      flex: 1,
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: `1px solid ${formData.smokerStatus === 'Yes' ? '#FFB800' : formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        backgroundColor: formData.smokerStatus === 'Yes' ? '#FFB800' : '#fff',
                        color: formData.smokerStatus === 'Yes' ? '#013946' : '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                      Yes
                  </button>
                  </div>
                  {formErrors.smokerStatus && <p style={{ color: '#ef4444', fontSize: '11px', margin: '2px 0 0 0' }}>{formErrors.smokerStatus}</p>}
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Province of residence <span style={{ color: '#013946' }}>*</span>
                </label>
                  <div
                    onClick={() => setModalProvinceOpen(!modalProvinceOpen)}
                    onBlur={() => {
                      setTimeout(() => {
                        setModalProvinceOpen(false)
                      }, 200)
                    }}
                    tabIndex={0}
                  style={{
                    width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.province ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                    backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ color: formData.province ? '#1f2937' : '#9ca3af' }}>
                      {formData.province ? 
                        { AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba', ON: 'Ontario' }[formData.province] 
                        : 'Select...'}
                    </span>
                    <svg width="10" height="6" viewBox="0 0 12 8" fill="none" style={{ transform: modalProvinceOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {modalProvinceOpen && (
                    <ul style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      marginTop: '4px',
                      padding: 0,
                      listStyle: 'none',
                      maxHeight: '160px',
                      overflowY: 'auto',
                      zIndex: 9999,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      {[
                        { value: 'AB', label: 'Alberta' },
                        { value: 'BC', label: 'British Columbia' },
                        { value: 'MB', label: 'Manitoba' },
                        { value: 'ON', label: 'Ontario' }
                      ].map((province) => (
                        <li
                          key={province.value}
                          onClick={() => {
                            handleInputChange('province', province.value);
                            setFormErrors(prev => ({ ...prev, province: '' }));
                            setModalProvinceOpen(false);
                          }}
                          style={{
                            padding: '10px 12px',
                            fontSize: '14px',
                            color: '#1f2937',
                            cursor: 'pointer',
                            backgroundColor: formData.province === province.value ? '#e0f7fa' : '#fff',
                            borderBottom: '1px solid #f3f4f6'
                          }}
                          onMouseEnter={(e) => {
                            if (formData.province !== province.value) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = formData.province === province.value ? '#e0f7fa' : '#fff';
                          }}
                        >
                          {province.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {formErrors.province && <p style={{ color: '#ef4444', fontSize: '11px', margin: '2px 0 0 0' }}>{formErrors.province}</p>}
                </div>
              </div>

              {/* Row 5: Coverage Amount and Term Length */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                {/* Coverage Amount Dropdown */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Coverage Amount <span style={{ color: '#013946' }}>*</span>
                </label>
                  <div
                    onClick={() => setModalCoverageOpen(!modalCoverageOpen)}
                    onBlur={() => {
                      setTimeout(() => {
                        setModalCoverageOpen(false)
                      }, 200)
                    }}
                    tabIndex={0}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.coverageAmount ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ color: formData.coverageAmount ? '#1f2937' : '#9ca3af' }}>
                      {formData.coverageAmount ? 
                        coverageOptions.find(opt => opt.value === formData.coverageAmount)?.label 
                        : 'Select...'}
                    </span>
                    <svg width="10" height="6" viewBox="0 0 12 8" fill="none" style={{ transform: modalCoverageOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {modalCoverageOpen && (
                    <ul style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      marginTop: '4px',
                      padding: 0,
                      listStyle: 'none',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 9999,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      {coverageOptions.map((option) => (
                        <li
                          key={option.value}
                          onClick={() => {
                            handleInputChange('coverageAmount', option.value);
                            setFormErrors(prev => ({ ...prev, coverageAmount: '' }));
                            setModalCoverageOpen(false);
                          }}
                          style={{
                            padding: '10px 12px',
                            fontSize: '14px',
                            color: '#1f2937',
                            cursor: 'pointer',
                            backgroundColor: formData.coverageAmount === option.value ? '#e0f7fa' : '#fff',
                            borderBottom: '1px solid #f3f4f6'
                          }}
                          onMouseEnter={(e) => {
                            if (formData.coverageAmount !== option.value) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = formData.coverageAmount === option.value ? '#e0f7fa' : '#fff';
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {formErrors.coverageAmount && <p style={{ color: '#ef4444', fontSize: '11px', margin: '2px 0 0 0' }}>{formErrors.coverageAmount}</p>}
                </div>

                {/* Term Length Dropdown */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Term Length <span style={{ color: '#013946' }}>*</span>
                  </label>
                  <div
                    onClick={() => setModalTermOpen(!modalTermOpen)}
                    onBlur={() => {
                      setTimeout(() => {
                        setModalTermOpen(false)
                      }, 200)
                    }}
                    tabIndex={0}
                  style={{
                    width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.termLength ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ color: formData.termLength ? '#1f2937' : '#9ca3af' }}>
                      {formData.termLength ? `${formData.termLength} years` : 'Select...'}
                    </span>
                    <svg width="10" height="6" viewBox="0 0 12 8" fill="none" style={{ transform: modalTermOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {modalTermOpen && (
                    <ul style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                    border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      marginTop: '4px',
                      padding: 0,
                      listStyle: 'none',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 9999,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      {termLengthOptions.map((option) => (
                        <li
                          key={option.value}
                          onClick={() => {
                            handleInputChange('termLength', option.value);
                            setFormErrors(prev => ({ ...prev, termLength: '' }));
                            setModalTermOpen(false);
                          }}
                          style={{
                            padding: '10px 12px',
                            fontSize: '14px',
                            color: '#1f2937',
                            cursor: 'pointer',
                            backgroundColor: formData.termLength === option.value ? '#e0f7fa' : '#fff',
                            borderBottom: '1px solid #f3f4f6'
                          }}
                          onMouseEnter={(e) => {
                            if (formData.termLength !== option.value) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = formData.termLength === option.value ? '#e0f7fa' : '#fff';
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {formErrors.termLength && <p style={{ color: '#ef4444', fontSize: '11px', margin: '2px 0 0 0' }}>{formErrors.termLength}</p>}
                </div>
              </div>

              {/* OTP Verification Field */}
              {showOtpField && (
                <div style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Verification code <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                  type="text"
                    maxLength={6}
                    placeholder="Enter verification code sent on phone"
                    value={otpValue}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setOtpValue(value)
                      setOtpError('')
                    }}
                  style={{
                    width: '100%',
                      padding: '10px 12px',
                      fontSize: '16px',
                      border: `1px solid ${otpError ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {otpError && <p style={{ color: '#ef4444', fontSize: '11px', margin: '2px 0 0 0' }}>{otpError}</p>}
                  <p style={{ 
                    textAlign: 'center', 
                    marginTop: '8px', 
                    fontSize: '12px', 
                    color: '#6b7280' 
                  }}>
                    Didn't receive the code? <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault()
                        alert('OTP resent to your phone!')
                      }}
                      style={{ color: '#013946', textDecoration: 'underline', fontWeight: 600 }}
                    >Resend OTP</a>
                  </p>
              </div>
              )}

              {/* Submit/Verify Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  if (!showOtpField) {
                    const errors: {[key: string]: string} = {}
                    const firstNameError = validateFirstName(formData.firstName)
                    const lastNameError = validateLastName(formData.lastName)
                    const emailError = validateEmail(formData.email)
                    const phoneError = validatePhone(formData.phoneNumber)
                    const genderError = validateGender(formData.gender)
                    const dobError = validateDateOfBirth(formData.dateOfBirth)
                    const provinceError = validateProvince(formData.province)
                    const smokerError = validateSmokerStatus(formData.smokerStatus)
                    
                    if (firstNameError) errors.firstName = firstNameError
                    if (lastNameError) errors.lastName = lastNameError
                    if (emailError) errors.email = emailError
                    if (phoneError) errors.phoneNumber = phoneError
                    if (genderError) errors.gender = genderError
                    if (dobError) errors.dateOfBirth = dobError
                    if (provinceError) errors.province = provinceError
                    if (smokerError) errors.smokerStatus = smokerError
                    
                    if (Object.keys(errors).length > 0) {
                      setFormErrors(errors)
                      return
                    }
                    
                    setShowOtpField(true)
                  } else {
                    if (otpValue.length !== 6) {
                      setOtpError('Please enter the 6-digit OTP')
                      return
                    }
                    handleSubmitLead(e as any)
                  }
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#013946',
                  backgroundColor: '#FFB800',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'background-color 0.3s ease'
                }}
              >
                {showOtpField ? 'Verify' : 'Submit Request'}
              </button>

              {/* Form Disclaimer */}
              <div style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '12px',
                marginTop: '12px'
              }}>
                <p style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  margin: '0',
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  You consent to PolicyAdvisor sharing your information with Sun Life to provide coverage options. A licensed Sun Life advisor may contact you to discuss coverage options tailored to you. For more details, see our <a href="https://www.policyadvisor.com/terms-of-service/" target="_blank" rel="noopener noreferrer" style={{ color: '#013946', textDecoration: 'underline' }}>Terms of Service</a> and <a href="https://www.policyadvisor.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: '#013946', textDecoration: 'underline' }}>Privacy Policy</a>.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Header Bar with Logos */}
      <div className="header-logo-bar" style={{
        width: '100%',
        backgroundColor: '#F9FAFA',
        position: 'relative',
        padding: '12px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
            <Image
              src="/IMAGE-TOP-OVERLAY-Life-2.png"
            alt="PolicyAdvisor and Sun Life"
            width={400}
            height={50}
              style={{
              width: 'auto',
              height: '40px',
              objectFit: 'contain',
              display: 'block'
            }}
            priority
          />
        </div>
      </div>

      {/* Hero Section - Desktop with Overlapping Form */}
      <section className="hero-section hero-desktop" style={{ position: 'relative', paddingBottom: '0' }}>
        {/* Top Section - Light background with text */}
        <div style={{ 
          backgroundColor: '#f8fafa',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
          display: 'flex',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 40px 50px',
            position: 'relative'
          }}>
            {/* Left Side - Text Content */}
          <div style={{
              flex: '1',
              maxWidth: '50%',
              paddingRight: '30px'
            }}>
            <h1 style={{
                color: '#1a1a1a',
                fontSize: 'clamp(32px, 4vw, 44px)',
              fontWeight: '700',
              lineHeight: '1.15',
                marginBottom: '14px'
            }}>
              Plan today,<br />
              Protect tomorrow<br />
                with Sun Life.
            </h1>
              <p style={{
                color: '#4a5568',
                fontSize: 'clamp(15px, 1.6vw, 18px)',
                lineHeight: '1.55',
                maxWidth: '440px',
                margin: 0
              }}>
                Protect your loved ones with life insurance from one of Canada's most trusted insurers. Get expert guidance from licensed advisors to help you choose coverage that fits your life, goals, and budget.
              </p>
            </div>

            {/* Right Side - Spacer for form positioning */}
            <div style={{ flex: '1', maxWidth: '50%' }} />
          </div>
        </div>

        {/* Bottom Section - Full Width Image */}
        <div style={{ 
          position: 'relative',
          width: '100%'
        }}>
          <Image
            src="/Mid-Header-5.png"
            alt="Family protection with Sun Life"
            width={1920}
            height={600}
              style={{
            width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>

        {/* Floating Form Card - Positioned to overlap both sections */}
        <div className="floating-form-wrapper" style={{
          position: 'absolute',
          top: '30px',
          right: 'max(30px, calc((100% - 1200px) / 2 + 20px))',
          width: '100%',
          maxWidth: '520px',
          zIndex: 100
        }}>
          <div className="hero-form-container" style={{
            backgroundColor: '#FFF8E0',
            borderRadius: '12px',
            padding: '40px 36px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.075)'
          }}>
            {/* Form Header */}
            <h2 style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              Get your life insurance options
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#4a4a4a',
              marginBottom: '24px',
              lineHeight: '1.5',
              textAlign: 'center'
            }}>
              Complete a short form to receive a free, no-obligation quote.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmitLead}>
              {/* First Name and Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    First Name *
                  </label>
                <input
                  type="text"
                    required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    onBlur={() => {
                      const error = validateFirstName(formData.firstName)
                      if (error) setFormErrors(prev => ({ ...prev, firstName: error }))
                    }}
                  style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: `1px solid ${formErrors.firstName ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                    outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.firstName && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.firstName}</p>}
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    onBlur={() => {
                      const error = validateLastName(formData.lastName)
                      if (error) setFormErrors(prev => ({ ...prev, lastName: error }))
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.lastName ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.lastName && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.lastName}</p>}
                </div>
            </div>

              {/* Email and Phone Number */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john.smith@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => {
                      const error = validateEmail(formData.email)
                      if (error) setFormErrors(prev => ({ ...prev, email: error }))
                    }}
              style={{
                width: '100%',
                      padding: '14px 16px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.email ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.email && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.email}</p>}
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Phone Number * <span style={{ fontWeight: 400, color: '#6b7280' }}>(we'll send a code)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      handleInputChange('phoneNumber', formatted)
                    }}
                    onBlur={() => {
                      const error = validatePhone(formData.phoneNumber)
                      if (error) setFormErrors(prev => ({ ...prev, phoneNumber: error }))
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.phoneNumber ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.phoneNumber && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.phoneNumber}</p>}
                </div>
              </div>

              {/* Gender and Age */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Gender *
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      type="button"
                      onClick={() => {
                        handleInputChange('gender', 'Man')
                        setFormErrors(prev => ({ ...prev, gender: '' }))
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 8px',
                        fontSize: '14px',
                        border: `1px solid ${formData.gender === 'Man' ? '#FFB800' : formErrors.gender ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        backgroundColor: formData.gender === 'Man' ? '#FFB800' : '#fff',
                        color: formData.gender === 'Man' ? '#013946' : '#1f2937',
                cursor: 'pointer',
                        fontWeight: 500
              }}
            >
                      Man
            </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('gender', 'Woman')
                        setFormErrors(prev => ({ ...prev, gender: '' }))
                      }}
                style={{
                        flex: 1,
                        padding: '10px 8px',
                        fontSize: '14px',
                        border: `1px solid ${formData.gender === 'Woman' ? '#FFB800' : formErrors.gender ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        backgroundColor: formData.gender === 'Woman' ? '#FFB800' : '#fff',
                        color: formData.gender === 'Woman' ? '#013946' : '#1f2937',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                      Woman
              </button>
          </div>
                  {formErrors.gender && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.gender}</p>}
        </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Age *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="e.g. 35"
                    value={formData.dateOfBirth}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 3)
                      handleInputChange('dateOfBirth', value)
                    }}
                    onBlur={() => {
                      const error = validateDateOfBirth(formData.dateOfBirth)
                      if (error) setFormErrors(prev => ({ ...prev, dateOfBirth: error }))
                    }}
            style={{
            width: '100%',
                      padding: '14px 16px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.dateOfBirth ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.dateOfBirth && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.dateOfBirth}</p>}
            </div>
              </div>

              {/* Smoker Status and Province */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Smoker Status *
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('smokerStatus', 'No')
                        setFormErrors(prev => ({ ...prev, smokerStatus: '' }))
                      }}
              style={{
                        flex: 1,
                        padding: '14px 16px',
              fontSize: '14px',
                        border: `1px solid ${formData.smokerStatus === 'No' ? '#FFB800' : formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        backgroundColor: formData.smokerStatus === 'No' ? '#FFB800' : '#fff',
                        color: formData.smokerStatus === 'No' ? '#013946' : '#1f2937',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('smokerStatus', 'Yes')
                        setFormErrors(prev => ({ ...prev, smokerStatus: '' }))
                      }}
                style={{
                        flex: 1,
                        padding: '14px 16px',
                        fontSize: '14px',
                        border: `1px solid ${formData.smokerStatus === 'Yes' ? '#FFB800' : formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        backgroundColor: formData.smokerStatus === 'Yes' ? '#FFB800' : '#fff',
                        color: formData.smokerStatus === 'Yes' ? '#013946' : '#1f2937',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                      Yes
              </button>
          </div>
                  {formErrors.smokerStatus && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.smokerStatus}</p>}
        </div>
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Province of residence *
                  </label>
                  <div
                    onClick={() => setEmbeddedProvinceOpen(!embeddedProvinceOpen)}
                    onBlur={() => {
                      setTimeout(() => {
                        setEmbeddedProvinceOpen(false)
                      }, 200)
                    }}
                    tabIndex={0}
                    style={{
            width: '100%',
                      padding: '14px 16px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.province ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ color: formData.province ? '#1f2937' : '#9ca3af' }}>
                      {formData.province ? 
                        { AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba', ON: 'Ontario' }[formData.province] 
                        : 'Select...'}
                    </span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: embeddedProvinceOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {embeddedProvinceOpen && (
                    <ul style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      marginTop: '4px',
                      padding: 0,
                      listStyle: 'none',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 9999,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      {[
                        { value: 'AB', label: 'Alberta' },
                        { value: 'BC', label: 'British Columbia' },
                        { value: 'MB', label: 'Manitoba' },
                        { value: 'ON', label: 'Ontario' }
                      ].map((province) => (
                        <li
                          key={province.value}
                          onClick={() => {
                            handleInputChange('province', province.value);
                            setFormErrors(prev => ({ ...prev, province: '' }));
                            setEmbeddedProvinceOpen(false);
                          }}
                          style={{
                            padding: '12px 16px',
                            fontSize: '14px',
              color: '#1f2937',
                            cursor: 'pointer',
                            backgroundColor: formData.province === province.value ? '#e0f7fa' : '#fff',
                            borderBottom: '1px solid #f3f4f6'
                          }}
                          onMouseEnter={(e) => {
                            if (formData.province !== province.value) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = formData.province === province.value ? '#e0f7fa' : '#fff';
                          }}
                        >
                          {province.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {formErrors.province && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.province}</p>}
                </div>
          </div>
          
              {/* Coverage Amount and Term Length */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                {/* Coverage Amount Dropdown */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Coverage Amount *
                  </label>
                  <div
                    onClick={() => setEmbeddedCoverageOpen(!embeddedCoverageOpen)}
                    onBlur={() => {
                      setTimeout(() => {
                        setEmbeddedCoverageOpen(false)
                      }, 200)
                    }}
                    tabIndex={0}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.coverageAmount ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ color: formData.coverageAmount ? '#1f2937' : '#9ca3af' }}>
                      {formData.coverageAmount ? 
                        coverageOptions.find(opt => opt.value === formData.coverageAmount)?.label 
                        : 'Select...'}
                    </span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: embeddedCoverageOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {embeddedCoverageOpen && (
                    <ul style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      marginTop: '4px',
                      padding: 0,
                      listStyle: 'none',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 9999,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      {coverageOptions.map((option) => (
                        <li
                          key={option.value}
                          onClick={() => {
                            handleInputChange('coverageAmount', option.value);
                            setFormErrors(prev => ({ ...prev, coverageAmount: '' }));
                            setEmbeddedCoverageOpen(false);
                          }}
                          style={{
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#1f2937',
                            cursor: 'pointer',
                            backgroundColor: formData.coverageAmount === option.value ? '#e0f7fa' : '#fff',
                            borderBottom: '1px solid #f3f4f6'
                          }}
                          onMouseEnter={(e) => {
                            if (formData.coverageAmount !== option.value) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = formData.coverageAmount === option.value ? '#e0f7fa' : '#fff';
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {formErrors.coverageAmount && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.coverageAmount}</p>}
                </div>

                {/* Term Length Dropdown */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Term Length *
                  </label>
                  <div
                    onClick={() => setEmbeddedTermOpen(!embeddedTermOpen)}
                    onBlur={() => {
                      setTimeout(() => {
                        setEmbeddedTermOpen(false)
                      }, 200)
                    }}
                    tabIndex={0}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.termLength ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ color: formData.termLength ? '#1f2937' : '#9ca3af' }}>
                      {formData.termLength ? `${formData.termLength} years` : 'Select...'}
                    </span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: embeddedTermOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {embeddedTermOpen && (
                    <ul style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      marginTop: '4px',
                      padding: 0,
                      listStyle: 'none',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 9999,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      {termLengthOptions.map((option) => (
                        <li
                          key={option.value}
                          onClick={() => {
                            handleInputChange('termLength', option.value);
                            setFormErrors(prev => ({ ...prev, termLength: '' }));
                            setEmbeddedTermOpen(false);
                          }}
                          style={{
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#1f2937',
                            cursor: 'pointer',
                            backgroundColor: formData.termLength === option.value ? '#e0f7fa' : '#fff',
                            borderBottom: '1px solid #f3f4f6'
                          }}
                          onMouseEnter={(e) => {
                            if (formData.termLength !== option.value) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = formData.termLength === option.value ? '#e0f7fa' : '#fff';
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {formErrors.termLength && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.termLength}</p>}
                </div>
              </div>
          
              {/* OTP Verification Field */}
              {showOtpField && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Verification code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter verification code sent on phone"
                    value={otpValue}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setOtpValue(value)
                      setOtpError('')
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '16px',
                      border: `1px solid ${otpError ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {otpError && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{otpError}</p>}
                  <p style={{ 
                    textAlign: 'center', 
                    marginTop: '10px', 
                    fontSize: '13px', 
                    color: '#6b7280' 
                  }}>
                    Didn't receive the code? <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault()
                        // Resend OTP logic here
                        alert('OTP resent to your phone!')
                      }}
                      style={{ color: '#013946', textDecoration: 'underline', fontWeight: 600 }}
                    >Resend OTP</a>
                  </p>
                </div>
              )}

              {/* Submit/Verify Button */}
            <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  if (!showOtpField) {
                    // First click - validate form and send OTP
                    const errors: {[key: string]: string} = {}
                    const firstNameError = validateFirstName(formData.firstName)
                    const lastNameError = validateLastName(formData.lastName)
                    const emailError = validateEmail(formData.email)
                    const phoneError = validatePhone(formData.phoneNumber)
                    const genderError = validateGender(formData.gender)
                    const dobError = validateDateOfBirth(formData.dateOfBirth)
                    const provinceError = validateProvince(formData.province)
                    const smokerError = validateSmokerStatus(formData.smokerStatus)
                    
                    if (firstNameError) errors.firstName = firstNameError
                    if (lastNameError) errors.lastName = lastNameError
                    if (emailError) errors.email = emailError
                    if (phoneError) errors.phoneNumber = phoneError
                    if (genderError) errors.gender = genderError
                    if (dobError) errors.dateOfBirth = dobError
                    if (provinceError) errors.province = provinceError
                    if (smokerError) errors.smokerStatus = smokerError
                    
                    if (Object.keys(errors).length > 0) {
                      setFormErrors(errors)
                      return
                    }
                    
                    // Send OTP (simulate)
                    setShowOtpField(true)
                  } else {
                    // Second click - verify OTP
                    if (otpValue.length !== 6) {
                      setOtpError('Please enter the 6-digit OTP')
                      return
                    }
                    // Submit the form
                    handleSubmitLead(e as any)
                  }
                }}
              style={{
                width: '100%',
                padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#013946',
                  backgroundColor: '#FFB800',
                border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {showOtpField ? 'Verify' : 'Submit Request'}
            </button>

              {/* Form Disclaimer */}
              <p style={{
                marginTop: '10px',
                fontSize: '11px',
                color: '#666',
                lineHeight: '1.5',
                textAlign: 'center',
                margin: '10px 0 0 0'
              }}>
                You consent to PolicyAdvisor sharing your information with Sun Life to provide coverage options. A licensed Sun Life advisor may contact you to discuss coverage options tailored to you. For more details, see our <a href="https://www.policyadvisor.com/terms-of-service/" target="_blank" rel="noopener noreferrer" style={{ color: '#013946', textDecoration: 'underline' }}>Terms of Service</a> and <a href="https://www.policyadvisor.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: '#013946', textDecoration: 'underline' }}>Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Hero Section - Mobile */}
      <section className="hero-section hero-mobile" style={{ display: 'none', overflow: 'visible' }}>
          <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          backgroundColor: '#EEFCFE',
          overflow: 'visible'
        }}>
          {/* Hero Text */}
          <div style={{
            padding: '24px 20px 20px',
            textAlign: 'center'
          }}>
            <h1 style={{
              color: '#013946',
              fontSize: '28px',
              fontWeight: '700',
              lineHeight: '1.2',
              marginBottom: '10px'
            }}>
              Plan today,<br />
              Protect tomorrow<br />
              with Sun Life.
            </h1>
          </div>

          {/* Hero Image - Mobile */}
          <div style={{ width: '100%', overflow: 'hidden' }}>
          <Image
              src="/Header-base-2.png"
              alt="Protect your family's future with Sun Life"
              width={1200}
              height={600}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
          
          {/* Mobile Form */}
          <div style={{
            width: '100%',
            padding: '16px 20px',
            backgroundColor: '#fff',
            overflow: 'visible'
          }}>
            <p style={{
              fontSize: '16px',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '16px',
              lineHeight: '1.5',
              fontWeight: 800
            }}>
              Get your free Sun Life life insurance quote below.
            </p>
            <form onSubmit={handleSubmitLead}>
              {/* Full Name */}
              {/* First Name and Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    First Name <span style={{ color: '#013946' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    onBlur={() => {
                      const error = validateFirstName(formData.firstName)
                      if (error) setFormErrors(prev => ({ ...prev, firstName: error }))
                    }}
              style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: `1px solid ${formErrors.firstName ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                  {formErrors.firstName && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.firstName}</p>}
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Last Name <span style={{ color: '#013946' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    onBlur={() => {
                      const error = validateLastName(formData.lastName)
                      if (error) setFormErrors(prev => ({ ...prev, lastName: error }))
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: `1px solid ${formErrors.lastName ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                  {formErrors.lastName && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.lastName}</p>}
                </div>
          </div>
          
              {/* Phone and Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Phone <span style={{ color: '#013946' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      handleInputChange('phoneNumber', formatted)
                    }}
                    onBlur={() => {
                      const error = validatePhone(formData.phoneNumber)
                      if (error) setFormErrors(prev => ({ ...prev, phoneNumber: error }))
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: `1px solid ${formErrors.phoneNumber ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                  {formErrors.phoneNumber && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.phoneNumber}</p>}
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Email <span style={{ color: '#013946' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => {
                      const error = validateEmail(formData.email)
                      if (error) setFormErrors(prev => ({ ...prev, email: error }))
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: `1px solid ${formErrors.email ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                  {formErrors.email && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.email}</p>}
                </div>
              </div>

              {/* Age */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Age <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  placeholder="e.g. 35"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 3)
                    handleInputChange('dateOfBirth', value)
                  }}
                  onBlur={() => {
                    const error = validateDateOfBirth(formData.dateOfBirth)
                    if (error) setFormErrors(prev => ({ ...prev, dateOfBirth: error }))
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: `1px solid ${formErrors.dateOfBirth ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                {formErrors.dateOfBirth && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.dateOfBirth}</p>}
              </div>

              {/* Gender */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Gender <span style={{ color: '#013946' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
            <button
                    type="button"
                    onClick={() => {
                      handleInputChange('gender', 'Man')
                      setFormErrors(prev => ({ ...prev, gender: '' }))
                    }}
              style={{
                      flex: 1,
                      padding: '8px 10px',
                      fontSize: '14px',
                      border: formData.gender === 'Man' ? 'none' : `1px solid ${formErrors.gender ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: formData.gender === 'Man' ? '#FFB800' : '#fff',
                      color: formData.gender === 'Man' ? '#013946' : '#1f2937',
                cursor: 'pointer',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  >
                    Man
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('gender', 'Woman')
                      setFormErrors(prev => ({ ...prev, gender: '' }))
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      fontSize: '14px',
                      border: formData.gender === 'Woman' ? 'none' : `1px solid ${formErrors.gender ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: formData.gender === 'Woman' ? '#FFB800' : '#fff',
                      color: formData.gender === 'Woman' ? '#013946' : '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  >
                    Woman
            </button>
                </div>
                {formErrors.gender && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.gender}</p>}
          </div>

              {/* Smoker Status */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Smoker <span style={{ color: '#013946' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('smokerStatus', 'No')
                      setFormErrors(prev => ({ ...prev, smokerStatus: '' }))
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      fontSize: '14px',
                      border: formData.smokerStatus === 'No' ? 'none' : `1px solid ${formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: formData.smokerStatus === 'No' ? '#FFB800' : '#fff',
                      color: formData.smokerStatus === 'No' ? '#013946' : '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('smokerStatus', 'Yes')
                      setFormErrors(prev => ({ ...prev, smokerStatus: '' }))
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      fontSize: '14px',
                      border: formData.smokerStatus === 'Yes' ? 'none' : `1px solid ${formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: formData.smokerStatus === 'Yes' ? '#FFB800' : '#fff',
                      color: formData.smokerStatus === 'Yes' ? '#013946' : '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  >
                    Yes
                  </button>
                </div>
                {formErrors.smokerStatus && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.smokerStatus}</p>}
          </div>
          
              {/* Province - Custom Dropdown */}
              <div style={{ marginBottom: '10px', position: 'relative' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Province of residence <span style={{ color: '#013946' }}>*</span>
                </label>
                <div
                  onClick={() => setMobileProvinceOpen(!mobileProvinceOpen)}
                  onBlur={() => {
                    setTimeout(() => {
                      setMobileProvinceOpen(false)
                    }, 200)
                  }}
                  tabIndex={0}
              style={{
                width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: `1px solid ${formErrors.province ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ color: formData.province ? '#1f2937' : '#9ca3af' }}>
                    {formData.province ? 
                      { AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba', ON: 'Ontario' }[formData.province] 
                      : 'Select...'}
                  </span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: mobileProvinceOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {mobileProvinceOpen && (
                  <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    marginTop: '4px',
                    padding: 0,
                    listStyle: 'none',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 9999,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {[
                      { value: 'AB', label: 'Alberta' },
                      { value: 'BC', label: 'British Columbia' },
                      { value: 'MB', label: 'Manitoba' },
                      { value: 'ON', label: 'Ontario' }
                    ].map((province) => (
                      <li
                        key={province.value}
                        onClick={() => {
                          handleInputChange('province', province.value);
                          setFormErrors(prev => ({ ...prev, province: '' }));
                          setMobileProvinceOpen(false);
                        }}
                        style={{
                          padding: '12px 16px',
                          fontSize: '15px',
                          color: '#1f2937',
                          cursor: 'pointer',
                          backgroundColor: formData.province === province.value ? '#e0f7fa' : '#fff',
                          borderBottom: '1px solid #f3f4f6'
                        }}
                      >
                        {province.label}
                      </li>
                    ))}
                  </ul>
                )}
                {formErrors.province && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.province}</p>}
              </div>

              {/* Coverage Amount - Mobile */}
              <div style={{ marginBottom: '14px', position: 'relative' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Coverage Amount <span style={{ color: '#013946' }}>*</span>
                </label>
                <div
                  onClick={() => setMobileCoverageOpen(!mobileCoverageOpen)}
                  onBlur={() => {
                    setTimeout(() => {
                      setMobileCoverageOpen(false)
                    }, 200)
                  }}
                  tabIndex={0}
              style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: `1px solid ${formErrors.coverageAmount ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                    backgroundColor: '#fff',
                cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ color: formData.coverageAmount ? '#1f2937' : '#9ca3af' }}>
                    {formData.coverageAmount ? 
                      coverageOptions.find(opt => opt.value === formData.coverageAmount)?.label 
                      : 'Select...'}
                  </span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: mobileCoverageOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {mobileCoverageOpen && (
                  <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    marginTop: '4px',
                    padding: 0,
                    listStyle: 'none',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 9999,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {coverageOptions.map((option) => (
                      <li
                        key={option.value}
                    onClick={() => {
                          handleInputChange('coverageAmount', option.value);
                          setFormErrors(prev => ({ ...prev, coverageAmount: '' }));
                          setMobileCoverageOpen(false);
                    }}
                    style={{
                          padding: '12px 16px',
                          fontSize: '15px',
                      color: '#1f2937',
                      cursor: 'pointer',
                          backgroundColor: formData.coverageAmount === option.value ? '#e0f7fa' : '#fff',
                          borderBottom: '1px solid #f3f4f6'
                        }}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
                {formErrors.coverageAmount && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.coverageAmount}</p>}
                </div>

              {/* Term Length - Mobile */}
              <div style={{ marginBottom: '14px', position: 'relative' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Term Length <span style={{ color: '#013946' }}>*</span>
                </label>
                <div
                  onClick={() => setMobileTermOpen(!mobileTermOpen)}
                  onBlur={() => {
                    setTimeout(() => {
                      setMobileTermOpen(false)
                    }, 200)
                  }}
                  tabIndex={0}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: `1px solid ${formErrors.termLength ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ color: formData.termLength ? '#1f2937' : '#9ca3af' }}>
                    {formData.termLength ? `${formData.termLength} years` : 'Select...'}
                  </span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: mobileTermOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {mobileTermOpen && (
                  <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    marginTop: '4px',
                    padding: 0,
                    listStyle: 'none',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 9999,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {termLengthOptions.map((option) => (
                      <li
                        key={option.value}
                        onClick={() => {
                          handleInputChange('termLength', option.value);
                          setFormErrors(prev => ({ ...prev, termLength: '' }));
                          setMobileTermOpen(false);
                        }}
                        style={{
                          padding: '12px 16px',
                          fontSize: '15px',
                      color: '#1f2937',
                      cursor: 'pointer',
                          backgroundColor: formData.termLength === option.value ? '#e0f7fa' : '#fff',
                          borderBottom: '1px solid #f3f4f6'
                        }}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
                {formErrors.termLength && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.termLength}</p>}
                </div>

              {/* OTP Verification Field - Mobile */}
              {showOtpField && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                    Verification code <span style={{ color: '#013946' }}>*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter verification code sent on phone"
                    value={otpValue}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setOtpValue(value)
                      setOtpError('')
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: `1px solid ${otpError ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {otpError && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{otpError}</p>}
                  <p style={{ 
                    textAlign: 'center', 
                    marginTop: '10px', 
                    fontSize: '13px', 
                    color: '#6b7280' 
                  }}>
                    Didn't receive the code? <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault()
                        // Resend OTP logic here
                      }}
                      style={{ color: '#013946', fontWeight: '600', textDecoration: 'none' }}
                    >Resend OTP</a>
                  </p>
          </div>
              )}
          
              {/* Submit */}
              <button
                type="button"
                onClick={(e) => {
                  if (!showOtpField) {
                    // First click - validate form and show OTP field
                    if (!validateForm()) {
                      return
                    }
                    setShowOtpField(true)
                  } else {
                    // Second click - verify OTP
                    if (otpValue.length !== 6) {
                      setOtpError('Please enter the 6-digit verification code')
                      return
                    }
                    handleSubmitLead(e as any)
                  }
                }}
              style={{
                width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#fff',
                  backgroundColor: '#013946',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {showOtpField ? 'Verify' : 'Submit Request'}
              </button>

              <p style={{
                marginTop: '10px',
                fontSize: '11px',
                color: '#6b7280',
                lineHeight: '1.5',
                textAlign: 'center'
              }}>
                You consent to PolicyAdvisor sharing your information with Sun Life to provide coverage options. A licensed Sun Life advisor may contact you to discuss coverage options tailored to you. For more details, see our <a href="https://www.policyadvisor.com/terms-of-service/" target="_blank" rel="noopener noreferrer" style={{ color: '#013946', textDecoration: 'underline' }}>Terms of Service</a> and <a href="https://www.policyadvisor.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: '#013946', textDecoration: 'underline' }}>Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* What is Sun Life Insurance */}
      <section className="section section-white">
        <div className="vitality-intro">
          <h2>Protect what matters most with Sun Life</h2>
          <p>
            Life insurance helps ensure your family's financial security when it matters most. Sun Life offers a range of life insurance options designed to provide dependable protection, whether you're planning for the short term or building long-term security.
            <br /><br />
            From affordable term coverage to permanent solutions that build value over time, Sun Life makes it easy to find coverage that aligns with your needs, priorities, and budget.
          </p>
        </div>
      </section>

      {/* Active Lifestyle Benefits */}
      <section className="section section-white">
        <div className="benefits-section">
          <div className="benefits-image" style={{ flex: '0 0 45%' }}>
            <Image
              src="/mid-image-2-.png"
              alt="Family enjoying quality time together"
              width={500}
              height={594}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                objectFit: 'cover',
                maxHeight: '594px'
              }}
            />
          </div>
          <div className="benefits-content">
            <h3>Why Canadians choose Sun Life insurance</h3>
            
            <div style={{ marginTop: '32px', marginBottom: '20px' }}>
              <ul className="benefits-list">
                <li><strong>Financial security for your loved ones</strong><br />
                Life insurance provides a tax-free benefit to help your family manage everyday expenses, pay off debts, replace income, and secure their future when you pass away.</li>
                
                <li><strong>Flexible plans for every life stage</strong><br />
                Choose from temporary term or permanent whole life insurance options that evolve with your needs.</li>
                
                <li><strong>Affordable and customizable</strong><br />
                Find a plan that fits your budget with coverage starting at just a few dollars a day.</li>
                
                <li><strong>Expert guidance, no pressure</strong><br />
                Get a free consultation with a licensed advisor who helps you understand your options and choose confidently.</li>
                
                <li><strong>Trusted by millions of Canadians</strong><br />
                With 150+ years of experience, Sun Life is one of Canada&#39;s most reliable and respected life insurance providers.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>




      {/* Insurance Answers Section */}
      <section className="section section-white">
          <div className="cta-image-box" style={{
          backgroundColor: '#FFF8E0',
          borderRadius: '16px',
          padding: 'clamp(16px, 3vw, 20px) clamp(16px, 4vw, 30px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(20px, 4vw, 40px)',
          maxWidth: '1200px',
          margin: '0 auto',
          flexWrap: 'wrap'
          }}>
          <div style={{
            flex: '1',
            minWidth: '250px',
            maxWidth: '500px'
          }}>
            <Image
              src="/CTA-NEW-.png"
              alt="Ready to get your Sun Life quote"
              width={500}
              height={400}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px'
              }}
            />
              </div>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '16px',
              lineHeight: 1.2,
              textAlign: 'left'
            }}>
              Ready to get your Sun Life quote?
            </h2>
            <p style={{
              fontSize: 'clamp(15px, 2.5vw, 18px)',
              color: '#4a5568',
              lineHeight: 1.6,
              marginBottom: 'clamp(20px, 4vw, 32px)',
              textAlign: 'left'
            }}>
              Get personalized quotes from our licensed advisors in minutes. No obligation, just expert guidance to help you choose the right coverage.
            </p>
            <button
              onClick={() => setShowLeadForm(true)}
              className="btn btn-primary"
              style={{
              backgroundColor: '#013946',
              color: 'white',
                  border: 'none',
              padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)',
              fontSize: 'clamp(14px, 2vw, 16px)',
              fontWeight: 600,
              borderRadius: '8px',
                  cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              width: '100%',
              maxWidth: '250px'
            }}>
              GET MY QUOTE
              </button>
          </div>
        </div>
      </section>

      {/* Term Life Insurance Products */}
      <section className="section section-white">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="centered-underlined-heading" style={{ marginBottom: '40px', fontSize: '32px', fontWeight: 700, color: '#2d3748', lineHeight: 1.3, textAlign: 'center' }}>
            Sun Life term life insurance products
          </h2>
          
          {/* Products Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '32px',
            marginTop: '20px'
          }} className="products-grid-2col">
            {/* Sun Life Evolve Term Life Insurance Card */}
            <div className="product-card" style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '0',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                height: '180px',
                position: 'relative',
                overflow: 'hidden'
              }}>
          <Image
                  src="/SunSpectrum-Term.png"
                  alt="Sun Life Evolve Term Life Insurance"
                  fill
            style={{
                    objectFit: 'cover',
                    objectPosition: 'top'
            }}
          />
        </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: '#1f2937', 
                  marginBottom: '12px',
                  marginTop: 0
                }}>
                  Sun Life Evolve Term Life Insurance
                </h3>
                
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#013946', 
                  marginBottom: '6px',
                  marginTop: 0
                }}>
                  Key features
                </h4>
                <ul style={{ 
                  fontSize: '14px', 
                  color: '#4a5568', 
                  lineHeight: 1.5,
                  margin: '0 0 12px 0',
                  paddingLeft: '18px'
                }}>
                  <li>Coverage from $50,000 up to $25 million</li>
                  <li>Flexible term lengths from 5 to 40 years</li>
                  <li>Flexible coverage that can grow with you at key life events</li>
                </ul>
                
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#013946', 
                  marginBottom: '6px',
                  marginTop: 0
                }}>
                  A good fit if you:
                </h4>
                <ul style={{ 
                  fontSize: '14px', 
                  color: '#4a5568', 
                  lineHeight: 1.5,
                  margin: 0,
                  paddingLeft: '18px'
                }}>
                  <li>Want affordable, flexible coverage for a specific period aligning with major life stages like paying off a mortgage</li>
                  <li>Like the option to convert to permanent coverage later as your needs evolve</li>
                </ul>
                </div>
              </div>

            {/* SunSpectrum Permanent Life II Card */}
            <div className="product-card" style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '0',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                height: '180px',
                position: 'relative',
                overflow: 'hidden'
              }}>
          <Image
                  src="/SunLife-Go-&-SunLife-Go-Simplified-.png"
                  alt="SunSpectrum Permanent Life II"
                  fill
            style={{
                    objectFit: 'cover',
                    objectPosition: 'center 15%'
            }}
          />
                  </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: '#1f2937', 
                  marginBottom: '12px',
                  marginTop: 0
                }}>
                  SunSpectrum Permanent Life II
                </h3>
                
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#013946', 
                  marginBottom: '6px',
                  marginTop: 0
                }}>
                  Key features
                </h4>
                <ul style={{ 
                  fontSize: '14px', 
                  color: '#4a5568', 
                  lineHeight: 1.5,
                  margin: '0 0 12px 0',
                  paddingLeft: '18px'
                }}>
                  <li>Coverage from $25,000 up to $25 million</li>
                  <li>Lifetime protection as long as premiums are paid</li>
                  <li>Guaranteed death benefit, cash values, and premiums</li>
                </ul>
                
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#013946', 
                  marginBottom: '6px',
                  marginTop: 0
                }}>
                  A good fit if you:
                </h4>
                <ul style={{ 
                  fontSize: '14px', 
                  color: '#4a5568', 
                  lineHeight: 1.5,
                  margin: 0,
                  paddingLeft: '18px'
                }}>
                  <li>Want guaranteed lifelong coverage without ongoing management</li>
                  <li>Are planning for retirement, estate protection, or long-term certainty</li>
                  <li>Prefer stable, predictable premiums and guaranteed lifetime protection</li>
                </ul>
                  </div>
                </div>
              </div>
        </div>
      </section>


      {/* Enjoy Exclusive Benefits */}
      <section className="section section-white">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="centered-underlined-heading" style={{ fontSize: '32px', fontWeight: 700, color: '#2d3748', marginBottom: '40px', lineHeight: 1.3, textAlign: 'center' }}>
            Enjoy exclusive benefits
          </h2>

          <div className="benefits-grid" style={{
              display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '33px',
            marginTop: '20px'
          }}>
            {/* Affordable Premiums */}
            <div style={{
              textAlign: 'left'
            }}>
              <div style={{
                display: 'flex',
              alignItems: 'center',
                gap: '12px',
                marginBottom: '10px'
              }}>
                <div style={{
                  fontSize: '28px',
                  color: '#013946',
                  display: 'flex',
                  alignItems: 'center'
              }}>
                <AiOutlineDollar />
                  </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1f2937',
                  margin: 0
              }}>
                Affordable Premiums
              </h3>
              </div>
              <p style={{
                fontSize: '16px',
                color: '#4a5568',
                lineHeight: 1.6,
                margin: 0
              }}>
                Get substantial coverage at a fraction of the cost of permanent insurance, especially when you&#39;re young and healthy.
              </p>
                  </div>

            {/* Financial Protection */}
            <div style={{
              textAlign: 'left'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '10px'
              }}>
                <div style={{
                  fontSize: '28px',
                  color: '#013946',
                  display: 'flex',
                  alignItems: 'center'
              }}>
                <BsShield />
                </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1f2937',
                  margin: 0
              }}>
                Financial Protection
              </h3>
              </div>
              <p style={{
                fontSize: '16px',
                color: '#4a5568',
                lineHeight: 1.6,
                margin: 0
              }}>
                Ensure your family can maintain their lifestyle and meet financial obligations if you&#39;re no longer there to provide.
          </p>
        </div>

            {/* Peace of Mind */}
            <div style={{
              textAlign: 'left'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '10px'
              }}>
                <div style={{
                  fontSize: '28px',
                  color: '#013946',
                  display: 'flex',
                  alignItems: 'center'
              }}>
                <AiOutlineHeart />
          </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1f2937',
                  margin: 0
              }}>
                Peace of Mind
              </h3>
              </div>
              <p style={{
                fontSize: '16px',
                color: '#4a5568',
                lineHeight: 1.6,
                margin: 0
              }}>
                Focus on living your life knowing your family&#39;s financial future is secure during critical years.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost of Term Insurance */}
      <section className="section section-white">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="cost-section" style={{
            display: 'grid',
            gridTemplateColumns: '45% 50%',
            gap: '60px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '32px', 
                fontWeight: 700, 
                color: '#2d3748', 
                marginBottom: '24px', 
                textAlign: 'left', 
                lineHeight: 1.3,
                position: 'relative',
                paddingBottom: '16px'
              }}>
                Cost of term insurance in Canada
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '60px',
                  height: '4px',
                  background: '#013946'
                }}></span>
              </h2>
              <p style={{ 
                fontSize: '17px', 
                color: '#4a5568', 
                lineHeight: 1.5,
                marginTop: '0',
                marginBottom: '0'
              }}>
                Your life insurance premium depends on factors like age, gender, coverage amount, term length, and overall health, but term life coverage is often more affordable than you might think.
                <br />
                Sun Life makes it easy and accessible to protect your family's financial future with flexible, budget-friendly options.
                <br />
                Here are some sample rates. Your exact cost will vary based on your coverage and term.
                <br />
                A licensed Sun Life advisor can help you find the right plan for your needs and budget at no cost.
              </p>
            </div>

            <div style={{
              flex: '0 0 50%'
            }}>
              <table className="cost-table" style={{
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#FFF8E0' }}>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontWeight: 800, 
                    fontSize: '18px', 
                    color: '#1f2937',
                    borderBottom: '2px solid #e5e7eb'
                  }}>
                    Age range
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontWeight: 800, 
                    fontSize: '18px', 
                    color: '#1f2937',
                    borderBottom: '2px solid #e5e7eb'
                  }}>
                    Premiums (female)
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontWeight: 800, 
                    fontSize: '18px', 
                    color: '#1f2937',
                    borderBottom: '2px solid #e5e7eb'
                  }}>
                    Premiums (male)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '18px 20px', fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>Age 20</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$16.65</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$25.20</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <td style={{ padding: '18px 20px', fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>Age 30</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$17.55</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$25.65</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '18px 20px', fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>Age 40</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$23.40</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$31.95</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <td style={{ padding: '18px 20px', fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>Age 50</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$51.30</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$72.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '18px 20px', fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>Age 60</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$161.55</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$230.85</td>
                </tr>
              </tbody>
            </table>
            <p className="cost-disclaimer" style={{ 
              fontSize: '11px', 
              color: '#6b7280', 
              marginTop: '12px', 
              marginBottom: 0,
              textAlign: 'left',
              fontStyle: 'italic'
            }}>
              Illustrative rates only. Based on $500,000 Term 10 coverage. Actual premiums vary. Contact an advisor for a personalized quote.
            </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section - Get Quote */}
      <section className="section section-white">
        <div className="cta-box" style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          backgroundColor: '#FFF8E0',
          padding: 'clamp(20px, 4vw, 35px) clamp(16px, 4vw, 45px)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'clamp(16px, 3vw, 33px)',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <h2 className="cta-heading" style={{ 
              fontSize: 'clamp(16px, 3vw, 32px)', 
            fontWeight: 700, 
            color: '#2d3748', 
              marginBottom: '8px',
            lineHeight: 1.3,
              textAlign: 'left'
          }}>
              Ready to protect your family with Sun&nbsp;Life?
          </h2>
            <p className="cta-subtext" style={{ 
              fontSize: 'clamp(12px, 2vw, 18px)', 
              color: '#4a5568', 
              margin: 0,
            lineHeight: 1.5,
              textAlign: 'left'
          }}>
              Get your personalized Sun&nbsp;Life quote in minutes!
          </p>
          </div>
          <div style={{ width: '100%', maxWidth: '250px', flexShrink: 0 }}>
          <button
            onClick={() => setShowLeadForm(true)}
            className="btn btn-primary"
            style={{
                width: '100%',
                fontSize: 'clamp(14px, 2vw, 16px)',
                padding: 'clamp(12px, 2vw, 16px) clamp(20px, 4vw, 40px)',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
                backgroundColor: '#013946'
            }}
          >
            GET QUOTE
          </button>
          </div>
        </div>
      </section>

      {/* Sun Life Term Life Features */}
      <section className="section section-white">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="centered-underlined-heading" style={{ 
            fontSize: '32px', 
            fontWeight: 700, 
            color: '#2d3748', 
            marginBottom: '40px', 
            textAlign: 'center',
            lineHeight: 1.3 
          }}>
            Sun Life term life features at a glance
          </h2>

          {/* Features Grid */}
          <div className="features-grid" style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '26px',
            marginTop: '20px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Level Premiums */}
            <div className="feature-card" style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '24px',
                 color: '#013946',
                 flexShrink: 0
               }}>
                 <BsGraphUp />
               </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '4px', marginTop: 0 }}>
                  Level premiums
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: 1.5, margin: 0 }}>
                  Your premium amount stays the same for the duration of your chosen term.
                </p>
              </div>
            </div>

            {/* Flexible Terms */}
            <div className="feature-card" style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '24px',
                 color: '#013946',
                 flexShrink: 0
               }}>
                 <AiOutlineCalendar />
               </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '4px', marginTop: 0 }}>
                  Flexible terms
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: 1.5, margin: 0 }}>
                  Choose the coverage period that fits your needs - commonly 10, 20, or 30 years.
                </p>
              </div>
            </div>

            {/* High Coverage Limits */}
            <div className="feature-card" style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '24px',
                 color: '#013946',
                 flexShrink: 0
               }}>
                 <BsShield />
               </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '4px', marginTop: 0 }}>
                  High coverage limits
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: 1.5, margin: 0 }}>
                  Coverage can range from lower amounts to several million dollars, depending on eligibility and underwriting.
                </p>
              </div>
            </div>

            {/* Convertible */}
            <div className="feature-card" style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '24px',
                 color: '#013946',
                 flexShrink: 0
               }}>
                 <AiOutlineSwap />
               </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '4px', marginTop: 0 }}>
                  Convertible
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: 1.5, margin: 0 }}>
                  Switch to permanent life insurance until age 75 (on select plans).
                </p>
              </div>
            </div>

            {/* Customizable Riders */}
            <div className="feature-card" style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '24px',
                 color: '#013946',
                 flexShrink: 0
               }}>
                 <AiOutlinePlus />
               </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '4px', marginTop: 0 }}>
                  Customizable riders
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: 1.5, margin: 0 }}>
                  Add options like disability waiver, accidental death, and child coverage.
                </p>
              </div>
            </div>

            {/* Digital & Advisor-Assisted */}
            <div className="feature-card" style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
             <div style={{
                 display: 'flex',
              alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '24px',
                 color: '#013946',
                 flexShrink: 0
               }}>
                 <AiOutlineLaptop />
               </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '4px', marginTop: 0 }}>
                  Digital & advisor-assisted
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: 1.5, margin: 0 }}>
                  Apply online or with a licensed Sun Life advisor.
                </p>
              </div>
            </div>

            {/* Living Benefit */}
            <div className="feature-card" style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
             <div style={{
                 display: 'flex',
              alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '24px',
                 color: '#013946',
                 flexShrink: 0
               }}>
                 <FaHandHoldingHeart />
            </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '4px', marginTop: 0 }}>
                  Living benefit
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: 1.5, margin: 0 }}>
                  Some plans offer early benefit access if diagnosed with a qualifying terminal illness or similar condition depending on the policy.
                </p>
          </div>
        </div>

            {/* Renewable Coverage */}
            <div className="feature-card" style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
             <div style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '24px',
                 color: '#013946',
                 flexShrink: 0
               }}>
                 <BsGraphUp />
               </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '4px', marginTop: 0 }}>
                  Renewable Coverage
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: 1.5, margin: 0 }}>
                  At the end of your term, you may have the option to renew your coverage without a new medical exam.
                </p>
              </div>
            </div>

            {/* Wellness Resources */}
            <div className="feature-card" style={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
          borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
             <div style={{
          display: 'flex',
          alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '24px',
                 color: '#013946',
                 flexShrink: 0
               }}>
                 <FaUserMd />
          </div>
          <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '4px', marginTop: 0 }}>
                  Wellness resources
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: 1.5, margin: 0 }}>
                  Access to additional resources or tools that support health and wellness, depending on the specific product features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FAQs */}
      <section className="faq-section">
        <h2 style={{ textAlign: 'center' }}>FAQs</h2>
            <p className="faq-subtitle">Everything you need to know about Sun Life life insurance.</p>
        <div className="faq-list">
          <div className={`faq-item ${activeFAQ === 0 ? 'active' : ''}`} onClick={() => toggleFAQ(0)}>
            <div className="faq-question">
                  <span>What is life insurance and how does it work in Canada?</span>
              <span>{activeFAQ === 0 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 0 && (
              <div className="faq-answer">
                    Life insurance provides a tax-free payout to your chosen beneficiaries if you pass away while your policy is active. This benefit can help replace income, pay off debts, cover final expenses, or support your family's financial future.
              </div>
            )}
          </div>
          
          <div className={`faq-item ${activeFAQ === 1 ? 'active' : ''}`} onClick={() => toggleFAQ(1)}>
            <div className="faq-question">
                  <span>Why choose Sun Life for life insurance?</span>
              <span>{activeFAQ === 1 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 1 && (
              <div className="faq-answer">
                    Sun Life is one of Canada's most trusted and established insurers, offering a wide range of life insurance options backed by strong financial stability. Licensed advisors help you choose coverage that fits your needs and budget.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFAQ === 2 ? 'active' : ''}`} onClick={() => toggleFAQ(2)}>
            <div className="faq-question">
                  <span>What types of life insurance does Sun Life offer?</span>
              <span>{activeFAQ === 2 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 2 && (
              <div className="faq-answer">
                    Sun Life offers term life insurance for affordable, time-limited protection, as well as permanent life insurance options designed to provide lifelong coverage and long-term financial planning benefits.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFAQ === 3 ? 'active' : ''}`} onClick={() => toggleFAQ(3)}>
            <div className="faq-question">
                  <span>How much life insurance coverage do I need?</span>
              <span>{activeFAQ === 3 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 3 && (
              <div className="faq-answer">
                    The right amount of coverage depends on factors such as your income, debts, family responsibilities, and long-term goals. A licensed advisor can help assess your situation and recommend an appropriate coverage amount.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFAQ === 4 ? 'active' : ''}`} onClick={() => toggleFAQ(4)}>
            <div className="faq-question">
                  <span>Do I need a medical exam to apply?</span>
              <span>{activeFAQ === 4 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 4 && (
              <div className="faq-answer">
                    Some life insurance policies require medical questions or exams, while others may offer simplified or no-medical options depending on your age, health, and coverage amount. Availability varies by policy.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFAQ === 5 ? 'active' : ''}`} onClick={() => toggleFAQ(5)}>
            <div className="faq-question">
                  <span>Is the life insurance payout taxable in Canada?</span>
              <span>{activeFAQ === 5 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 5 && (
              <div className="faq-answer">
                    In most cases, life insurance benefits paid to a named beneficiary are tax-free, allowing your loved ones to receive the full amount to support their financial needs.
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Footer Disclaimer */}
      <footer style={{
        backgroundColor: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        padding: '40px 20px',
        marginTop: '0'
      }}>
        <div style={{
          width: '100%',
          padding: '0 40px'
        }}>
            <p style={{
              fontSize: '11px',
              color: '#6b7280',
              lineHeight: '1.8',
              margin: '0 0 16px 0',
              textAlign: 'center'
            }}>
              Disclaimer: This website is operated by PolicyAdvisor, a licensed independent insurance brokerage and authorized distributor of Sun Life insurance products. PolicyAdvisor is not the insurer. All insurance products discussed on this site are underwritten by Sun Life Assurance Company of Canada and are subject to eligibility, terms, conditions, and provincial variations. The content on this site is provided for general informational purposes only and does not constitute insurance advice. For specific product details and advice tailored to your situation, please consult a licensed advisor. PolicyAdvisor is not the insurer. All insurance products are underwritten by Sun Life Assurance Company of Canada. Product availability, features, and eligibility may vary by province and individual circumstances. The information provided on this website is for general informational purposes only and does not constitute professional insurance advice. For full details, terms, and conditions, please speak with a licensed Sun Life advisor.
            </p>
            <p style={{
              fontSize: '11px',
              color: '#6b7280',
              margin: '0',
              textAlign: 'center',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '16px'
            }}>
              © 2026 Policy Advisor. All rights reserved.
            </p>
          </div>
      </footer>
    </main>
  )
}

