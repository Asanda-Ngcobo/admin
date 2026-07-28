export default function Loading() {
  return (
    <div className="absolute inset-0 z-50 backdrop-blur-lg flex justify-center items-center">
      <h1 className="text-4xl font-semibold animate-pulse">
        Loading...
      </h1>
    </div>
  );
}
