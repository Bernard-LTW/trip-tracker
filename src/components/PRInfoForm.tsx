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
          </div>

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
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 