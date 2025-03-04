import Image from "next/image";
import Link from "next/link";

const QuranPage = () => {
  return (
    <div className="bg-sky-800 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl text-center text-white font-bold my-10">
        Al-Quran
      </h1>
      <Image
        src={"quran.svg"}
        alt="Quran"
        width={180}
        height={180}
        className="my-4"
      />
      <Link href={"/quran/surah"}>
        <div className="border-b-4 border-gray-800 hover:cursor-pointer rounded-xl my-14">
          <button className="text-white bg-gray-500 py-2 px-6 rounded-xl text-lg font-semibold hover:translate-y-2 hover:duration-200 hover:bg-gray-400">
            Read Quran
          </button>
        </div>
      </Link>
    </div>
  );
};

export default QuranPage;
