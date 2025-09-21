import Image from "next/image";

export default function Plant() {
  return (
    <div className="md:hidden mt-12">
      <Image
        className="mx-auto"
        alt="A cute plant in a pot"
        src="/plant.svg"
        height={160}
        width={90}
      />
    </div>
  );
}
