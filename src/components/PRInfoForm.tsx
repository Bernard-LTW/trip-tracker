import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createOrUpdateUser, UserPRInfo } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const VISA_TYPES = [
  "Tier 4 Student",
  "Tier 2 General",
  "Skilled Worker",
  "Graduate",
  "Family",
  "Other"
];

export default function PRInfoForm({ initialData }: { initialData: UserPRInfo }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserPRInfo>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

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
            <Label htmlFor="firstEntryToUK">First Entry to UK</Label>
            <Input
              id="firstEntryToUK"
              type="date"
              value={formData.firstEntryToUK}
              onChange={(e) => setFormData(prev => ({ ...prev, firstEntryToUK: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visaType">Visa Type</Label>
            <Select
              value={formData.visaType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, visaType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visa type" />
              </SelectTrigger>
              <SelectContent>
                {VISA_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indefiniteLeaveDate">Indefinite Leave Date (if applicable)</Label>
            <Input
              id="indefiniteLeaveDate"
              type="date"
              value={formData.indefiniteLeaveDate || ""}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                indefiniteLeaveDate: e.target.value || null 
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes about your immigration status..."
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 