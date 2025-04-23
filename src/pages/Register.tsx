
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MusicIcon, Upload, Loader2, ArrowRight } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const registerSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    const diff = today.getFullYear() - date.getFullYear();
    return diff >= 18;
  }, { message: "You must be at least 18 years old" }),
  address: z.string().min(5, { message: "Please enter your full address" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  nationalIdNumber: z.string().min(5, { message: "Please enter a valid ID number" }),
  passportNumber: z.string().optional(),
  previousWorkUrl: z.string().optional(),
  agreement: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      address: '',
      phoneNumber: '',
      nationalIdNumber: '',
      passportNumber: '',
      previousWorkUrl: '',
      agreement: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Integrate real API call
      const ApiService = (await import('../services/ApiService')).default;
      await ApiService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        phoneNumber: data.phoneNumber,
        nationalIdNumber: data.nationalIdNumber,
        passportNumber: data.passportNumber,
        previousWorkUrl: data.previousWorkUrl,
        agreement: data.agreement,
        role: 'artist'
      });
      toast({
        title: "Registration submitted successfully!",
        description: "A verification email has been sent. Please check your inbox.",
      });
      navigate('/register/success');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const result = await form.trigger(['email', 'password', 'confirmPassword', 'fullName']);
      if (result) setStep(2);
    }
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <MusicIcon className="h-12 w-12 text-brand-purple mx-auto" />
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Artist Registration
          </h1>
          <p className="mt-2 text-gray-600">
            Register as an artist to submit your work for copyright protection
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="text-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto ${
                step >= 1 ? 'bg-brand-purple text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className="text-xs mt-1">Account</div>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-brand-purple' : 'bg-gray-200'}`}></div>
            
            <div className="text-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto ${
                step >= 2 ? 'bg-brand-purple text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <div className="text-xs mt-1">Profile</div>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? 'Create Your Account' : 'Complete Your Artist Profile'}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? 'Enter your basic information to get started' 
                : 'Provide details required for artist verification'}
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                {step === 2 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+255 123 456 789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Your full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nationalIdNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID Number</FormLabel>
                            <FormControl>
                              <Input placeholder="ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="passportNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passport Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Passport number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="previousWorkUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous Work URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/your-portfolio" {...field} />
                          </FormControl>
                          <FormDescription>
                            Link to your existing music portfolio or work samples
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="bg-brand-light-purple p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Upload className="h-5 w-5 text-brand-purple" />
                        <span className="font-medium">Upload Documents</span>
                      </div>
                      <p className="text-sm mt-2">
                        Please prepare scanned copies of your national ID, passport (if available), and samples of your previous work. 
                        You'll be able to upload these after submitting the registration form.
                      </p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="agreement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 text-brand-purple rounded border-gray-300 focus:ring-brand-purple"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the <Link to="/terms" className="text-brand-purple hover:underline">terms and conditions</Link> and <Link to="/privacy" className="text-brand-purple hover:underline">privacy policy</Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
              
              <CardFooter>
                <div className="flex justify-between w-full">
                  {step === 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                  )}
                  
                  {step === 1 ? (
                    <Button
                      type="button"
                      className="ml-auto"
                      onClick={nextStep}
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="ml-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Registration'
                      )}
                    </Button>
                  )}
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        <div className="mt-8 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-purple hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
