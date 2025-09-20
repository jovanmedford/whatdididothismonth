import LinkButton from "./_components/link-button";
import BannerWidget from "./banner-widget";

export default function Banner() {
  return (
    <section className="px-2 ">
      <h1 className="mb-10 mt-0 text-5xl 2xl:text-6xl font-bold text-center">
        Make The Days Count
      </h1>
      <BannerWidget />
      <LinkButton href="/sign-up" className="block max-w-32 mx-auto text-center">Get Started</LinkButton>
    </section>
  );
}
