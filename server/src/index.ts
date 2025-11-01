import express from 'express';
import cors from 'cors';
// --- FIX 1: Import 'Prisma' alongside 'PrismaClient' ---
import { PrismaClient, Prisma } from '@prisma/client';
import 'dotenv/config';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const bookingSchema = z.object({
  userName: z.string().min(1, 'Name is required'),
  userEmail: z.string().email('Invalid email address'),
  slotId: z.number().int().positive('Invalid slot ID'),
  quantity: z.number().int().positive('Invalid quantity'),
  finalPrice: z.number().positive('Invalid final price'),
  promoCode: z.string().optional().nullable(),
});

// --- Routes ---

// 1. GET all experiences (NOW WITH SEARCH)
app.get('/api/experiences', async (req, res) => {
  try {
    const { search } = req.query;

    const whereClause = search
      ? {
          OR: [
            {
              title: {
                contains: search as string,
                // --- FIX 2: Use the Prisma enum ---
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              description: {
                contains: search as string,
                // --- FIX 3: Use the Prisma enum ---
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              location: {
                contains: search as string,
                // --- FIX 4: Use the Prisma enum ---
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const experiences = await prisma.experience.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
    });
    res.json(experiences);
  } catch (error) {
    console.error('Failed to fetch experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// 2. GET a single experience by ID
app.get('/api/experiences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await prisma.experience.findUnique({
      where: { id: Number(id) },
      include: {
        slots: {
          orderBy: { startTime: 'asc' },
        },
      },
    });
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    console.error('Failed to fetch experience:', error);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// 3. POST to validate a promo code
app.post('/api/promo/validate', (req, res) => {
  try {
    const validCodes = {
      SAVE10: { type: 'percentage', value: 10 },
      FLAT100: { type: 'fixed', value: 100 },
    };
    const isKey = (code: string): code is keyof typeof validCodes => {
      return code in validCodes;
    };
    const { promoCode } = req.body as { promoCode: string };
    if (promoCode && isKey(promoCode)) {
      res.json({
        valid: true,
        discount: validCodes[promoCode],
      });
    } else {
      res.json({
        valid: false,
        message: 'Invalid promo code',
      });
    }
  } catch (error) {
    console.error('Failed to validate promo code:', error);
    res.status(500).json({ error: 'Failed to validate promo code' });
  }
});

// 4. POST to create a new booking
app.post('/api/bookings', async (req, res) => {
  const validation = bookingSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten() });
  }
  const { slotId, userName, userEmail, quantity, finalPrice, promoCode } =
    validation.data;
  try {
    const newBooking = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findFirst({
        where: {
          id: slotId,
          spotsAvailable: { gte: quantity },
        },
      });
      if (!slot) {
        throw new Error('Not enough spots available for this quantity.');
      }
      await tx.slot.update({
        where: { id: slotId },
        data: {
          spotsAvailable: {
            decrement: quantity,
          },
        },
      });
      const booking = await tx.booking.create({
        data: {
          slotId: slotId,
          userName: userName,
          userEmail: userEmail,
          quantity: quantity,
          finalPrice: finalPrice,
          promoCode: promoCode,
        },
      });
      return booking;
    });
    res.status(201).json(newBooking);
  } catch (error) {
    if (error instanceof Error && error.message.includes('spots available')) {
      return res.status(409).json({ error: error.message });
    }
    console.error('Booking failed:', error);
    res.status(500).json({ error: 'Booking failed. Please try again.' });
  }
});

// Simple test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BookIt API is running!' });
});

// --- Start the Server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});