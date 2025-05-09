import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    text: "The quality of the traditional attire I purchased was exceptional. The fabric is premium and the craftsmanship is outstanding. Will definitely shop here again!",
    author: "Adebayo O.",
    location: "Lagos",
    rating: 5,
    initials: "AD",
    bgColor: "bg-primary",
  },
  {
    id: 2,
    text: "Fast shipping and excellent customer service. The skincare products are amazing for my sensitive skin. The natural ingredients make all the difference.",
    author: "Chinwe N.",
    location: "Abuja",
    rating: 4.5,
    initials: "CN",
    bgColor: "bg-accent",
  },
  {
    id: 3,
    text: "The kitchen appliances I bought are energy-efficient and durable. Great prices compared to other stores and the product arrived well-packaged.",
    author: "Tunde O.",
    location: "Port Harcourt",
    rating: 5,
    initials: "TO",
    bgColor: "bg-primary",
  },
];

const TestimonialsSection = () => {
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <div className="text-yellow-400 mb-4 flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 fill-current" />
        ))}
        
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-5 w-5 text-yellow-400/30" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-5 w-5 fill-current" />
            </div>
          </div>
        )}
        
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-yellow-400/30" />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              {renderRating(testimonial.rating)}
              <p className="text-neutral-dark mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className={`w-10 h-10 ${testimonial.bgColor} text-white rounded-full flex items-center justify-center font-medium`}>
                  {testimonial.initials}
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">{testimonial.author}</h4>
                  <p className="text-sm text-neutral-dark">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
