import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CreditCard, Clock } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import { formatDate, formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { Application } from '@/types';

export function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/applications/my');
      setApplications(response.data.data || []);
    } catch (error: any) {
      showToast('Failed to load applications', 'error');
      console.error('Error fetching applications:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your credit card applications</p>
          </div>
          <Link to="/application/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card variant="elevated">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-600">
                    {applications.filter((app) => app.status === 'approved').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {applications.filter((app) => app.status === 'pending').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Applications List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
          {applications.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600">
                  Click the "New Application" button above to start your credit card application journey!
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid gap-4">
              {applications.map((application) => (
                <Card key={application._id} variant="elevated">
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {application.applicationNumber}
                          </h3>
                          <Badge status={application.status}>
                            {application.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Submitted</p>
                            <p className="font-medium">{formatDate(application.submittedAt)}</p>
                          </div>
                          {application.creditInfo && (
                            <>
                              <div>
                                <p className="text-gray-600">Credit Score</p>
                                <p className="font-medium">{application.creditInfo.creditScore}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Credit Limit</p>
                                <p className="font-medium text-primary-600">
                                  {formatCurrency(application.creditInfo.creditLimit)}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <Link to={`/application/${application._id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
