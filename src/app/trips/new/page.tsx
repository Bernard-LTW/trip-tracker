'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { tripService } from '@/services/tripService';
import { userService } from '@/services/userService';
import { residenceService } from '@/services/residenceService';
import { Trip } from '@/types/tripTypes';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftIcon, PlusIcon, XIcon, AlertCircleIcon, CheckCircle2Icon, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { isBefore, format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NewTripPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstEntryDate, setFirstEntryDate] = useState<Date | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  // const [nextValidTripDate, setNextValidTripDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState<Omit<Trip, 'id' | 'userId' | 'createdAt'>>({
    title: '',
    description: '',
    country: '',
    startDate: '',
    endDate: '',
    emoji: ''
  });

  const [residenceCheck, setResidenceCheck] = useState<{
    isValid: boolean;
    nextValidDate: Date | null;
    qualifyingPeriodEnd: Date | null;
    nextPossibleTrips?: {
      sevenDayTrip: Date | null;
      fourteenDayTrip: Date | null;
    };
  }>({
    isValid: true,
    nextValidDate: null,
    qualifyingPeriodEnd: null
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

  useEffect(() => {
    async function calculateNextValidTripDate() {
      if (!user) {
        return router.push('/trips');
      }
      
      if (!formData.startDate || !formData.endDate) {
        setResidenceCheck({ isValid: true, nextValidDate: null, qualifyingPeriodEnd: null });
        return;
      }

      try {
        // Create a temporary trip with the current form data
        const tempTrip: Trip = {
          id: 'temp',
          userId: user.uid,
          title: formData.title,
          description: formData.description,
          country: formData.country,
          startDate: formData.startDate,
          endDate: formData.endDate,
          emoji: formData.emoji,
          createdAt: Timestamp.now()
        };
        
        // Check residence requirements including the temporary trip
        const result = await residenceService.checkContinuousResidence(user.uid, tempTrip);

        // Debug log to see what we're getting from the service
        console.log('Residence check result:', result);

        setResidenceCheck({ 
          isValid: result.isValid, 
          nextValidDate: null,
          qualifyingPeriodEnd: result.qualifyingPeriodEnd || null,
          nextPossibleTrips: result.nextPossibleTrips
        });
      } catch (error) {
        console.error('Error calculating next valid trip date:', error);
      }
    }

    calculateNextValidTripDate();
  }, [user, formData, router]);

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
                <Input
                  type="date"
                  value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value;
                    if (date && firstEntryDate && isBefore(new Date(date), firstEntryDate)) {
                      toast.error('Trip start date cannot be before your first entry to the UK');
                      return;
                    }
                    setFormData(prev => ({
                      ...prev,
                      startDate: date ? new Date(date).toISOString() : ''
                    }));
                  }}
                  min={firstEntryDate ? format(firstEntryDate, 'yyyy-MM-dd') : undefined}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate ? formData.endDate.split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      endDate: date ? new Date(date).toISOString() : ''
                    }));
                  }}
                  min={formData.startDate ? formData.startDate.split('T')[0] : firstEntryDate ? format(firstEntryDate, 'yyyy-MM-dd') : undefined}
                />
              </div>
            </div>

            <Alert 
              variant={!formData.startDate || !formData.endDate ? "default" : residenceCheck.isValid ? "default" : "destructive"} 
              className="mt-4"
            >
              {!formData.startDate || !formData.endDate ? (
                <>
                  <CalendarIcon className="h-4 w-4" />
                  <AlertDescription>
                    Pick your trip dates and we&apos;ll tell you if they comply with your residence requirements.
                  </AlertDescription>
                </>
              ) : residenceCheck.isValid ? (
                <>
                  <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                  <AlertDescription>
                    These dates comply with your residence requirements through the end of your qualifying period
                    ({residenceCheck.qualifyingPeriodEnd && format(residenceCheck.qualifyingPeriodEnd, 'MMMM d, yyyy')}).

                    {residenceCheck.nextPossibleTrips && (
                      <div className="mt-2 space-y-1">
                        <p className="font-medium">Next possible short trips after this one:</p>
                        {residenceCheck.nextPossibleTrips.sevenDayTrip && (
                          <p>• 7-day trip possible from {format(residenceCheck.nextPossibleTrips.sevenDayTrip, 'MMMM d, yyyy')}</p>
                        )}
                        {residenceCheck.nextPossibleTrips.fourteenDayTrip && (
                          <p>• 14-day trip possible from {format(residenceCheck.nextPossibleTrips.fourteenDayTrip, 'MMMM d, yyyy')}</p>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </>
              ) : (
                <>
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertDescription>
                    This trip would exceed the maximum allowed absence in a rolling 12-month period during your qualifying period
                    (ending {residenceCheck.qualifyingPeriodEnd && format(residenceCheck.qualifyingPeriodEnd, 'MMMM d, yyyy')}).
                  </AlertDescription>
                </>
              )}
            </Alert>

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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 