import FuzzyGranularity from 'ququmber-api/FuzzyGranularity';
import FuzzyTime, {buildFuzzyTime} from 'ququmber-api/FuzzyTime';

export const generateFuzzyTimeJson = (fuzzyTime: FuzzyTime): Object => {
  if (fuzzyTime) {
    return {
      time: fuzzyTime.getTime(),
      granularity: fuzzyTime.getGranularity().getName()
    };
  }
};

export const consumeFuzzyTime = (json: any) => {
  return buildFuzzyTime(
    new Date(json.time),
    consumeFuzzyGranularity(json.granularity)
  );
};

export const consumeFuzzyGranularity = (json: any) => {
  switch(json.toLowerCase()) {
    case 'minute': return FuzzyGranularity.MINUTE;
    case 'hour': return FuzzyGranularity.HOUR;
    case 'day': return FuzzyGranularity.DAY;
    case 'week': return FuzzyGranularity.WEEK;
    case 'month': return FuzzyGranularity.MONTH;
    case 'year': return FuzzyGranularity.YEAR;
    case 'forever': return FuzzyGranularity.FOREVER;
    default: throw 'Error in consumeFuzzyGranularity: granularity unknown';
  }
};
