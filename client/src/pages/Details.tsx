import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { API_ROOT } from '../api';
import type { Experience, Slot } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/experiences/${id}`);
        setExperience(response.data);
        if (response.data.slots.length > 0) {
          const firstAvailableDate = new Date(
            response.data.slots[0].startTime
          ).toDateString();
          setSelectedDate(firstAvailableDate);
        }
      } catch (err) {
        setError('Failed to fetch experience details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id]);

  const availableDates = experience
    ? [
        ...new Set(
          experience.slots.map((slot) =>
            new Date(slot.startTime).toDateString()
          )
        ),
      ]
    : [];

  const slotsForSelectedDate = experience
    ? experience.slots.filter(
        (slot) => new Date(slot.startTime).toDateString() === selectedDate
      )
    : [];

  const formatTime = (dateString: string) => {
    return new Date(dateString)
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase();
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setQuantity(1);
  };

  const handleSlotSelect = (slot: Slot) => {
    if (slot.spotsAvailable > 0) {
      setSelectedSlot(slot);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((currentQuantity) => {
      const newQuantity = currentQuantity + amount;
      if (newQuantity < 1) return 1;
      if (selectedSlot && newQuantity > selectedSlot.spotsAvailable) {
        return selectedSlot.spotsAvailable;
      }
      return newQuantity;
    });
  };

  const handleConfirm = () => {
    navigate('/checkout', {
      state: {
        experience,
        slot: selectedSlot,
        quantity,
      },
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!experience) return <p>Experience not found.</p>;

  const subtotal = experience.price * quantity;
  const taxes = 59;
  const total = subtotal + taxes;

  const canDecrease = quantity <= 1;
  const canIncrease = !selectedSlot || quantity >= selectedSlot.spotsAvailable;
  const canConfirm = !selectedSlot;

  return (
    <>
      <Link
        to="/"
        className="flex items-center gap-2 mb-4 text-sm font-medium text-black"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Details
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 flex flex-col gap-8">
          <img
            src={`${API_ROOT}${experience.imageUrl}`}
            alt={experience.title}
            className="w-full h-[381px] object-cover rounded-xl"
          />

          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-medium text-[#161616]">
              {experience.title}
            </h1>
            <p className="text-base font-normal text-[#6C6C6C] h-12">
              Curated small-group experience. Certified guide. Safety first with
              gear included. Helmet and Life jackets along with an expert will
              accompany in kayaking.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium text-[#161616]">Choose date</h2>
            <div className="flex flex-wrap gap-2">
              {availableDates.map((date) => (
                <button
                  key={date}
                  onClick={() => handleDateSelect(date)}
                  className={`w-[80px] h-[34px] rounded-[4px] px-3 py-2 text-sm ${
                    selectedDate === date
                      ? 'bg-[#FFD643] text-black font-medium'
                      : 'bg-white text-[#838383] font-normal border border-[#BDBDBD]'
                  }`}
                >
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                  })}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium text-[#161616]">Choose time</h2>
            <div className="flex flex-wrap gap-4">
              {slotsForSelectedDate.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={slot.spotsAvailable === 0}
                  className={`
                    w-[125px] h-[45px] rounded-[4px] px-3 py-2 text-sm font-medium
                    border border-[#BDBDBD]
                    items-center gap-2
                    ${
                      slot.spotsAvailable === 0
                        ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                        : selectedSlot?.id === slot.id
                        ? 'bg-[#FFD643] text-black'
                        : 'bg-white text-zinc-700 hover:bg-zinc-50'
                    }
                  `}
                >
                  <span>{formatTime(slot.startTime)}</span>
                  <span
                    className={`text-xs ${
                      slot.spotsAvailable === 0
                        ? 'text-zinc-500'
                        : 'text-red-500'
                    }`}
                  >
                    {slot.spotsAvailable === 0
                      ? 'Sold out'
                      : `${slot.spotsAvailable} left`}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs font-normal text-[#838383]">
              All times are in IST (GMT +5:30)
            </p>
          </div>

          {/* About Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium text-[#161616]">About</h2>
            <div className="bg-#EEEEEE border p-4 rounded-md shadow-sm">
              <p className="text-xs font-normal text-[#838383]">
                Scenic routes, trained guides, and safety briefing. Minimum age
                10.
              </p>{' '}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="w-full md:w-[387px] h-fit bg-[#EFEFEF] p-6 rounded-xl shadow-md sticky top-24 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-base font-normal text-[#656565]">
                Starts at
              </span>
              <span className="text-lg font-normal text-[#161616]">
                ₹{experience.price}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-normal text-[#656565]">
                Quantity
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="font-bold text-zinc-600 disabled:text-zinc-400"
                  disabled={canDecrease}
                >
                  -
                </button>
                <span className="text-lg font-normal text-[#161616]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="font-bold text-zinc-600 disabled:text-zinc-400"
                  disabled={canIncrease}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-normal text-[#656565]">
                Subtotal
              </span>
              <span className="text-lg font-normal text-[#161616]">
                ₹{subtotal}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-normal text-[#656565]">
                Taxes
              </span>
              <span className="text-lg font-normal text-[#161616]">
                ₹{taxes}
              </span>
            </div>
          </div>
          <hr className="border-zinc-400" />
          <div className="flex justify-between items-center">
            <span className="text-xl font-medium text-[#161616]">Total</span>
            <span className="text-xl font-medium text-[#161616]">
              ₹{total}
            </span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={canConfirm}
            className="w-full h-[44px] bg-[#FFD643] text-black text-base font-medium py-3 px-5 rounded-lg transition-colors hover:bg-primary-hover disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};

export default Details;