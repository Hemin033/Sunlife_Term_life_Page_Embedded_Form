"use client";
import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('return') || '/';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: '#f0f4f8'
    }}>
      <style>{`
        .thank-you-logo {
          width: 400px;
          height: auto;
        }
        @media (max-width: 768px) {
          .thank-you-logo {
            width: 340px;
          }
        }
      `}</style>
      <div style={{
        maxWidth: '580px',
        width: '100%',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '16px',
        padding: '48px 40px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)'
      }}>
        {/* Logo Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <Image
            src="/IMAGE-TOP-OVERLAY-Life-2.png"
            alt="PolicyAdvisor | Sun Life"
            width={400}
            height={60}
            className="thank-you-logo"
            style={{ objectFit: 'contain', height: 'auto' }}
          />
        </div>

        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 28px',
          borderRadius: '50%',
          background: '#4ade80',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        {/* Thank You Message */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '12px',
          lineHeight: '1.2'
        }}>
          You're all set
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          We've received your request.
        </p>

        {/* Need quotes section */}
        <p style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          Need quotes in a hurry?
        </p>
        
        <p style={{
          fontSize: '15px',
          color: '#4b5563',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          Call <a href="tel:+18886019980" style={{ color: '#013946', fontWeight: '600', textDecoration: 'none' }}>+1-888-601-9980</a> or Book a time with a licensed advisor.
        </p>

        {/* Book a Call Button */}
        <a
          href="https://action.sunlife.ca/AppointmentRendezvous/s/prospr-home?language=en_CA&WT.ac=en-ca%3Aweb%3Aslf_internal%3Aprosprweb%3Aprosprweb"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '16px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#013946',
            background: '#FFB800',
            cursor: 'pointer',
            textDecoration: 'none',
            marginBottom: '12px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Book a Call
        </a>

        {/* Return to Home Button */}
        <button
          onClick={() => router.push(returnUrl)}
          style={{
            width: '100%',
            padding: '16px 24px',
            border: '2px solid #013946',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#013946',
            background: '#ffffff',
            cursor: 'pointer'
          }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f4f8'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            margin: '0 auto 16px', 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e2e8f0', 
            borderTop: '4px solid #013946', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#374151', fontSize: '18px' }}>Loading...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
