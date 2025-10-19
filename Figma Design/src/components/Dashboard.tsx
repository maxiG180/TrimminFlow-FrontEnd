import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plus, Users, Euro, Calendar } from "lucide-react";

export function Dashboard() {
  const todayAppointments = [
    { id: 1, customer: "John Smith", time: "09:00", barber: "Marco" },
    { id: 2, customer: "Sarah Johnson", time: "10:30", barber: "Alex" },
    { id: 3, customer: "Mike Davis", time: "14:00", barber: "Marco" },
    { id: 4, customer: "Emma Wilson", time: "15:30", barber: "Tony" },
  ];

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to TRIMMINFLOW</p>
        </div>
        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-xl px-6">
          <Plus className="w-4 h-4 mr-2" />
          Add Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="border border-border/20 rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Euro className="w-4 h-4" />
              Today's Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">€127</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border border-border/20 rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Today's Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">8</div>
            <p className="text-xs text-muted-foreground">4 completed, 4 pending</p>
          </CardContent>
        </Card>

        <Card className="border border-border/20 rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Next Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">14:00</div>
            <p className="text-xs text-muted-foreground">Mike Davis - Marco</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Today's Appointments</h2>
        <div className="grid grid-cols-2 gap-4">
          {todayAppointments.map((appointment) => (
            <Card key={appointment.id} className="border border-border/20 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{appointment.customer}</h3>
                    <p className="text-sm text-muted-foreground">with {appointment.barber}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium">{appointment.time}</div>
                    <div className="w-2 h-2 bg-foreground rounded-full ml-auto"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}