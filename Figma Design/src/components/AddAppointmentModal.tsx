import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X } from "lucide-react";

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAppointmentModal({ isOpen, onClose }: AddAppointmentModalProps) {
  if (!isOpen) return null;

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4 border border-border/20 rounded-xl shadow-xl">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Add New Appointment</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="rounded-lg hover:bg-muted/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input 
                id="customer-name" 
                placeholder="Enter customer name"
                className="rounded-xl border-border/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Phone Number</Label>
              <Input 
                id="customer-phone" 
                placeholder="Enter phone number"
                className="rounded-xl border-border/20"
              />
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <Label>Service</Label>
            <Select>
              <SelectTrigger className="rounded-xl border-border/20">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="haircut">Haircut - €15</SelectItem>
                <SelectItem value="beard">Beard Trim - €8</SelectItem>
                <SelectItem value="both">Haircut + Beard - €20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Barber Selection */}
          <div className="space-y-2">
            <Label>Barber</Label>
            <Select>
              <SelectTrigger className="rounded-xl border-border/20">
                <SelectValue placeholder="Select a barber" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marco">Marco</SelectItem>
                <SelectItem value="alex">Alex</SelectItem>
                <SelectItem value="tony">Tony</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Input 
              type="date" 
              className="rounded-xl border-border/20"
              defaultValue="2024-03-20"
            />
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-3">
            <Label>Available Time Slots</Label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.slice(0, 12).map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border/20 hover:bg-foreground hover:text-background"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl border-border/20"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-foreground text-background hover:bg-foreground/90 rounded-xl"
            >
              Confirm Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}