import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { residenceService } from '@/services/residenceService';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { userService } from '@/services/userService';
import { Buffer } from '@/types/userTypes';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Goal } from 'lucide-react';

interface ResidenceCheckProps {
  userId: string;
}

interface ResidenceCheckState {
  isLoading: boolean;
  error: string | null;
  result: Awaited<ReturnType<typeof residenceService.checkContinuousResidence>> | null;
  buffer: number;
}

export function ResidenceCheck({ userId }: ResidenceCheckProps) {
  const [state, setState] = useState<ResidenceCheckState>({
    isLoading: true,
    error: null,
    result: null,
    buffer: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function checkResidence() {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const user = await userService.getUser(userId);
        const result = await residenceService.checkContinuousResidence(userId);
        setState(prev => ({ 
          ...prev, 
          result, 
          buffer: user.prInfo.buffer,
          isLoading: false 
        }));
      } catch (error) {
        console.error('Error checking residence:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to check residence status'
        }));
      }
    }

    checkResidence();
  }, [userId]);

  if (state.isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Checking residence status...</p>
        </CardContent>
      </Card>
    );
  }

  if (state.error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive">{state.error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!state.result) return null;

  const { isValid, maxAbsencePeriod, failureReason } = state.result;
  const adjustedMaxDays = 180 - state.buffer;

  // Find the buffer label
  const bufferLabel = Object.entries(Buffer)
    .find(entry => entry[1] === state.buffer)?.[0] ?? 'No Buffer';

  return (
    <Card>
      <Button
        variant="ghost"
        className="w-full p-0 h-auto hover:bg-transparent"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardHeader className="w-full px-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <Goal className="h-5 w-5" />
                <CardTitle className="text-lg font-medium">
                  Continuous Residence Check
                </CardTitle>
              </div>
              <Badge variant={isValid ? "default" : "destructive"}>
                {isValid ? 'Valid' : 'Invalid'}
              </Badge>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
      </Button>

      {isExpanded && (
        <CardContent className="space-y-2 pt-0">
          <div>
            <p className="text-sm font-medium">Maximum Absence Period</p>
            <p className="text-sm text-muted-foreground">
              {maxAbsencePeriod.days} days between{' '}
              {format(maxAbsencePeriod.startDate, 'MMM d, yyyy')} and{' '}
              {format(maxAbsencePeriod.endDate, 'MMM d, yyyy')}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Safety Buffer</p>
            <p className="text-sm text-muted-foreground">
              {bufferLabel} ({state.buffer} days buffer)
            </p>
          </div>

          {!isValid && failureReason && (
            <div>
              <p className="text-sm font-medium">Reason</p>
              <p className="text-sm text-destructive">{failureReason}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>* Maximum allowed absence is {adjustedMaxDays} days in any 12-month period</p>
            <p className="italic">
              (Standard 180 days minus {state.buffer} days safety buffer)
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
} 