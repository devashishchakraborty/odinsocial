export default function SmallLoader(props: any) {
  return (
    <div className="flex h-full w-full justify-center p-2" {...props}>
      <div className="h-5 w-5 animate-spin rounded-full border-3 border-gray-200 border-t-sky-800"></div>
    </div>
  );
}
