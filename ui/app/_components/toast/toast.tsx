"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import EE from "eventemitter3";
import "./toast.css";

interface ToastMessage {
  id: string;
  type: "error" | "information" | "success";
  title: string;
  description: string;
  duration?: number;
}

type NewToastMessage = Omit<ToastMessage, "id">;

let emitter = new EE();

export default function Toast({ message }: { message: ToastMessage }) {
  return (
    <li className={`min-w-lg mb-4 rounded-lg toast--${message.type}`}>
      <div className={`p-2 rounded-t-lg toast_header--${message.type}`}>
        <h2 className="font-bold">{message.title}</h2>
      </div>
      <p className="px-2 py-6">{message.description}</p>
    </li>
  );
}

export function ToastContainer() {
  let [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    let listener = (newMessage: ToastMessage) => {
      setMessages((messages) => [...messages, newMessage]);
      setTimeout(
        () =>
          setMessages((messages: ToastMessage[]) =>
            messages.filter((message) => message.id !== newMessage.id)
          ),
        newMessage.duration
      );
    };
    emitter.on("message", listener);

    return () => {
      emitter.off("message", listener);
    };
  }, []);

  return (
    <ul className="flex flex-col-reverse fixed z-40 bottom-4 items-center left-1/2 right-1/2">
      {messages.map((message) => (
        <Toast key={message.id} message={message} />
      ))}
    </ul>
  );
}

export function showNotification(message: NewToastMessage) {
  emitter.emit("message", {
    ...message,
    id: uuidv4(),
    duration: message.duration ? message.duration : 4000,
  });
}
