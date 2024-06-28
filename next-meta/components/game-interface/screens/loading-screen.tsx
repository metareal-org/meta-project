// loading-screen.tsx
import useLoadingStore from "@/store/gui-store/useLoadingStore";

export default function LoadingScreen() {
  const { isVisible, text } = useLoadingStore();
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed w-dvw h-dvh bg-[black] flex flex-col items-center justify-center z-[100]">
      <video autoPlay loop muted playsInline className="size-96 object-cover">
        <source src="/assets/videos/loading.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div className="text-xl">{text.title}</div>
      {text.description && <div>{text.description}</div>}
    </div>
  );
}
