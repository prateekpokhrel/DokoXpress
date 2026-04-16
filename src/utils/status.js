export function getOrderVariant(status) {
  if (status === 'Delivered') {
    return 'success';
  }

  if (status === 'Out for Delivery') {
    return 'info';
  }

  if (status === 'Packed') {
    return 'warning';
  }

  return 'neutral';
}

export function getVerificationVariant(status) {
  return status === 'verified' ? 'success' : 'warning';
}
