import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between gap-5 p-24">
      <Button asChild>
        <Link href={"/game"}>Sings!</Link>
      </Button>
      <Button asChild>
        <Link href={"/builder"}>Builder</Link>
      </Button>
    </main>
  );
}
