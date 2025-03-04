import Image from "next/image";
import Link from "next/link";

type Surah = {
  nomor: number;
  nama: string;
  namaLatin: string;
  tempatTurun: string;
  jumlahAyat: number;
  arti: string;
  deskripsi: string;
  audioFull: null;
};

const SurahPage = async () => {
  const data = await fetch("https://equran.id/api/v2/surat");
  const surahs = await data.json();

  return (
    <div className="bg-sky-800 min-h-screen flex flex-col items-center p-4">
      <Link href="/quran" className="mb-4">
        <Image
          src={"/left-arrow.svg"}
          alt="Left Arrow"
          width={15}
          height={15}
          className="hover:cursor-pointer"
        />
      </Link>
      <ol className="w-full space-y-2">
        {surahs.data.map((surah: Surah) => (
          <li key={surah.nomor}>
            <Link href={`/quran/surah/${surah.nomor}`}>
              <div className="bg-sky-400/35 py-2 px-2 rounded-xl flex">
                <p className="text-white/50 px-5 flex justify-center items-center">
                  {surah.nomor}
                </p>
                <div className="flex justify-between w-full">
                  <div>
                    <h1 className="font-bold">{surah.namaLatin}</h1>
                    <h2 className="text-xs text-white/80">{surah.arti}</h2>
                    <h3 className="text-white/80 text-xs">
                      {surah.tempatTurun === "Mekah"
                        ? "Makkiyah"
                        : "Madaniyyah"}
                    </h3>
                  </div>
                  <div className="px-2 py-1">
                    <p className="text-2xl text-right">{surah.nama}</p>
                    <p className="text-right text-xs text-white/80">
                      {surah.jumlahAyat} ayat
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default SurahPage;
