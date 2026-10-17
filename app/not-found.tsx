import { LinkButton } from "@/components/brand/link-button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">404</p>
        <h1 className="mt-3 text-6xl font-extrabold sm:text-8xl">Off the map.</h1>
        <p className="mt-4 text-muted-foreground">That page does not exist, but plenty of destinations do.</p>
        <div className="mt-8 flex justify-center gap-3">
          <LinkButton href="/" className="h-11 px-6">Back home</LinkButton>
          <LinkButton href="/packages" variant="outline" className="h-11 border-2 border-foreground px-6">Browse holidays</LinkButton>
        </div>
      </div>
    </main>
  );
}
