import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type ReviewItem = {
  id?: number;
  name: string;
  body: string;
  rating: number;
};

export function ReviewModal({
  children,
  onReviewAdded,
}: {
  children: React.ReactNode;
  onReviewAdded?: (review: ReviewItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const resetForm = () => {
    setName('');
    setBody('');
    setRating(5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), body: body.trim(), rating }),
      });

      if (!response.ok) {
        window.alert('Could not submit your review. Try again.');
        return;
      }

      const created = await response.json() as ReviewItem;
      onReviewAdded?.(created);
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setSubmitted(false);
          resetForm();
        }, 300);
      }, 3000);
    } catch {
      window.alert('Could not submit your review. Try again.');
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
            <h2 className="text-2xl font-serif text-primary">Thank You</h2>
            <p className="text-muted-foreground font-light">
              Your review means the world to us. Thank you for sharing your UBTAN experience.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-primary font-normal">Share Your Experience</DialogTitle>
              <DialogDescription className="font-light text-muted-foreground">
                Welcome back. We would love to hear how your visit to UBTAN went.
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
                <span className="text-xs tracking-widest text-primary uppercase block mb-1">Your Rating</span>
                <div className="flex gap-1 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className={`transition-colors ${star <= (hoverRating || rating) ? 'text-primary' : 'text-muted-foreground/30'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Textarea
                  required
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Tell us about your experience..."
                  className="min-h-[100px] border-border/50 bg-background/50 rounded-none focus-visible:ring-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide"
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
