"use client";

import { authClient } from "@/lib/auth-client";

import { FaGoogle, FaGithub, FaGit } from "react-icons/fa"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { OctagonAlertIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}),
  email: z.email(),
  password: z.string().min(1, { message: "Password is required" }),
  confirmPassword: z.string().min(1, { message: "Password is required" }),
})
.refine((data) => data.password === data.confirmPassword, {
  error: "Password do not match",
  path: ["confirmPassword"],
})

export const SignUpView = () => {

  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError ] = useState<string | null>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true)

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },

      {
        onSuccess: () => {
          setPending(false);
          router.push("/")
        },
        
        onError: ({ error }) => {
          setError(error.message)
          setPending(false);
        }

      }
    );
  }
  
   const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true)

    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/"
      },

      {
        onSuccess: () => {
          setPending(false);
        },
        
        onError: ({ error }) => {
          setError(error.message)
          setPending(false);
        }

      }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0 ">
        <CardContent className="grid p-0 md:grid-cols-2 ">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Let&apos; get started</h1>
                <p className="text-muted-foreground text-balance">
                  Create your account
                </p>
              </div>
              {/* Name */}
              <FieldGroup>
                <Field>
                  <FieldLabel>Name</FieldLabel>

                  <Input
                    type="text" 
                    placeholder="John Doe"
                    {...form.register("name")}
                  />

                  <FieldError errors={[form.formState.errors.name]} />
                </Field>
              </FieldGroup>

              {/* Email */}
              <FieldGroup>
                <Field>
                  <FieldLabel>Email</FieldLabel>

                  <Input
                    type="email"
                    placeholder="yourmail@gmail.com"
                    {...form.register("email")}
                  />

                  <FieldError errors={[form.formState.errors.email]} />
                </Field>
              </FieldGroup>

              {/* Password */}
              <FieldGroup>
                <Field>
                  <FieldLabel>Password</FieldLabel>

                  <Input
                    type="password"
                    placeholder="********"
                    {...form.register("password")}
                  />

                  <FieldError errors={[form.formState.errors.password]} />
                </Field>
              </FieldGroup>

              {/* Confirm Password */}
              <FieldGroup>
                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>

                  <Input
                    type="password"
                    placeholder="********"
                    {...form.register("confirmPassword")}
                  />

                  <FieldError errors={[form.formState.errors.confirmPassword]} />
                </Field>
              </FieldGroup>

              {!!error && (
                <Alert className="bg-destructive/10 border-none">
                  <OctagonAlertIcon className="h-4 w-4 text-destructive!" />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}
              <Button type="submit" disabled={pending} className="w-full">Sign Up</Button>


              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant={"outline"} onClick={() => onSocial("google")} type="button" className="w-full">
                  <FaGoogle />
                </Button>
                <Button variant={"outline"} onClick={() => onSocial("github")} type="button" className="w-full">
                  <FaGithub />
                </Button>
              </div>

              <div className="text-center text-sm">
                ALready have an account? {" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign In
                </Link>
              </div>
            </div>
          </form>

          {/* Right Content */}
          <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <Image src="/logo.svg" alt="image" width={92} height={92} />
            <p className="text-2xl font-semibold text-white ">Meet AI</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offest-4">
            By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
};
