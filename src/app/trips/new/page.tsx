'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { tripService } from '@/services/tripService';
import { userService } from '@/services/userService';
import { Trip } from '@/types/tripTypes';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftIcon, PlusIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { isBefore } from 'date-fns';
import { ValidatedDatePicker } from '@/components/validated-date-picker';

export default function NewTripPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstEntryDate, setFirstEntryDate] = useState<Date | null>(null);
  const [showDescription, setShowDescription] = useState(false);

  const [formData, setFormData] = useState<Omit<Trip, 'id' | 'userId' | 'createdAt'>>({
    title: '',
    description: '',
    country: '',
    startDate: '',
    endDate: '',
    emoji: ''
  });

  useEffect(() => {
    async function loadFirstEntryDate() {
      if (!user) return;
      try {
        const arrivalDate = await userService.getArrivalDate(user.uid);
        setFirstEntryDate(arrivalDate);
      } catch (error) {
        console.error('Error loading first entry date:', error);
        toast.error('Failed to load first entry date');
      }
    }
    loadFirstEntryDate();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firstEntryDate) return;

    const startDate = new Date(formData.startDate);
    if (isBefore(startDate, firstEntryDate)) {
      toast.error('Trip start date cannot be before your first entry to the UK');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newTrip: Omit<Trip, 'id'> = {
        ...formData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      };

      await tripService.createTrip(newTrip);
      toast.success('Trip created successfully');
      router.push('/trips');
    } catch (err) {
      setError('Failed to create trip');
      toast.error('Failed to create trip');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Please sign in to create a trip</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Trip</CardTitle>
          <CardDescription>Fill in the details of your upcoming trip</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Trip Title</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Summer Vacation in Italy"
                  className="flex-1"
                />
                <div className="w-full sm:w-[150px]">
                  <EmojiPicker
                    emoji={formData.emoji}
                    onSelect={(emoji) => setFormData(prev => ({ ...prev, emoji }))}
                  />
                </div>
              </div>
            </div>

            {showDescription ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description">Description</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDescription(false)}
                    className="h-8 px-2"
                  >
                    <XIcon className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your trip plans..."
                  className="min-h-[100px]"
                />
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDescription(true)}
                className="w-full"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Description
              </Button>
            )}

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g., Italy"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <ValidatedDatePicker
                  date={formData.startDate ? new Date(formData.startDate) : undefined}
                  onSelect={(date) => {
                    if (date && firstEntryDate && isBefore(date, firstEntryDate)) {
                      toast.error('Trip start date cannot be before your first entry to the UK');
                      return;
                    }
                    setFormData(prev => ({ 
                      ...prev, 
                      startDate: date ? date.toISOString() : '' 
                    }));
                  }}
                  disabledDate={(date: Date) => firstEntryDate ? isBefore(date, firstEntryDate) : false}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <ValidatedDatePicker
                  date={formData.endDate ? new Date(formData.endDate) : undefined}
                  onSelect={(date) => setFormData(prev => ({ 
                    ...prev, 
                    endDate: date ? date.toISOString() : '' 
                  }))}
                  disabledDate={(date: Date) => {
                    if (!formData.startDate || !firstEntryDate) return false;
                    const startDate = new Date(formData.startDate);
                    return isBefore(date, startDate) || isBefore(date, firstEntryDate);
                  }}
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={loading || !formData.startDate || !formData.endDate}
              >
                {loading ? 'Creating...' : 'Create Trip'}
              </Button>
              {/* <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 