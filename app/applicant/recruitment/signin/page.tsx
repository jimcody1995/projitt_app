'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PinField from 'react-pin-field';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendApplicantOTP, verifyApplicantOTP } from '@/api/applicant';
import { customToast } from '@/components/common/toastr';
import axios from 'axios';
import { useSession } from '@/context/SessionContext';

/**
 * SignIn component handles user sign-in via email and OTP verification.
 * It allows users to request a verification code sent to their email,
 * input the OTP, verify it, and then sign in to the application.
 */
export default function SignIn() {
  const [sentStatus, setSentStatus] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [code, setCode] = React.useState('');
  const [codeError, setCodeError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { setSession } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  /**
   * Validates the email format.
   * @param email - The email string to validate.
   * @returns An error message if invalid, else an empty string.
   */
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

  /**
   * Handles changes in the email input field.
   * Clears any existing email error on change.
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError('');
  };

  /**
   * Submits the email to request an OTP.
   * Performs validation before sending the request.
   */
  const handleEmailSubmit = async () => {
    try {
      const error = validateEmail(email);
      if (error) {
        setEmailError(error);
        return;
      }
      setIsSubmitting(true);
      const response = await sendApplicantOTP({ email });
      if (response.status) {
        customToast('Success', 'Code sent successfully', 'success');
        setSentStatus(true);
      }
      setIsSubmitting(false);
    } catch (error: any) {
      customToast('Error', error.response.data.message, 'error');
      setIsSubmitting(false);
    }

  };

  /**
   * Updates the code state when user completes input in the PIN field.
   * Clears any existing code error on completion.
   */
  const handleCodeComplete = (enteredCode: string) => {
    setCode(enteredCode);
    setCodeError('');
  };

  /**
   * Submits the entered OTP code for verification.
   * Validates that the code is 6 digits before submission.
   */
  const handleCodeSubmit = async () => {
    try {
      if (!code || code.length !== 6) {
        setCodeError('Please enter the complete 6-digit code');
        return;
      }
      setIsSubmitting(true);
      const response = await verifyApplicantOTP({ email, otp: code });
      if (response.token) {

        axios.defaults.headers.common["Authorization"] = `Bearer ${response.token.applicant_token}`;
        setSession({ token: response.token.applicant_token, authenticated: true, full_name: response.token.first_name + " " + response.token.last_name, email: response.token.email });
        // localStorage.setItem("applicantId", response.token.id);

        const redirect = params.get('redirect');
        if (redirect && (redirect === '/applicant/messages' || redirect === '/applicant/settings' || redirect === '/applicant/my-applications')) {
          router.replace(`${redirect}`);
        }
        else if (redirect && redirect.startsWith('/applicant/recruitment/apply')) {

          router.replace(redirect + '?jobId=' + params.get('jobId') + '&applicantId=' + response.token.id);
        }
        else {
          console.log("asdfasdf");

          router.push(`/applicant/my-applications`);
        }
      }
      setIsSubmitting(false);
    } catch (error: any) {
      customToast('Error', error.response.data.message, 'error');
      setIsSubmitting(false);
    }

  };

  /**
   * Handles resending the OTP code to the user's email.
   * Provides user feedback on success or failure.
   */
  const handleResendCode = async () => {
    try {
      const response = await sendApplicantOTP({ email });
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
          data-test-id="login-page-logo"
        />
      </div>

      {/* Login Form Container */}
      <div className="w-full flex-1 flex justify-center items-center pb-[10px]">
        {!sentStatus && (
          <div
            className="w-[560px] border border-[#e9e9e9] rounded-[12px] bg-white p-[48px]"
            id="login-form-container"
            data-testid="login-form-container"
            data-test-id="login-form-container"
          >
            {/* Form Title */}
            <h1
              className="text-[22px]/[30px] font-semibold tracking-tight text-[#353535]"
              id="login-form-title"
              data-testid="login-form-title"
              data-test-id="login-form-title"
            >
              Ready to take the next step?
            </h1>
            <p className="text-[14px]/[20px] text-[#626262] mt-[4px]">
              Create an account or sign in to continue your application
            </p>
            <div className="mt-[29px]">
              <Label
                className="text-[14px]/[22px] text-[#353535]"
                htmlFor="email-input"
                id="email-label"
                data-testid="email-label"
                data-test-id="email-label"
              >
                Email Address
              </Label>
              <Input
                id="email-input"
                data-testid="email-input"
                data-test-id="email-input"
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
                <p
                  className="text-red-500 text-sm mt-2"
                  data-testid="email-error"
                  data-test-id="email-error"
                >
                  {emailError}
                </p>
              )}
            </div>
            <Button
              className="w-full h-[48px] mt-[24px]"
              onClick={handleEmailSubmit}
              disabled={isSubmitting}
              id="email-submit-button"
              data-testid="email-submit-button"
              data-test-id="email-submit-button"
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
            data-test-id="login-form-container"
          >
            {/* Form Title */}
            <h1
              className="text-[22px]/[30px] font-semibold tracking-tight text-[#353535]"
              id="login-form-title"
              data-testid="login-form-title"
              data-test-id="login-form-title"
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
                data-test-id="signup-verify-pinfield"
              />
            </div>
            {codeError && (
              <p
                className="text-red-500 text-sm mt-2"
                data-testid="code-error"
                data-test-id="code-error"
              >
                {codeError}
              </p>
            )}
            <p className="mt-[18px]">
              Didn't receive your code?{' '}
              <span
                className="text-[#0D978B] cursor-pointer"
                onClick={handleResendCode}
                id="resend-code-link"
                data-testid="resend-code-link"
                data-test-id="resend-code-link"
              >
                Resend Code
              </span>
            </p>
            <Button
              className="w-full h-[48px] mt-[42px] text-[14px]/[20px]"
              onClick={handleCodeSubmit}
              disabled={isSubmitting}
              id="code-submit-button"
              data-testid="code-submit-button"
              data-test-id="code-submit-button"
            >
              {isSubmitting ? 'Verifying...' : 'Continue with email'}
            </Button>
            <Button
              variant="ghost"
              className="w-full h-[48px] mt-[10px] text-[14px]/[20px] text-[#0D978B]"
              onClick={() => setSentStatus(false)}
              id="change-email-button"
              data-testid="change-email-button"
              data-test-id="change-email-button"
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
        data-test-id="footer-logo-container"
      >
        <img
          src="/images/poweredBy.png"
          alt="logo"
          className="h-[28px]"
          id="footer-logo-image"
          data-testid="footer-logo-image"
          data-test-id="footer-logo-image"
        />
      </div>
    </div>
  );
}
