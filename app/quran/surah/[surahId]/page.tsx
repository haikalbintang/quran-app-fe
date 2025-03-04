const Surah = async ({ params }: { params: { surahId: number } }) => {
  const data = await fetch(`https://equran.id/api/v2/surat/${params.surahId}`);
  const surah = await data.json();
  console.log(surah);

  return (
    <div className="bg-sky-800 min-h-screen flex flex-col items-center">
      <header className="flex">
        <div className="flex flex-col">
          <h1>
            {params.surahId}. {surah.data.namaLatin}
          </h1>
          <h1>{surah.data.arti}</h1>
        </div>
        <div>^</div>
      </header>

      <div className="bg-sky-900 w-full py-3 px-2">
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
                  <p className="text-right text-3xl">
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
              </li>
            )
          )}
        </ol>
      </main>
    </div>
  );
};

export default Surah;
