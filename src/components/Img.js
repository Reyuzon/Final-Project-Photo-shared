import { useState } from "react";

/**
 * We extend `<img>`'s properties as we want our 
 * component to act as a drop-in replacement for it
 */
export default function Img({ fallback = null, ...props }) {
  // State untuk melacak apakah gambar rusak
  const [isBroken, setIsBroken] = useState(false);

  // Function untuk menangani error saat gambar gagal dimuat
  function handleError() {
    setIsBroken(true);
  }

  // Jika gambar rusak, tampilkan fallback
  if (isBroken) {
    return fallback;
  }

  // Tampilkan gambar dengan handler error
  return <img onError={handleError} {...props} />;
}
