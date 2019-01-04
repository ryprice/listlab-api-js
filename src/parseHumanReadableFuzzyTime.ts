import FuzzyGranularity from "ququmber-api/FuzzyGranularity";
import FuzzyTime from "ququmber-api/FuzzyTime";

export default (str: string): FuzzyTime => {
    let result = str;
    result = result.toLowerCase();
    result = result.trim();
    const words = result.split(" ");
    if (words.length < 1) {
        return undefined;
    }

    if (words[0] === "today") {
        return new FuzzyTime(new Date(), FuzzyGranularity.DAY);
    }

    if (words[0] === "yesterday") {
        return new FuzzyTime(new Date(), FuzzyGranularity.DAY).getPrev();
    }

    if (words[0] === "tomorrow") {
        return new FuzzyTime(new Date(), FuzzyGranularity.DAY).getNext();
    }

    if (words[0] === "this") {
        words.shift();
        return parse(words);
    }

    if (words[0] === "last") {
        words.shift();
        return parse(words).getPrev();
    }

    if (words[0] === "next") {
        words.shift();
        return parse(words).getNext();
    }
};

const parse = (words: string[]) => {
    if (!words[0]) {
        return undefined;
    }

    let time = new FuzzyTime(new Date(), FuzzyGranularity.DAY);
    if (words[0] === "week") {
        time = time.withGranularity(FuzzyGranularity.WEEK);
        return time;
    } else if (words[0] === "month") {
        time = time.withGranularity(FuzzyGranularity.MONTH);
        return time;
    } else if (words[0] === "year") {
        time = time.withGranularity(FuzzyGranularity.YEAR);
        return time;
    }
};
