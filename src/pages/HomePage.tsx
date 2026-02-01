import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Clock, Shield, Zap, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Get Your Credit Card in Minutes
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                Fast, secure, and hassle-free credit card applications with instant approval
                decisions based on your credit score.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/application/new">
                  <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                    Apply Now
                  </Button>
                </Link>
                <Link to="/application/track">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                    Track Application
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-2xl transform rotate-6"></div>
                <div className="relative bg-white/95 rounded-2xl p-8 shadow-2xl">
                  <CreditCard className="h-16 w-16 text-primary-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Card</h3>
                  <p className="text-gray-600 mb-4">Credit Limit up to ₹10,00,000</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Instant Approval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>No Annual Fee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Reward Points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600">
              Fast, secure, and transparent credit card application process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="elevated" className="text-center">
              <CardBody className="py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary-100 rounded-full">
                    <Zap className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Decision</h3>
                <p className="text-gray-600">
                  Get approval or rejection decision instantly based on your credit score.
                  No waiting for days!
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated" className="text-center">
              <CardBody className="py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-100 rounded-full">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Secure</h3>
                <p className="text-gray-600">
                  Your data is encrypted and protected with bank-level security. We never
                  compromise on safety.
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated" className="text-center">
              <CardBody className="py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-yellow-100 rounded-full">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Process</h3>
                <p className="text-gray-600">
                  Simple 3-step application form. Takes less than 5 minutes to complete.
                  Get started now!
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Three simple steps to get your credit card</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fill Application</h3>
              <p className="text-gray-600">
                Provide your personal and employment details in our simple form
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Credit Check</h3>
              <p className="text-gray-600">
                We automatically verify your credit score and calculate your credit limit
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Your Card</h3>
              <p className="text-gray-600">
                If approved, your card will be dispatched to your address within 7-10 days
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/application/new">
              <Button size="lg">Start Your Application</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Credit Limit Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Credit Limit Based on Income
            </h2>
            <p className="text-xl text-gray-600">Transparent and fair credit limit calculation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="outlined" className="hover:border-primary-500 transition-colors">
              <CardBody>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                  <span className="text-sm font-medium text-gray-600">Annual Income</span>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-gray-900">≤ ₹2,00,000</span>
                </div>
                <div className="text-primary-600 font-semibold">
                  Credit Limit: ₹50,000
                </div>
              </CardBody>
            </Card>

            <Card variant="outlined" className="hover:border-primary-500 transition-colors">
              <CardBody>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                  <span className="text-sm font-medium text-gray-600">Annual Income</span>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-gray-900">₹2L - ₹3L</span>
                </div>
                <div className="text-primary-600 font-semibold">
                  Credit Limit: ₹75,000
                </div>
              </CardBody>
            </Card>

            <Card variant="outlined" className="hover:border-primary-500 transition-colors">
              <CardBody>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                  <span className="text-sm font-medium text-gray-600">Annual Income</span>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-gray-900">₹3L - ₹5L</span>
                </div>
                <div className="text-primary-600 font-semibold">
                  Credit Limit: ₹1,00,000
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              <strong>Note:</strong> For annual income above ₹5,00,000, credit limit will be
              subjective and reviewed manually.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Your Credit Card?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of satisfied customers who got instant approval
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/application/new">
              <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                Apply Now
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
