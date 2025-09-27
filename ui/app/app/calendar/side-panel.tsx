import Button from "@/app/_components/button/button";
import ActivityForm from "./activity-form";
import { useState } from "react";

export default function SidePanel() {
  let [show, setShow] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShow(true)}
        className="text-white bg-primary-500 fixed bottom-16 right-8 py-1 px-4 hover:cursor-pointer"
        variant="emphasized"
      >
        Do something else this month
      </Button>
      {show ? (
        <section
          className={`${
            show ? "block" : "hidden"
          } fixed z-10 right-0 py-12 px-20 top-0 bottom-0 bg-primary-100 rounded-l-3xl shadow-xl`}
        >
          <h2 className="text-xl font-bold mb-8">Add a New Activity</h2>
          <ActivityForm onCancel={() => setShow(false)} />
        </section>
      ) : null}
    </>
  );
}
