import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Download, QrCode, Share2 } from "lucide-react";

export function QRGenerator() {
  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-foreground mb-2">QR Code Generator</h1>
        <p className="text-muted-foreground">Generate QR codes for easy customer booking</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Shop QR Code */}
        <Card className="border border-border/20 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Shop QR Code
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Links to your public booking page
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Preview */}
            <div className="bg-muted/20 rounded-xl p-8 flex items-center justify-center">
              <div className="w-48 h-48 bg-foreground rounded-lg relative">
                {/* QR Code Pattern Simulation */}
                <div className="absolute inset-4 grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm ${
                        Math.random() > 0.4 ? 'bg-background' : ''
                      }`}
                    />
                  ))}
                </div>
                {/* Corner markers */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-background rounded"></div>
                <div className="absolute top-2 right-2 w-6 h-6 bg-background rounded"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 bg-background rounded"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">URL:</p>
              <p className="text-sm font-mono bg-muted/30 p-2 rounded-lg">
                https://trimminflow.com/book
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Individual Barber QR */}
        <Card className="border border-border/20 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Barber QR Code
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Direct booking for specific barber
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Preview */}
            <div className="bg-muted/20 rounded-xl p-8 flex items-center justify-center">
              <div className="w-48 h-48 bg-foreground rounded-lg relative">
                {/* QR Code Pattern Simulation */}
                <div className="absolute inset-4 grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm ${
                        Math.random() > 0.3 ? 'bg-background' : ''
                      }`}
                    />
                  ))}
                </div>
                {/* Corner markers */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-background rounded"></div>
                <div className="absolute top-2 right-2 w-6 h-6 bg-background rounded"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 bg-background rounded"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">URL:</p>
              <p className="text-sm font-mono bg-muted/30 p-2 rounded-lg">
                https://trimminflow.com/book/marco
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-4">
        <div className="flex gap-4 justify-center">
          <Button 
            className="bg-foreground text-background hover:bg-foreground/90 rounded-xl px-8"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Generate New Codes
          </Button>
          <Button 
            variant="outline" 
            className="rounded-xl border-border/20 px-8"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Codes
          </Button>
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-xl border-border/20 px-8"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Poster Template
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Print-ready poster with QR codes for your shop
          </p>
        </div>
      </div>

      {/* Instructions */}
      <Card className="mt-8 border border-border/20 rounded-xl bg-muted/10">
        <CardContent className="p-6">
          <h3 className="font-medium mb-3">How to use QR codes:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Place the Shop QR code at your entrance for general bookings</li>
            <li>• Give Barber QR codes to individual stylists for their stations</li>
            <li>• Print the poster template and display it prominently</li>
            <li>• Customers can scan with any smartphone camera</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}