// Importing necessary icons from heroicons library
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
// Importing clsx for conditional classnames
import clsx from 'clsx';

// InvoiceStatus component which takes status as a prop
export default function InvoiceStatus({ status }: { status: string }) {
  return (
    // Span element with conditional classes based on status
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === 'pending', // Gray background for pending status
          'bg-green-500 text-white': status === 'paid', // Green background for paid status
        },
      )}
    >
      {status === 'pending' ? (
        // If status is pending, display "Pending" and a clock icon
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'paid' ? (
        // If status is paid, display "Paid" and a check icon
        <>
          Paid
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}