'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PinField from 'react-pin-field';
import { useRouter } from 'next/navigation';
import { sendApplicantOTP, verifyApplicantOTP } from '@/api/applicant';
import { customToast } from '@/components/common/toastr';
import axios from 'axios';
import { useSession } from '@/context/SessionContext';

export default function SignIn() {
  const [sentStatus, setSentStatus] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [code, setCode] = React.useState('');
  const [codeError, setCodeError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { setSession } = useSession();
  const router = useRouter();

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError('');
  };

  // Handle email submission
  const handleEmailSubmit = async () => {
    try {
      const error = validateEmail(email);
      if (error) {
        setEmailError(error);
        return;
      }
      setIsSubmitting(true);
      const response = await sendApplicantOTP({ email });
      console.log(response);

      if (response.status) {
        setSentStatus(true);
      }
      setIsSubmitting(false);
    } catch (error: any) {
      customToast('Error', error.response.data.message, 'error');
      setIsSubmitting(false);
    }

  };

  // Handle code completion
  const handleCodeComplete = (enteredCode: string) => {
    setCode(enteredCode);
    setCodeError('');
  };

  // Handle code submission
  const handleCodeSubmit = async () => {
    try {
      if (!code || code.length !== 6) {
        setCodeError('Please enter the complete 6-digit code');
        return;
      }
      setIsSubmitting(true);
      const response = await verifyApplicantOTP({ email, otp: code });
      console.log(response);

      if (response.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
        setSession({ token: response.token, authenticated: true });
        router.push('/applicant/recruitment/apply');
      }
      setIsSubmitting(false);
    } catch (error: any) {
      customToast('Error', error.response.data.message, 'error');
      setIsSubmitting(false);
    }

  };

  const handleResendCode = async () => {
    try {
      const response = await sendApplicantOTP({ email });
      console.log(response);
      if (response.status) {
        customToast('Success', 'Code resent successfully', 'success');
      }
    } catch (error: any) {
      customToast('Error', error.response.data.message, 'error');
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between gap-[30px]">
      {/* Logo Section */}
      <div className="pt-[60px] flex justify-center w-full">
        <img
          src="/images/zaidLLC.png"
          alt="logo"
          className="h-[32px]"
          id="login-page-logo"
          data-testid="login-page-logo"
        />
      </div>

      {/* Login Form Container */}
      <div className="w-full flex-1 flex justify-center items-center pb-[10px]">
        {!sentStatus && (
          <div
            className="w-[560px] border border-[#e9e9e9] rounded-[12px] bg-white p-[48px]"
            id="login-form-container"
            data-testid="login-form-container"
          >
            {/* Form Title */}
            <h1
              className="text-[22px]/[30px] font-semibold tracking-tight text-[#353535]"
              id="login-form-title"
              data-testid="login-form-title"
            >
              Ready to take the next step?
            </h1>
            <p className="text-[14px]/[20px] text-[#626262] mt-[4px]">
              Create an account or sign in to continue your application
            </p>
            <div className="mt-[29px]">
              <Label className="text-[14px]/[22px] text-[#353535]" htmlFor="email-input">
                Email Address
              </Label>
              <Input
                id="email-input"
                data-testid="email-input"
                placeholder="Enter email address"
                className={`h-[48px] mt-[12px] ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => {
                  const error = validateEmail(email);
                  setEmailError(error);
                }}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-2" data-testid="email-error">
                  {emailError}
                </p>
              )}
            </div>
            <Button
              className="w-full h-[48px] mt-[24px]"
              onClick={handleEmailSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Continue with email'}
            </Button>
            <p className="text-[14px]/[20px] text-[#787878] mt-[25px]">
              By clicking continue I agree with Projitt Terms of Service and Privacy Policy
            </p>
          </div>
        )}
        {sentStatus && (
          <div
            className="w-[560px] border border-[#e9e9e9] rounded-[12px] bg-white p-[48px]"
            id="login-form-container"
            data-testid="login-form-container"
          >
            {/* Form Title */}
            <h1
              className="text-[22px]/[30px] font-semibold tracking-tight text-[#353535]"
              id="login-form-title"
              data-testid="login-form-title"
            >
              Welcome Alice,
            </h1>
            <p className="text-[14px]/[20px] text-[#626262] mt-[4px]">
              Enter the 6-digit code sent to {email} to continue your application
            </p>
            <div className="flex justify-between">
              <PinField
                length={6}
                onComplete={handleCodeComplete}
                className={`mt-[32px] border rounded-[10px] sm:w-[56px] w-full h-[56px] text-center text-xl mx-1 focus:outline-none focus:ring-[3px] focus:ring-[#0D978B33] ${codeError ? 'border-red-500' : 'border-[#bcbcbc]'
                  }`}
                id="signup-verify-pinfield"
                data-testid="signup-verify-pinfield"
              />
            </div>
            {codeError && (
              <p className="text-red-500 text-sm mt-2" data-testid="code-error">
                {codeError}
              </p>
            )}
            <p className="mt-[18px]">
              Didn't receive your code?{' '}
              <span className="text-[#0D978B] cursor-pointer" onClick={handleResendCode}>Resend Code</span>
            </p>
            <Button
              className="w-full h-[48px] mt-[42px] text-[14px]/[20px]"
              onClick={handleCodeSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Continue with email'}
            </Button>
            <Button
              variant="ghost"
              className="w-full h-[48px] mt-[10px] text-[14px]/[20px] text-[#0D978B]"
              onClick={() => setSentStatus(false)}
            >
              Change email
            </Button>
          </div>
        )}
      </div>

      <div
        className="w-full flex justify-center "
        id="footer-logo-container"
        data-testid="footer-logo-container"
      >
        <img
          src="/images/poweredBy.png"
          alt="logo"
          className="h-[28px]"
          id="footer-logo-image"
          data-testid="footer-logo-image"
        />
      </div>
    </div>
  );
}
