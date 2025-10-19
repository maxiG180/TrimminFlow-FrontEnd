import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Plus } from "lucide-react";

export function Calendar() {
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const barbers = ["Marco", "Alex", "Tony"];

  // Sample appointments data
  const appointments = {
    "Marco-09:00": "John Smith",
    "Marco-14:00": "Mike Davis",
    "Alex-10:30": "Sarah Johnson",
    "Tony-15:30": "Emma Wilson",
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-foreground mb-2">Weekly Calendar</h1>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">Week of March 18 - 24, 2024</p>
          <Button variant="outline" className="rounded-xl border-border/20">
            Previous Week
          </Button>
          <Button variant="outline" className="rounded-xl border-border/20">
            Next Week
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="border border-border/20 rounded-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Header Row */}
          <div className="grid grid-cols-4 border-b border-border/20">
            <div className="p-4 bg-muted/30 font-medium text-center">Time</div>
            {barbers.map((barber) => (
              <div key={barber} className="p-4 bg-muted/30 font-medium text-center border-l border-border/20">
                {barber}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-4 border-b border-border/10 min-h-[60px]">
              <div className="p-4 bg-muted/10 text-center text-sm text-muted-foreground font-medium flex items-center justify-center">
                {time}
              </div>
              {barbers.map((barber) => {
                const appointmentKey = `${barber}-${time}`;
                const hasAppointment = appointments[appointmentKey];
                
                return (
                  <div key={`${barber}-${time}`} className="p-2 border-l border-border/20 flex items-center justify-center">
                    {hasAppointment ? (
                      <div className="bg-foreground text-background px-3 py-2 rounded-lg text-sm w-full text-center">
                        {hasAppointment}
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full h-full rounded-lg border border-dashed border-border/30 hover:border-border/60"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}