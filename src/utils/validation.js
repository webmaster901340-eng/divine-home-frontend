export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateIndianPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 && phoneRegex.test(cleanPhone);
};

export const formatPhoneInput = (value) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 10) {
    return cleaned;
  }
  return cleaned.slice(0, 10);
};
