import { Typography } from "../ui/typography";

const QnA = ({
  question,
  answer,
  step,
}: {
  question: string;
  answer: string;
  step: number;
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full">
        <span className="text-lg font-semibold text-white">{step}</span>
      </div>
      <div className="ml-4">
        <Typography
          variant={"h4"}
          className="text-xl font-semibold dark:text-white"
        >
          {question}
        </Typography>
        <Typography
          variant={"paragraph"}
          className="mt-4 text-base dark:text-white"
        >
          {answer}
        </Typography>
      </div>
    </div>
  );
};

export default QnA;
