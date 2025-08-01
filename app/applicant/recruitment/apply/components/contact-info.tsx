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
      firstName: '',
      lastName: '',
      email: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      country_id: '',
      phoneNumber: '',
    });

    const [errors, setErrors] = React.useState({
      firstName: '',
      lastName: '',
      email: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      country_id: '',
      phoneNumber: '',
    });

    // Validation functions
    const validateField = (name: string, value: string) => {
      switch (name) {
        case 'firstName':
          if (!value.trim()) return 'First name is required';
          if (value.trim().length < 2) return 'First name must be at least 2 characters';
          return '';

        case 'lastName':
          if (!value.trim()) return 'Last name is required';
          if (value.trim().length < 2) return 'Last name must be at least 2 characters';
          return '';

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value.trim()) return 'Email is required';
          if (!emailRegex.test(value)) return 'Please enter a valid email address';
          return '';

        case 'addressLine1':
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

        case 'zipCode':
          if (!value.trim()) return 'Zip code is required';
          const zipRegex = /^\d{5}(-\d{4})?$/;
          if (!zipRegex.test(value)) return 'Please enter a valid zip code';
          return '';

        case 'country_id':
          if (!value) return 'Country is required';
          return '';

        case 'phoneNumber':
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
        firstName: validateField('firstName', formData.firstName),
        lastName: validateField('lastName', formData.lastName),
        email: validateField('email', formData.email),
        addressLine1: validateField('addressLine1', formData.addressLine1),
        city: validateField('city', formData.city),
        state: validateField('state', formData.state),
        zipCode: validateField('zipCode', formData.zipCode),
        country_id: validateField('country_id', formData.country_id),
        phoneNumber: validateField('phoneNumber', formData.phoneNumber),
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
              className={`mt-[12px] h-[48px] ${errors.firstName ? 'border-red-500' : ''}`}
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => {
                const error = validateField('firstName', formData.firstName);
                setErrors(prev => ({ ...prev, firstName: error }));
              }}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="w-full">
            <p className="font-medium text-[14px]/[22px] text-[#353535]">Last Name *</p>
            <Input
              className={`mt-[12px] h-[48px] ${errors.lastName ? 'border-red-500' : ''}`}
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => {
                const error = validateField('lastName', formData.lastName);
                setErrors(prev => ({ ...prev, lastName: error }));
              }}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        <div className="w-full mt-[20px]">
          <p className="font-medium text-[14px]/[22px] text-[#353535]">Email Address *</p>
          <Input
            className={`mt-[12px] h-[48px] ${errors.email ? 'border-red-500' : ''}`}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => {
              const error = validateField('email', formData.email);
              setErrors(prev => ({ ...prev, email: error }));
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="w-full mt-[20px]">
          <p className="font-medium text-[14px]/[22px] text-[#353535]">Address Line 1 *</p>
          <Input
            className={`mt-[12px] h-[48px] ${errors.addressLine1 ? 'border-red-500' : ''}`}
            value={formData.addressLine1}
            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
            onBlur={() => {
              const error = validateField('addressLine1', formData.addressLine1);
              setErrors(prev => ({ ...prev, addressLine1: error }));
            }}
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>
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
              className={`mt-[12px] h-[48px] ${errors.zipCode ? 'border-red-500' : ''}`}
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              onBlur={() => {
                const error = validateField('zipCode', formData.zipCode);
                setErrors(prev => ({ ...prev, zipCode: error }));
              }}
              placeholder="12345 or 12345-6789"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
            )}
          </div>
          <div className="w-full">
            <p className="font-medium text-[14px]/[22px] text-[#353535]">Country *</p>
            <Select
              value={formData.country_id}
              onValueChange={(val) => {
                handleInputChange('country_id', val);
                setErrors(prev => ({ ...prev, country_id: '' }));
              }}
            >
              <SelectTrigger className={`h-[48px] mt-[12px] ${errors.country_id ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {(country || [])?.map((country: any) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country_id && (
              <p className="text-red-500 text-sm mt-1">{errors.country_id}</p>
            )}
          </div>
        </div>
        <div className="w-full mt-[40px]">
          <p className="font-medium text-[14px]/[22px] text-[#353535]">Phone Number *</p>
          <div className="flex sm:flex-row flex-col gap-[16px] w-full mt-[12px]">
            <div className="sm:w-[113px] w-full">
              <Select
                defaultValue="US"
                indicatorVisibility={false}
                onValueChange={(value) => {
                  setCode(phoneNumber.find((item) => item.key === value)?.code || '');
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
                className={`h-[48px] ${errors.phoneNumber ? 'border-red-500' : ''}`}
                id="signup-phone-input"
                data-testid="signup-phone-input"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                onBlur={() => {
                  const error = validateField('phoneNumber', formData.phoneNumber);
                  setErrors(prev => ({ ...prev, phoneNumber: error }));
                }}
              />
            </div>
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      </div>
    );
  });

ContactInfo.displayName = 'ContactInfo';

export default ContactInfo;
