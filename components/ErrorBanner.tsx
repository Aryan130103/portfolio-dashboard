export default function ErrorBanner({ message }: { message: string }) {
  return <div className="rounded border border-red-300 bg-red-100 p-3 text-sm text-red-700">{message}</div>;
}
