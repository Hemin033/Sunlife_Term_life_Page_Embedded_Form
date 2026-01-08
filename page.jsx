"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header1 from '../Components/Header/Header1';

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  // Get return URL - Next.js router handles base path automatically
  const returnUrl = searchParams.get('return') || '/';

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(returnUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, returnUrl]);

  return (
    <>
      <Header1 />
      <hr className="header-separator" />
      <div style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px 40px 20px',
        marginTop: '40px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '60px 40px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Success Icon */}
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 30px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(22, 163, 74, 0.3)'
          }}>
            <svg 
              width="50" 
              height="50" 
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
            fontSize: '42px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Thank You!
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: '#4a5568',
            marginBottom: '8px',
            lineHeight: '1.6'
          }}>
            We've received your request successfully.
          </p>
          
          <p style={{
            fontSize: '18px',
            color: '#64748b',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Our team will get in touch with you shortly.
          </p>

          {/* Redirect Message */}
          <div style={{
            padding: '20px',
            background: '#f1f5f9',
            borderRadius: '12px',
            marginTop: '30px'
          }}>
            <p style={{
              fontSize: '16px',
              color: '#475569',
              margin: '0',
              lineHeight: '1.5'
            }}>
              Redirecting you back in <strong style={{ color: '#d81671', fontSize: '18px' }}>{countdown}</strong> second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>

          {/* Manual Redirect Button */}
          <button
            onClick={() => router.push(returnUrl)}
            style={{
              marginTop: '30px',
              padding: '14px 32px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#ffffff',
              background: '#d81671',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(216, 22, 113, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#b8125d';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(216, 22, 113, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#d81671';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(216, 22, 113, 0.3)';
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    </>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div>
        <Header1 />
        <hr className="header-separator" />
        <div style={{
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px 40px 20px',
          marginTop: '40px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ 
              margin: '0 auto 16px', 
              width: '40px', 
              height: '40px', 
              border: '4px solid #e2e8f0', 
              borderTop: '4px solid #d81671', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite' 
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#374151', fontSize: '18px' }}>Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}

