import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Award, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About Trossachs</h1>
        <p className="text-lg text-neutral-dark max-w-3xl mx-auto">
          Your premier destination for quality Nigerian products, from traditional fashion to modern conveniences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="order-2 lg:order-1">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="mb-4">
            Founded in 2018, Trossachs began as a small boutique in Lagos showcasing authentic Nigerian fashion and handicrafts. The name "Trossachs" was inspired by our founder's vision to create a marketplace that bridges traditional craftsmanship with modern needs.
          </p>
          <p className="mb-4">
            What started as a passion project quickly grew into a comprehensive online marketplace as we recognized the growing demand for authentic Nigerian products both locally and internationally.
          </p>
          <p>
            Today, Trossachs is proud to offer a diverse range of products from carefully selected Nigerian artisans, designers, and manufacturers who share our commitment to quality, authenticity, and sustainability.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p>
            At Trossachs, our mission is to showcase the rich diversity of Nigerian products and connect talented creators with discerning customers worldwide. We aim to support local economies, preserve traditional craftsmanship, and promote sustainable business practices across our supply chain.
          </p>
        </div>
        
        <div className="order-1 lg:order-2">
          <div className="rounded-lg overflow-hidden h-full flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1607923432780-7a9c30adcb3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Nigerian marketplace" 
              className="w-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Why Choose Trossachs?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Quality Assured</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Every product on our platform goes through a rigorous quality check before being listed.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Authentic Products</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We work directly with artisans and manufacturers to ensure authenticity.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Supporting Local</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your purchase supports Nigerian artisans, manufacturers, and the local economy.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Customer Focused</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our dedicated team is committed to providing exceptional customer service.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-primary/5 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Commitment to Sustainability</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-3">Eco-Friendly Packaging</h3>
            <p>
              We use recyclable and biodegradable packaging materials whenever possible to minimize our environmental footprint.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-3">Ethical Sourcing</h3>
            <p>
              We carefully vet our suppliers to ensure fair labor practices and responsible resource management throughout our supply chain.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-3">Community Support</h3>
            <p>
              A portion of every purchase goes toward supporting education and entrepreneurship programs in Nigerian communities.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Join the Trossachs Family</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          Whether you're a customer, artisan, or partner, we invite you to be part of our growing community dedicated to showcasing the best of Nigerian craftsmanship and innovation.
        </p>
        <p className="font-medium">
          Thank you for supporting Trossachs and the incredible talent behind every product we offer.
        </p>
      </div>
    </div>
  );
}