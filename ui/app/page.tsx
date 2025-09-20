import "./app.css";
import Banner from "./banner";
import Header from "./header";
import Section from "./section";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Section>
          <Banner />
        </Section>
      </main>
    </>
  );
}
