import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, AlertCircle, ShoppingBag } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();
  
  let errorMessage = "An unexpected error occurred.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-primary rounded-full animate-pulse"></div>
        {errorStatus === 404 ? (
          <div className="relative text-[120px] font-bold tracking-tighter text-foreground/10 select-none">
            404
          </div>
        ) : (
          <AlertCircle className="relative w-24 h-24 text-destructive/80 mx-auto" />
        )}
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-4 sm:text-5xl">
        {errorStatus === 404 ? "Page Not Found" : "Something went wrong"}
      </h1>
      
      <p className="text-muted-foreground text-lg max-w-[600px] mb-10 leading-relaxed">
        {errorStatus === 404 
          ? "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
          : errorMessage}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
        <Button asChild size="lg" className="w-full sm:w-auto px-8 rounded-full h-12 shadow-lg shadow-primary/20 transition-all hover:scale-105">
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 rounded-full h-12 transition-all hover:bg-secondary/80">
          <Link to="/collections">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shop Collections
          </Link>
        </Button>
      </div>

      {errorStatus !== 404 && (
        <div className="mt-12 p-4 rounded-2xl bg-secondary/30 border border-border max-w-2xl w-full text-left">
          <p className="text-xs font-mono text-muted-foreground break-all opacity-50">
            Error Details: {errorMessage}
          </p>
        </div>
      )}

      <footer className="mt-20 text-sm text-muted-foreground/60 font-medium">
        &copy; {new Date().getFullYear()} Ecart. All rights reserved.
      </footer>
    </div>
  );
}
