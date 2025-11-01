import { useLocation, Link } from 'react-router-dom';
import type { Booking, Experience } from '../types';

// SVGs for Success and Failure icons
const SuccessIcon = () => (
  <svg
    className="w-16 h-16 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const FailureIcon = () => (
  <svg
    className="w-16 h-16 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Result = () => {
  const location = useLocation();

  // Read the state passed from the navigate() function in Checkout
  const {
    success,
    booking,
    experience,
    message,
  } = (location.state as {
    success: boolean;
    booking?: Booking;
    experience?: Experience;
    message?: string;
  }) || { success: false };

  // --- Render Success Page ---
  if (success && booking && experience) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <SuccessIcon />
        <h1 className="text-3xl font-bold mt-4 mb-2">Booking Confirmed!</h1>
        <p className="text-zinc-600 text-lg mb-6">
          Your booking for **{experience.title}** is complete.
        </p>
        <div className="bg-white shadow-md rounded-lg p-6 text-left max-w-sm w-full mb-8">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Booking Summary
          </h2>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-zinc-600">Ref ID:</span>
              <span className="font-medium">BKNG{booking.id}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-zinc-600">Name:</span>
              <span className="font-medium">{booking.userName}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-zinc-600">Email:</span>
              <span className="font-medium">{booking.userEmail}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-zinc-600">Total Paid:</span>
              <span className="font-medium">₹{booking.finalPrice}</span>
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="bg-zinc-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-black"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // --- Render Failure Page ---
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <FailureIcon />
      <h1 className="text-3xl font-bold mt-4 mb-2">Booking Failed</h1>
      <p className="text-zinc-600 text-lg mb-6">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      <Link
        to="/"
        className="bg-zinc-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-black"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Result;