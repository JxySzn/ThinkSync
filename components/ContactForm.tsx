"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone } from "lucide-react";

export default function ContactForm({ id }: { id?: string }) {
  return (
    <div id={id} className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact us</h1>
          <p className="text-muted-foreground text-lg">
            {"We'd love to talk about how we can help you."}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl">Fill in the form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  className="bg-background border-border"
                />
                <Input
                  placeholder="Last Name"
                  className="bg-background border-border"
                />
              </div>
              <Input
                placeholder="Email"
                type="email"
                className="bg-background border-border"
              />
              <Input
                placeholder="Phone Number"
                type="tel"
                className="bg-background border-border"
              />
              <Textarea
                placeholder="Details"
                rows={6}
                className="bg-background border-border resize-none"
              />
              <Button className="w-full" size="lg">
                Send inquiry
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                {"We'll get back to you in 1-2 business days."}
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <MapPin className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Our address</h3>
                <p className="text-muted-foreground mb-2">
                  {"We're here to help with any questions or code."}
                </p>
                <div className="text-sm">
                  <p>300 Bath Street, Tay House</p>
                  <p>Glasgow G2 4JR, United Kingdom</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Mail className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Email us</h3>
                <p className="text-muted-foreground mb-2">
                  {"We'll get back to you as soon as possible."}
                </p>
                <p className="text-sm font-medium">hello@example.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Phone className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Call us</h3>
                <p className="text-muted-foreground mb-2">
                  Mon-Fri from 8am to 5pm.
                </p>
                <p className="text-sm font-medium">+1 (555) 000-0000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
