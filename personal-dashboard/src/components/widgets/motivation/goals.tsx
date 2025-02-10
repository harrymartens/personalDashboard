// Goals.tsx or Goals.jsx
import { Badge } from "@/components/ui/badge";
import { Goal } from "lucide-react";
import { useEffect, useState } from "react";

interface Quote {
  data: {
    quote: string;
    author: string;
  };
}

export default function Goals() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("/api/stoic-quote");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Quote = await response.json();
        setQuote(data);
        // Store the quote and today's date in localStorage
        localStorage.setItem("dailyQuote", JSON.stringify(data));
        localStorage.setItem("quoteDate", new Date().toDateString());
      } catch (error) {
        console.error("Error fetching quote data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const getStoredQuote = () => {
      const storedQuote = localStorage.getItem("dailyQuote");
      const storedDate = localStorage.getItem("quoteDate");
      const today = new Date().toDateString();

      if (storedQuote && storedDate === today) {
        setQuote(JSON.parse(storedQuote));
        setIsLoading(false);
      } else {
        fetchQuote();
      }
    };

    getStoredQuote();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <span>Loading quote...</span>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <span>Error fetching quote data.</span>
      </div>
    );
  }

  const quoteString =
    quote.data.author == ""
      ? quote.data.quote
      : quote.data.quote + " - " + quote.data.author;

  return (
    <div className="flex h-full flex-col gap-4">
      <a className="flex items-center gap-2 text-3xl font-semibold text-light">
        Goals{" "}
        <span>
          <Goal className="size-7" />
        </span>
      </a>

      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-min py-1 text-med">
          Fitness
        </Badge>
        <ul className="pl-3">
          <li className="text-sml text-light">Get 10% Stronger</li>
        </ul>

        <hr className="mx-auto my-2 h-1 w-10/12 rounded border-0 bg-light/80 dark:bg-gray-700" />

        <Badge variant="secondary" className="w-min py-1 text-med">
          Career
        </Badge>
        <ul className="pl-3">
          <li className="text-sml text-light">
            Complete Macropad & Website projects
          </li>
        </ul>

        <hr className="mx-auto my-2 h-1 w-10/12 rounded border-0 bg-light/80 dark:bg-gray-700" />

        <Badge variant="secondary" className="w-min py-1 text-med">
          Personal
        </Badge>
        <ul className="pl-3">
          <li className="text-sml text-light">Read 5x per week</li>
        </ul>

        <hr className="mx-auto my-2 h-1 w-10/12 rounded border-0 bg-light/80 dark:bg-gray-700" />

        <Badge variant="secondary" className="w-min py-1 text-med">
          Financial
        </Badge>

        <ul className="pl-3">
          <li className="text-sml text-light">Save $5k</li>
        </ul>

        <hr className="mx-auto my-2 h-1 w-10/12 rounded border-0 bg-light/80 dark:bg-gray-700" />
      </div>

      <div className="relative mt-auto w-full overflow-hidden rounded border-2 p-2">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="inline-block font-LED text-xl text-light">
            {quoteString + "                      " + quoteString}
          </span>
        </div>
      </div>
    </div>
  );
}
