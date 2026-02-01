import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import { formatDate, formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { Application } from '@/types';

export function TrackApplicationPage() {
  const [applicationNumber, setApplicationNumber] = useState('');
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleTrack = async () => {
    if (!applicationNumber.trim()) {
      showToast('Please enter an application number', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get(`/applications/track/${applicationNumber}`);
      setApplication(response.data.data);
    } catch (error: any) {
      showToast(
        error.response?.data?.error?.message || 'Application not found',
        'error'
      );
      setApplication(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Application</h1>
          <p className="text-gray-600">Enter your application number to check status</p>
        </div>

        {/* Search Box */}
        <Card className="mb-8">
          <CardBody>
            <div className="flex gap-3">
              <Input
                placeholder="Enter Application Number (e.g., CC2026020100001)"
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              />
              <Button onClick={handleTrack} loading={isLoading} className="whitespace-nowrap">
                <Search className="h-4 w-4 mr-2" />
                Track
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Application Details */}
        {!isLoading && application && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Application Status</CardTitle>
                  <Badge status={application.status}>
                    {application.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Application Number</p>
                    <p className="font-semibold text-gray-900">{application.applicationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Submitted On</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(application.submittedAt, 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  {application.creditInfo && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Credit Score</p>
                        <p className="font-semibold text-gray-900">
                          {application.creditInfo.creditScore}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Credit Limit</p>
                        <p className="font-semibold text-primary-600">
                          {formatCurrency(application.creditInfo.creditLimit)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Timeline */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {application.statusHistory.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {item.status === 'pending' && (
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-yellow-600" />
                          </div>
                        )}
                        {item.status === 'approved' && (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                        {item.status === 'rejected' && (
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <X className="h-4 w-4 text-red-600" />
                          </div>
                        )}
                        {index < application.statusHistory.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-gray-900 capitalize">{item.status}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(item.timestamp, 'MMM dd, yyyy HH:mm')}
                        </p>
                        {item.remarks && (
                          <p className="text-sm text-gray-500 mt-1">{item.remarks}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Next Steps */}
            {application.status === 'approved' && (
              <Card variant="outlined" className="border-green-200 bg-green-50">
                <CardBody>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">What's Next?</h4>
                      <p className="text-sm text-green-800">
                        Your credit card will be dispatched to your registered address within 7-10
                        business days. You will receive a tracking number via email.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {application.status === 'rejected' && (
              <Card variant="outlined" className="border-red-200 bg-red-50">
                <CardBody>
                  <div className="flex gap-3">
                    <X className="h-6 w-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">Application Rejected</h4>
                      <p className="text-sm text-red-800">
                        Unfortunately, your application was not approved at this time. You can
                        reapply after 6 months. Contact support for more details.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
