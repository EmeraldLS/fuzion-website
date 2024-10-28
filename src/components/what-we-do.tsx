import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wind, ThermometerSnowflake, Award, Users } from "lucide-react";

const features = [
  {
    icon: <Wind className="h-6 w-6 text-main" />,
    title: "Innovative Cooling",
    description:
      "Pushing boundaries with annual innovations in air cooling technology.",
  },
  {
    icon: <ThermometerSnowflake className="h-6 w-6 text-main" />,
    title: "Best-in-Class Products",
    description:
      "Setting new market standards with our high-performance coolers.",
  },
  {
    icon: <Award className="h-6 w-6 text-main" />,
    title: "33 Years of Excellence",
    description: "A legacy of trust and quality in air cooler manufacturing.",
  },
  {
    icon: <Users className="h-6 w-6 text-main" />,
    title: "Customer-Centric",
    description:
      "Prioritizing customer satisfaction in every product we create.",
  },
];

export default function WhatWeDo({ image }: { image: string }) {
  return (
    <section className="py-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
          What we do
        </h2>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img
              src={image}
              alt="Air cooler manufacturing process"
              className="rounded-lg shadow-xl w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <p className="text-xl font-semibold text-main">
              Cooling comfort for over three decades
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              Leading Air Cooler Manufacturers in India
            </h3>
            <p className="text-gray-600">
              With a legacy spanning 33 years, we are proud to be at the
              forefront of air cooler innovation. Our commitment to excellence
              in both product and service has established us as a trusted name
              in the industry.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">{feature.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-gray-600">
              From homes to offices, our coolers are designed to deliver comfort
              and convenience, enriching the lives of millions across the
              country. Experience the difference with our range of products, and
              join the thousands who trust us for their cooling needs.
            </p>
            <Button className="bg-main text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out hover:shadow-lg">
              Discover Our Legacy
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
