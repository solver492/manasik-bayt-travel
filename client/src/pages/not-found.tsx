import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
         <AlertCircle className="w-10 h-10 text-destructive" />
      </div>
      <h1 className="text-4xl font-serif font-bold text-primary mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
