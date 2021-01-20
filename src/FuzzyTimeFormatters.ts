import FuzzyGranularity from 'listlab-api/FuzzyGranularity';
import FuzzyTime, {buildFuzzyTime, unoffsetNow} from 'listlab-api/FuzzyTime';
import FuzzyTimeRange from 'listlab-api/FuzzyTimeRange';
import {dayNames, monthNames, shortMonthNames} from 'listlab-api/TimeStrings';

export const formatRelativeShortName = (time: FuzzyTime): string => {
  const now = buildFuzzyTime(new Date(unoffsetNow()), time.getGranularity());
  if (
    time.equals(now) ||
    time.equals(now.getNext()) ||
    time.equals(now.getPrev())
  ) {
    return formatRelativeName(time);
  }
  return formatShortName(time);
};

export const formatRelativeRangeShortName = (range: FuzzyTimeRange) => {
  const start = range.getStart();
  const end = range.getEnd();
  if (start && end) {
    if (start.equals(end.getPrev())) {
      return formatRelativeShortName(start);
    }
    return (
      `${formatRelativeShortName(start)} - ` +
      `${formatRelativeShortName(end.withGranularity(FuzzyGranularity.DAY).getPrev())}`
    );
  } else if (start) {
    return `After ${formatRelativeShortName(start)}`;
  } else if (end) {
    return `Before ${formatRelativeShortName(end)}`;
  }
  return '';
};


export const formatRelativeName = (time: FuzzyTime): string => {
  const now = buildFuzzyTime(new Date(unoffsetNow()), time.getGranularity());
  const timeTime = time.getTime();

  // If it's this one
  if (time.equals(now)) {
    switch (time.getGranularity()) {
      case FuzzyGranularity.DAY:
        return 'Today';
      case FuzzyGranularity.FOREVER:
        return 'None';
      default:
        return 'This ' + time.getGranularity().getName();
    }
  }
  // If it's the next one
  if (time.equals(now.getNext())) {
    switch (time.getGranularity()) {
      case FuzzyGranularity.DAY:
        return 'Tomorrow';
      default:
        return 'Next ' + time.getGranularity().getName();
    }
  }
  // If it's the previous one
  if (time.equals(now.getPrev())) {
    switch (time.getGranularity()) {
      case FuzzyGranularity.DAY:
        return 'Yesterday';
      default:
        return 'Last ' + time.getGranularity().getName();
    }
  }

  // If it's not next, but still doesn't need to be qualified with a full date
  const parent = time.getParent();
  if (parent.getGranularity() === FuzzyGranularity.FOREVER || timeTime < parent.getNext().getTime()) {
    switch (time.getGranularity()) {
      case FuzzyGranularity.DAY:
        return `${dayNames[timeTime.getUTCDay()]} ${(timeTime.getUTCMonth() + 1)}/${timeTime.getUTCDate()}`;
      case FuzzyGranularity.WEEK:
        return (
          monthNames[timeTime.getUTCMonth()] + ' ' +
          timeTime.getUTCDate() + '-' +
          new Date(timeTime.setUTCDate(timeTime.getUTCDate()+6)).getUTCDate()
        );
      case FuzzyGranularity.MONTH:
        return monthNames[timeTime.getUTCMonth()];
      case FuzzyGranularity.YEAR:
        return timeTime.getUTCFullYear().toString();
    }
  }

  return timeTime.toString();
};

export const formatShortName = (time: FuzzyTime) => {
  const timeTime = time.getTime();
  const twoDigetYear = timeTime.getUTCFullYear().toString().substr(-2);
  switch (time.getGranularity()) {
    case FuzzyGranularity.DAY:
      return `${timeTime.getUTCMonth() + 1}/${timeTime.getUTCDate()}/${twoDigetYear}`;
    case FuzzyGranularity.WEEK:
      return `Week ${timeTime.getUTCMonth() + 1}/${timeTime.getUTCDate()}/${twoDigetYear}`;
    case FuzzyGranularity.MONTH:
      return `${shortMonthNames[timeTime.getUTCMonth()]} ${timeTime.getUTCFullYear().toString()}`;
    case FuzzyGranularity.YEAR:
      return timeTime.getUTCFullYear().toString();
  }
};
