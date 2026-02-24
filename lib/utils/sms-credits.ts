export function calculateSMSCredits(message: string): number {
  const length = message.length;
  
  if (length <= 160) {
    return 1;
  } else if (length <= 306) {
    return 2;
  } else if (length <= 459) {
    return 3;
  } else if (length <= 612) {
    return 4;
  } else {
    return Math.ceil(length / 153);
  }
}

export function getSMSCreditInfo(message: string) {
  const length = message.length;
  const credits = calculateSMSCredits(message);
  const maxLength = credits === 1 ? 160 : 153 * credits;
  
  return {
    length,
    credits,
    maxLength,
    remaining: maxLength - length,
  };
}
