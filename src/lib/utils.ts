import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  return format(new Date(date), formatStr);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function validatePAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validatePincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return phone;
}

export function getCreditLimitForIncome(income: number): number | string {
  if (income <= 200000) return 50000;
  if (income <= 300000) return 75000;
  if (income <= 500000) return 100000;
  return 'Subjective';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function maskPAN(pan: string): string {
  if (!pan || pan.length < 4) return pan;
  // Show only last 4 characters: XXXXX1234X
  const lastFour = pan.slice(-4);
  return `XXXXXX${lastFour}`;
}

export function maskEmail(email: string): string {
  if (!email) return email;
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  const maskedUsername = username.length > 2 
    ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
    : username;
  return `${maskedUsername}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return phone;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 10) {
    const lastFour = cleaned.slice(-4);
    return `+91XXXXXX${lastFour}`;
  }
  return phone;
}

export function getUsernameFromEmail(email: string): string {
  if (!email) return 'User';
  const username = email.split('@')[0];
  // Capitalize first letter
  return username.charAt(0).toUpperCase() + username.slice(1);
}
