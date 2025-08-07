'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { useBasic } from '@/context/BasicContext';
import phoneNumber from '@/constants/phoneNumber.json';

interface ContactInfoProps {
  onValidationChange?: (isValid: boolean, data: any) => void;
}

const ContactInfo = React.forwardRef<{ validate: () => boolean }, ContactInfoProps>(
  ({ onValidationChange }, ref) => {
    const { country } = useBasic();
    const [code, setCode] = React.useState('US');
    const [formData, setFormData] = React.useState({
      first_name: '',
      last_name: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      contact_code: '+1',
      contact_no: '',
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
      contact_no: '',
    });

    // Validation functions
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

        case 'contact_no':
          if (!value.trim()) return 'Phone number is required';
          return '';

        default:
          return '';
      }
    };

    // Handle input changes
    const handleInputChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Validate all fields
    const validateForm = () => {
      const newErrors = {
        first_name: validateField('first_name', formData.first_name),
        last_name: validateField('last_name', formData.last_name),
        address: validateField('address', formData.address),
        city: validateField('city', formData.city),
        state: validateField('state', formData.state),
        zip_code: validateField('zip_code', formData.zip_code),
        country: validateField('country', formData.country),
        contact_code: validateField('contact_code', formData.contact_code),
        contact_no: validateField('contact_no', formData.contact_no),
      };

      setErrors(newErrors);

      const isValid = Object.values(newErrors).every(error => error === '');

      if (onValidationChange) {
        onValidationChange(isValid, formData);
      }

      return isValid;
    };

    // Expose validation function to parent
    React.useImperativeHandle(ref, () => ({
      validate: validateForm
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
            value=""
            disabled
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
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div className="w-full">
            <p className="font-medium text-[14px]/[22px] text-[#353535]">State *</p>
            <Input
              className={`mt-[12px] h-[48px] ${errors.state ? 'border-red-500' : ''}`}
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              onBlur={() => {
                const error = validateField('state', formData.state);
                setErrors(prev => ({ ...prev, state: error }));
              }}
            />
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
              }}
            >
              <SelectTrigger className={`h-[48px] mt-[12px] ${errors.country ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {(country || [])?.map((country: any) => (
                  <SelectItem key={country.id} value={country.name}>
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
                  id="signup-phone-country-trigger"
                  data-testid="signup-phone-country-trigger"
                >
                  <SelectValue
                    placeholder="Select a country"
                    id="signup-phone-country-value"
                    data-testid="signup-phone-country-value"
                  />
                </SelectTrigger>
                <SelectContent
                  id="signup-phone-country-content"
                  data-testid="signup-phone-country-content"
                >
                  {phoneNumber.map((item) => (
                    <SelectItem
                      key={item.key}
                      value={item.key}
                      id={`signup-phone-country-${item.key}`}
                      data-testid={`signup-phone-country-${item.key}`}
                    >
                      {item.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input
                placeholder={`+${code}(555)000-0000`}
                type="text"
                className={`h-[48px] ${errors.contact_no ? 'border-red-500' : ''}`}
                id="signup-phone-input"
                data-testid="signup-phone-input"
                value={formData.contact_no}
                onChange={(e) => handleInputChange('contact_no', e.target.value)}
                onBlur={() => {
                  const error = validateField('contact_no', formData.contact_no);
                  setErrors(prev => ({ ...prev, contact_no: error }));
                }}
              />
            </div>
          </div>
          {errors.contact_no && (
            <p className="text-red-500 text-sm mt-1">{errors.contact_no}</p>
          )}
        </div>
      </div>
    );
  });

ContactInfo.displayName = 'ContactInfo';

export default ContactInfo;
