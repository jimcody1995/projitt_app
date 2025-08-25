'use client';

import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBasic } from '@/context/BasicContext';
import phoneNumber from '@/constants/phoneNumber.json';
import { getApplicantInfo } from '@/api/applicant';
import { customToast } from '@/components/common/toastr';
import { useSession } from '@/context/SessionContext';
import { errorHandlers } from '@/utils/error-handler';
/**
 * @description
 * ContactInfo is a form component for collecting and validating user contact information.
 * It includes fields for first name, last name, address, city, state, zip code, country, and phone number.
 * The component uses local state to manage form data and validation errors, and exposes a validation function to a parent component via a forwarded ref.
 * It provides unique data-testid locators for UI elements to aid in test automation.
 */
interface ContactInfoProps {
  jobId: string | null;
  applicantId: string | null;
  onValidationChange?: (isValid: boolean, data: any) => void;
  setLoading?: (loading: boolean) => void;
}

const ContactInfo = React.forwardRef<{ validate: () => boolean; getData: () => any }, ContactInfoProps>(
  ({ onValidationChange, jobId, applicantId, setLoading }, ref) => {
    const { country } = useBasic();
    const [code, setCode] = React.useState('US');
    const { session } = useSession();
    const [formData, setFormData] = React.useState({
      first_name: '',
      last_name: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      contact_code: '+1',
      contact_number: '',
    });

    const [errors, setErrors] = React.useState({
      first_name: '',
      last_name: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      contact_code: '+1',
      contact_number: '',
    });
    const [applicantInfo, setApplicantInfo] = React.useState<any>(null);

    // State for managing country states
    interface StateData {
      name: string;
      state_code: string;
    }
    const [countryStates, setCountryStates] = React.useState<StateData[]>([]);
    const [isLoadingStates, setIsLoadingStates] = React.useState(false);

    const getApplicantInfoData = async () => {
      try {
        if (setLoading) setLoading(true);
        const response = await getApplicantInfo(jobId as string, applicantId as string);
        if (response.status === true) {
          setApplicantInfo(response.data);
        }
      } catch (error: unknown) {
        errorHandlers.custom(error, "Error fetching applicant info");
      } finally {
        if (setLoading) setLoading(false);
      }
    };
    useEffect(() => {
      if (session.authenticated) {
        getApplicantInfoData();
      }
    }, [applicantId, jobId]);

    // Initialize form data when applicantInfo is loaded
    useEffect(() => {
      if (applicantInfo) {
        setFormData({
          first_name: applicantInfo.applicant?.first_name || '',
          last_name: applicantInfo.applicant?.last_name || '',
          address: applicantInfo.address || '',
          city: applicantInfo.city || '',
          state: applicantInfo.state || '',
          zip_code: applicantInfo.zip_code || '',
          country: applicantInfo.country || '',
          contact_code: applicantInfo.contact_code || '+1',
          contact_number: applicantInfo.contact_number || '',
        });
      }
    }, [applicantInfo]);

    // Load states when country changes
    useEffect(() => {
      if (formData.country) {
        setIsLoadingStates(true);
        fetch('https://countriesnow.space/api/v0.1/countries/states', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: formData.country })
        })
          .then(res => res.json())
          .then(data => {
            console.log('States data:', data);

            if (data?.data?.states) {
              setCountryStates(data.data.states);

              // Check if current formData.state exists in the fetched states
              if (formData.state) {
                const stateExists = data.data.states.some((state: StateData) =>
                  state.name === formData.state || state.state_code === formData.state
                );

                if (!stateExists) {
                  // If state doesn't exist in the list, clear it
                  setFormData(prev => ({ ...prev, state: '' }));
                }
              }
            }
          })
          .catch(error => {
            console.error('Error fetching states:', error);
            customToast('Error fetching states', 'Failed to load states for selected country', 'error');
            setCountryStates([]);
          })
          .finally(() => {
            setIsLoadingStates(false);
          });
      } else {
        // Clear states when no country is selected
        setCountryStates([]);
        setFormData(prev => ({ ...prev, state: '' }));
      }
    }, [formData.country]);



    /**
     * @description
     * This function validates a single form field based on its name and value.
     * It returns an error message if the validation fails, otherwise returns an empty string.
     * @param {string} name - The name of the field to validate.
     * @param {string} value - The value of the field.
     * @returns {string} - The error message or an empty string.
     */
    const validateField = (name: string, value: string) => {
      switch (name) {
        case 'first_name':
          if (!value.trim()) return 'First name is required';
          if (value.trim().length < 2) return 'First name must be at least 2 characters';
          return '';

        case 'last_name':
          if (!value.trim()) return 'Last name is required';
          if (value.trim().length < 2) return 'Last name must be at least 2 characters';
          return '';

        case 'address':
          if (!value.trim()) return 'Address is required';
          if (value.trim().length < 5) return 'Address must be at least 5 characters';
          return '';

        case 'city':
          if (!value.trim()) return 'City is required';
          if (value.trim().length < 2) return 'City must be at least 2 characters';
          return '';

        case 'state':
          if (!value.trim()) return 'State is required';
          if (value.trim().length < 2) return 'State must be at least 2 characters';
          return '';

        case 'zip_code':
          if (!value.trim()) return 'Zip code is required';
          const zipRegex = /^\d{5}(-\d{4})?$/;
          if (!zipRegex.test(value)) return 'Please enter a valid zip code';
          return '';

        case 'country':
          if (!value) return 'Country is required';
          return '';

        case 'contact_number':
          if (!value.trim()) return 'Phone number is required';
          return '';

        default:
          return '';
      }
    };

    /**
     * @description
     * This function handles changes to the input fields.
     * It updates the formData state and clears any existing errors for the changed field.
     * @param {string} name - The name of the field being changed.
     * @param {string} value - The new value of the field.
     */
    const handleInputChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    };

    /**
     * @description
     * This function validates all form fields and updates the errors state.
     * It returns true if all fields are valid, otherwise false.
     * It also calls the `onValidationChange` prop to notify the parent component of the validation status.
     * @returns {boolean} - The overall validation status of the form.
     */
    const validateForm = () => {
      // First, ensure parent component has the latest data
      if (onValidationChange) {
        onValidationChange(false, formData);
      }

      const newErrors = {
        first_name: validateField('first_name', formData.first_name),
        last_name: validateField('last_name', formData.last_name),
        address: validateField('address', formData.address),
        city: validateField('city', formData.city),
        state: validateField('state', formData.state),
        zip_code: validateField('zip_code', formData.zip_code),
        country: validateField('country', formData.country),
        contact_code: validateField('contact_code', formData.contact_code),
        contact_number: validateField('contact_number', formData.contact_number),
      };

      setErrors(newErrors);

      const isValid = Object.values(newErrors).every(error => error === '');

      // Update parent with validation status
      if (onValidationChange) {
        onValidationChange(isValid, formData);
      }

      return isValid;
    };

    // Expose validation function to parent component via a forwarded ref.
    React.useImperativeHandle(ref, () => ({
      validate: validateForm,
      getData: () => formData,
    }));


    return (
      <div>
        <p className="font-medium text-[22px]/[30px]">Contact Info</p>
        <p className="mt-[8px] text-[14px]/[13px] text-[#787878]">Add your contact information</p>
        <div className="flex sm:flex-row flex-col gap-[20px] mt-[40px]">
          <div className="w-full">
            <p className="font-medium text-[14px]/[22px] text-[#353535]">First Name *</p>
            <Input
              className={`mt-[12px] h-[48px] ${errors.first_name ? 'border-red-500' : ''}`}
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              onBlur={() => {
                const error = validateField('first_name', formData.first_name);
                setErrors(prev => ({ ...prev, first_name: error }));
              }}
              data-testid="contact-first-name-input"
              id="contact-first-name-input"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
            )}
          </div>
          <div className="w-full">
            <p className="font-medium text-[14px]/[22px] text-[#353535]">Last Name *</p>
            <Input
              className={`mt-[12px] h-[48px] ${errors.last_name ? 'border-red-500' : ''}`}
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              onBlur={() => {
                const error = validateField('last_name', formData.last_name);
                setErrors(prev => ({ ...prev, last_name: error }));
              }}
              data-testid="contact-last-name-input"
              id="contact-last-name-input"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
            )}
          </div>
        </div>
        <div className="w-full mt-[20px]">
          <p className="font-medium text-[14px]/[22px] text-[#353535]">Email Address *</p>
          <Input
            className={`mt-[12px] h-[48px]`}
            value={session.email || ''}
            disabled
            data-testid="contact-email-input"
            id="contact-email-input"
          />
        </div>
        <div className="w-full mt-[20px]">
          <p className="font-medium text-[14px]/[22px] text-[#353535]">Address Line 1 *</p>
          <Input
            className={`mt-[12px] h-[48px] ${errors.address ? 'border-red-500' : ''}`}
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            onBlur={() => {
              const error = validateField('address', formData.address);
              setErrors(prev => ({ ...prev, address: error }));
            }}
            data-testid="contact-address-input"
            id="contact-address-input"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
        <div className="flex sm:flex-row flex-col gap-[20px] mt-[40px]">
          <div className="w-full">
            <p className="font-medium text-[14px]/[22px] text-[#353535]">City *</p>
            <Input
              className={`mt-[12px] h-[48px] ${errors.city ? 'border-red-500' : ''}`}
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              onBlur={() => {
                const error = validateField('city', formData.city);
                setErrors(prev => ({ ...prev, city: error }));
              }}
              data-testid="contact-city-input"
              id="contact-city-input"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div className="w-full">
            <p className="font-medium text-[14px]/[22px] text-[#353535]">State *</p>
            <Select
              value={formData.state}
              onValueChange={(val) => {
                handleInputChange('state', val);
                setErrors(prev => ({ ...prev, state: '' }));
              }}
              disabled={!formData.country || isLoadingStates}
            >
              <SelectTrigger
                className={`h-[48px] mt-[12px] ${errors.state ? 'border-red-500' : ''}`}
                data-testid="contact-state-select-trigger"
                id="contact-state-select-trigger"
              >
                <SelectValue
                  placeholder={isLoadingStates ? "Loading states..." : formData.country ? "Select State" : "Select country first"}
                  data-testid="contact-state-select-value"
                />
              </SelectTrigger>
              <SelectContent data-testid="contact-state-select-content">
                {countryStates.map((state: StateData) => (
                  <SelectItem
                    key={state.state_code}
                    value={state.name}
                    data-testid={`contact-state-select-item-${state.state_code}`}
                    id={`contact-state-select-item-${state.state_code}`}
                  >
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>
        </div>
        <div className="flex sm:flex-row flex-col gap-[20px] mt-[40px]">
          <div className="w-full">
            <p className="font-medium text-[14px]/[22px] text-[#353535]">Zip Code *</p>
            <Input
              className={`mt-[12px] h-[48px] ${errors.zip_code ? 'border-red-500' : ''}`}
              value={formData.zip_code}
              onChange={(e) => handleInputChange('zip_code', e.target.value)}
              onBlur={() => {
                const error = validateField('zip_code', formData.zip_code);
                setErrors(prev => ({ ...prev, zip_code: error }));
              }}
              placeholder="12345 or 12345-6789"
              data-testid="contact-zip-code-input"
              id="contact-zip-code-input"
            />
            {errors.zip_code && (
              <p className="text-red-500 text-sm mt-1">{errors.zip_code}</p>
            )}
          </div>
          <div className="w-full">
            <p className="font-medium text-[14px]/[22px] text-[#353535]">Country *</p>
            <Select
              value={formData.country}
              onValueChange={(val) => {
                handleInputChange('country', val);
                setErrors(prev => ({ ...prev, country: '' }));
                // Clear state when country changes
                setFormData(prev => ({ ...prev, state: '' }));
              }}
            >
              <SelectTrigger
                className={`h-[48px] mt-[12px] ${errors.country ? 'border-red-500' : ''}`}
                data-testid="contact-country-select-trigger"
                id="contact-country-select-trigger"
              >
                <SelectValue placeholder="Select Country" data-testid="contact-country-select-value" />
              </SelectTrigger>
              <SelectContent data-testid="contact-country-select-content">
                {(country || [])?.map((country: any) => (
                  <SelectItem
                    key={country.id}
                    value={country.name}
                    data-testid={`contact-country-select-item-${country.id}`}
                    id={`contact-country-select-item-${country.id}`}
                  >
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>
        </div>
        <div className="w-full mt-[40px]">
          <p className="font-medium text-[14px]/[22px] text-[#353535]">Phone Number *</p>
          <div className="flex sm:flex-row flex-col gap-[16px] w-full mt-[12px]">
            <div className="sm:w-[113px] w-full">
              <Select
                indicatorVisibility={false}
                value={code}
                onValueChange={(value) => {
                  const code = phoneNumber.find((item) => item.key === value)?.code;
                  if (!code) return;
                  handleInputChange('contact_code', code);
                  setCode(code);
                }}
              >
                <SelectTrigger
                  className="h-[48px]"
                  id="contact-phone-country-trigger"
                  data-testid="contact-phone-country-trigger"
                >
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent data-testid="contact-phone-country-content">
                  {phoneNumber.map((item) => (
                    <SelectItem
                      key={item.key}
                      value={item.key}
                      data-testid={`contact-phone-country-item-${item.key}`}
                      id={`contact-phone-country-item-${item.key}`}
                    >
                      {item.key} +{item.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input
                placeholder={`+${code}(555)000-0000`}
                type="text"
                className={`h-[48px] ${errors.contact_number ? 'border-red-500' : ''}`}
                id="contact-phone-input"
                data-testid="contact-phone-input"
                value={formData.contact_number}
                onChange={(e) => handleInputChange('contact_number', e.target.value)}
                onBlur={() => {
                  const error = validateField('contact_number', formData.contact_number);
                  setErrors(prev => ({ ...prev, contact_number: error }));
                }}
              />
            </div>
          </div>
          {errors.contact_number && (
            <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>
          )}
        </div>
      </div>
    );
  }
);

ContactInfo.displayName = 'ContactInfo';

export default ContactInfo;
