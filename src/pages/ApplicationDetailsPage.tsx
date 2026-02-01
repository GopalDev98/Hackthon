import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Briefcase, CreditCard } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import { formatDate, formatCurrency, maskPAN } from '@/lib/utils';
import api from '@/lib/api';
import { Application } from '@/types';

export function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/applications/${id}`);
      setApplication(response.data.data);
    } catch (error: any) {
      showToast('Failed to load application details', 'error');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Application Details
              </h1>
              <p className="text-gray-600 mt-1">{application.applicationNumber}</p>
            </div>
            <Badge status={application.status} className="text-base px-4 py-2">
              {application.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Status Timeline */}
        <Card variant="elevated" className="mb-6">
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {application.statusHistory.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.status === 'approved'
                          ? 'bg-green-500'
                          : item.status === 'rejected'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                    {index < application.statusHistory.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 capitalize">
                        {item.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(item.timestamp, 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    {item.remarks && (
                      <p className="text-sm text-gray-600 mt-1">{item.remarks}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Credit Information */}
        {application.creditInfo && (
          <Card variant="elevated" className="mb-6">
            <CardHeader>
              <CardTitle>
                <CreditCard className="h-5 w-5 inline mr-2" />
                Credit Information
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Credit Score</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {application.creditInfo.creditScore}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Retrieved on {formatDate(application.creditInfo.retrievedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Credit Limit</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatCurrency(application.creditInfo.creditLimit)}
                  </p>
                  {application.status === 'approved' && (
                    <p className="text-sm text-green-600 mt-1">Approved Amount</p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Personal Information */}
        <Card variant="elevated" className="mb-6">
          <CardHeader>
            <CardTitle>
              <User className="h-5 w-5 inline mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">
                  {application.personalInfo.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium text-gray-900">
                  {formatDate(application.personalInfo.dateOfBirth)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">
                  {application.personalInfo.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">
                  {application.personalInfo.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">PAN Card</p>
                <p className="font-medium text-gray-900 uppercase tracking-wider">
                  {maskPAN(application.personalInfo.panCard)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-900">
                  {application.personalInfo.address.street},{' '}
                  {application.personalInfo.address.city},{' '}
                  {application.personalInfo.address.state} -{' '}
                  {application.personalInfo.address.pincode}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Employment Information */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>
              <Briefcase className="h-5 w-5 inline mr-2" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Employment Type</p>
                <p className="font-medium text-gray-900 capitalize">
                  {application.employmentInfo.employmentType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Income</p>
                <p className="font-medium text-gray-900">
                  {formatCurrency(application.employmentInfo.annualIncome)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Company Name</p>
                <p className="font-medium text-gray-900">
                  {application.employmentInfo.companyName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-medium text-gray-900">
                  {application.employmentInfo.designation}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Submission Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 inline mr-1" />
          Submitted on {formatDate(application.submittedAt, 'MMMM dd, yyyy')} at{' '}
          {formatDate(application.submittedAt, 'HH:mm')}
        </div>
      </div>
    </div>
  );
}
