import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, ArrowRight, ArrowLeft, User, Briefcase, FileText } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { Input } from '@/components/ui/Input';
import { MaskedInput } from '@/components/ui/MaskedInput';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { EMPLOYMENT_TYPES, INDIAN_STATES } from '@/lib/constants';
import { validatePAN, validatePhone, validatePincode, calculateAge, formatCurrency, maskPAN } from '@/lib/utils';
import api from '@/lib/api';
import { Modal } from '@/components/ui/Modal';

// Step 1: Personal Info Schema
const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().refine(validatePhone, 'Invalid phone number'),
  panCard: z.string().refine(validatePAN, 'Invalid PAN card format (e.g., ABCDE1234F)'),
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().refine(validatePincode, 'Invalid pincode'),
});

// Step 2: Employment Info Schema
const employmentInfoSchema = z.object({
  employmentType: z.enum(['salaried', 'self-employed', 'business']),
  annualIncome: z.number().min(0, 'Income must be positive').max(100000000),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  designation: z.string().min(2, 'Designation must be at least 2 characters'),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type EmploymentInfoFormData = z.infer<typeof employmentInfoSchema>;

export function ApplicationFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormData | null>(null);
  const [employmentInfo, setEmploymentInfo] = useState<EmploymentInfoFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [applicationResult, setApplicationResult] = useState<any>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Employment', icon: Briefcase },
    { number: 3, title: 'Review', icon: FileText },
  ];

  const handlePersonalInfoSubmit = (data: PersonalInfoFormData) => {
    // Validate age
    const age = calculateAge(data.dateOfBirth);
    if (age < 18) {
      showToast('You must be at least 18 years old to apply', 'error');
      return;
    }

    setPersonalInfo(data);
    setCurrentStep(2);
  };

  const handleEmploymentInfoSubmit = (data: EmploymentInfoFormData) => {
    setEmploymentInfo(data);
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!personalInfo || !employmentInfo) return;

    try {
      setIsSubmitting(true);

      const applicationData = {
        personalInfo: {
          fullName: personalInfo.fullName,
          dateOfBirth: personalInfo.dateOfBirth,
          email: personalInfo.email,
          phone: personalInfo.phone,
          panCard: personalInfo.panCard.toUpperCase(),
          address: {
            street: personalInfo.street,
            city: personalInfo.city,
            state: personalInfo.state,
            pincode: personalInfo.pincode,
          },
        },
        employmentInfo: {
          employmentType: employmentInfo.employmentType,
          annualIncome: employmentInfo.annualIncome,
          companyName: employmentInfo.companyName,
          designation: employmentInfo.designation,
        },
      };

      const response = await api.post('/applications', applicationData);
      setApplicationResult(response.data.data);
      setShowSuccessModal(true);
    } catch (error: any) {
      showToast(
        error.response?.data?.error?.message || 'Application submission failed',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${
                      currentStep >= step.number
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700 hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      currentStep > step.number ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && 'Personal Information'}
              {currentStep === 2 && 'Employment Information'}
              {currentStep === 3 && 'Review Your Application'}
            </CardTitle>
          </CardHeader>
          <CardBody className="p-6">
            {currentStep === 1 && (
              <PersonalInfoForm
                defaultValues={personalInfo || undefined}
                onSubmit={handlePersonalInfoSubmit}
              />
            )}
            {currentStep === 2 && (
              <EmploymentInfoForm
                defaultValues={employmentInfo || undefined}
                onSubmit={handleEmploymentInfoSubmit}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && personalInfo && employmentInfo && (
              <ReviewForm
                personalInfo={personalInfo}
                employmentInfo={employmentInfo}
                onBack={() => setCurrentStep(2)}
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
                onEdit={(step) => setCurrentStep(step)}
              />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {}}
        title="Application Submitted Successfully!"
        size="lg"
      >
        {applicationResult && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {applicationResult.status === 'approved' ? 'Congratulations!' : 'Application Received'}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Application Number:</span>
                <span className="font-semibold">{applicationResult.applicationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-semibold ${
                    applicationResult.status === 'approved' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {applicationResult.status.toUpperCase()}
                </span>
              </div>
              {applicationResult.creditInfo && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credit Score:</span>
                    <span className="font-semibold">{applicationResult.creditInfo.creditScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credit Limit:</span>
                    <span className="font-semibold text-primary-600">
                      {formatCurrency(applicationResult.creditInfo.creditLimit)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {applicationResult.status === 'approved' && (
              <p className="text-gray-600 text-center">
                Your credit card will be dispatched to your address within 7-10 business days.
              </p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/application/track')}
              >
                Track Application
              </Button>
              <Button fullWidth onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Personal Info Form Component
function PersonalInfoForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: PersonalInfoFormData;
  onSubmit: (data: PersonalInfoFormData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          required
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <Input
          label="Date of Birth"
          type="date"
          required
          error={errors.dateOfBirth?.message}
          {...register('dateOfBirth')}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone Number"
          placeholder="+919876543210"
          required
          helperText="Format: +91XXXXXXXXXX"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <MaskedInput
        label="PAN Card Number"
        placeholder="ABCDE1234F"
        required
        helperText="Format: ABCDE1234F (5 letters, 4 digits, 1 letter)"
        error={errors.panCard?.message}
        {...register('panCard')}
        className="uppercase"
      />

      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-900 mb-4">Address Information</h4>
        <div className="space-y-4">
          <Input
            label="Street Address"
            placeholder="123 Main Street"
            required
            error={errors.street?.message}
            {...register('street')}
          />
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="City"
              placeholder="Mumbai"
              required
              error={errors.city?.message}
              {...register('city')}
            />
            <Select
              label="State"
              required
              options={INDIAN_STATES.map((state) => ({ value: state, label: state }))}
              error={errors.state?.message}
              {...register('state')}
            />
            <Input
              label="Pincode"
              placeholder="400001"
              required
              error={errors.pincode?.message}
              {...register('pincode')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

// Employment Info Form Component
function EmploymentInfoForm({
  defaultValues,
  onSubmit,
  onBack,
}: {
  defaultValues?: EmploymentInfoFormData;
  onSubmit: (data: EmploymentInfoFormData) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmploymentInfoFormData>({
    resolver: zodResolver(employmentInfoSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Select
        label="Employment Type"
        required
        options={EMPLOYMENT_TYPES.map((type) => ({ value: type.value, label: type.label }))}
        error={errors.employmentType?.message}
        {...register('employmentType')}
      />

      <Input
        label="Annual Income (INR)"
        type="number"
        placeholder="450000"
        required
        error={errors.annualIncome?.message}
        {...register('annualIncome', { valueAsNumber: true })}
      />

      <Input
        label="Company Name"
        placeholder="Tech Corp India"
        required
        error={errors.companyName?.message}
        {...register('companyName')}
      />

      <Input
        label="Designation"
        placeholder="Software Engineer"
        required
        error={errors.designation?.message}
        {...register('designation')}
      />

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="submit">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

// Review Form Component
function ReviewForm({
  personalInfo,
  employmentInfo,
  onBack,
  onSubmit,
  isSubmitting,
  onEdit,
}: {
  personalInfo: PersonalInfoFormData;
  employmentInfo: EmploymentInfoFormData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onEdit: (step: number) => void;
}) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="space-y-6">
      {/* Personal Info Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Personal Information</h4>
          <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
            Edit
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <span className="ml-2 font-medium">{personalInfo.fullName}</span>
          </div>
          <div>
            <span className="text-gray-600">DOB:</span>
            <span className="ml-2 font-medium">{personalInfo.dateOfBirth}</span>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <span className="ml-2 font-medium">{personalInfo.email}</span>
          </div>
          <div>
            <span className="text-gray-600">Phone:</span>
            <span className="ml-2 font-medium">{personalInfo.phone}</span>
          </div>
          <div>
            <span className="text-gray-600">PAN:</span>
            <span className="ml-2 font-medium uppercase tracking-wider">{maskPAN(personalInfo.panCard)}</span>
          </div>
          <div>
            <span className="text-gray-600">Address:</span>
            <span className="ml-2 font-medium">
              {personalInfo.city}, {personalInfo.state} - {personalInfo.pincode}
            </span>
          </div>
        </div>
      </div>

      {/* Employment Info Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Employment Information</h4>
          <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
            Edit
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Type:</span>
            <span className="ml-2 font-medium capitalize">{employmentInfo.employmentType}</span>
          </div>
          <div>
            <span className="text-gray-600">Annual Income:</span>
            <span className="ml-2 font-medium">{formatCurrency(employmentInfo.annualIncome)}</span>
          </div>
          <div>
            <span className="text-gray-600">Company:</span>
            <span className="ml-2 font-medium">{employmentInfo.companyName}</span>
          </div>
          <div>
            <span className="text-gray-600">Designation:</span>
            <span className="ml-2 font-medium">{employmentInfo.designation}</span>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="terms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the{' '}
          <a href="#" className="text-primary-600 hover:underline">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-600 hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onSubmit} loading={isSubmitting} disabled={!agreedToTerms}>
          Submit Application
        </Button>
      </div>
    </div>
  );
}
