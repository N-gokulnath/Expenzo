export const formatCurrency = (amount: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  // Custom Indian format (roughly: 1,23,456)
  const x = amount.toFixed(0);
  const lastThree = x.substring(x.length - 3);
  const otherNumbers = x.substring(0, x.length - 3);
  const formatted = otherNumbers !== '' 
                    ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree 
                    : lastThree;
  
  return `₹${formatted}`;
};

export const formatMonthYear = (date: Date): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Invalid Date';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatTime = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Invalid Time';
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${strMinutes} ${ampm}`;
};
