'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IoMdWalk } from 'react-icons/io'
import { MdDirectionsRun } from 'react-icons/md'
import { GiWeightLiftingUp } from 'react-icons/gi'
import { FaDollarSign, FaShieldAlt, FaHeart, FaUsers, FaCalendarAlt, FaCog, FaChartLine, FaExchangeAlt, FaPlus, FaLaptop, FaUserMd, FaCheck } from 'react-icons/fa'
import { AiOutlineDollar, AiOutlineHeart, AiOutlineCalendar, AiOutlinePlus, AiOutlineLaptop, AiOutlineSwap, AiOutlineEye, AiOutlineMedicineBox, AiOutlineTeam, AiOutlineGlobal } from 'react-icons/ai'
import { BsShield, BsPeople, BsGraphUp } from 'react-icons/bs'
import { TbDental } from 'react-icons/tb'
import { BentoGrid, BentoGridItem } from '../components/ui/bento-grid'

const Home = () => {
  const router = useRouter()
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [mobileProvinceDropdownOpen, setMobileProvinceDropdownOpen] = useState(false)
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const [otp, setOTP] = useState(['', '', '', '', '', ''])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    age: '',
    employmentStatus: '',
    occupation: '',
    annualIncome: '',
    province: '',
    provincialCoverage: ''
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    age: '',
    employmentStatus: '',
    occupation: '',
    annualIncome: '',
    province: '',
    provincialCoverage: '',
    coverageAmount: 0
  })

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10;
  }

  const validateAge = (age: string) => {
    const numAge = parseInt(age);
    return numAge >= 18 && numAge <= 99;
  }

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateAllFields = () => {
    const errors = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      gender: '',
      age: '',
      employmentStatus: '',
      occupation: '',
      annualIncome: '',
      province: '',
      provincialCoverage: ''
    }
    let isValid = true

    // First Name
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
      isValid = false
    }

    // Last Name
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
      isValid = false
    }

    // Phone Number
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required'
      isValid = false
    } else if (!validatePhone(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number'
      isValid = false
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    // Gender
    if (!formData.gender) {
      errors.gender = 'Please select your gender'
      isValid = false
    }

    // Age
    if (!formData.age.trim()) {
      errors.age = 'Age is required'
      isValid = false
    } else if (!validateAge(formData.age)) {
      errors.age = 'Age must be between 18 and 99'
      isValid = false
    }

    // Province
    if (!formData.province) {
      errors.province = 'Please select your province'
      isValid = false
    }

    // Provincial Coverage
    if (!formData.provincialCoverage) {
      errors.provincialCoverage = 'Please select provincial coverage'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateAllFields()) {
      return
    }
    
    // Store phone number for reference
    setPhoneNumber(formData.phoneNumber)
    // Hide lead form and redirect to Thank You page
    setShowLeadForm(false)
    router.push('/thank-you')
  }

  const handleOTPChange = (index: number, value: string) => {
    const newOTP = [...otp]
    // Only allow numbers
    if (value.match(/^[0-9]$/)) {
      newOTP[index] = value
      setOTP(newOTP)
      // Auto-focus next input
      if (index < 5 && value !== '') {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    } else if (value === '') {
      // Allow backspace
      newOTP[index] = ''
      setOTP(newOTP)
      // Auto-focus previous input
      if (index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`)
        prevInput?.focus()
      }
    }
  }

  const handleVerifyOTP = () => {
    // Here you would verify the OTP
    console.log('Verifying OTP:', otp.join(''))
    setShowOTPVerification(false)
    router.push('/thank-you?return=/')
  }

  const handleResendOTP = () => {
    // Here you would trigger OTP resend
    console.log('Resending OTP to:', phoneNumber)
    // Reset OTP inputs
    setOTP(['', '', '', '', '', ''])
  }

  return (
    <main>
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
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 40px)',
            maxWidth: '900px',
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
              Complete a short form to get your free, no-obligation quote for health and dental insurance. Your information is private, secure, and used only to assist with your Sun Life quote.
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
              {/* First Name / Last Name Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                  First Name <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '16px',
                      border: formErrors.firstName ? '1px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
                  {formErrors.firstName && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', margin: 0 }}>{formErrors.firstName}</p>
                  )}
              </div>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                  Last Name <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '16px',
                      border: formErrors.lastName ? '1px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
                  {formErrors.lastName && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', margin: 0 }}>{formErrors.lastName}</p>
                  )}
              </div>
              </div>

              {/* Email / Phone Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                    Email Address <span style={{ color: '#013946' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john.smith@gmail.com"
                    value={formData.email}
                    onChange={(e) => {
                      handleInputChange('email', e.target.value);
                      setFormErrors(prev => ({ ...prev, email: '' }));
                    }}
                    onBlur={() => {
                      if (formData.email && !validateEmail(formData.email)) {
                        setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '16px',
                      border: formErrors.email ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none'
                    }}
                  />
                  {formErrors.email && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', margin: 0 }}>{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                  Phone Number <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(555) 123-4567"
                  value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d\s\-()]/g, '');
                      const digits = value.replace(/\D/g, '');
                      let formatted = '';
                      if (digits.length > 0) {
                        formatted = '(' + digits.substring(0, 3);
                        if (digits.length > 3) {
                          formatted += ') ' + digits.substring(3, 6);
                        }
                        if (digits.length > 6) {
                          formatted += '-' + digits.substring(6, 10);
                        }
                      }
                      handleInputChange('phoneNumber', formatted || value);
                      setFormErrors(prev => ({ ...prev, phoneNumber: '' }));
                    }}
                    onBlur={() => {
                      if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
                        setFormErrors(prev => ({ ...prev, phoneNumber: 'Please enter a valid 10-digit phone number' }));
                      }
                    }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '16px',
                      border: formErrors.phoneNumber ? '1px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
                  {formErrors.phoneNumber && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', margin: 0 }}>{formErrors.phoneNumber}</p>
                  )}
              </div>
              </div>

              {/* Gender and Age */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                  Gender <span style={{ color: '#013946' }}>*</span>
                </label>
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => handleInputChange('gender', 'Man')}
                    style={{
                          flex: 1,
                        padding: '14px 16px',
                          fontSize: '16px',
                        border: `2px solid ${formErrors.gender ? '#dc2626' : (formData.gender === 'Man' ? '#0086ae' : '#d1d5db')}`,
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
                    onClick={() => handleInputChange('gender', 'Woman')}
                    style={{
                          flex: 1,
                        padding: '14px 16px',
                          fontSize: '16px',
                        border: `2px solid ${formErrors.gender ? '#dc2626' : (formData.gender === 'Woman' ? '#0086ae' : '#d1d5db')}`,
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
                  {formErrors.gender && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', margin: 0 }}>{formErrors.gender}</p>
                  )}
              </div>
                <div>
                    <label style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                    Age <span style={{ color: '#013946' }}>*</span>
                  </label>
                <input
                  type="text"
                  required
                    maxLength={3}
                    placeholder="e.g. 35"
                    value={formData.age}
                  onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      const numValue = parseInt(value);
                      if (value === '' || (numValue >= 0 && numValue <= 120)) {
                        handleInputChange('age', value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      const numValue = parseInt(value);
                      if (value && (numValue < 18 || numValue > 99)) {
                        setFormErrors(prev => ({ ...prev, age: 'Age must be between 18 and 99' }));
                    }
                  }}
                  style={{
                    width: '100%',
                      padding: '14px 16px',
                    fontSize: '16px',
                      border: formErrors.age ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: '8px',
                    outline: 'none'
                  }}
                />
                  {formErrors.age && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', margin: 0 }}>{formErrors.age}</p>
                  )}
              </div>
                </div>

              {/* Province and Provincial Coverage */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                    Province of Residence <span style={{ color: '#013946' }}>*</span>
                </label>
                <select
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                  style={{
                    width: '100%',
                      padding: '14px 16px',
                    fontSize: '16px',
                      border: formErrors.province ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: '8px',
                    outline: 'none',
                    backgroundColor: '#fff',
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
                  {formErrors.province && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', margin: 0 }}>{formErrors.province}</p>
                  )}
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '14px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
                    Do you have Provincial Coverage? <span style={{ color: '#013946' }}>*</span>
                </label>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button
                    type="button"
                      onClick={() => {
                        handleInputChange('provincialCoverage', 'Yes')
                        setFormErrors(prev => ({ ...prev, provincialCoverage: '' }))
                      }}
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        fontSize: '16px',
                        border: `2px solid ${formErrors.provincialCoverage ? '#dc2626' : (formData.provincialCoverage === 'Yes' ? '#0086ae' : '#d1d5db')}`,
                        borderRadius: '8px',
                        backgroundColor: formData.provincialCoverage === 'Yes' ? '#e0f2fe' : '#fff',
                        color: '#1f2937',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('provincialCoverage', 'No')
                        setFormErrors(prev => ({ ...prev, provincialCoverage: '' }))
                      }}
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        fontSize: '16px',
                        border: `2px solid ${formErrors.provincialCoverage ? '#dc2626' : (formData.provincialCoverage === 'No' ? '#0086ae' : '#d1d5db')}`,
                        borderRadius: '8px',
                        backgroundColor: formData.provincialCoverage === 'No' ? '#e0f2fe' : '#fff',
                        color: '#1f2937',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      No
                    </button>
                  </div>
                  {formErrors.provincialCoverage && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', margin: 0 }}>{formErrors.provincialCoverage}</p>
                  )}
                </div>
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
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#64748b',
                lineHeight: '1.5',
                textAlign: 'left'
              }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#334155' }}>
                  By submitting this form, you agree to be contacted by a licensed advisor to discuss your Sun Life Health and Dental Insurance options.
                </p>
                <p style={{ margin: '0', fontSize: '13px' }}>
                  Your information is secure, confidential and used only to assist with your insurance inquiry.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOTPVerification && (
        <div style={{
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
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '12px'
            }}>
              Verify Your Number
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              An OTP has been sent to {phoneNumber}
            </p>
            
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  style={{
                    width: '40px',
                    height: '40px',
                    textAlign: 'center',
                    fontSize: '18px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#013946'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#013946',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              Verify
            </button>

            <p style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Didn't receive the code? <button
                onClick={handleResendOTP}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#013946',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Resend OTP (42s)
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Hero Section - Desktop with Overlapping Form (Funeralcare Style) */}
      <section className="hero-section hero-desktop" style={{ position: 'relative', paddingBottom: '0' }}>
        {/* Logo Bar */}
        <div style={{
          width: '100%',
          backgroundColor: '#F9FAFA',
          padding: '12px 0'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 40px'
          }}>
            <Image
              src="/IMAGE-TOP-OVERLAY-Mob-2-.png"
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
            padding: '50px 40px 60px',
            position: 'relative'
          }}>
            {/* Left Side - Text Content */}
            <div style={{ 
              flex: '1',
              maxWidth: '55%',
              paddingRight: '40px'
            }}>
              <h1 style={{
                color: '#1a1a1a',
                fontSize: 'clamp(32px, 4vw, 46px)',
              fontWeight: '700',
              lineHeight: '1.15',
                marginBottom: '20px'
            }}>
              Protect your health.<br />
              Smile with confidence.
            </h1>
              <p style={{
                color: '#4a5568',
                fontSize: 'clamp(16px, 1.8vw, 19px)',
                lineHeight: '1.6',
                maxWidth: '480px'
              }}>
                Get comprehensive health & dental coverage with Sun Life, Canada's trusted insurer. Our licensed advisors help you find the perfect plan.
              </p>
            </div>

            {/* Right Side - Spacer for form positioning */}
            <div style={{ flex: '1', maxWidth: '45%' }} />
          </div>
        </div>

        {/* Bottom Section - Full Width Image */}
        <div style={{ 
          position: 'relative',
          width: '100%'
        }}>
            <Image
            src="/Mid-Header-Image-3.png"
            alt="Happy family with health coverage"
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
          top: '40px',
          right: 'max(20px, calc((100% - 1200px) / 2 - 20px))',
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
              Get started today
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#4a4a4a',
              marginBottom: '24px',
              lineHeight: '1.5',
              textAlign: 'center'
            }}>
              Complete a short form to get your free, no-obligation quote.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmitLead}>
              {/* First Name / Last Name */}
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
              style={{
                width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: formErrors.firstName ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.firstName && (
                    <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.firstName}</p>
                  )}
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
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: formErrors.lastName ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.lastName && (
                    <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email / Phone */}
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
                    onChange={(e) => {
                      handleInputChange('email', e.target.value);
                      setFormErrors(prev => ({ ...prev, email: '' }));
                    }}
                    onBlur={() => {
                      if (formData.email && !validateEmail(formData.email)) {
                        setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: formErrors.email ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.email && (
                    <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d\s\-()]/g, '');
                      const digits = value.replace(/\D/g, '');
                      let formatted = '';
                      if (digits.length > 0) {
                        formatted = '(' + digits.substring(0, 3);
                        if (digits.length > 3) {
                          formatted += ') ' + digits.substring(3, 6);
                        }
                        if (digits.length > 6) {
                          formatted += '-' + digits.substring(6, 10);
                        }
                      }
                      handleInputChange('phoneNumber', formatted || value);
                      setFormErrors(prev => ({ ...prev, phoneNumber: '' }));
                    }}
                    onBlur={() => {
                      if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
                        setFormErrors(prev => ({ ...prev, phoneNumber: 'Please enter a valid 10-digit phone number' }));
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: formErrors.phoneNumber ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.phoneNumber && (
                    <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Gender and Age */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Gender *
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
            <button 
                      type="button"
                      onClick={() => handleInputChange('gender', 'Man')}
              style={{
                        flex: 1,
                        padding: '14px 12px',
                        fontSize: '15px',
                        border: `2px solid ${formErrors.gender ? '#dc2626' : (formData.gender === 'Man' ? '#FFB800' : '#d1d5db')}`,
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
                      onClick={() => handleInputChange('gender', 'Woman')}
                      style={{
                        flex: 1,
                        padding: '14px 12px',
                        fontSize: '15px',
                        border: `2px solid ${formErrors.gender ? '#dc2626' : (formData.gender === 'Woman' ? '#FFB800' : '#d1d5db')}`,
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
                  {formErrors.gender && (
                    <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.gender}</p>
                  )}
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
                    value={formData.age}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      const numValue = parseInt(value);
                      if (value === '' || (numValue >= 0 && numValue <= 120)) {
                        handleInputChange('age', value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      const numValue = parseInt(value);
                      if (value && (numValue < 18 || numValue > 99)) {
                        setFormErrors(prev => ({ ...prev, age: 'Age must be between 18 and 99' }));
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: formErrors.age ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1f2937'
                    }}
                  />
                  {formErrors.age && (
                    <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.age}</p>
                  )}
                </div>
              </div>

              {/* Province of Residence and Provincial Coverage */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Province of Residence *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
              style={{
                width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: formErrors.province ? '1px solid #dc2626' : '1px solid #d1d5db',
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
                  {formErrors.province && (
                    <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.province}</p>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Do you have Provincial Coverage? *
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleInputChange('provincialCoverage', 'Yes')}
                      style={{
                        flex: 1,
                        padding: '14px 12px',
                        fontSize: '15px',
                        border: `2px solid ${formErrors.provincialCoverage ? '#dc2626' : (formData.provincialCoverage === 'Yes' ? '#FFB800' : '#d1d5db')}`,
                        borderRadius: '6px',
                        backgroundColor: formData.provincialCoverage === 'Yes' ? '#FFB800' : '#fff',
                        color: formData.provincialCoverage === 'Yes' ? '#013946' : '#1f2937',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('provincialCoverage', 'No')}
                      style={{
                        flex: 1,
                        padding: '14px 12px',
                        fontSize: '15px',
                        border: `2px solid ${formErrors.provincialCoverage ? '#dc2626' : (formData.provincialCoverage === 'No' ? '#FFB800' : '#d1d5db')}`,
                        borderRadius: '6px',
                        backgroundColor: formData.provincialCoverage === 'No' ? '#FFB800' : '#fff',
                        color: formData.provincialCoverage === 'No' ? '#013946' : '#1f2937',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      No
                    </button>
                  </div>
                  {formErrors.provincialCoverage && (
                    <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.provincialCoverage}</p>
                  )}
                </div>
              </div>
              

              {/* Submit Button */}
            <button 
                type="submit"
              style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '17px',
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
                marginTop: '16px',
                fontSize: '12px',
                color: '#666',
                lineHeight: '1.5',
                textAlign: 'center'
              }}>
                By submitting, you agree to be contacted by a licensed advisor from Sun Life.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Hero Section - Mobile */}
      <section className="hero-section hero-mobile" style={{ display: 'none' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          backgroundColor: '#EEFCFE'
        }}>
          {/* Logo Bar */}
          <Image
            src="/IMAGE-TOP-OVERLAY-Mob-2-.png"
            alt="PolicyAdvisor and Sun Life"
            width={800}
            height={80}
            priority
            style={{
              width: '70%',
              height: 'auto',
              maxWidth: '70%',
              margin: '0 auto',
              paddingTop: '16px'
            }}
          />
          
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
              Protect your health.<br />
              Smile with confidence.
            </h1>
            <p style={{
              color: '#4a5568',
              fontSize: '15px',
              lineHeight: '1.5',
              marginBottom: '0'
            }}>
              Get your free Sun Life health & dental quote below.
            </p>
          </div>

          {/* Header Image */}
          <Image
            src="/Mobile-header-BAse-H&D.png"
            alt="Health and Dental Coverage"
            width={800}
            height={400}
              style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
          
          {/* Mobile Form */}
          <div style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#fff',
            overflow: 'visible'
          }}>
            <form onSubmit={handleSubmitLead}>
              {/* First Name */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  First Name <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '15px',
                    border: formErrors.firstName ? '1px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                {formErrors.firstName && (
                  <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Last Name <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '15px',
                    border: formErrors.lastName ? '1px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                {formErrors.lastName && (
                  <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Email <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    handleInputChange('email', e.target.value);
                    setFormErrors(prev => ({ ...prev, email: '' }));
                  }}
                  onBlur={() => {
                    if (formData.email && !validateEmail(formData.email)) {
                      setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '15px',
                    border: formErrors.email ? '1px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                {formErrors.email && (
                  <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Phone <span style={{ color: '#013946' }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d\s\-()]/g, '');
                    const digits = value.replace(/\D/g, '');
                    let formatted = '';
                    if (digits.length > 0) {
                      formatted = '(' + digits.substring(0, 3);
                      if (digits.length > 3) {
                        formatted += ') ' + digits.substring(3, 6);
                      }
                      if (digits.length > 6) {
                        formatted += '-' + digits.substring(6, 10);
                      }
                    }
                    handleInputChange('phoneNumber', formatted || value);
                    setFormErrors(prev => ({ ...prev, phoneNumber: '' }));
                  }}
                  onBlur={() => {
                    if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
                      setFormErrors(prev => ({ ...prev, phoneNumber: 'Please enter a valid 10-digit phone number' }));
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '15px',
                    border: formErrors.phoneNumber ? '1px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                {formErrors.phoneNumber && (
                  <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.phoneNumber}</p>
                )}
              </div>

              {/* Gender */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Gender <span style={{ color: '#013946' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
            <button 
                    type="button"
                    onClick={() => handleInputChange('gender', 'Man')}
              style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '14px',
                      border: `2px solid ${formErrors.gender ? '#dc2626' : (formData.gender === 'Man' ? '#013946' : '#d1d5db')}`,
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
                    onClick={() => handleInputChange('gender', 'Woman')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '14px',
                      border: `2px solid ${formErrors.gender ? '#dc2626' : (formData.gender === 'Woman' ? '#013946' : '#d1d5db')}`,
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
                {formErrors.gender && (
                  <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.gender}</p>
                )}
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
                  value={formData.age}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const numValue = parseInt(value);
                    if (value === '' || (numValue >= 0 && numValue <= 120)) {
                      handleInputChange('age', value);
                      setFormErrors(prev => ({ ...prev, age: '' }));
                    }
                  }}
                  onBlur={() => {
                    if (formData.age && !validateAge(formData.age)) {
                      setFormErrors(prev => ({ ...prev, age: 'Age must be between 18 and 99' }));
                    }
                  }}
            style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '15px',
                    border: formErrors.age ? '1px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                {formErrors.age && (
                  <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.age}</p>
                )}
              </div>
          
              {/* Province of Residence - Custom Dropdown */}
              <div style={{ marginBottom: '10px', position: 'relative' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Province of Residence <span style={{ color: '#013946' }}>*</span>
                </label>
                <div
                  onClick={() => setMobileProvinceDropdownOpen(!mobileProvinceDropdownOpen)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '15px',
                    border: formErrors.province ? '1px solid #dc2626' : '1px solid #d1d5db',
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
                      { 'AB': 'Alberta', 'BC': 'British Columbia', 'MB': 'Manitoba', 'NB': 'New Brunswick', 'NL': 'Newfoundland and Labrador', 'NS': 'Nova Scotia', 'ON': 'Ontario', 'PE': 'Prince Edward Island', 'QC': 'Quebec', 'SK': 'Saskatchewan', 'NT': 'Northwest Territories', 'NU': 'Nunavut', 'YT': 'Yukon' }[formData.province] 
                      : 'Select...'}
                  </span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: mobileProvinceDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {mobileProvinceDropdownOpen && (
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
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    {[
                      { value: 'AB', label: 'Alberta' },
                      { value: 'BC', label: 'British Columbia' },
                      { value: 'MB', label: 'Manitoba' },
                      { value: 'NB', label: 'New Brunswick' },
                      { value: 'NL', label: 'Newfoundland and Labrador' },
                      { value: 'NS', label: 'Nova Scotia' },
                      { value: 'ON', label: 'Ontario' },
                      { value: 'PE', label: 'Prince Edward Island' },
                      { value: 'QC', label: 'Quebec' },
                      { value: 'SK', label: 'Saskatchewan' },
                      { value: 'NT', label: 'Northwest Territories' },
                      { value: 'NU', label: 'Nunavut' },
                      { value: 'YT', label: 'Yukon' }
                    ].map((province) => (
                      <li
                        key={province.value}
                        onClick={() => {
                          handleInputChange('province', province.value);
                          setMobileProvinceDropdownOpen(false);
                        }}
                        style={{
                          padding: '10px 12px',
                          fontSize: '15px',
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
                {formErrors.province && (
                  <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.province}</p>
                )}
              </div>

              {/* Provincial Coverage */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937', display: 'block', marginBottom: '4px' }}>
                  Covered by provincial health care? <span style={{ color: '#013946' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('provincialCoverage', 'Yes')
                      setFormErrors(prev => ({ ...prev, provincialCoverage: '' }))
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '14px',
                      border: `2px solid ${formErrors.provincialCoverage ? '#dc2626' : (formData.provincialCoverage === 'Yes' ? '#013946' : '#d1d5db')}`,
                      borderRadius: '6px',
                      backgroundColor: formData.provincialCoverage === 'Yes' ? '#e0f7fa' : '#fff',
                      color: '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('provincialCoverage', 'No')
                      setFormErrors(prev => ({ ...prev, provincialCoverage: '' }))
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '14px',
                      border: `2px solid ${formErrors.provincialCoverage ? '#dc2626' : (formData.provincialCoverage === 'No' ? '#013946' : '#d1d5db')}`,
                      borderRadius: '6px',
                      backgroundColor: formData.provincialCoverage === 'No' ? '#e0f7fa' : '#fff',
                      color: '#1f2937',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    No
                  </button>
                </div>
                {formErrors.provincialCoverage && (
                  <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', margin: 0 }}>{formErrors.provincialCoverage}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
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
                fontSize: '10px',
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

      {/* What is Sun Life Health and Dental Insurance */}
      <section className="section section-white">
        <div className="vitality-intro" style={{ padding: '0 8px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}>Comprehensive health and dental coverage with Sun Life</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '16px', fontSize: 'clamp(16px, 2.5vw, 20px)' }}>
            Your health deserves more than the basics. Sun Life offers flexible personal health and dental insurance that helps safeguard you from unexpected medical expenses not covered by provincial healthcare, including prescription drugs, dental care, vision, and paramedical services.
          </p>
          <p style={{ lineHeight: '1.6', marginBottom: '0', fontSize: 'clamp(16px, 2.5vw, 20px)' }}>
            Perfect especially for self-employed Canadians, retirees, or anyone losing group benefits, Sun Life makes it easy to maintain comprehensive coverage and peace of mind for you and your family.
          </p>
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
              Ready to protect your health with Sun&nbsp;Life?
            </h2>
            <p className="cta-subtext" style={{
              fontSize: 'clamp(12px, 2vw, 18px)',
              color: '#4a5568',
              margin: 0,
              lineHeight: 1.5,
              textAlign: 'left'
            }}>
              Get your personalized Sun&nbsp;Life health and dental quote in minutes!
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

      {/* Active Lifestyle Benefits */}
      <section className="section section-white" style={{ paddingTop: 'clamp(30px, 6vw, 60px)' }}>
        <div className="benefits-section">
          <div className="benefits-image" style={{ flex: '0 0 45%', minWidth: '280px' }}>
            <Image
              src="/mid-image-2-.png"
              alt="Family enjoying quality time together"
              width={500}
              height={594}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
                objectFit: 'cover',
                maxHeight: '594px'
              }}
            />
          </div>
          <div className="benefits-content">
            <div style={{ marginTop: '0px', marginBottom: '20px', textAlign: 'left' }}>
              <h4 style={{
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                Why Canadians choose Sun Life health & dental insurance
              </h4>
              <div style={{ marginBottom: '16px' }}>
              <p style={{
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                  color: '#1f2937',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  lineHeight: '1.4',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <FaCheck style={{ color: '#10b981', fontSize: '16px', marginTop: '4px', flexShrink: 0 }} /> <strong>Comprehensive coverage</strong>
                </p>
                <p style={{
                  fontSize: 'clamp(14px, 2vw, 18px)',
                color: '#4a5568',
                  margin: '0',
                  lineHeight: '1.5',
                  paddingLeft: '24px'
              }}>
                  Protects what provincial healthcare doesn't, including prescriptions, dental, vision, and mental health care.
              </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
              <p style={{
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                  color: '#1f2937',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  lineHeight: '1.4',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <FaCheck style={{ color: '#10b981', fontSize: '16px', marginTop: '4px', flexShrink: 0 }} /> <strong>Flexible, affordable plans</strong>
                </p>
                <p style={{
                  fontSize: 'clamp(14px, 2vw, 18px)',
                color: '#4a5568',
                  margin: '0',
                  lineHeight: '1.5',
                  paddingLeft: '24px'
              }}>
                  Customize your coverage and budget with options for individuals and families.
              </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
              <p style={{
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                  color: '#1f2937',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  lineHeight: '1.4',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <FaCheck style={{ color: '#10b981', fontSize: '16px', marginTop: '4px', flexShrink: 0 }} /> <strong>Wellness & virtual care</strong>
                </p>
                <p style={{
                  fontSize: 'clamp(14px, 2vw, 18px)',
                color: '#4a5568',
                  margin: '0',
                  lineHeight: '1.5',
                  paddingLeft: '24px'
              }}>
                  Access mental health support, telemedicine, and wellness programs anytime, anywhere.
              </p>
            </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  color: '#1f2937',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  lineHeight: '1.4',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <FaCheck style={{ color: '#10b981', fontSize: '16px', marginTop: '4px', flexShrink: 0 }} /> <strong>Trusted protection</strong>
                </p>
                <p style={{
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  color: '#4a5568',
                  margin: '0',
                  lineHeight: '1.5',
                  paddingLeft: '24px'
                }}>
                  Backed by 150+ years of experience, Sun Life is one of Canada's most reliable insurers.
                </p>
              </div>

              <div style={{ marginBottom: '0' }}>
                <p style={{
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  color: '#1f2937',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  lineHeight: '1.4',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <FaCheck style={{ color: '#10b981', fontSize: '16px', marginTop: '4px', flexShrink: 0 }} /> <strong>Free expert advice</strong>
                </p>
                <p style={{
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  color: '#4a5568',
                  margin: '0',
                  lineHeight: '1.5',
                  paddingLeft: '24px'
                }}>
                  Get a personalized quote and consultation from a licensed advisor at no cost, with no pressure.
                </p>
              </div>
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


      {/* What does private health insurance cover? */}
      <section className="section section-white">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 8px' }}>
          <h2 className="centered-underlined-heading" style={{ 
            fontSize: 'clamp(24px, 4vw, 32px)', 
            fontWeight: 700, 
            color: '#2d3748', 
            marginBottom: 'clamp(24px, 4vw, 40px)', 
            textAlign: 'center',
            lineHeight: 1.3 
          }}>
            What does private health insurance cover?
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#4a5568',
            lineHeight: '1.6',
            marginBottom: 'clamp(24px, 4vw, 40px)',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto clamp(24px, 4vw, 40px)'
          }}>
            Private health insurance helps cover healthcare costs not fully included in public plans, giving you access to services like prescription drugs, dental, vision, and paramedical care. Here's what a personal health insurance plan typically covers:
          </p>

          <div className="coverage-cards-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(16px, 3vw, 30px)',
            marginTop: 'clamp(24px, 4vw, 40px)'
          }}>
            {/* Prescription drugs */}
            <div className="coverage-card" style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: 'clamp(20px, 3vw, 30px)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                fontSize: 'clamp(28px, 4vw, 32px)',
                color: '#013946',
                marginBottom: '16px'
              }}>
                <AiOutlineMedicineBox />
              </div>
              <h3 style={{
                fontSize: 'clamp(18px, 3vw, 24px)',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                Prescription drugs
              </h3>
              <p style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: '#4a5568',
                lineHeight: '1.6'
              }}>
                Helps pay for medications and treatments not covered by public health plans
              </p>
            </div>

            {/* Paramedical services */}
            <div className="coverage-card" style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: 'clamp(20px, 3vw, 30px)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                fontSize: 'clamp(28px, 4vw, 32px)',
                color: '#013946',
                marginBottom: '16px'
              }}>
                <AiOutlineTeam />
              </div>
              <h3 style={{
                fontSize: 'clamp(18px, 3vw, 24px)',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                Paramedical services
              </h3>
              <p style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: '#4a5568',
                lineHeight: '1.6'
              }}>
                Includes physiotherapy, chiropractic care, massage therapy, and counselling services
              </p>
            </div>

            {/* Vision care */}
            <div className="coverage-card" style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: 'clamp(20px, 3vw, 30px)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                fontSize: 'clamp(28px, 4vw, 32px)',
                color: '#013946',
                marginBottom: '16px'
              }}>
                <AiOutlineEye />
              </div>
              <h3 style={{
                fontSize: 'clamp(18px, 3vw, 24px)',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                Vision care
              </h3>
              <p style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: '#4a5568',
                lineHeight: '1.6'
              }}>
                Covers eye exams, prescription glasses, contact lenses, and corrective procedures
              </p>
            </div>

            {/* Travel medical */}
            <div className="coverage-card" style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: 'clamp(20px, 3vw, 30px)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                fontSize: 'clamp(28px, 4vw, 32px)',
                color: '#013946',
                marginBottom: '16px'
              }}>
                <AiOutlineGlobal />
              </div>
              <h3 style={{
                fontSize: 'clamp(18px, 3vw, 24px)',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                Travel medical
              </h3>
              <p style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: '#4a5568',
                lineHeight: '1.6'
              }}>
                Provides emergency medical coverage for unexpected expenses incurred while traveling
              </p>
            </div>

            {/* Medical equipment */}
            <div className="coverage-card" style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: 'clamp(20px, 3vw, 30px)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                fontSize: 'clamp(28px, 4vw, 32px)',
                color: '#013946',
                marginBottom: '16px'
              }}>
                <AiOutlineMedicineBox />
              </div>
              <h3 style={{
                fontSize: 'clamp(18px, 3vw, 24px)',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                Medical equipment
              </h3>
              <p style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: '#4a5568',
                lineHeight: '1.6'
              }}>
                Coverage for medical devices, supplies, and durable equipment
              </p>
            </div>

            {/* Dental */}
            <div className="coverage-card" style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: 'clamp(20px, 3vw, 30px)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                fontSize: 'clamp(28px, 4vw, 32px)',
                color: '#013946',
                marginBottom: '16px'
              }}>
                <TbDental />
              </div>
              <h3 style={{
                fontSize: 'clamp(18px, 3vw, 24px)',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                Dental
              </h3>
              <p style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: '#4a5568',
                lineHeight: '1.6'
              }}>
                Covers routine checkups, cleanings, fillings, crowns, and major work depending on your plan
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
              Ready to protect your health with Sun&nbsp;Life?
            </h2>
            <p className="cta-subtext" style={{
              fontSize: 'clamp(12px, 2vw, 18px)',
              color: '#4a5568',
              margin: 0,
              lineHeight: 1.5,
              textAlign: 'left'
            }}>
              Get your personalized Sun&nbsp;Life health and dental quote in minutes!
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

      {/* FAQs */}
      <section className="faq-section">
        <h2 style={{ textAlign: 'center' }}>FAQs</h2>
            <p className="faq-subtitle">Everything you need to know about Sun Life health and dental insurance.</p>
        <div className="faq-list">
          <div className={`faq-item ${activeFAQ === 0 ? 'active' : ''}`} onClick={() => toggleFAQ(0)}>
            <div className="faq-question">
                  <span>What does Sun Life health & dental insurance cover?</span>
              <span>{activeFAQ === 0 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 0 && (
              <div className="faq-answer">
                    Sun Life's extended health and dental coverage helps pay for expenses not covered by your provincial health plan. This includes prescription drugs, preventive dental care, major dental work, vision care, medical equipment, and registered health services such as physiotherapy and chiropractic.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFAQ === 1 ? 'active' : ''}`} onClick={() => toggleFAQ(1)}>
            <div className="faq-question">
                  <span>How are dental coverage costs determined?</span>
              <span>{activeFAQ === 1 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 1 && (
              <div className="faq-answer">
                    Sun Life reimburses dental expenses based on fee guides published annually by the Canadian Dental Association for each province. The plan pays the reasonable cost of the least expensive eligible procedure that achieves an adequate result.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFAQ === 2 ? 'active' : ''}`} onClick={() => toggleFAQ(2)}>
            <div className="faq-question">
                  <span>When should I submit a dental pre-treatment estimate?</span>
              <span>{activeFAQ === 2 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 2 && (
              <div className="faq-answer">
                    Sun Life recommends that plan members submit an estimate before receiving any dental service costing $500 or more. This allows the insurer to confirm your coverage and the amount payable before the work is completed.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFAQ === 3 ? 'active' : ''}`} onClick={() => toggleFAQ(3)}>
            <div className="faq-question">
                  <span>How long do I have to submit a claim?</span>
              <span>{activeFAQ === 3 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 3 && (
              <div className="faq-answer">
                    For most dental and extended health claims, you must submit within 365 days after the end of the benefit year in which the expense occurred or within 90 days after your coverage ends, whichever comes first.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFAQ === 4 ? 'active' : ''}`} onClick={() => toggleFAQ(4)}>
            <div className="faq-question">
                  <span>Can I coordinate my Sun Life benefits with another plan?</span>
              <span>{activeFAQ === 4 ? '−' : '+'}</span>
            </div>
            {activeFAQ === 4 && (
              <div className="faq-answer">
                    Yes. Sun Life allows coordination of benefits between your plan and a spouse's plan. You may also refuse coverage if you already have comparable dental or extended health benefits elsewhere, then re-enroll later if that coverage ends.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#f8f9fa',
        padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 20px)',
        marginTop: 'clamp(30px, 6vw, 60px)',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: 'clamp(12px, 2vw, 14px)',
            color: '#6b7280',
            lineHeight: '1.5',
            margin: '0 0 16px 0'
          }}>
            <strong>Disclaimer:</strong> This website is operated by Policy Advisor, an independent insurance broker. We are not directly affiliated with or endorsed by Sun Life Financial. All product names, logos, and brands are property of their respective owners. The information provided on this site is for general informational purposes only and should not be considered as professional insurance advice. Insurance products and their features may vary based on your location and individual circumstances. For specific details about Sun Life insurance products, please consult with a licensed insurance advisor or contact Sun Life directly.
          </p>
          <p style={{
            fontSize: 'clamp(12px, 2vw, 14px)',
            color: '#6b7280',
            lineHeight: '1.6',
            margin: '0'
          }}>
            © {new Date().getFullYear()} Policy Advisor. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}

export default Home;

