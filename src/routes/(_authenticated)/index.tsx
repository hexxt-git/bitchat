import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "@/features/chat/chat";

export const Route = createFileRoute("/(_authenticated)/")({
  component: IndexPage,
});

function IndexPage() {
  return <Chat />;
}
