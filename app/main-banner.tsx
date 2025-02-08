import LinkButton from "./_components/button";

export default function MainBanner() {
  return (
    <section className="text-center bg-beige-500 py-16 px-2 text-deep-blue-500">
      <h1 className="mb-4 mt-0 text-4xl font-bold">Make The Days Count</h1>
      <p className="mt-4 mb-6">
        Take control of every aspect of your life and then you will have an even
        better life.
      </p>
      <LinkButton href="#">Get Started</LinkButton>
    </section>
  );
}
