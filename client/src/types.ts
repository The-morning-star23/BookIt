export interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  totalSpots: number;
  spotsAvailable: number;
  experienceId: number;
}

export interface Experience {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  slots: Slot[];
}

// This is the data we get back from the server after a successful booking
export interface Booking {
  id: number;
  userName: string;
  userEmail: string;
  promoCode: string | null;
  finalPrice: number;
  slotId: number;
  createdAt: string;
}