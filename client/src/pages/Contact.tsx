import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you shortly.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Contact Us</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="text-center p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl mb-2">Our Location</CardTitle>
          <CardDescription>
            23 Market Street, Lagos Island<br />
            Lagos, Nigeria
          </CardDescription>
        </Card>
        
        <Card className="text-center p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Phone className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl mb-2">Phone Number</CardTitle>
          <CardDescription>
            +234 (0) 123 456 7890<br />
            +234 (0) 987 654 3210
          </CardDescription>
        </Card>
        
        <Card className="text-center p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl mb-2">Email Address</CardTitle>
          <CardDescription>
            info@trossachs.com<br />
            support@trossachs.com
          </CardDescription>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <p className="text-neutral-dark mb-6">
            Have a question or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Enter your name" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                name="subject" 
                placeholder="What is this regarding?" 
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="Type your message here" 
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
        
        <div className="bg-neutral-light rounded-lg p-6 h-full">
          <h2 className="text-2xl font-bold mb-6">Our Business Hours</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-neutral-medium pb-3">
              <span className="font-medium">Monday - Friday</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-neutral-medium pb-3">
              <span className="font-medium">Saturday</span>
              <span>10:00 AM - 4:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-neutral-medium pb-3">
              <span className="font-medium">Sunday</span>
              <span>Closed</span>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-3">Customer Support</h3>
            <p className="text-neutral-dark mb-4">
              Our customer support team is available during business hours to assist you with any questions or concerns.
            </p>
            <p className="text-neutral-dark mb-4">
              For urgent matters outside of business hours, please email us at <span className="text-primary">support@trossachs.com</span> and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}