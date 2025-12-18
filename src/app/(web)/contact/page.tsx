import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          We'd love to hear from you. Get in touch with us for inquiries, orders, or any questions.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Your Name" />
                <Input type="email" placeholder="Your Email" />
              </div>
              <Input placeholder="Subject" />
              <Textarea placeholder="Your Message" rows={6} />
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <h2 className="font-headline text-2xl font-semibold">Contact Information</h2>
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-md">
                    <MapPin className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold">Our Address</h3>
                    <p className="text-muted-foreground">123 Agri-Trade Tower, Farmville, India 400001</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-md">
                    <Mail className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">contact@rivaagro.com</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-md">
                    <Phone className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
