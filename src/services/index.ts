import dayjs from 'dayjs';

// import objectSupport from 'dayjs/plugin/objectSupport';
// import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// dayjs.extend(objectSupport);
dayjs.extend(utc);  /* utc plugin must be included before timezone plugin. */
// dayjs.extend(timezone);

export {
    dayjs,
};
