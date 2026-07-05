import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function BookingModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => setSubmitted(false), 300);
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-primary/20 bg-card rounded-none">
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <h2 className="text-2xl font-serif text-primary">Request Received</h2>
            <p className="text-muted-foreground font-light">
              Thank you for choosing UBTAN. We will contact you shortly to confirm your appointment.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-primary font-normal">Book an Appointment</DialogTitle>
              <DialogDescription className="font-light text-muted-foreground">
                Request a time for your luxurious beauty experience. We will contact you to confirm.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Input required placeholder="Your Full Name" className="border-border/50 bg-background/50 rounded-none focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Input required type="tel" placeholder="Phone Number" className="border-border/50 bg-background/50 rounded-none focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Select required>
                  <SelectTrigger className="border-border/50 bg-background/50 rounded-none focus-visible:ring-primary">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-primary/20">
                    <SelectItem value="hair">Hair Styling & Care</SelectItem>
                    <SelectItem value="skin">Luxury Skin Care</SelectItem>
                    <SelectItem value="makeup">Professional Makeup</SelectItem>
                    <SelectItem value="hands_feet">Hands & Feet Spa</SelectItem>
                    <SelectItem value="threading_waxing">Threading & Waxing</SelectItem>
                    <SelectItem value="multiple">Multiple Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Input required type="date" className="border-border/50 bg-background/50 rounded-none focus-visible:ring-primary text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Any special requests or messages?" className="min-h-[100px] border-border/50 bg-background/50 rounded-none focus-visible:ring-primary" />
              </div>
              <Button type="submit" className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide">
                REQUEST APPOINTMENT
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}