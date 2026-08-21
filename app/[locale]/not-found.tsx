import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8faf7] px-5">
      <div className="rounded-[2rem] bg-white p-12 text-center shadow-soft">
        <p className="text-6xl font-black text-leaf">404</p>

        <h1 className="mt-5 text-2xl font-black text-soil">
          Page not found / পৃষ্ঠাটি পাওয়া যায়নি
        </h1>

        <p className="mt-3 text-soil/60">
          Sorry, we could not find the page you are looking for.
          <br />
          দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-leaf px-8 py-4 font-black text-white"
        >
          Back to Home / হোমে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
