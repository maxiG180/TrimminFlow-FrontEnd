import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Scissors, Star } from "lucide-react";

export function PublicBooking() {
  const services = [
    { id: "haircut", name: "Haircut", price: "€15", description: "Professional hair styling" },
    { id: "beard", name: "Beard Trim", price: "€8", description: "Precision beard grooming" },
    { id: "combo", name: "Haircut + Beard", price: "€20", description: "Complete grooming package" },
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/20 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Scissors className="w-8 h-8" />
              <h1 className="text-3xl font-medium">TRIMMINFLOW</h1>
            </div>
            <p className="text-muted-foreground">Book your appointment online</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-foreground text-foreground" />
              ))}
              <span className="text-sm text-muted-foreground ml-2">4.9/5 (127 reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Service Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Choose Your Service</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="border border-border/20 rounded-xl cursor-pointer hover:border-foreground/30 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <div className="text-xl font-medium">{service.price}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="w-3 h-3 rounded-full border-2 border-border/30"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Select Date</h2>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <Card 
                key={day} 
                className="border border-border/20 rounded-xl cursor-pointer hover:border-foreground/30 transition-colors text-center"
              >
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">{day}</div>
                  <div className="text-lg font-medium">{18 + index}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Available Times</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {timeSlots.map((time, index) => (
              <Button
                key={time}
                variant={index === 5 ? "default" : "outline"}
                className={`rounded-xl ${index === 5 
                  ? "bg-foreground text-background" 
                  : "border-border/20 hover:border-foreground/30"}`}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Your Information</h2>
          <Card className="border border-border/20 rounded-xl">
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name"
                    className="rounded-xl border-border/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="Enter your phone"
                    className="rounded-xl border-border/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Book Button */}
        <div className="text-center pt-4">
          <Button 
            size="lg" 
            className="bg-foreground text-background hover:bg-foreground/90 rounded-xl px-12 py-4 text-lg"
          >
            Book Appointment
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            You'll receive a confirmation via SMS
          </p>
        </div>
      </div>
    </div>
  );
}