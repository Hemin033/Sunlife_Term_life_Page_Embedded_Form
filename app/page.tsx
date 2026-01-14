'use client'

import { useState, useEffect } from 'react'
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
    occupation: '',
    smokerStatus: '',
    province: '',
    coverageAmount: 0
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [mobileProvinceOpen, setMobileProvinceOpen] = useState(false)
  const [productCarouselIndex, setProductCarouselIndex] = useState(0)

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setProductCarouselIndex(prev => prev === 1 ? 0 : prev + 1)
    }, 3000) // Change slide every 3 seconds
    
    return () => clearInterval(interval)
  }, [])

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

  const validateDateOfBirth = (dob: string): string => {
    if (!dob.trim()) return 'Date of birth is required'
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
    if (!dateRegex.test(dob)) return 'Please enter a valid date (DD/MM/YYYY)'
    
    const [day, month, year] = dob.split('/').map(Number)
    const birthDate = new Date(year, month - 1, day)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    if (age < 18) return 'You must be at least 18 years old'
    if (age > 85) return 'Age must be 85 or younger'
    if (birthDate > today) return 'Date of birth cannot be in the future'
    
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
            gap: 16px !important;
          }
          .feature-card {
            padding: 20px !important;
          }
          
          /* Cost Section */
          .cost-section {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .cost-section h2 {
            font-size: 24px !important;
          }
          .cost-section p {
            font-size: 15px !important;
          }
          .cost-table {
            font-size: 14px !important;
          }
          .cost-table th,
          .cost-table td {
            padding: 12px 8px !important;
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
            padding: 10px 6px !important;
            font-size: 13px !important;
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
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div className="lead-form-content" style={{
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowLeadForm(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '8px',
                lineHeight: 1
              }}
            >
              ×
            </button>

            {/* Form Header */}
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '8px',
              textAlign: 'center'
            }}>
              Get started today
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              Complete the quick form below to find out how affordable life insurance can be and get an expert Sun Life licensed advisor to help you find choosing the right plan for your family.
            </p>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '32px',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              <strong>Free of charge and with no obligation.</strong>
            </p>

            {/* Form */}
            <form onSubmit={handleSubmitLead}>
              {/* First Name and Last Name */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', alignItems: 'start' }}>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '16px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
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
                      borderRadius: '8px',
                      outline: 'none'
                    }}
                  />
                  {formErrors.firstName && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{formErrors.firstName}</p>}
                </div>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '16px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
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
                      borderRadius: '8px',
                      outline: 'none'
                    }}
                  />
                  {formErrors.lastName && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{formErrors.lastName}</p>}
                </div>
              </div>

              {/* Phone Number and Email Address */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', alignItems: 'start' }}>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '16px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                    Phone Number <span style={{ color: '#013946' }}>*</span>
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
                      borderRadius: '8px',
                      outline: 'none'
                    }}
                  />
                  {formErrors.phoneNumber && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{formErrors.phoneNumber}</p>}
                </div>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '16px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
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
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: `1px solid ${formErrors.email ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      outline: 'none'
                    }}
                  />
                  {formErrors.email && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{formErrors.email}</p>}
                </div>
              </div>

              {/* Gender */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '22px', marginBottom: '24px', alignItems: 'start' }}>
                <label style={{ fontWeight: 700, fontSize: '16px', color: '#1f2937' }}>
                  Gender <span style={{ color: '#013946' }}>*</span>
                </label>
                <div>
                <div className="gender-buttons" style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                      onClick={() => {
                        handleInputChange('gender', 'Man')
                        setFormErrors(prev => ({ ...prev, gender: '' }))
                      }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      fontSize: '15px',
                        border: `2px solid ${formData.gender === 'Man' ? '#0086ae' : formErrors.gender ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      backgroundColor: formData.gender === 'Man' ? '#e0f2fe' : '#fff',
                      color: '#1f2937',
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
                      padding: '14px',
                      fontSize: '15px',
                        border: `2px solid ${formData.gender === 'Woman' ? '#0086ae' : formErrors.gender ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      backgroundColor: formData.gender === 'Woman' ? '#e0f2fe' : '#fff',
                      color: '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Woman
                  </button>
                  </div>
                  {formErrors.gender && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{formErrors.gender}</p>}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '22px', marginBottom: '24px', alignItems: 'start' }}>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '16px', color: '#1f2937', display: 'block' }}>
                    Date of Birth <span style={{ color: '#013946' }}>*</span>
                  </label>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    Your premium depends on your age.
                  </p>
                </div>
                <div>
                <input
                  type="text"
                  required
                  maxLength={10}
                    placeholder="DD/MM/YYYY"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 8) {
                        // Format as DD/MM/YYYY
                      if (value.length >= 4) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
                      } else if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2);
                      }
                      handleInputChange('dateOfBirth', value);
                    }
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
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
                  {formErrors.dateOfBirth && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{formErrors.dateOfBirth}</p>}
                </div>
              </div>

              {/* Smoker Status */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '22px', marginBottom: '24px', alignItems: 'start' }}>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '16px', color: '#1f2937', display: 'block' }}>
                    Smoker Status <span style={{ color: '#013946' }}>*</span>
                  </label>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    Includes tobacco, e-cigarettes, and vaping in the past 12 months.
                  </p>
                </div>
                <div>
                <div className="smoker-buttons" style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                      onClick={() => {
                        handleInputChange('smokerStatus', 'Non-smoker')
                        setFormErrors(prev => ({ ...prev, smokerStatus: '' }))
                      }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      fontSize: '15px',
                        border: `2px solid ${formData.smokerStatus === 'Non-smoker' ? '#0086ae' : formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      backgroundColor: formData.smokerStatus === 'Non-smoker' ? '#e0f2fe' : '#fff',
                      color: '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Non-smoker
                  </button>
                  <button
                    type="button"
                      onClick={() => {
                        handleInputChange('smokerStatus', 'Smoker')
                        setFormErrors(prev => ({ ...prev, smokerStatus: '' }))
                      }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      fontSize: '15px',
                        border: `2px solid ${formData.smokerStatus === 'Smoker' ? '#0086ae' : formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      backgroundColor: formData.smokerStatus === 'Smoker' ? '#e0f2fe' : '#fff',
                      color: '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Smoker
                  </button>
                  </div>
                  {formErrors.smokerStatus && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{formErrors.smokerStatus}</p>}
                </div>
              </div>

              {/* Province */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '22px', marginBottom: '24px', alignItems: 'start' }}>
                <label style={{ fontWeight: 700, fontSize: '16px', color: '#1f2937' }}>
                  Province <span style={{ color: '#013946' }}>*</span>
                </label>
                <div>
                <select
                    required
                  value={formData.province}
                    onChange={(e) => {
                      handleInputChange('province', e.target.value)
                      setFormErrors(prev => ({ ...prev, province: '' }))
                    }}
                    onBlur={() => {
                      const error = validateProvince(formData.province)
                      if (error) setFormErrors(prev => ({ ...prev, province: error }))
                    }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                      border: `1px solid ${formErrors.province ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    outline: 'none',
                    backgroundColor: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select Province</option>
                  <option value="AB">Alberta</option>
                  <option value="BC">British Columbia</option>
                  <option value="MB">Manitoba</option>
                  <option value="NB">New Brunswick</option>
                  <option value="NL">Newfoundland and Labrador</option>
                  <option value="NS">Nova Scotia</option>
                  <option value="ON">Ontario</option>
                  <option value="PE">Prince Edward Island</option>
                  <option value="QC">Quebec</option>
                  <option value="SK">Saskatchewan</option>
                </select>
                  {formErrors.province && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{formErrors.province}</p>}
                </div>
              </div>

              {/* Coverage Amount */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '22px', marginBottom: '24px', alignItems: 'center' }}>
                <label style={{ fontWeight: 700, fontSize: '16px', color: '#1f2937' }}>
                  Coverage Amount
                </label>
                <input
                  type="text"
                  placeholder="$500,000"
                  value={formData.coverageAmount > 0 ? `$${formData.coverageAmount.toLocaleString()}` : ''}
                  onChange={(e) => {
                    const numValue = e.target.value.replace(/[$,]/g, '')
                    if (!isNaN(Number(numValue))) {
                      handleInputChange('coverageAmount', parseInt(numValue) || 0)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Occupation */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '22px', marginBottom: '32px', alignItems: 'center' }}>
                <label style={{ fontWeight: 700, fontSize: '16px', color: '#1f2937' }}>
                  Occupation
                </label>
                <input
                  type="text"
                  placeholder="Enter your occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#fff',
                  backgroundColor: '#013946',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'background-color 0.3s ease'
                }}
              >
                Submit Request
              </button>

              {/* Form Disclaimer */}
              <div style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '24px'
              }}>
                <p style={{
                  fontSize: '13px',
                  color: '#4b5563',
                  margin: '0 0 8px 0',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  By submitting this form, you agree to be contacted by a licensed advisor to discuss your Sun Life term life insurance options.
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: '0',
                  fontStyle: 'italic',
                  textAlign: 'center'
                }}>
                  Your information is secure, confidential and used only to assist with your insurance inquiry.
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
                marginBottom: '16px'
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
                Secure your family's future with reliable, affordable life insurance coverage you can count on. Sun Life offers flexible options designed to protect your loved ones, pay off debts, and preserve your legacy.
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
          maxWidth: '460px',
          zIndex: 100
        }}>
          <div className="hero-form-container" style={{
            backgroundColor: '#FFF8E0',
            borderRadius: '12px',
            padding: '32px 30px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.075)'
          }}>
            {/* Form Header */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: '8px',
              textAlign: 'center'
            }}>
              Get started today
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#4a4a4a',
              marginBottom: '20px',
              lineHeight: '1.5',
              textAlign: 'center'
            }}>
              Complete a short form to get your free, no-obligation quote.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmitLead}>
              {/* First Name and Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#1a1a1a', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
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
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.firstName ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                    outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.firstName && <p style={{ color: '#ef4444', fontSize: '10px', margin: '3px 0 0 0' }}>{formErrors.firstName}</p>}
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#1a1a1a', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
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
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.lastName ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.lastName && <p style={{ color: '#ef4444', fontSize: '10px', margin: '3px 0 0 0' }}>{formErrors.lastName}</p>}
                </div>
            </div>

              {/* Phone Number and Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#1a1a1a', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Phone Number *
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
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.phoneNumber && <p style={{ color: '#ef4444', fontSize: '10px', margin: '3px 0 0 0' }}>{formErrors.phoneNumber}</p>}
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#1a1a1a', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
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
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.email ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.email && <p style={{ color: '#ef4444', fontSize: '10px', margin: '3px 0 0 0' }}>{formErrors.email}</p>}
                </div>
              </div>

              {/* Gender and Date of Birth */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#1a1a1a', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
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
                        border: `2px solid ${formData.gender === 'Man' ? '#FFB800' : formErrors.gender ? '#ef4444' : '#d1d5db'}`,
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
                        border: `2px solid ${formData.gender === 'Woman' ? '#FFB800' : formErrors.gender ? '#ef4444' : '#d1d5db'}`,
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
                  {formErrors.gender && <p style={{ color: '#ef4444', fontSize: '10px', margin: '3px 0 0 0' }}>{formErrors.gender}</p>}
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#1a1a1a', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Date of Birth *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="DD/MM/YYYY"
                    value={formData.dateOfBirth}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 8) {
                        // Format as DD/MM/YYYY
                        if (value.length >= 4) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
                        } else if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2);
                        }
                        handleInputChange('dateOfBirth', value);
                      }
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
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.dateOfBirth && <p style={{ color: '#ef4444', fontSize: '10px', margin: '3px 0 0 0' }}>{formErrors.dateOfBirth}</p>}
        </div>
              </div>

              {/* Smoker Status and Province */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#1a1a1a', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
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
                        padding: '10px 8px',
              fontSize: '14px',
                        border: `2px solid ${formData.smokerStatus === 'No' ? '#FFB800' : formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
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
                        padding: '10px 8px',
                        fontSize: '14px',
                        border: `2px solid ${formData.smokerStatus === 'Yes' ? '#FFB800' : formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
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
                  {formErrors.smokerStatus && <p style={{ color: '#ef4444', fontSize: '10px', margin: '3px 0 0 0' }}>{formErrors.smokerStatus}</p>}
        </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#1a1a1a', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Province *
                  </label>
                  <select
                    required
                    value={formData.province}
                    onChange={(e) => {
                      handleInputChange('province', e.target.value)
                      setFormErrors(prev => ({ ...prev, province: '' }))
                    }}
                    onBlur={() => {
                      const error = validateProvince(formData.province)
                      if (error) setFormErrors(prev => ({ ...prev, province: error }))
                    }}
                    style={{
            width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: `1px solid ${formErrors.province ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
              color: '#1f2937',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="AB">Alberta</option>
                    <option value="BC">British Columbia</option>
                    <option value="MB">Manitoba</option>
                    <option value="NB">New Brunswick</option>
                    <option value="NL">Newfoundland and Labrador</option>
                    <option value="NS">Nova Scotia</option>
                    <option value="NT">Northwest Territories</option>
                    <option value="NU">Nunavut</option>
                    <option value="ON">Ontario</option>
                    <option value="PE">Prince Edward Island</option>
                    <option value="QC">Quebec</option>
                    <option value="SK">Saskatchewan</option>
                    <option value="YT">Yukon</option>
                  </select>
                  {formErrors.province && <p style={{ color: '#ef4444', fontSize: '10px', margin: '3px 0 0 0' }}>{formErrors.province}</p>}
                </div>
          </div>
          
              {/* Submit Button */}
            <button
                type="submit"
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
                Submit Request
            </button>

              {/* Form Disclaimer */}
              <p style={{
                marginTop: '10px',
                fontSize: '11px',
                color: '#666',
                lineHeight: '1.4',
                textAlign: 'center',
                margin: '10px 0 0 0'
              }}>
                By submitting, you agree to be contacted by a licensed advisor from Sun Life.
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
              marginBottom: '12px'
            }}>
              Plan today,<br />
              Protect tomorrow<br />
              with Sun Life.
            </h1>
            <p style={{
              color: '#4a5568',
              fontSize: '15px',
              lineHeight: '1.5',
              marginBottom: '0'
            }}>
              Get your free Sun Life life insurance quote below.
            </p>
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
            <form onSubmit={handleSubmitLead}>
              {/* Full Name */}
              {/* First Name and Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
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
                      padding: '10px 12px',
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
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
                      padding: '10px 12px',
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
                      padding: '10px 12px',
                      fontSize: '15px',
                      border: `1px solid ${formErrors.email ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                  {formErrors.email && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.email}</p>}
                </div>
              </div>

              {/* Date of Birth */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Date of Birth <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="DD/MM/YYYY"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 8) {
                      // Format as DD/MM/YYYY
                      if (value.length >= 4) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
                      } else if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2);
                      }
                      handleInputChange('dateOfBirth', value);
                    }
                  }}
                  onBlur={() => {
                    const error = validateDateOfBirth(formData.dateOfBirth)
                    if (error) setFormErrors(prev => ({ ...prev, dateOfBirth: error }))
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
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
                      border: `1.5px solid ${formData.gender === 'Man' ? '#013946' : formErrors.gender ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: formData.gender === 'Man' ? '#e0f7fa' : '#fff',
                      color: '#1f2937',
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
                      padding: '8px 10px',
                      fontSize: '14px',
                      border: `1.5px solid ${formData.gender === 'Woman' ? '#013946' : formErrors.gender ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: formData.gender === 'Woman' ? '#e0f7fa' : '#fff',
                      color: '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Woman
            </button>
                </div>
                {formErrors.gender && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.gender}</p>}
          </div>
          
              {/* Province - Custom Dropdown */}
              <div style={{ marginBottom: '10px', position: 'relative' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Province <span style={{ color: '#013946' }}>*</span>
                </label>
                <div
                  onClick={() => setMobileProvinceOpen(!mobileProvinceOpen)}
                  onBlur={() => {
                    setTimeout(() => {
                      const error = validateProvince(formData.province)
                      if (error) setFormErrors(prev => ({ ...prev, province: error }))
                    }, 200)
                  }}
                  tabIndex={0}
              style={{
                width: '100%',
                    padding: '10px 12px',
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
                      { AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba', NB: 'New Brunswick', NL: 'Newfoundland', NS: 'Nova Scotia', ON: 'Ontario', PE: 'PEI', QC: 'Quebec', SK: 'Saskatchewan' }[formData.province] 
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
                      { value: 'NB', label: 'New Brunswick' },
                      { value: 'NL', label: 'Newfoundland' },
                      { value: 'NS', label: 'Nova Scotia' },
                      { value: 'ON', label: 'Ontario' },
                      { value: 'PE', label: 'PEI' },
                      { value: 'QC', label: 'Quebec' },
                      { value: 'SK', label: 'Saskatchewan' }
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
                      border: `1.5px solid ${formData.smokerStatus === 'No' ? '#013946' : formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: formData.smokerStatus === 'No' ? '#e0f7fa' : '#fff',
                      color: '#1f2937',
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
                      padding: '8px 10px',
                      fontSize: '14px',
                      border: `1.5px solid ${formData.smokerStatus === 'Yes' ? '#013946' : formErrors.smokerStatus ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      backgroundColor: formData.smokerStatus === 'Yes' ? '#e0f7fa' : '#fff',
                      color: '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Yes
            </button>
                </div>
                {formErrors.smokerStatus && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>{formErrors.smokerStatus}</p>}
          </div>
          
              {/* Submit */}
              <button
                type="submit"
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
                Submit Request
              </button>

              <p style={{
                marginTop: '10px',
                fontSize: '11px',
                color: '#6b7280',
                lineHeight: '1.4',
                textAlign: 'center'
              }}>
                By submitting, you agree to be contacted by a licensed advisor from Sun Life.
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
            Secure your family's future with reliable coverage. Sun Life offers flexible life insurance options designed to safeguard your loved ones, pay off debts, and preserve your legacy, all with reliable coverage from one of Canada's most established insurers.
            <br /><br />
            Whether you're looking for affordable term coverage or lifetime protection that builds value, Sun Life makes it easy to find the right plan for your needs and budget.
          </p>
        </div>
      </section>

      {/* Active Lifestyle Benefits */}
      <section className="section section-white" style={{ paddingTop: '60px' }}>
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
                Your family receives a tax-free benefit to cover debts, income loss, or future goals.</li>
                
                <li><strong>Flexible plans for every life stage</strong><br />
                Choose from term, permanent, or participating life insurance options that evolve with your needs.</li>
                
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
          <div className="cta-box" style={{
          backgroundColor: '#FFF8E0',
          borderRadius: '16px',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '50px',
          maxWidth: '1200px',
            margin: '0 auto'
          }}>
          <div style={{
            flex: '1',
            maxWidth: '450px'
          }}>
            <Image
              src="/CTA-NEW-.png"
              alt="Ready to get your Sun Life quote"
              width={450}
              height={360}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px'
              }}
            />
              </div>
          <div style={{ flex: '1' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '12px',
              lineHeight: 1.2,
              textAlign: 'left'
            }}>
              Ready to get your Sun Life quote?
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#4a5568',
              lineHeight: 1.6,
              marginBottom: '28px',
              textAlign: 'left'
            }}>
              Get personalized quotes from our licensed advisors in minutes. No obligation, just expert guidance to help you choose the right coverage.
            </p>
            <button
              onClick={() => setShowLeadForm(true)}
              style={{
              backgroundColor: '#013946',
              color: 'white',
                  border: 'none',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '8px',
                  cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              minWidth: '200px'
            }}>
              GET MY QUOTE
              </button>
          </div>
        </div>
      </section>

      {/* Term Life Insurance Products */}
      <section className="section section-white" style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="centered-underlined-heading" style={{ marginBottom: '40px', fontSize: '32px', fontWeight: 700, color: '#2d3748', lineHeight: 1.3, textAlign: 'center' }}>
            Sun Life term life insurance products
          </h2>
          
          {/* Carousel Container */}
          <div style={{ position: 'relative', marginTop: '20px' }}>
            {/* Left Arrow */}
            <button
              onClick={() => setProductCarouselIndex(prev => Math.max(0, prev - 1))}
              style={{
                position: 'absolute',
                left: '-50px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: productCarouselIndex === 0 ? '#e5e7eb' : '#013946',
                color: productCarouselIndex === 0 ? '#9ca3af' : '#fff',
                cursor: productCarouselIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 10,
                transition: 'all 0.3s ease'
              }}
              disabled={productCarouselIndex === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => setProductCarouselIndex(prev => Math.min(1, prev + 1))}
              style={{
                position: 'absolute',
                right: '-50px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: productCarouselIndex === 1 ? '#e5e7eb' : '#013946',
                color: productCarouselIndex === 1 ? '#9ca3af' : '#fff',
                cursor: productCarouselIndex === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 10,
                transition: 'all 0.3s ease'
              }}
              disabled={productCarouselIndex === 1}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            {/* Carousel Track */}
            <div style={{ overflow: 'hidden' }}>
              <div 
                className="products-carousel"
                style={{
                  display: 'flex',
                  gap: '24px',
                  transition: 'transform 0.5s ease',
                  transform: `translateX(calc(-${productCarouselIndex} * (33.333% + 16px)))`
                }}
              >
            {/* SunTerm Card */}
            <div className="product-card" style={{
              flex: '0 0 calc(33.333% - 16px)',
              minWidth: 'calc(33.333% - 16px)',
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
                height: '200px',
                position: 'relative',
                overflow: 'hidden'
              }}>
          <Image
                  src="/Sun-term-.png"
                  alt="SunTerm Life Insurance"
                  fill
            style={{
                    objectFit: 'cover'
            }}
          />
        </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: '#1f2937', 
                  marginBottom: '12px',
                  marginTop: 0
                }}>
                  SunTerm
                </h3>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#4a5568', 
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  Comprehensive, renewable coverage up to $15 million, with robust rider options and conversion to permanent life insurance available.
                </p>
                </div>
              </div>

            {/* SunSpectrum Term Card */}
            <div className="product-card" style={{
              flex: '0 0 calc(33.333% - 16px)',
              minWidth: 'calc(33.333% - 16px)',
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
                height: '200px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image
                  src="/SunSpectrum-Term.png"
                  alt="SunSpectrum Term Life Insurance"
                  fill
                style={{
                    objectFit: 'cover'
                  }}
                />
                  </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: '#1f2937', 
                  marginBottom: '12px',
                  marginTop: 0
                }}>
                  SunSpectrum Term
                </h3>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#4a5568', 
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  Affordable premiums, streamlined features, and coverage up to $15 million.
                </p>
                </div>
              </div>

            {/* SunLife Go Card */}
            <div className="product-card" style={{
              flex: '0 0 calc(33.333% - 16px)',
              minWidth: 'calc(33.333% - 16px)',
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
                height: '200px',
                position: 'relative',
                overflow: 'hidden'
              }}>
          <Image
                  src="/SunLife-Go-&-SunLife-Go-Simplified-.png"
                  alt="SunLife Go Life Insurance"
                  fill
            style={{
                    objectFit: 'cover'
            }}
          />
                  </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: '#1f2937', 
                  marginBottom: '12px',
                  marginTop: 0
                }}>
                  SunLife Go & SunLife Go Simplified
                </h3>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#4a5568', 
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  Easy to apply for, no-medical-exam online policies with coverage up to $1&nbsp;million (SunLife Go) or $500,000 (SunLife Go Simplified), ideal for fast, basic protection needs.
                </p>
                  </div>
                </div>

            {/* SunLife Evolve Card */}
            <div className="product-card" style={{
              flex: '0 0 calc(33.333% - 16px)',
              minWidth: 'calc(33.333% - 16px)',
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
                height: '200px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image
                  src="/Term-Go-.png"
                  alt="SunLife Evolve Life Insurance"
                  fill
                  style={{
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: '#1f2937', 
                  marginBottom: '12px',
                  marginTop: 0
                }}>
                  SunLife Evolve
                </h3>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#4a5568', 
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  Offering the highest coverage and flexibility with up to $15-25 million; renewable to age 85 and convertible to permanent coverage up to age 75.
                </p>
              </div>
            </div>
              </div>
            </div>
            
            {/* Carousel Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
              {[0, 1].map((index) => (
                <button
                  key={index}
                  onClick={() => setProductCarouselIndex(index)}
                  style={{
                    width: productCarouselIndex === index ? '24px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: productCarouselIndex === index ? '#013946' : '#d1d5db',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
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
                justifyContent: 'flex-start',
                marginBottom: '16px',
                fontSize: '32px',
                color: '#013946'
              }}>
                <AiOutlineDollar />
                  </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '10px',
                marginTop: 0
              }}>
                Affordable Premiums
              </h3>
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
                justifyContent: 'flex-start',
                marginBottom: '16px',
                fontSize: '32px',
                color: '#013946'
              }}>
                <BsShield />
                </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '10px',
                marginTop: 0
              }}>
                Financial Protection
              </h3>
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
                justifyContent: 'flex-start',
                marginBottom: '16px',
                fontSize: '32px',
                color: '#013946'
              }}>
                <AiOutlineHeart />
          </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '10px',
                marginTop: 0
              }}>
                Peace of Mind
              </h3>
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
                  <td style={{ padding: '18px 20px', fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>20s</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$29.10</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$47.33</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <td style={{ padding: '18px 20px', fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>30s</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$54.12</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$76.70</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '18px 20px', fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>40s</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$136.23</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$212.48</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <td style={{ padding: '18px 20px', fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>50s</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$298.45</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$425.67</td>
                </tr>
                <tr>
                  <td style={{ padding: '18px 20px', fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>60s</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$587.92</td>
                  <td style={{ padding: '18px 20px', fontSize: '20px', color: '#1f2937', fontWeight: '700' }}>$789.34</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section - Get Quote */}
      <section className="section section-white">
        <div className="cta-banner" style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          backgroundColor: '#FFF8E0',
          padding: '50px 45px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2 className="cta-banner-heading" style={{ 
            fontSize: 'clamp(18px, 4vw, 26px)', 
            fontWeight: 700, 
            color: '#2d3748', 
            marginBottom: '12px',
            lineHeight: 1.3,
            textAlign: 'center'
          }}>
            Ready to protect your family with Sun Life?
          </h2>
          <p className="cta-banner-text" style={{ 
            fontSize: 'clamp(14px, 3vw, 17px)', 
            color: '#6b7280', 
            margin: '0 0 24px 0',
            lineHeight: 1.5,
            textAlign: 'center',
            fontWeight: 400
          }}>
            Get your personalized Sun Life quote in minutes!
          </p>
          <button
            onClick={() => setShowLeadForm(true)}
            className="btn btn-primary"
            style={{
              minWidth: '200px',
              fontSize: '16px',
              padding: '16px 40px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#013946',
              borderRadius: '8px'
            }}
          >
            GET QUOTE
          </button>
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
                  Your payments stay the same for your full term.
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
                  Choose 10, 15, 20, or 30 years.
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
                  Options from $50,000 up to $15 million.
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
                  Early payout available if diagnosed with a terminal illness (on select plans).
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
                  Easily extend your protection at the end of your term, no new medical exam required.
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
                  Personalized health support (e.g., diabetes management tools).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FAQs */}
      <section className="faq-section">
        <h2 style={{ textAlign: 'center' }}>FAQs</h2>
            <p className="faq-subtitle">Everything you need to know about Sun Life term life insurance.</p>
        <div className="faq-list">
          <div className={`faq-item ${activeFAQ === 0 ? 'active' : ''}`} onClick={() => toggleFAQ(0)}>
            <div className="faq-question">
                  <span>What is term life insurance?</span>
              <span>{activeFAQ === 0 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 0 && (
              <div className="faq-answer">
                    Term life insurance provides coverage for a specific period. If you pass away during the term, your beneficiaries receive a tax-free payout to help replace lost income or cover expenses.
              </div>
            )}
          </div>
          
          <div className={`faq-item ${activeFAQ === 1 ? 'active' : ''}`} onClick={() => toggleFAQ(1)}>
            <div className="faq-question">
                  <span>What types of term life insurance does Sun Life offer?</span>
              <span>{activeFAQ === 1 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 1 && (
              <div className="faq-answer">
                    Sun Life offers five main term life products: SunTerm, SunSpectrum Term, SunLife Go, SunLife Go Simplified, and SunLife Evolve. Each varies by coverage limit, application process, and available riders.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFAQ === 2 ? 'active' : ''}`} onClick={() => toggleFAQ(2)}>
            <div className="faq-question">
                  <span>Can I convert my Sun Life term policy to permanent insurance?</span>
              <span>{activeFAQ === 2 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 2 && (
              <div className="faq-answer">
                    Yes, most Sun Life term life insurance policies allow conversion to permanent insurance (whole life or universal) until age 75, providing you greater long-term flexibility.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFAQ === 3 ? 'active' : ''}`} onClick={() => toggleFAQ(3)}>
            <div className="faq-question">
                  <span>How much does Sun Life term life insurance cost?</span>
              <span>{activeFAQ === 3 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 3 && (
              <div className="faq-answer">
                    Premiums depend on age, gender, health, term length, and coverage amount. As an example, a healthy 35-year-old non-smoker might pay about $35/month for $500,000 of coverage over 20 years.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFAQ === 4 ? 'active' : ''}`} onClick={() => toggleFAQ(4)}>
            <div className="faq-question">
                  <span>What rider options are available with Sun Life term life insurance?</span>
              <span>{activeFAQ === 4 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 4 && (
              <div className="faq-answer">
                    You can customize your policy with riders such as accidental death, child coverage, disability waiver of premium, or guaranteed insurability, depending on your chosen product.
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
        marginTop: '80px'
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
              Disclaimer: This website is operated by Policy Advisor, an independent insurance broker. We are not directly affiliated with or endorsed by Sun Life Financial. All product names, logos, and brands are property of their respective owners. The information provided on this site is for general informational purposes only and should not be considered as professional insurance advice. Insurance products and their features may vary based on your location and individual circumstances. For specific details about Sun Life insurance products, please consult with a licensed Sun Life advisor.
            </p>
            <p style={{
              fontSize: '11px',
              color: '#6b7280',
              margin: '0',
              textAlign: 'center',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '16px'
            }}>
              © 2025 Policy Advisor. All rights reserved.
            </p>
          </div>
      </footer>
    </main>
  )
}

