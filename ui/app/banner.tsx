import LinkButton from "./_components/link-button";
import BannerWidget from "./banner-widget";

export default function Banner() {
  return (
    <section className="px-2 ">
      <h1 className="mb-10 mt-0 text-5xl 2xl:text-6xl font-bold">
        Make The Days Count
      </h1>
      <BannerWidget />

      <p className="my-12 max-w-100">
        Consistency over time beats perfection — build habits that last a
        liftime.
      </p>
      <LinkButton href="#">Get Started</LinkButton>
    </section>
  );
}
