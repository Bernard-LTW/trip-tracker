import Image from "next/image";
import { Button } from "@/components/ui/button";

interface SignInSectionProps {
  onSignIn: () => void;
}

export default function SignInSection({ onSignIn }: SignInSectionProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg text-center">Sign in to start tracking your travels</p>
      <Button
        onClick={onSignIn}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Image
          src="/google.svg"
          alt="Google logo"
          width={24}
          height={24}
        />
        Sign in with Google
      </Button>
    </div>
  );
} 