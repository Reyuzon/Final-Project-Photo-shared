export const splitArray = (arr) => {
  const parts = 4; // Jumlah bagian yang diinginkan
  const chunkSize = Math.ceil(arr.length / parts); // Ukuran tiap bagian
  return Array.from({ length: parts }, (_, i) =>
    arr.slice(i * chunkSize, i * chunkSize + chunkSize)
  );
};
