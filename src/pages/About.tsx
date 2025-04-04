
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, FileCheck, UserCheck, Award, BookOpen, BarChart3 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-purple text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">About COSOTA</h1>
            <p className="text-lg opacity-90">
              The Copyright Society of Tanzania (COSOTA) is Tanzania's collective management organization 
              dedicated to the protection and promotion of copyright and related rights.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              COSOTA's mission is to protect the rights of creators and rights holders by ensuring they are properly 
              compensated for the use of their works, while also facilitating legal access to creative content for users.
            </p>
            <p className="text-gray-700 mb-6">
              We strive to create an environment where creativity thrives through proper recognition and remuneration of artistic works.
            </p>
            <div className="bg-brand-light-purple p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-3">Our Core Values</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Shield className="h-5 w-5 mr-2 text-brand-purple mt-0.5" />
                  <span><span className="font-medium">Integrity:</span> We uphold the highest ethical standards in all our operations.</span>
                </li>
                <li className="flex items-start">
                  <FileCheck className="h-5 w-5 mr-2 text-brand-purple mt-0.5" />
                  <span><span className="font-medium">Transparency:</span> We ensure clear and open processes in copyright management.</span>
                </li>
                <li className="flex items-start">
                  <Award className="h-5 w-5 mr-2 text-brand-purple mt-0.5" />
                  <span><span className="font-medium">Excellence:</span> We strive for the highest quality in our services.</span>
                </li>
                <li className="flex items-start">
                  <UserCheck className="h-5 w-5 mr-2 text-brand-purple mt-0.5" />
                  <span><span className="font-medium">Respect:</span> We value and honor the rights and creative expressions of all creators.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6">What We Do</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex">
                    <div className="mr-4">
                      <div className="h-10 w-10 bg-brand-light-purple rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-brand-purple" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Copyright Registration</h3>
                      <p className="text-gray-600">
                        We facilitate the registration of copyrights for musical works, providing creators with official documentation of their rights.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex">
                    <div className="mr-4">
                      <div className="h-10 w-10 bg-brand-light-purple rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-brand-purple" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Rights Protection</h3>
                      <p className="text-gray-600">
                        We monitor the use of registered works and take action against copyright infringement to protect creators' rights.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex">
                    <div className="mr-4">
                      <div className="h-10 w-10 bg-brand-light-purple rounded-full flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-brand-purple" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Royalty Collection & Distribution</h3>
                      <p className="text-gray-600">
                        We collect and distribute royalties to creators for the use of their works, ensuring fair compensation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">AudioRightsHub: Our Digital Platform</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-8">
            AudioRightsHub is COSOTA's official digital platform designed to streamline the copyright registration process
            for music creators in Tanzania. The platform provides a transparent and efficient way for artists to protect
            their work and manage their rights in the digital age.
          </p>
          <Link to="/register">
            <Button size="lg">
              Join AudioRightsHub Today
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="bg-gray-100 py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Contact COSOTA</h2>
          <div className="max-w-md mx-auto">
            <address className="not-italic text-gray-700 space-y-4">
              <p>
                <strong>Physical Address:</strong><br />
                COSOTA Building, Plot 123<br />
                Kijitonyama, Dar es Salaam<br />
                Tanzania
              </p>
              <p>
                <strong>Phone:</strong><br />
                +255 22 123 4567
              </p>
              <p>
                <strong>Email:</strong><br />
                info@cosota.go.tz
              </p>
            </address>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
