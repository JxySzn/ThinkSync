import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
const page = () => {
  return (
    <div>
      Home page
      <Button asChild>
        <Link href="/sign_in">Sign In</Link>
      </Button>
      <Button asChild>
        <Link href="/sign_up">Sign UP</Link>
      </Button>
    </div>
  );
};

export default page;
