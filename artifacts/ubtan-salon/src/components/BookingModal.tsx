import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Loader2, MessageSquare, Phone, Sparkles, User } from 'lucide-react';
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

const fieldLabelClass = 'mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground';
const iconClass = 'pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/60';
const inputClass = 'border-border/50 bg-background/50 rounded-none pl-11 focus-visible:ring-primary';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

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
      <DialogContent className="sm:max-w-lg border-primary/20 bg-card rounded-none p-8 md:p-10">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="py-10 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10"
            >
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-serif text-primary">Request Received</h2>
            <p className="mt-3 font-light text-muted-foreground">
              Thank you for choosing UBTAN. We will contact you shortly to confirm your appointment.
            </p>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <span className="text-xs uppercase tracking-[0.3em] text-primary">Reserve Your Time</span>
              <DialogTitle className="text-3xl font-serif text-foreground font-medium mt-1">
                Book an Appointment
              </DialogTitle>
              <div className="h-px w-16 bg-primary/30 mt-3 mb-1" />
              <DialogDescription className="font-light text-muted-foreground">
                Request a time for your luxurious beauty experience. We will contact you to confirm.
              </DialogDescription>
            </DialogHeader>
            <motion.form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <label className={fieldLabelClass}>Full Name</label>
                  <div className="relative">
                    <User className={iconClass} />
                    <Input
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <label className={fieldLabelClass}>Phone Number</label>
                  <div className="relative">
                    <Phone className={iconClass} />
                    <Input
                      required
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Your number"
                      className={inputClass}
                    />
                  </div>
                </motion.div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <label className={fieldLabelClass}>Preferred Service</label>
                  <div className="relative">
                    <Sparkles className={iconClass} />
                    <Select required value={service} onValueChange={setService}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Select service" />
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
                </motion.div>
                <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <label className={fieldLabelClass}>Preferred Date</label>
                  <div className="relative">
                    <Calendar className={iconClass} />
                    <Input
                      required
                      type="date"
                      value={preferredDate}
                      onChange={(event) => setPreferredDate(event.target.value)}
                      className={`${inputClass} text-muted-foreground`}
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <label className={fieldLabelClass}>Special Requests</label>
                <div className="relative">
                  <MessageSquare className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-primary/60" />
                  <Textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Any special requests or messages?"
                    className="min-h-[100px] border-border/50 bg-background/50 rounded-none pl-11 pt-3.5 focus-visible:ring-primary"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-none bg-primary py-6 text-primary-foreground hover:bg-primary/90 font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending
                    </span>
                  ) : (
                    'Request Appointment'
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
