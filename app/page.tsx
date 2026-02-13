import ImageSection from "@/components/image-section";
import { Button } from "@/components/ui/button";
import { ArrowRight} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-32">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-5xl font-bold text-black mb-6">A Better way to track your applications.</h1>
              <p className="text-muted-foreground mb-10 text-xl">Capture,Organize, and manage your job search in one place</p>
              {/* buttons */}
              <div className="flex flex-col items-center gap-y-4">
                <Link href={'/sign-up'}>
                  <Button size='lg' className="px-8 h-12 text-lg font-medium"> Sign for free <ArrowRight className="size-4"/></Button>
                </Link>
                <p className="text-sm text-muted-foreground">Free for everyone,no credit card required</p>
              </div>
            </div>
        </section>
        {/* Hero Images Section */}
          <ImageSection/>
      </main>
    </div>
  );
}
