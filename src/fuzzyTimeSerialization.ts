import FuzzyGranularity from 'listlab-api/FuzzyGranularity';
import FuzzyTime, {buildFuzzyTime} from 'listlab-api/FuzzyTime';

export const fuzzyTimeToRestJson = (fuzzyTime: FuzzyTime): Object => {
  if (fuzzyTime) {
    return {
      time: fuzzyTime.getTime(),
      granularity: fuzzyTime.getGranularity().getName()
    };
  }
};

export const restJsonToFuzzyTime = (json: any) => {
  return buildFuzzyTime(
    new Date(json.time),
    restJsonToFuzzyGranularity(json.granularity)
  );
};

export const restJsonToFuzzyGranularity = (json: any) => {
  switch(json.toLowerCase()) {
    case 'minute': return FuzzyGranularity.MINUTE;
    case 'hour': return FuzzyGranularity.HOUR;
    case 'day': return FuzzyGranularity.DAY;
    case 'week': return FuzzyGranularity.WEEK;
    case 'month': return FuzzyGranularity.MONTH;
    case 'year': return FuzzyGranularity.YEAR;
    case 'forever': return FuzzyGranularity.FOREVER;
    default: throw 'Error in restJsonToFuzzyGranularity: granularity unknown';
  }
};
