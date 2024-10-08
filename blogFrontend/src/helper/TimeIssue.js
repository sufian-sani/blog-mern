import { format } from 'date-fns';

const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return format(date, 'MMMM dd, yyyy');
};

export { formatDate };