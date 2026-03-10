"use client";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
            Have a question, partnership idea, or feedback? We&apos;d love to
            hear from you.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-5">
          {/* Info */}
          <div className="space-y-6 md:col-span-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">
                  hello@newscout.app
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Location</p>
                <p className="text-sm text-muted-foreground">
                  San Francisco, CA
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Response Time</p>
                <p className="text-sm text-muted-foreground">Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Your name" required />
              <Input type="email" placeholder="Your email" required />
            </div>
            <Input placeholder="Subject" required />
            <Textarea placeholder="Your message…" rows={5} required />
            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
