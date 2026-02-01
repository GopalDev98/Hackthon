import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import { formatDate, formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { Application, ApplicationStatus } from '@/types';

export function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editedCreditLimit, setEditedCreditLimit] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/applications');
      const apps = response.data.data?.applications || response.data.data || [];
      setApplications(apps);
    } catch (error: any) {
      showToast('Failed to load applications', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleViewDetails = (app: Application) => {
    setSelectedApp(app);
    setEditedCreditLimit(app.creditInfo?.creditLimit || 0);
    setRemarks('');
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      await api.patch(`/applications/${appId}`, { 
        status: newStatus,
        creditLimit: editedCreditLimit,
        remarks: remarks || `Application ${newStatus} by admin`
      });
      showToast(`Application ${newStatus} successfully`, 'success');
      fetchApplications();
      setShowDetailsModal(false);
    } catch (error: any) {
      showToast('Failed to update application', 'error');
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Applications</h1>
          <p className="text-gray-600 mt-1">Manage and review credit card applications</p>
        </div>

        {/* Filters */}
        <Card variant="elevated" className="mb-6">
          <CardBody>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by application number, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' },
                ]}
              />
            </div>
          </CardBody>
        </Card>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredApplications.length} of {applications.length} applications
        </div>

        {/* Applications Table */}
        <Card variant="elevated">
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Limit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {app.applicationNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.personalInfo.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {app.personalInfo.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge status={app.status}>{app.status.toUpperCase()}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.creditInfo?.creditScore || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.creditInfo ? formatCurrency(app.creditInfo.creditLimit) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(app.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(app)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Application Details"
          size="xl"
        >
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <Badge status={selectedApp.status} className="text-base px-4 py-1">
                {selectedApp.status.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-500">
                {selectedApp.applicationNumber}
              </span>
            </div>

            {/* Personal Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{selectedApp.personalInfo.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">DOB:</span>
                    <span className="ml-2 font-medium">{selectedApp.personalInfo.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{selectedApp.personalInfo.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">{selectedApp.personalInfo.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">PAN:</span>
                    <span className="ml-2 font-medium uppercase">{selectedApp.personalInfo.panCard}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <span className="ml-2 font-medium">
                    {selectedApp.personalInfo.address.street}, {selectedApp.personalInfo.address.city},{' '}
                    {selectedApp.personalInfo.address.state} - {selectedApp.personalInfo.address.pincode}
                  </span>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Employment Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium capitalize">
                    {selectedApp.employmentInfo.employmentType}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Annual Income:</span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(selectedApp.employmentInfo.annualIncome)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Company:</span>
                  <span className="ml-2 font-medium">{selectedApp.employmentInfo.companyName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Designation:</span>
                  <span className="ml-2 font-medium">{selectedApp.employmentInfo.designation}</span>
                </div>
              </div>
            </div>

            {/* Credit Information */}
            {selectedApp.creditInfo && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Credit Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Credit Score:</span>
                    <span className="ml-2 font-medium text-lg">
                      {selectedApp.creditInfo.creditScore}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Credit Limit:</span>
                    <span className="ml-2 font-medium text-lg text-primary-600">
                      {formatCurrency(selectedApp.creditInfo.creditLimit)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Actions */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Admin Actions</h4>
              
              {/* Edit Credit Limit */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit Limit (₹)
                  </label>
                  <Input
                    type="number"
                    value={editedCreditLimit}
                    onChange={(e) => setEditedCreditLimit(Number(e.target.value))}
                    placeholder="Enter credit limit"
                    min="0"
                    step="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Original: {formatCurrency(selectedApp.creditInfo?.creditLimit || 0)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks (Optional)
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks or reason for decision..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                {selectedApp.status !== 'approved' && (
                  <Button
                    variant="primary"
                    onClick={() => handleUpdateStatus(selectedApp._id, 'approved')}
                  >
                    Approve Application
                  </Button>
                )}
                {selectedApp.status !== 'rejected' && (
                  <Button
                    variant="danger"
                    onClick={() => handleUpdateStatus(selectedApp._id, 'rejected')}
                  >
                    Reject Application
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
