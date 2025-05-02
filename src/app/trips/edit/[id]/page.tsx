'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { tripService } from '@/services/tripService';
import { userService } from '@/services/userService';
import { Trip } from '@/types/tripTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftIcon, Trash2Icon, PlusIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { use } from 'react';
import { isBefore } from 'date-fns';
import { ValidatedDatePicker } from '@/components/validated-date-picker';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    async function loadData() {
      if (!user) return;
      
      try {
        setLoading(true);
        const [trip, arrivalDate] = await Promise.all([
          tripService.getTripById(id),
          userService.getArrivalDate(user.uid)
        ]);

        if (!trip) {
          toast.error('Trip not found');
          router.push('/trips');
          return;
        }

        setFirstEntryDate(arrivalDate);
        setFormData({
          title: trip.title,
          description: trip.description,
          country: trip.country,
          startDate: trip.startDate,
          endDate: trip.endDate,
          emoji: trip.emoji
        });
        setShowDescription(!!trip.description);
      } catch (err) {
        setError('Failed to load trip');
        toast.error('Failed to load trip');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firstEntryDate) return;

    const startDate = new Date(formData.startDate);
    if (isBefore(startDate, firstEntryDate)) {
      toast.error('Trip start date cannot be before your first entry to the UK');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await tripService.updateTrip(id, formData);
      toast.success('Trip updated successfully');
      router.push('/trips');
    } catch (err) {
      setError('Failed to update trip');
      toast.error('Failed to update trip');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await tripService.deleteTrip(id);
      toast.success('Trip deleted successfully');
      router.push('/trips');
    } catch (err) {
      setError('Failed to delete trip');
      toast.error('Failed to delete trip');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Please sign in to edit trips</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 max-w-2xl w-full">
      <Button
        variant="ghost"
        className="mb-4 sm:mb-6 gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </Button>

      <Card className="w-full">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Edit Trip</CardTitle>
          <CardDescription>Update your trip details</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
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
                    onClick={() => {
                      setShowDescription(false);
                      setFormData(prev => ({ ...prev, description: '' }));
                    }}
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
                disabled={saving || !formData.startDate || !formData.endDate}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={deleting}
                    className="gap-2"
                  >
                    <Trash2Icon className="h-4 w-4" />
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your trip
                      and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 