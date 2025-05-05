import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createOrUpdateUser } from "@/lib/user";
import { UserPRInfo, Buffer } from "@/types/userTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function PRInfoForm({ initialData }: { initialData: UserPRInfo }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserPRInfo>({
    ...initialData,
    buffer: initialData.buffer ?? 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate dates
    if (formData.firstEntryToUK && formData.visaApprovalDate) {
      const entryDate = new Date(formData.firstEntryToUK);
      const visaDate = new Date(formData.visaApprovalDate);
      if (entryDate < visaDate) {
        toast.error("First entry date cannot be earlier than visa approval date");
        return;
      }
    }

    setLoading(true);
    try {
      await createOrUpdateUser(user.uid, {
        prInfo: formData
      });
      toast.success("PR information updated successfully");
    } catch (error) {
      console.error("Error updating PR info:", error);
      toast.error("Failed to update PR information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>PR Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="visaApprovalDate">Visa Approval Date</Label>
            <Input
              id="visaApprovalDate"
              type="date"
              value={formData.visaApprovalDate}
              onChange={(e) => setFormData(prev => ({ ...prev, visaApprovalDate: e.target.value }))}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              This date is usually shown on the email you received from the Home Office.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstEntryToUK">First Entry to UK</Label>
            <Input
              id="firstEntryToUK"
              type="date"
              value={formData.firstEntryToUK}
              min={formData.visaApprovalDate}
              onChange={(e) => {
                const newDate = e.target.value;
                if (!formData.visaApprovalDate || new Date(newDate) >= new Date(formData.visaApprovalDate)) {
                  setFormData(prev => ({ ...prev, firstEntryToUK: newDate }));
                } else {
                  toast.error("First entry date cannot be earlier than visa approval date");
                }
              }}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Check your passport for stamps or flight tickets to find this date.
              {formData.visaApprovalDate && (
                <> Must be on or after {new Date(formData.visaApprovalDate).toLocaleDateString()}</>
              )}
            </p>
          </div>

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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 