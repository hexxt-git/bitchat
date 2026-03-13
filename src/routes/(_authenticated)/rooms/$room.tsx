import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "@/features/chat/chat";

export const Route = createFileRoute("/(_authenticated)/rooms/$room")({
  component: IndexPage,
});

function IndexPage() {
  const { room } = Route.useParams();
  return <Chat roomId={room} />;
}
