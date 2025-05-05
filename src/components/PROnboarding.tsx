'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createOrUpdateUser } from "@/lib/user";
import { UserPRInfo, Buffer } from "@/types/userTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { getUserData } from "@/lib/user";

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Trip Tracker',
    description: 'Let\'s set up your PR tracking information to help you stay compliant with UK residency requirements.'
  },
  {
    id: 'visaApproval',
    title: 'When was your visa approved? ',
    description: 'This date is usually shown on the email you received from the Home Office.'
  },
  {
    id: 'firstEntry',
    title: 'When did you first enter the UK on this visa?',
    description: 'Check your passport for stamps or flight tickets to find this date.'
  },
  {
    id: 'buffer',
    title: 'Safety Buffer',
    description: 'Choose a safety buffer for your trips. This helps ensure you stay within permitted absence limits.'
  }
];

interface PROnboardingProps {
  onComplete?: () => void;
}

export default function PROnboarding({ onComplete }: PROnboardingProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<UserPRInfo>({
    visaApprovalDate: '',
    firstEntryToUK: '',
    buffer: 0
  });

  useEffect(() => {
    setMounted(true);
    async function loadExistingData() {
      if (!user) return;
      
      try {
        const userData = await getUserData(user.uid);
        if (userData?.prInfo) {
          setFormData(prev => ({
            ...prev,
            visaApprovalDate: userData.prInfo?.visaApprovalDate || '',
            firstEntryToUK: userData.prInfo?.firstEntryToUK || '',
            buffer: userData.prInfo?.buffer || 0
          }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setInitialLoading(false);
      }
    }
    loadExistingData();
  }, [user]);

  if (!mounted || initialLoading) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await createOrUpdateUser(user.uid, {
        prInfo: formData
      });
      toast.success("PR information saved successfully!");
      onComplete?.();
    } catch (error) {
      console.error("Error saving PR info:", error);
      toast.error("Failed to save PR information");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    return (
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <CardHeader>
          <CardTitle>{step.title}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* {step.id === 'welcome' && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We'll help you track your time in and out of the UK to ensure you meet the residency requirements for permanent residence.
              </p>
            </div>
          )} */}

          {step.id === 'visaApproval' && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="visaApprovalDate">Visa Approval Date</Label>
                <Input
                  id="visaApprovalDate"
                  type="date"
                  value={formData.visaApprovalDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, visaApprovalDate: e.target.value }))}
                  required
                />
              </div>
            </div>
          )}

          {step.id === 'firstEntry' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstEntryToUK">First Entry Date</Label>
                <Input
                  id="firstEntryToUK"
                  type="date"
                  value={formData.firstEntryToUK}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstEntryToUK: e.target.value }))}
                  required
                />
              </div>
            </div>
          )}

          {step.id === 'buffer' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buffer">Safety Buffer</Label>
                <Select
                  value={formData.buffer.toString()}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    buffer: Number(value) as Buffer 
                  }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a safety buffer" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(Buffer).map(([label, value]) => (
                      <SelectItem key={value} value={value.toString()}>
                        {label} ({value} days)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  A safety buffer helps ensure you don't accidentally exceed absence limits.
                  The larger the buffer, the more conservative your trip planning will be.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6 gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            
            {currentStep === steps.length - 1 ? (
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !formData.visaApprovalDate || !formData.firstEntryToUK}
              >
                {loading ? "Saving..." : "Complete Setup"}
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={
                  (step.id === 'visaApproval' && !formData.visaApprovalDate) ||
                  (step.id === 'firstEntry' && !formData.firstEntryToUK)
                }
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </motion.div>
    );
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </Card>
    </div>
  );
} 