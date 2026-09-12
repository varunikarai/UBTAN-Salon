import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SERVICE_OPTIONS = [
  { value: 'hair', label: 'Hair Styling & Care' },
  { value: 'skin', label: 'Luxury Skin Care' },
  { value: 'makeup', label: 'Professional Makeup' },
  { value: 'hands_feet', label: 'Hands & Feet Spa' },
  { value: 'threading_waxing', label: 'Threading & Waxing' },
  { value: 'multiple', label: 'Multiple Services' },
];

export function BookingModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  const resetForm = () => {
    setName('');
    setPhone('');
    setService('');
    setPreferredDate('');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !service || !preferredDate || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          service,
          preferredDate,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        window.alert('Could not send your booking request. Try again.');
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setSubmitted(false);
          resetForm();
        }, 300);
      }, 3000);
    } catch {
      window.alert('Could not send your booking request. Try again.');
    } finally {
      setSubmitting(false);
    }
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
                <Input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your Full Name"
                  className="border-border/50 bg-background/50 rounded-none focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Input
                  required
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Phone Number"
                  className="border-border/50 bg-background/50 rounded-none focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Select required value={service} onValueChange={setService}>
                  <SelectTrigger className="border-border/50 bg-background/50 rounded-none focus-visible:ring-primary">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-primary/20">
                    {SERVICE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Input
                  required
                  type="date"
                  value={preferredDate}
                  onChange={(event) => setPreferredDate(event.target.value)}
                  className="border-border/50 bg-background/50 rounded-none focus-visible:ring-primary text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Any special requests or messages?"
                  className="min-h-[100px] border-border/50 bg-background/50 rounded-none focus-visible:ring-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide"
              >
                {submitting ? 'SENDING...' : 'REQUEST APPOINTMENT'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
