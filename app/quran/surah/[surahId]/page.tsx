import Image from "next/image";
import Link from "next/link";
import { Scheherazade_New } from "next/font/google";

const arabic = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const Surah = async ({ params }: { params: Promise<{ surahId: string }> }) => {
  const surahId = (await params).surahId;
  const dataSurah = await fetch(`https://equran.id/api/v2/surat/${surahId}`);
  const surah = await dataSurah.json();
  // Fetching tafsir
  const dataTafsir = await fetch(`https://equran.id/api/v2/tafsir/${surahId}`);
  const tafsir = await dataTafsir.json();

  return (
    <div className="bg-sky-800 min-h-screen flex flex-col items-center">
      <header className="flex py-3 w-full">
        {/* Left */}
        <div className="w-1/3 flex pl-5 items-center">
          <Link href="/quran/surah">
            <Image
              src={"/left-arrow-2.svg"}
              alt="Back"
              width={23}
              height={23}
            />
          </Link>
        </div>
        {/* Middle */}
        <div className="w-1/3 flex">
          <div className="flex flex-col text-center">
            <h1 className="text-sm">
              {surahId}. {surah.data.namaLatin}
            </h1>
            <h1 className="text-xs">{surah.data.arti}</h1>
          </div>
          <div className="flex justify-center items-center pl-2">
            <Image
              src="/chevron-down.svg"
              alt="Chevron Down"
              width={14}
              height={14}
            />
          </div>
        </div>
        {/* Right */}
        <div className="w-1/3 flex justify-end pr-5">
          <Image src={"/info.svg"} alt="Deskripsi" width={23} height={23} />
        </div>
      </header>

      <div className="bg-sky-900 w-full py-3 px-4">
        <p className="text-xs">
          {surah.data.nomor}. {surah.data.namaLatin} ({surah.data.arti})
        </p>
      </div>

      <main className="w-full">
        <ol>
          {surah.data.ayat.map(
            (ayat: {
              nomorAyat: number;
              teksArab: string;
              teksIndonesia: string;
              teksLatin: string;
            }) => (
              <li key={ayat.nomorAyat}>
                <div className="bg-sky-950 p-4 border-b-2 border-white/40">
                  <p
                    className={`text-right text-3xl font-medium leading-14 ${arabic.className}`}
                  >
                    {ayat.teksArab}{" "}
                    <span className="text-xl">({ayat.nomorAyat})</span>
                  </p>
                  <p className="text-white/70 mt-2">{ayat.teksLatin}</p>
                  <p className="text-white/90">{ayat.teksIndonesia}</p>
                  <div className="mt-2">
                    <p className="text-sm border-2 inline-flex px-1 py-[1px] rounded-lg text-white/70">
                      {surah.data.nomor}:{ayat.nomorAyat}
                    </p>
                  </div>
                </div>
                {/* Tafsir */}
                <details className="bg-sky-900 p-4 text-white/80 text-sm border-t border-white/40">
                  <summary className="cursor-pointer text-white/90">
                    Lihat Tafsir
                  </summary>
                  <p className="mt-2">
                    {tafsir.data.tafsir[ayat.nomorAyat - 1]?.teks ||
                      "Tafsir tidak tersedia."}
                  </p>
                </details>
              </li>
            )
          )}
        </ol>
      </main>

      <div></div>
    </div>
  );
};

export default Surah;
