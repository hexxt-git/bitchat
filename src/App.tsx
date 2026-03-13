import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./components/SignInForm";
import { Content } from "./components/Content";

export default function App() {
  return (
    <>
      <Authenticated>
        <Content />
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </>
  );
}
