document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    el: '#app',
    data: {
      startTime: '08:00',
      jurisdiction: null,
      age: null,
      school: null,
    },
    computed: {
      results: function() {
        return generateResults(
          this.age,
          this.school,
          this.jurisdiction,
          this.startTime
        );
      },
    },
  });
  window.app = app;
});

const maxHrsOnSetRules = {
  ny: {
    inSession: {
      sixToEight: 8,
      nineToFifteen: 9,
      sixteenToSeventeen: 10,
    },
    notInSession: {
      sixToEight: 8,
      nineToFifteen: 9,
      sixteenToSeventeen: 10,
    },
  },
  ca: {
    inSession: {
      sixToEight: 8,
      nineToFifteen: 9,
      sixteenToSeventeen: 10,
    },
    notInSession: {
      sixToEight: 8,
      nineToFifteen: 9,
      sixteenToSeventeen: 10,
    },
  },
  sag: {
    inSession: {
      sixToEight: 8,
      nineToFifteen: 9,
      sixteenToSeventeen: 10,
    },
    notInSession: {
      sixToEight: 8,
      nineToFifteen: 9,
      sixteenToSeventeen: 10,
    },
  },
};

const maxWorkHrsRules = {
  ny: {
    inSession: {
      sixToEight: 4,
      nineToFifteen: 5,
      sixteenToSeventeen: 6,
    },
    notInSession: {
      sixToEight: 6,
      nineToFifteen: 7,
      sixteenToSeventeen: 9,
    },
  },
  ca: {
    inSession: {
      sixToEight: 4,
      nineToFifteen: 5,
      sixteenToSeventeen: 6,
    },
    notInSession: {
      sixToEight: 6,
      nineToFifteen: 7,
      sixteenToSeventeen: 8,
    },
  },
  sag: {
    inSession: {
      sixToEight: 5,
      nineToFifteen: 5,
      sixteenToSeventeen: 6,
    },
    notInSession: {
      sixToEight: 6,
      nineToFifteen: 7,
      sixteenToSeventeen: 8,
    },
  },
};

const generateResults = (age, school, jurisdiction, startTime) => {
  let results = [];
  // if (this.age && this.school && this.jurisdiction) {
  if (age && school && jurisdiction) {
    const maxWorkHrs =
      // maxWorkHrsRules[this.jurisdiction][this.school][this.age];
      maxWorkHrsRules[jurisdiction][school][age];

    const startTimeArr = startTime.split(':');
    const lunchTime = calculate(startTimeArr, 6);

    const maxHrsOnSet =
      // maxHrsOnSetRules[this.jurisdiction][this.school][this.age];
      maxHrsOnSetRules[jurisdiction][school][age];
    const maxHrsOnSetTime = calculate(startTimeArr, maxHrsOnSet);

    results = [
      `can work for a maximum of ${maxWorkHrs} hours`,
      `needs lunch at ${lunchTime} (after 6 hours)`,
      `can be on set until ${maxHrsOnSetTime} (max. ${maxHrsOnSet} hours)`,
    ];
    return results;
  }
};

const calculate = (startTimeArr, time) => {
  const hour = (parseInt(startTimeArr[0]) + time) % 24;
  let newTime;
  if (hour > 11) {
    newTime =
      (hour === 12 ? 12 : hour % 12).toString() +
      ':' +
      startTimeArr.slice(1, 2).join(':') +
      ' PM';
  } else {
    newTime =
      hour.toString() + ':' + startTimeArr.slice(1, 2).join(':') + ' AM';
  }

  const newTimeArr = toTimeArr(newTime);
  if (newTimeArr[2] === 'AM' && newTimeArr[0] === '0') {
    newTimeArr[0] = '12';
    newTime = newTimeArr.slice(0, 2).join(':') + ' AM';
  }

  return newTime;
};

const checkIfTooLate = maxHrsOnSetTime => {
  const timeArr = toTimeArr(maxHrsOnSetTime);

  const beforeEarliestNextEnd = timeArr[2] === 'PM' || parseInt(timeArr[0]) < 5;
  const afterTenPm =
    timeArr[2] === 'PM' && parseInt(timeArr[0]) > 9 && parseInt(timeArr[1]) > 0;
  const afterMidnight = timeArr[2] === 'AM';
  const afterTwelveThirty =
    timeArr[2] === 'AM' &&
    ((timeArr[0] === '12' && parseInt(timeArr[1]) > 30) || timeArr[0] !== '12');

  if (
    (window.school === 'inSession' && (afterTenPm || afterMidnight)) ||
    (window.school === 'notInSession' && afterTwelveThirty)
  ) {
    document.getElementById('max-hrs-on-set-li').classList.add('red');
  }
};

const toTimeArr = timeStr => {
  return timeStr
    .split(' ')[0]
    .split(':')
    .concat(timeStr.split(' ')[1]);
};