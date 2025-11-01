import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import type { Experience, Slot } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

type Discount = {
  type: 'percentage' | 'fixed';
  value: number;
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    experience,
    slot,
    quantity,
  } = (location.state as {
    experience: Experience;
    slot: Slot;
    quantity: number;
  }) || {};

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [discount, setDiscount] = useState<Discount | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const subtotal = experience?.price ? experience.price * quantity : 0;
  const taxes = 59;

  let total = subtotal + taxes;
  let discountAmount = 0;

  if (discount) {
    if (discount.type === 'percentage') {
      discountAmount = (total * discount.value) / 100;
    } else {
      discountAmount = discount.value;
    }
    total = Math.max(0, total - discountAmount);
  }

  const handleValidatePromo = async () => {
    if (!promoCode) return;
    try {
      const response = await api.post('/promo/validate', { promoCode });
      if (response.data.valid) {
        setDiscount(response.data.discount);
        setPromoMessage('Promo code applied!');
      } else {
        setDiscount(null);
        setPromoMessage(response.data.message || 'Invalid promo code');
      }
    } catch {
      setDiscount(null);
      setPromoMessage('Error validating code.');
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsProcessing(true);
    setBookingError(null);

    try {
      const bookingDetails = {
        userName,
        userEmail,
        slotId: slot.id,
        quantity: quantity,
        finalPrice: total,
        promoCode: discount ? promoCode : null,
      };

      const response = await api.post('/bookings', bookingDetails);

      navigate('/result', {
        state: {
          success: true,
          booking: response.data,
          experience,
        },
      });
    } catch (error: unknown) {
      let message = 'Booking failed. Please try again.';
      let status = 500;

      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const err = error as {
          response?: { data?: { error?: string }; status?: number };
        };
        message = err.response?.data?.error || message;
        status = err.response?.status || 500;
      }

      setBookingError(message);
      setIsProcessing(false);

      if (status === 409) {
        navigate('/result', {
          state: { success: false, message },
        });
      }
    }
  };

  if (!experience || !slot) {
    navigate('/');
    return <LoadingSpinner />;
  }

  const isFormValid = userName && userEmail && termsAccepted && !isProcessing;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <form
      onSubmit={handleSubmitBooking}
      className="flex flex-col md:flex-row-reverse gap-8"
    >
      {/* Right Side: Price Summary */}
      <div className="w-full md:w-[387px] h-fit bg-[#EFEFEF] p-6 rounded-xl shadow-md sticky top-24 flex flex-col gap-6">
        <h2 className="text-xl font-semibold mb-4">Price summary</h2>
        <div className="flex justify-between items-center">
          <span className="text-zinc-600">Experience</span>
          <span className="font-semibold">{experience.title}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-600">Date</span>
          <span className="font-semibold">{formatDate(slot.startTime)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-600">Time</span>
          <span className="font-semibold">{formatTime(slot.startTime)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-600">Qty</span>
          <span className="font-semibold">{quantity}</span>
        </div>
        <hr className="border-zinc-400" />
        <div className="flex justify-between items-center">
          <span className="text-zinc-600">Subtotal</span>
          <span className="font-semibold">₹{subtotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-600">Taxes</span>
          <span className="font-semibold">₹{taxes}</span>
        </div>
        {discount && (
          <div className="flex justify-between items-center text-green-600">
            <span className="text-zinc-600">Discount ({promoCode})</span>
            <span className="font-semibold">- ₹{discountAmount.toFixed(0)}</span>
          </div>
        )}
        <hr className="border-zinc-400" />
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Total</span>
          <span className="text-lg font-bold">₹{total.toFixed(0)}</span>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full h-[44px] bg-[#FFD643] text-black text-base font-medium py-3 px-5 rounded-lg transition-colors hover:bg-primary-hover disabled:bg-zinc-300 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Pay and Confirm'}
        </button>
      </div>

      {/* Left Side: Form */}
      <div className="w-full md:w-2/3">
        <Link
          to={`/experience/${experience.id}`}
          className="text-sm font-medium text-zinc-600 hover:text-black mb-4 inline-flex items-center"
        >
          &larr; Back to details
        </Link>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                Full name
              </label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-md border-zinc-300 bg-zinc-100 px-4 py-2 text-sm"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full rounded-md border-zinc-300 bg-zinc-100 px-4 py-2 text-sm"
                placeholder="Your email"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="promo"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Promo code
            </label> 
            <div className="flex gap-2">
              <input
                type="text"
                id="promo"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="w-full rounded-md border-zinc-300 bg-zinc-100 px-4 py-2 text-sm"
                placeholder="e.g. SAVE10"
              />
              <button
                type="button"
                onClick={handleValidatePromo}
                className="bg-zinc-800 text-white font-semibold px-4 py-2 rounded-md text-sm"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p
                className={`text-sm mt-1 ${
                  discount ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {promoMessage}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded text-primary-DEFAULT focus:ring-primary-hover"
                required
              />
              <span className="ml-2 text-sm text-zinc-600">
                I agree to the terms and safety policy
              </span>
            </label>
          </div>

          {bookingError && (
            <p className="text-center text-red-500 mb-4">{bookingError}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Checkout;